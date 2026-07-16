const profile = require("../portfolio-profile.json");
const skills = require("../skills.json");
const services = require("../services.json");
const projectPayload = require("../projects.json");
const contact = require("../contact.json");
const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const {
  PROMPT_VERSION,
  buildPortfolioAssistantInstructions
} = require("./portfolio-assistant-prompt");

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_ACTIVE_BUCKETS = 2_000;
const requestBuckets = new Map();

function readPublicKnowledge(filePath) {
  try {
    return readFileSync(filePath, "utf8").trim().slice(0, 40_000);
  } catch (error) {
    return "";
  }
}

const supportingPublicKnowledge = [
  {
    name: "portfolio.txt",
    content: readPublicKnowledge(join(__dirname, "..", "portfolio.txt"))
  },
  {
    name: "faq.txt",
    content: readPublicKnowledge(join(__dirname, "..", "faq.txt"))
  }
].filter((document) => document.content);

const publicPortfolio = {
  name: profile.name,
  title: profile.title,
  positioning: profile.positioning,
  profile: (profile.sections || []).map((section) => ({
    id: section.id,
    title: section.title,
    summary: section.summary,
    summaryFilipino: section.summaryFilipino,
    bullets: section.bullets
  })),
  skills: (skills.items || []).map(({ title, summary, summaryFilipino, bullets }) => ({
    title,
    summary,
    summaryFilipino,
    bullets
  })),
  services: (services.items || []).map(({ title, summary, summaryFilipino, bullets }) => ({
    title,
    summary,
    summaryFilipino,
    bullets
  })),
  projects: (projectPayload.projects || []).map((project) => ({
    name: project.name,
    category: project.category,
    problemSolved: project.problemSolved,
    problemSolvedFilipino: project.problemSolvedFilipino,
    toolsUsed: project.toolsUsed,
    mainFeatures: project.mainFeatures,
    businessImpact: project.businessImpact,
    businessImpactFilipino: project.businessImpactFilipino
  })),
  contact: {
    availability: contact.availability,
    email: contact.email,
    phone: contact.phone,
    facebook: contact.facebook,
    linkedin: contact.linkedin,
    github: contact.github,
    preferredContactMethod: contact.preferredContactMethod
  },
  supportingPublicKnowledge
};

const assistantInstructions = buildPortfolioAssistantInstructions(publicPortfolio);

function getClientId(req) {
  const forwarded = String(req.headers["x-vercel-forwarded-for"] || req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || req.socket?.remoteAddress || "anonymous";
}

function isRateLimited(clientId) {
  const now = Date.now();

  if (!requestBuckets.has(clientId) && requestBuckets.size >= MAX_ACTIVE_BUCKETS) {
    requestBuckets.forEach((times, key) => {
      if (!times.some((time) => now - time < WINDOW_MS)) requestBuckets.delete(key);
    });
    if (requestBuckets.size >= MAX_ACTIVE_BUCKETS) return true;
  }

  const recent = (requestBuckets.get(clientId) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestBuckets.set(clientId, recent);
    return true;
  }
  recent.push(now);
  requestBuckets.set(clientId, recent);

  if (requestBuckets.size >= MAX_ACTIVE_BUCKETS) {
    requestBuckets.forEach((times, key) => {
      if (!times.some((time) => now - time < WINDOW_MS)) requestBuckets.delete(key);
    });
  }
  return false;
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-8)
    .filter((message) => message && message.role === "user")
    .map((message) => ({
      role: "user",
      content: String(message.content || "").trim().slice(0, 1_200)
    }))
    .filter((message) => message.content);
}

function extractOutputText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
}

module.exports = async function portfolioChat(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Portfolio-Prompt-Version", PROMPT_VERSION);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return res.status(413).json({ error: "Request is too large." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "AI_NOT_CONFIGURED",
      message: "The secure AI connection is not configured."
    });
  }

  const clientId = getClientId(req);
  const safetyIdentifier = createHash("sha256").update(clientId).digest("hex").slice(0, 32);
  if (isRateLimited(safetyIdentifier)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Please wait a moment before asking another question." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch (error) {
    return res.status(400).json({ error: "Invalid JSON request." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  let parsedBodySize;
  try {
    parsedBodySize = Buffer.byteLength(
      typeof req.body === "string" ? req.body : JSON.stringify(body),
      "utf8"
    );
  } catch (error) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  if (parsedBodySize > 20_000) {
    return res.status(413).json({ error: "Request is too large." });
  }

  const message = String(body.message || "").trim();
  if (!message) {
    return res.status(400).json({ error: "A question is required." });
  }
  if (message.length > 1_200) {
    return res.status(400).json({ error: "Keep the question to 1,200 characters or fewer." });
  }

  const history = normalizeHistory(body.history);
  const controller = new AbortController();
  const requestTimeout = setTimeout(() => controller.abort(), 15_000);
  const abortRequest = () => controller.abort();
  req.once?.("aborted", abortRequest);

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        instructions: assistantInstructions,
        input: [...history, { role: "user", content: message }],
        max_output_tokens: 500,
        store: false,
        safety_identifier: safetyIdentifier
      }),
      signal: controller.signal
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      console.error("Portfolio AI request failed", openAIResponse.status, payload?.error?.code || "unknown_error");
      return res.status(502).json({ error: "The AI assistant is temporarily unavailable." });
    }

    const answer = extractOutputText(payload);
    if (!answer) {
      return res.status(502).json({ error: "The AI assistant returned an empty response." });
    }

    return res.status(200).json({ answer, provider: "openai" });
  } catch (error) {
    console.error("Portfolio AI connection error", error?.message || error);
    return res.status(502).json({ error: "The AI assistant is temporarily unavailable." });
  } finally {
    clearTimeout(requestTimeout);
    req.off?.("aborted", abortRequest);
  }
};
