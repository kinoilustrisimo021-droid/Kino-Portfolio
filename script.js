(function () {
  const progress = document.querySelector(".scroll-progress");
  const revealItems = document.querySelectorAll(".reveal");
  const navLinks = document.querySelectorAll(".nav-links a");
  const portraitCard = document.querySelector(".portrait-card");
  const profilePhoto = document.querySelector("#profilePhoto");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canUsePointerMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;
  const CHATBOT_CONFIG = {
    botName: "Kino Portfolio Assistant",
    provider: "retrieval",
    structuredProfileUrl: "portfolio-profile.json",
    portfolioTextUrl: "portfolio.txt",
    skillsUrl: "skills.json",
    projectsUrl: "projects.json",
    servicesUrl: "services.json",
    contactUrl: "contact.json",
    faqUrl: "faq.txt",
    knowledgeBaseUrl: "questionnaire.txt",
    confidenceThreshold: 2,
    fallbackResponse:
      "Thank you for your question. I do not have that exact information in the portfolio, but based on the available details, I can share related information about skills, projects, experience, services, tools, or contact information.",
    localizedFallbackResponse:
      "Salamat sa tanong. Wala akong exact information na iyon sa portfolio, pero base sa available details, pwede akong mag-share ng related information tungkol sa skills, projects, experience, services, tools, o contact information.",
    privacyFallbackResponse:
      "Thank you for your question. This specific information is not currently available in the public portfolio. You may ask about skills, work experience, projects, tools used, achievements, or contact information.",
    localizedPrivacyFallbackResponse:
      "Salamat sa tanong. Ang specific information na ito ay hindi kasalukuyang available sa public portfolio. Pwede kang magtanong tungkol sa skills, work experience, projects, tools na gamit, achievements, o contact information.",
    suggestedQuestions: [
      "Tell me about yourself.",
      "What can you do?",
      "What projects have you completed?",
      "Can you build dashboards?",
      "What tools and technologies do you use?",
      "Do you have sample work?",
      "What services can you offer?",
      "Why should we hire you?",
      "How can we contact you?",
      "Are you available for freelance or full-time work?",
      "I want to submit a project request."
    ],
    futureModel: {
      type: "replaceable",
      options: ["local-llm", "huggingface-inference", "api-backend"],
      endpoint: ""
    }
  };

  document.body.classList.add("page-ready");

  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${percent}%`;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  if (portraitCard && profilePhoto) {
    const sources = (profilePhoto.dataset.photoSources || "")
      .split(",")
      .map((source) => source.trim())
      .filter(Boolean);
    let sourceIndex = 0;

    function showLoaded() {
      portraitCard.classList.add("portrait-loaded");
      portraitCard.classList.remove("portrait-missing");
    }

    function showMissing() {
      portraitCard.classList.add("portrait-missing");
      portraitCard.classList.remove("portrait-loaded");
    }

    function tryNextSource() {
      if (sourceIndex >= sources.length) {
        showMissing();
        return;
      }

      const nextSource = sources[sourceIndex];
      sourceIndex += 1;
      profilePhoto.src = nextSource;
    }

    profilePhoto.addEventListener("load", showLoaded);
    profilePhoto.addEventListener("error", tryNextSource);

    tryNextSource();
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navMap = new Map(
    Array.from(navLinks).map((link) => [link.getAttribute("href")?.replace("#", ""), link])
  );

  function setActiveNav(id) {
    navLinks.forEach((link) => link.classList.toggle("is-active", link === navMap.get(id)));
  }

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry) setActiveNav(activeEntry.target.id);
      },
      {
        rootMargin: "-34% 0px -55% 0px",
        threshold: [0.08, 0.22, 0.5]
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  const projectImages = new Map();

  document.querySelectorAll("[data-project-image]").forEach((img) => {
    const id = img.dataset.projectImage;
    const shot = img.closest(".project-shot");
    const card = img.closest(".project-card");
    if (!id || !shot || !card) return;

    projectImages.set(id, { img, shot, card });

    const sources = (img.dataset.imageSources || "")
      .split(",")
      .map((source) => source.trim())
      .filter(Boolean);
    let sourceIndex = 0;

    function showLoaded() {
      shot.classList.add("has-image");
      card.classList.add("has-project-image");
    }

    function showMissing() {
      shot.classList.remove("has-image");
      card.classList.remove("has-project-image");
    }

    function tryNextSource() {
      if (sourceIndex >= sources.length) {
        showMissing();
        return;
      }
      img.src = sources[sourceIndex];
      sourceIndex += 1;
    }

    img.addEventListener("load", showLoaded);
    img.addEventListener("error", tryNextSource);

    tryNextSource();
  });

  if (canUsePointerMotion) {
    const premiumTargets = document.querySelectorAll(
      ".project-card, .glass-card, .timeline-item, .experience-item, .responsibility-grid article, .primary-action, .secondary-action"
    );

    premiumTargets.forEach((target) => {
      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        const rotateX = ((y / rect.height) - 0.5) * -5;

        target.style.setProperty("--spotlight-x", `${xPercent}%`);
        target.style.setProperty("--spotlight-y", `${yPercent}%`);
        target.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);

        if (target.classList.contains("magnetic")) {
          target.style.setProperty("--magnetic-x", `${(x / rect.width - 0.5) * 8}px`);
          target.style.setProperty("--magnetic-y", `${(y / rect.height - 0.5) * 8}px`);
        }
      });

      target.addEventListener("pointerleave", () => {
        target.style.removeProperty("--tilt-x");
        target.style.removeProperty("--tilt-y");
        target.style.removeProperty("--magnetic-x");
        target.style.removeProperty("--magnetic-y");
      });
    });
  }

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close preview">Close</button>
    <figure class="lightbox-panel">
      <img alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const closeLightbox = lightbox.querySelector(".lightbox-close");

  function openLightbox(img) {
    const card = img.closest(".project-card");
    const title = card?.querySelector("h3")?.textContent?.trim() || "Project screenshot";
    if (!img.src || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeLightbox?.focus();
  }

  function hideLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  }

  document.querySelectorAll(".project-shot").forEach((shot) => {
    shot.addEventListener("click", () => {
      const img = shot.querySelector(".project-image");
      if (img && shot.classList.contains("has-image")) openLightbox(img);
    });
  });

  closeLightbox?.addEventListener("click", hideLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hideLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) hideLightbox();
  });

  const portfolioChatbot = document.querySelector("[data-portfolio-chatbot]");

  if (portfolioChatbot) {
    initPortfolioChatbot(portfolioChatbot);
  }

  function initPortfolioChatbot(widget) {
    const toggle = widget.querySelector(".chatbot-toggle");
    const panel = widget.querySelector(".chatbot-panel");
    const close = widget.querySelector(".chatbot-close");
    const clear = widget.querySelector(".chatbot-clear");
    const form = widget.querySelector("[data-chatbot-form]");
    const input = widget.querySelector("[data-chatbot-input]");
    const messages = widget.querySelector("[data-chatbot-messages]");
    const status = widget.querySelector("[data-chatbot-status]");
    const suggestions = widget.querySelector("[data-chatbot-suggestions]");
    const quickActions = widget.querySelector("[data-chatbot-quick-actions]");
    const backdrop = document.querySelector("[data-chatbot-backdrop]");
    let started = false;
    let knowledgeItems = [];
    let projectData = [];
    let contactData = {};
    let projectRequestModal = null;

    const fallbackKnowledge = parseKnowledgeBase(`
# Portfolio Summary
Q: Who is Kino?
A: Kino Ilustrisimo is a data operations and automation professional focused on Python automation, reporting workflows, dashboard monitoring, and operational performance improvement.
Q: What is Kino's technical focus?
A: Kino's technical focus includes Python automation, Excel reporting, CSV and XLSX processing, dashboard monitoring, data validation, and workflow improvement.
Q: What projects can Kino showcase?
A: Kino can showcase the MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, and Report Auto Extractor.
Q: What are your skills?
A: Kino's skills include Python automation, data reporting, Excel reporting, CSV/XLSX processing, dashboard monitoring, data validation, workflow improvement, operational monitoring, and communication.
Q: What tools and technologies do you use?
A: Kino's technical stack focuses on Python, Excel, CSV and XLSX workflows, reporting dashboards, data validation, automation scripts, and operational monitoring tools.
Q: What services can you offer?
A: Kino can support reporting automation, dashboard monitoring, Excel/CSV/XLSX processing, workflow improvement, data validation, and operations-focused performance reporting.
Q: What makes Kino valuable to future employers or clients?
A: Kino connects operational experience with practical automation, helping teams reduce manual work, improve reporting visibility, and monitor performance through usable tools.
Q: Sino ka?
A: Ako ang portfolio assistant ni Kino Ilustrisimo. Pwede akong sumagot tungkol sa kanyang skills, projects, work experience, tools, achievements, at professional background.
Q: Ano ang skills mo?
A: Ang main skills ni Kino ay Python automation, data reporting, Excel reporting, CSV/XLSX processing, dashboard monitoring, data validation, workflow improvement, operational monitoring, at communication.
Q: Ano ang mga project mo?
A: Ilan sa projects ni Kino ay MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, at Report Auto Extractor.
Q: What should the assistant do if information is unavailable?
A: The assistant should avoid inventing information and say that the specific information is not currently available in the portfolio.
    `);

    if (!toggle || !panel || !form || !input || !messages || !status || !suggestions || !quickActions) return;

    renderSuggestedQuestions();
    renderQuickActions();

    loadPortfolioKnowledge()
      .then(({ items, profileCount, faqCount, projectCount, supportCount, projects, contact }) => {
        knowledgeItems = items.length ? items : fallbackKnowledge;
        projectData = projects;
        contactData = contact;
        renderQuickActions();
        status.textContent = items.length
          ? `Portfolio assistant ready: ${profileCount} profile sections, ${projectCount} projects, ${supportCount} support sections, and ${faqCount} FAQs loaded.`
          : "Portfolio fallback knowledge is ready. Use a local server or GitHub Pages to load the portfolio profile.";
      })
      .catch(() => {
        knowledgeItems = fallbackKnowledge;
        status.textContent = "Portfolio fallback knowledge is ready. Use a local server or GitHub Pages to load the portfolio profile.";
      });

    function openChatbot() {
      widget.classList.add("is-open");
      backdrop?.classList.add("is-open");
      document.body.classList.add("chatbot-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");

      if (!started) {
        addMessage(
          "bot",
          "Hi! I'm Kino's Portfolio AI Assistant. You may ask me about his skills, projects, experience, services, tools, or availability. You can also submit a project request with your email, budget, timeline, and requirements."
        );
        started = true;
      }

      window.setTimeout(() => input.focus(), 180);
    }

    function closeChatbot() {
      widget.classList.remove("is-open");
      backdrop?.classList.remove("is-open");
      document.body.classList.remove("chatbot-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      toggle.focus();
    }

    function clearChatbot() {
      messages.innerHTML = "";
      started = false;
      openChatbot();
    }

    function renderSuggestedQuestions() {
      suggestions.innerHTML = "";

      const title = document.createElement("p");
      title.className = "chatbot-suggestions-title";
      title.textContent = "Suggested questions";
      suggestions.appendChild(title);

      CHATBOT_CONFIG.suggestedQuestions.forEach((question) => {
        const button = document.createElement("button");
        button.className = "chatbot-suggestion";
        button.type = "button";
        button.textContent = question;
        button.addEventListener("click", () => {
          handleQuestion(question);
          input.focus();
        });
        suggestions.appendChild(button);
      });
    }

    function renderQuickActions() {
      quickActions.innerHTML = "";

      getQuickActions(contactData).forEach((action) => {
        const control = document.createElement(action.href ? "a" : "button");
        control.className = `chatbot-action${action.primary ? " primary" : ""}`;
        control.textContent = action.label;

        if (action.href) {
          control.href = action.href;
          if (/^https?:/i.test(action.href)) {
            control.target = "_blank";
            control.rel = "noopener noreferrer";
          }
        } else {
          control.type = "button";
          control.addEventListener("click", () => runChatbotAction(action.action));
        }

        quickActions.appendChild(control);
      });
    }

    function addMessage(type, text) {
      const message = document.createElement("div");
      message.className = `chatbot-message ${type}`;
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function addResponseActions(actions) {
      if (!actions.length) return;

      const actionRow = document.createElement("div");
      actionRow.className = "chatbot-response-actions";

      actions.forEach((action) => {
        const control = document.createElement(action.href ? "a" : "button");
        control.className = `chatbot-action${action.primary ? " primary" : ""}`;
        control.textContent = action.label;

        if (action.href) {
          control.href = action.href;
          if (/^https?:/i.test(action.href)) {
            control.target = "_blank";
            control.rel = "noopener noreferrer";
          }
        } else {
          control.type = "button";
          control.addEventListener("click", () => runChatbotAction(action.action));
        }

        actionRow.appendChild(control);
      });

      messages.appendChild(actionRow);
      messages.scrollTop = messages.scrollHeight;
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "chatbot-message bot typing";
      typing.setAttribute("aria-label", "Assistant is preparing a response");
      typing.innerHTML = "<span></span><span></span><span></span>";
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      return typing;
    }

    async function handleQuestion(question) {
      addMessage("user", question);
      const typing = addTyping();

      window.setTimeout(() => {
        typing.remove();
        const response = generatePortfolioResponse(question, knowledgeItems, projectData, contactData);
        addMessage("bot", response.text);
        addResponseActions(response.actions);
      }, reduceMotion ? 80 : 520);
    }

    function runChatbotAction(action) {
      if (action === "projects") {
        document.querySelector("#projects")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }

      if (action === "skills") {
        document.querySelector("#skills")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }

      if (action === "resume") {
        addMessage("bot", "Opening the premium resume PDF layout. In the print dialog, choose Save as PDF to download the resume.");
        window.setTimeout(() => window.print(), 250);
        return;
      }

      if (action === "lead") {
        renderLeadCaptureForm();
      }

      if (action === "project-request") {
        renderLeadCaptureForm();
      }

      if (action === "download-lead") {
        downloadLeadFile();
      }
    }

    function renderLeadCaptureForm(initialValues = {}) {
      closeProjectRequestModal();

      const modal = document.createElement("div");
      modal.className = "project-request-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "projectRequestTitle");
      modal.innerHTML = `
        <div class="project-request-overlay" data-close-project-modal></div>
      `;

      const card = document.createElement("form");
      card.className = "chatbot-lead-card project-request-dialog";
      card.innerHTML = `
        <div class="project-request-heading">
          <div>
            <p class="project-request-kicker">Client Inquiry</p>
            <h3 id="projectRequestTitle">Project Request Assistant</h3>
            <p>Submit a project inquiry for Kino. Final pricing will still depend on scope, complexity, timeline, and requirements.</p>
          </div>
          <button class="project-request-close" type="button" data-close-project-modal aria-label="Close project request form">Close</button>
        </div>
        <div class="chatbot-lead-grid">
          <label>Full name <span class="required">*</span>
            <input name="name" type="text" autocomplete="name" value="${escapeHtml(initialValues.name)}" required>
          </label>
          <label>Email address <span class="required">*</span>
            <input name="email" type="email" autocomplete="email" value="${escapeHtml(initialValues.email)}" required>
          </label>
          <label>Company / organization
            <input name="company" type="text" autocomplete="organization" value="${escapeHtml(initialValues.company)}">
          </label>
          <label>Contact number
            <input name="phone" type="text" autocomplete="tel" value="${escapeHtml(initialValues.phone)}">
          </label>
          <label>Project type <span class="required">*</span>
            <select name="projectType" required>
              ${renderOption("AI Chatbot", initialValues.projectType)}
              ${renderOption("Dashboard Development", initialValues.projectType)}
              ${renderOption("Automation", initialValues.projectType)}
              ${renderOption("Data Reporting", initialValues.projectType)}
              ${renderOption("Portfolio Website", initialValues.projectType)}
              ${renderOption("Business Website", initialValues.projectType)}
              ${renderOption("System Development", initialValues.projectType)}
              ${renderOption("Excel / Google Sheet Automation", initialValues.projectType)}
              ${renderOption("Other Custom Project", initialValues.projectType)}
            </select>
          </label>
          <label>Estimated budget <span class="required">*</span>
            <input name="budget" type="text" placeholder="Example: PHP 10,000 - PHP 25,000" value="${escapeHtml(initialValues.budget)}" required>
          </label>
          <label>Preferred timeline / deadline
            <input name="timeline" type="text" placeholder="Example: 2-4 weeks or target date" value="${escapeHtml(initialValues.timeline)}">
          </label>
          <label>Preferred contact method
            <select name="contactMethod">
              ${renderOption("Email", initialValues.contactMethod)}
              ${renderOption("Phone or messaging app", initialValues.contactMethod)}
              ${renderOption("LinkedIn", initialValues.contactMethod)}
              ${renderOption("Any available channel", initialValues.contactMethod)}
            </select>
          </label>
          <label class="wide-field">Project description <span class="required">*</span>
            <textarea name="requirement" placeholder="Briefly describe what you need, the problem to solve, and expected output..." required>${escapeHtml(initialValues.requirement)}</textarea>
          </label>
          <label class="wide-field">Additional notes
            <textarea name="notes" placeholder="Optional notes, references, existing tools, or special requirements...">${escapeHtml(initialValues.notes)}</textarea>
          </label>
        </div>
        <p class="chatbot-form-note">Required fields are marked with *. Click Review & Continue first, then confirm on the next screen to send the request. This does not generate a final quotation.</p>
        <div class="chatbot-lead-footer">
          <button class="chatbot-lead-submit" type="submit">Review & Continue</button>
        </div>
      `;

      card.addEventListener("submit", (event) => {
        event.preventDefault();
        const request = readProjectRequest(card);
        if (!request.name || !request.email || !request.projectType || !request.budget || !request.requirement) return;
        renderProjectRequestSummary(card, request);
      });

      modal.appendChild(card);
      modal.querySelectorAll("[data-close-project-modal]").forEach((control) => {
        control.addEventListener("click", closeProjectRequestModal);
      });

      document.body.appendChild(modal);
      projectRequestModal = modal;
      document.body.classList.add("project-modal-open");
      window.requestAnimationFrame(() => modal.classList.add("is-visible"));
      window.setTimeout(() => card.querySelector("input, select, textarea")?.focus(), reduceMotion ? 0 : 180);
    }

    function closeProjectRequestModal() {
      if (!projectRequestModal) return;

      const modal = projectRequestModal;
      projectRequestModal = null;
      modal.classList.remove("is-visible");
      document.body.classList.remove("project-modal-open");
      window.setTimeout(() => modal.remove(), reduceMotion ? 0 : 180);
    }

    function readProjectRequest(card) {
      const formData = new FormData(card);
      return {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        company: String(formData.get("company") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        projectType: String(formData.get("projectType") || "").trim(),
        budget: String(formData.get("budget") || "").trim(),
        timeline: String(formData.get("timeline") || "").trim(),
        contactMethod: String(formData.get("contactMethod") || "").trim(),
        requirement: String(formData.get("requirement") || "").trim(),
        notes: String(formData.get("notes") || "").trim(),
        capturedAt: new Date().toISOString()
      };
    }

    function renderProjectRequestSummary(card, request) {
      card.innerHTML = `
        <div class="project-request-heading">
          <div>
            <p class="project-request-kicker">Review Request</p>
            <h3>Confirm and Send Project Request</h3>
            <p>Please review the details before sending. Kino will review the request and reply through the email address provided.</p>
          </div>
          <button class="project-request-close" type="button" data-close-project-modal aria-label="Close project request form">Close</button>
        </div>
        <dl class="chatbot-request-summary">
          ${renderSummaryRow("Client Name", request.name)}
          ${renderSummaryRow("Email Address", request.email)}
          ${renderSummaryRow("Company / Organization", request.company || "Not provided")}
          ${renderSummaryRow("Contact Number", request.phone || "Not provided")}
          ${renderSummaryRow("Project Type", request.projectType)}
          ${renderSummaryRow("Project Description", request.requirement)}
          ${renderSummaryRow("Estimated Budget", request.budget)}
          ${renderSummaryRow("Preferred Timeline", request.timeline || "Not provided")}
          ${renderSummaryRow("Preferred Contact Method", request.contactMethod || "Email")}
          ${renderSummaryRow("Additional Notes", request.notes || "None")}
        </dl>
        <div class="chatbot-lead-footer">
          <button class="chatbot-lead-submit" type="button" data-confirm-request>Send Project Request</button>
          <button class="chatbot-lead-download" type="button" data-edit-request>Edit Details</button>
        </div>
      `;

      card.querySelector("[data-confirm-request]")?.addEventListener("click", () => submitProjectRequest(request, card));
      card.querySelector("[data-edit-request]")?.addEventListener("click", () => {
        closeProjectRequestModal();
        renderLeadCaptureForm(request);
      });
      card.querySelector("[data-close-project-modal]")?.addEventListener("click", closeProjectRequestModal);
    }

    async function submitProjectRequest(request, card) {
      const button = card.querySelector("[data-confirm-request]");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      const config = getProjectRequestConfig();
      const requests = getSavedLeads();
      requests.push(request);
      saveLeads(requests);

      let result = { sent: false, mode: "local" };
      try {
        result = await sendProjectRequest(request, config);
      } catch (error) {
        result = { sent: false, mode: "error", error };
      }

      closeProjectRequestModal();

      if (result.sent) {
        addMessage("bot", "Thank you. Your project request has been submitted successfully. I will review the details and respond to you through the email address you provided.");
        return;
      }

      if (result.mode === "mailto") {
        addMessage("bot", "Your project request was prepared in your email app. Please send the email there to complete the submission. A local copy was also saved in this browser.");
        addResponseActions([{ label: "Download Request JSON", action: "download-lead", primary: true }]);
        return;
      }

      addMessage("bot", "Your project request was saved locally in this browser, but automatic email delivery could not be completed. Please check the FormSubmit activation/configuration in contact.json, or switch the provider to Formspree, EmailJS, or a backend email API.");
      addResponseActions([{ label: "Download Request JSON", action: "download-lead", primary: true }]);
    }

    function getSavedLeads() {
      try {
        return JSON.parse(localStorage.getItem("kinoPortfolioProjectRequests") || "[]");
      } catch {
        return [];
      }
    }

    function saveLeads(leads) {
      try {
        localStorage.setItem("kinoPortfolioProjectRequests", JSON.stringify(leads));
      } catch {
        // Local storage can be unavailable in private or restricted browser contexts.
      }
    }

    function downloadLeadFile() {
      const leads = getSavedLeads();
      if (!leads.length) {
        addMessage("bot", "No project request details are saved yet. Use the Submit Project Request action first.");
        return;
      }

      const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kino-project-requests.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function getProjectRequestConfig() {
      const config = contactData.projectRequest || {};
      const emailjs = config.emailjs || {};

      return {
        enabled: config.enabled !== false,
        provider: String(config.provider || "none").toLowerCase(),
        recipientEmail: config.recipientEmail || contactData.email || "",
        formsubmitEndpoint: config.formsubmitEndpoint || "",
        formspreeEndpoint: config.formspreeEndpoint || "",
        emailjs: {
          publicKey: emailjs.publicKey || "",
          serviceId: emailjs.serviceId || "",
          templateId: emailjs.templateId || ""
        },
        subject: config.mailSubject || "New project request from Kino portfolio"
      };
    }

    async function sendProjectRequest(request, config) {
      if (!config.enabled) return { sent: false, mode: "disabled" };

      if (config.provider === "formsubmit" && config.recipientEmail) {
        const endpoint = config.formsubmitEndpoint || `https://formsubmit.co/ajax/${encodeURIComponent(config.recipientEmail)}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            _subject: config.subject,
            _replyto: request.email,
            name: request.name,
            email: request.email,
            company: request.company || "Not provided",
            phone: request.phone || "Not provided",
            projectType: request.projectType,
            projectDescription: request.requirement,
            estimatedBudget: request.budget,
            timeline: request.timeline || "Not provided",
            preferredContactMethod: request.contactMethod || "Email",
            additionalNotes: request.notes || "None",
            message: buildProjectRequestEmailBody(request)
          })
        });

        if (!response.ok) throw new Error("FormSubmit request failed.");
        return { sent: true, mode: "formsubmit" };
      }

      if (config.provider === "formspree" && config.formspreeEndpoint) {
        const response = await fetch(config.formspreeEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject: config.subject,
            name: request.name,
            email: request.email,
            company: request.company,
            phone: request.phone,
            projectType: request.projectType,
            projectDescription: request.requirement,
            estimatedBudget: request.budget,
            timeline: request.timeline,
            preferredContactMethod: request.contactMethod,
            additionalNotes: request.notes,
            message: buildProjectRequestEmailBody(request)
          })
        });

        if (!response.ok) throw new Error("Formspree request failed.");
        return { sent: true, mode: "formspree" };
      }

      if (
        config.provider === "emailjs"
        && config.emailjs.publicKey
        && config.emailjs.serviceId
        && config.emailjs.templateId
      ) {
        await loadExternalScript("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js", "emailjs-sdk");
        if (!window.emailjs) throw new Error("EmailJS SDK did not load.");

        window.emailjs.init({ publicKey: config.emailjs.publicKey });
        await window.emailjs.send(config.emailjs.serviceId, config.emailjs.templateId, {
          to_email: config.recipientEmail,
          from_name: request.name,
          reply_to: request.email,
          client_email: request.email,
          client_company: request.company || "Not provided",
          client_phone: request.phone || "Not provided",
          project_type: request.projectType,
          project_description: request.requirement,
          estimated_budget: request.budget,
          preferred_timeline: request.timeline || "Not provided",
          preferred_contact_method: request.contactMethod || "Email",
          additional_notes: request.notes || "None",
          message: buildProjectRequestEmailBody(request)
        });

        return { sent: true, mode: "emailjs" };
      }

      if (config.recipientEmail) {
        const subject = encodeURIComponent(config.subject);
        const body = encodeURIComponent(buildProjectRequestEmailBody(request));
        window.location.href = `mailto:${config.recipientEmail}?subject=${subject}&body=${body}`;
        return { sent: false, mode: "mailto" };
      }

      return { sent: false, mode: "local" };
    }

    function loadExternalScript(src, id) {
      return new Promise((resolve, reject) => {
        const existing = document.getElementById(id);
        if (existing) {
          resolve(existing);
          return;
        }

        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Unable to load ${src}`));
        document.head.appendChild(script);
      });
    }

    function buildProjectRequestEmailBody(request) {
      return [
        "Hello,",
        "",
        "You received a new project request from your portfolio website.",
        "",
        `Client Name: ${request.name}`,
        `Email Address: ${request.email}`,
        `Company / Organization: ${request.company || "Not provided"}`,
        `Contact Number: ${request.phone || "Not provided"}`,
        `Project Type: ${request.projectType}`,
        "",
        "Project Description:",
        request.requirement,
        "",
        `Estimated Budget: ${request.budget}`,
        `Preferred Timeline: ${request.timeline || "Not provided"}`,
        `Preferred Contact Method: ${request.contactMethod || "Email"}`,
        "",
        "Additional Notes:",
        request.notes || "None",
        "",
        "Please review the request and respond to the client accordingly."
      ].join("\n");
    }

    function renderSummaryRow(label, value) {
      return `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`;
    }

    function renderOption(label, selectedValue = "") {
      const selected = String(label).toLowerCase() === String(selectedValue || "").toLowerCase() ? " selected" : "";
      return `<option${selected}>${escapeHtml(label)}</option>`;
    }

    function escapeHtml(value = "") {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    toggle.addEventListener("click", openChatbot);
    backdrop?.addEventListener("click", closeChatbot);
    close?.addEventListener("click", closeChatbot);
    clear?.addEventListener("click", clearChatbot);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      input.value = "";
      handleQuestion(question);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectRequestModal) {
        closeProjectRequestModal();
        return;
      }

      if (event.key === "Escape" && widget.classList.contains("is-open")) {
        closeChatbot();
      }
    });
  }

  async function loadPortfolioKnowledge() {
    const [
      profileResult,
      portfolioTextResult,
      skillsResult,
      projectsResult,
      servicesResult,
      contactResult,
      faqResult,
      questionnaireResult
    ] = await Promise.allSettled([
      loadStructuredProfile(),
      loadPortfolioText(),
      loadSkillsKnowledge(),
      loadProjectsKnowledge(),
      loadServicesKnowledge(),
      loadContactKnowledge(),
      loadFaqSupport(),
      loadQuestionnaireFaqs()
    ]);

    const profileItems = profileResult.status === "fulfilled" ? profileResult.value : [];
    const portfolioTextItems = portfolioTextResult.status === "fulfilled" ? portfolioTextResult.value : [];
    const skillsItems = skillsResult.status === "fulfilled" ? skillsResult.value : [];
    const projectPayload = projectsResult.status === "fulfilled" ? projectsResult.value : { items: [], projects: [] };
    const servicesItems = servicesResult.status === "fulfilled" ? servicesResult.value : [];
    const contactPayload = contactResult.status === "fulfilled" ? contactResult.value : { items: [], contact: {} };
    const faqItems = faqResult.status === "fulfilled" ? faqResult.value : [];
    const questionnaireItems = questionnaireResult.status === "fulfilled" ? questionnaireResult.value : [];
    const supportItems = [...portfolioTextItems, ...skillsItems, ...servicesItems, ...contactPayload.items];

    return {
      items: [...profileItems, ...supportItems, ...projectPayload.items, ...faqItems, ...questionnaireItems],
      profileCount: profileItems.length,
      faqCount: faqItems.length + questionnaireItems.length,
      projectCount: projectPayload.projects.length,
      supportCount: supportItems.length,
      projects: projectPayload.projects,
      contact: contactPayload.contact
    };
  }

  async function loadStructuredProfile() {
    const response = await fetch(CHATBOT_CONFIG.structuredProfileUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load structured portfolio profile.");
    const profile = await response.json();
    return buildProfileKnowledgeItems(profile);
  }

  async function loadPortfolioText() {
    const response = await fetch(CHATBOT_CONFIG.portfolioTextUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load portfolio text.");
    const text = await response.text();
    const sections = [];
    let current = { title: "Portfolio Summary", lines: [] };

    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (/^[A-Z][A-Z /]+$/.test(trimmed)) {
        if (current.lines.length) sections.push(current);
        current = { title: trimmed, lines: [] };
        return;
      }

      current.lines.push(trimmed);
    });

    if (current.lines.length) sections.push(current);

    return sections.map((section) => {
      const answer = section.lines.join(" ").replace(/\s+/g, " ").trim();
      const normalizedTitle = normalizeText(section.title);
      return {
        category: "Structured Portfolio Text",
        question: `${section.title} ${answer}`,
        answer,
        answerFilipino: "",
        sourceType: "profile",
        priority: normalizedTitle === "contact" ? 2 : 1,
        intentKeys: inferIntentKeys(`${section.title} ${answer}`),
        keywords: [normalizedTitle, ...tokenize(answer).slice(0, 12)].filter(Boolean),
        sectionId: `portfolio-${normalizedTitle.replace(/\s+/g, "-") || "text"}`,
        sectionLabel: section.title.toLowerCase()
      };
    });
  }

  async function loadSkillsKnowledge() {
    const response = await fetch(CHATBOT_CONFIG.skillsUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load skills knowledge.");
    const skills = await response.json();
    return buildJsonKnowledgeItems(skills, "skills", "Skills and Tools", ["skills", "tools", "dashboard", "automation"]);
  }

  async function loadProjectsKnowledge() {
    const response = await fetch(CHATBOT_CONFIG.projectsUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load project knowledge.");
    const payload = await response.json();
    const projects = Array.isArray(payload.projects) ? payload.projects : [];

    return {
      projects,
      items: projects.map((project) => ({
        category: "Project Portfolio",
        question: `${project.name || ""} ${project.category || ""} ${(project.keywords || []).join(" ")}`,
        answer: formatProjectAnswer(project, false),
        answerFilipino: formatProjectAnswer(project, true),
        sourceType: "project",
        priority: 4,
        intentKeys: ["projects", ...(project.intentKeys || [])],
        keywords: [project.name, project.category, ...(project.keywords || [])].filter(Boolean),
        sectionId: project.id || "",
        sectionLabel: project.name || "project portfolio"
      }))
    };
  }

  async function loadServicesKnowledge() {
    const response = await fetch(CHATBOT_CONFIG.servicesUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load services knowledge.");
    const services = await response.json();
    return buildJsonKnowledgeItems(services, "services", "Services Offered", ["services", "availability"]);
  }

  async function loadContactKnowledge() {
    const response = await fetch(CHATBOT_CONFIG.contactUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load contact knowledge.");
    const contact = await response.json();
    const contactLines = [
      contact.email ? `Email: ${contact.email}.` : "",
      contact.phone ? `Mobile: ${contact.phone}.` : "",
      contact.facebook ? `Facebook: ${contact.facebook}.` : "",
      contact.preferredContactMethod ? `Preferred contact method: ${contact.preferredContactMethod}` : ""
    ].filter(Boolean).join(" ");
    const contactLinesFilipino = [
      contact.email ? `Email: ${contact.email}.` : "",
      contact.phone ? `Mobile: ${contact.phone}.` : "",
      contact.facebook ? `Facebook: ${contact.facebook}.` : "",
      contact.preferredContactMethod ? `Preferred contact method: ${contact.preferredContactMethod}` : ""
    ].filter(Boolean).join(" ");
    const item = {
      category: "Contact Information",
      question: "contact email mobile phone facebook github linkedin portfolio availability leave details connect hire",
      answer: [contact.summary || "Kino is available for professional inquiries.", contactLines].filter(Boolean).join(" "),
      answerFilipino: [contact.summaryFilipino || "Available si Kino para sa professional inquiries.", contactLinesFilipino].filter(Boolean).join(" "),
      sourceType: "profile",
      priority: 3,
      intentKeys: ["contact", "availability"],
      keywords: ["contact", "email", "mobile", "phone", "facebook", "github", "linkedin", "availability", "connect"],
      sectionId: "contact",
      sectionLabel: "contact information"
    };

    return { items: [item], contact };
  }

  async function loadFaqSupport() {
    const response = await fetch(CHATBOT_CONFIG.faqUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load FAQ support.");
    const text = await response.text();
    return parseKnowledgeBase(text).map((item) => ({
      ...item,
      sourceType: "faq",
      priority: 2,
      intentKeys: inferIntentKeys(`${item.category} ${item.question} ${item.answer}`)
    }));
  }

  async function loadQuestionnaireFaqs() {
    const response = await fetch(CHATBOT_CONFIG.knowledgeBaseUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load questionnaire knowledge base.");
    const text = await response.text();
    return parseKnowledgeBase(text).map((item) => ({
      ...item,
      sourceType: "faq",
      priority: 1,
      intentKeys: inferIntentKeys(`${item.category} ${item.question} ${item.answer}`)
    }));
  }

  function buildJsonKnowledgeItems(payload, sectionId, sectionLabel, defaultIntents) {
    const items = [];
    const addItem = (title, summary, summaryFilipino, bullets, keywords, intents) => {
      const bulletText = Array.isArray(bullets) && bullets.length ? `Key points: ${bullets.join("; ")}.` : "";
      items.push({
        category: sectionLabel,
        question: `${title || sectionLabel} ${(keywords || []).join(" ")}`,
        answer: [summary, bulletText].filter(Boolean).join(" "),
        answerFilipino: summaryFilipino || "",
        sourceType: "profile",
        priority: 3,
        intentKeys: intents || defaultIntents,
        keywords: keywords || [],
        sectionId,
        sectionLabel
      });
    };

    if (Array.isArray(payload.items)) {
      payload.items.forEach((item) => {
        addItem(item.title, item.summary, item.summaryFilipino, item.bullets, item.keywords, item.intentKeys || defaultIntents);
      });
    } else {
      addItem(payload.title, payload.summary, payload.summaryFilipino, payload.bullets, payload.keywords, payload.intentKeys || defaultIntents);
    }

    return items.filter((item) => item.answer);
  }

  function buildProfileKnowledgeItems(profile) {
    if (!profile || !Array.isArray(profile.sections)) return [];

    return profile.sections.map((section) => {
      const bullets = Array.isArray(section.bullets) ? section.bullets : [];
      const filipinoBullets = Array.isArray(section.bulletsFilipino) ? section.bulletsFilipino : [];
      const keywords = Array.isArray(section.keywords) ? section.keywords : [];
      const intentKeys = Array.isArray(section.intentKeys) ? section.intentKeys : [];
      const answer = [section.summary, bullets.length ? `Key points: ${bullets.join("; ")}.` : ""]
        .filter(Boolean)
        .join(" ");
      const answerFilipino = [section.summaryFilipino, filipinoBullets.length ? `Key points: ${filipinoBullets.join("; ")}.` : ""]
        .filter(Boolean)
        .join(" ");

      return {
        category: section.title || "Portfolio Profile",
        question: `${section.title || ""} ${keywords.join(" ")}`.trim(),
        answer,
        answerFilipino,
        sourceType: "profile",
        priority: 3,
        intentKeys,
        keywords,
        sectionId: section.id || "",
        sectionLabel: section.title || "portfolio profile"
      };
    }).filter((item) => item.question && item.answer);
  }

  function parseKnowledgeBase(text) {
    const items = [];
    let category = "General";
    let current = null;
    let mode = "";

    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("#")) {
        if (current) {
          items.push(current);
          current = null;
        }
        category = trimmed.replace(/^#+\s*/, "").trim() || "General";
        mode = "";
        return;
      }

      if (/^Q:\s*/i.test(trimmed)) {
        if (current) items.push(current);
        current = {
          category,
          question: trimmed.replace(/^Q:\s*/i, "").trim(),
          answer: ""
        };
        mode = "question";
        return;
      }

      if (/^A:\s*/i.test(trimmed)) {
        if (!current) current = { category, question: "", answer: "" };
        current.answer = trimmed.replace(/^A:\s*/i, "").trim();
        mode = "answer";
        return;
      }

      if (current && mode === "answer") {
        current.answer = `${current.answer} ${trimmed}`.trim();
      } else if (current && mode === "question") {
        current.question = `${current.question} ${trimmed}`.trim();
      }
    });

    if (current) items.push(current);
    return items.filter((item) => item.question && item.answer);
  }

  function generatePortfolioResponse(question, knowledgeItems, projects, contact) {
    const normalizedQuestion = normalizeText(question);
    const wantsFilipino = isLikelyFilipino(question);

    if (!knowledgeItems.length || !normalizedQuestion) {
      return {
        text: getFallbackResponse(question),
        confidence: "fallback",
        actions: getResponseActions([], contact)
      };
    }

    if (isSensitiveOrUnavailableRequest(normalizedQuestion)) {
      return {
        text: getPrivacyFallbackResponse(question),
        confidence: "private",
        actions: getResponseActions(["privacy"], contact)
      };
    }

    const intentKeys = detectIntentKeys(question);

    if (intentKeys.includes("contact") && hasContactDetails(contact)) {
      return {
        text: formatContactResponse(contact, wantsFilipino),
        confidence: "high",
        actions: getResponseActions(["contact", ...intentKeys], contact)
      };
    }

    const projectMatch = findProjectMatch(question, projects);

    if (projectMatch && projectMatch.score >= 4) {
      return {
        text: formatProjectAnswer(projectMatch.project, wantsFilipino),
        confidence: "high",
        actions: getResponseActions(["projects", ...(projectMatch.project.intentKeys || [])], contact)
      };
    }

    const normalizedSearchQuestion = normalizeText(buildSemanticSearchText(question, intentKeys));
    const topMatch = knowledgeItems
      .map((item) => ({ item, score: scoreKnowledgeItem(normalizedSearchQuestion, item) }))
      .sort((a, b) => b.score - a.score)[0];

    if (topMatch && topMatch.score >= CHATBOT_CONFIG.confidenceThreshold + 8 && topMatch.item.sourceType === "faq") {
      return {
        text: withServiceRecommendation(adaptAnswerLanguage(topMatch.item.answer, topMatch.item, wantsFilipino), intentKeys, wantsFilipino),
        confidence: "high",
        actions: getResponseActions(intentKeys, contact)
      };
    }

    const intentAnswer = composeIntentAnswer(question, intentKeys, knowledgeItems, wantsFilipino);
    if (intentAnswer) {
      return {
        text: withServiceRecommendation(intentAnswer, intentKeys, wantsFilipino),
        confidence: "related",
        actions: getResponseActions(intentKeys, contact)
      };
    }

    if (topMatch && topMatch.score >= CHATBOT_CONFIG.confidenceThreshold) {
      const prefix = wantsFilipino
        ? "Hindi exact ang tanong sa portfolio, pero base sa available information: "
        : "The portfolio does not specify the exact detail, but based on the available information: ";
      return {
        text: withServiceRecommendation(`${prefix}${adaptAnswerLanguage(topMatch.item.answer, topMatch.item, wantsFilipino)}`, intentKeys, wantsFilipino),
        confidence: "partial",
        actions: getResponseActions(intentKeys, contact)
      };
    }

    return {
      text: getFallbackResponse(question, getRelatedLabel(intentKeys)),
      confidence: "fallback",
      actions: getResponseActions(intentKeys, contact)
    };
  }

  function findProjectMatch(question, projects) {
    const normalizedQuestion = normalizeText(question);
    const terms = new Set(tokenize(normalizedQuestion));
    const matches = projects.map((project) => {
      const searchable = normalizeText([
        project.name,
        project.category,
        project.problemSolved,
        project.businessImpact,
        ...(project.toolsUsed || []),
        ...(project.mainFeatures || []),
        ...(project.keywords || [])
      ].filter(Boolean).join(" "));
      let score = 0;

      if (project.name && normalizedQuestion.includes(normalizeText(project.name))) score += 12;
      terms.forEach((term) => {
        if (searchable.includes(term)) score += 1.5;
      });

      return { project, score };
    }).sort((a, b) => b.score - a.score);

    return matches[0] || null;
  }

  function formatProjectAnswer(project, wantsFilipino) {
    const tools = Array.isArray(project.toolsUsed) ? project.toolsUsed.join(", ") : "";
    const features = Array.isArray(project.mainFeatures) ? project.mainFeatures.join("; ") : "";
    const screenshot = project.screenshot ? `Screenshot: ${project.screenshot}` : "Screenshot: available in the project section.";

    if (wantsFilipino) {
      return [
        `Project: ${project.name}`,
        `Problem solved: ${project.problemSolvedFilipino || project.problemSolved}`,
        `Tools used: ${tools || "Portfolio does not specify exact tools for this project."}`,
        `Main features: ${features || "Portfolio does not specify exact feature list."}`,
        `Business impact: ${project.businessImpactFilipino || project.businessImpact}`,
        screenshot,
        "Kung gusto mong i-discuss ang similar project, pwede kang mag-leave ng details sa contact form."
      ].filter(Boolean).join("\n");
    }

    return [
      `Project: ${project.name}`,
      `Problem solved: ${project.problemSolved}`,
      `Tools used: ${tools || "The portfolio does not specify exact tools for this project."}`,
      `Main features: ${features || "The portfolio does not specify the exact feature list."}`,
      `Business impact: ${project.businessImpact}`,
      screenshot,
      "You may contact Kino directly if you want to discuss a similar dashboard, automation, or reporting project."
    ].filter(Boolean).join("\n");
  }

  function hasContactDetails(contact = {}) {
    return Boolean(contact.email || contact.phone || contact.facebook || contact.linkedin || contact.github);
  }

  function formatContactResponse(contact = {}, wantsFilipino) {
    const details = [
      contact.email ? `Email: ${contact.email}` : "",
      contact.phone ? `Mobile: ${contact.phone}` : "",
      contact.facebook ? `Facebook: ${contact.facebook}` : "",
      contact.linkedin ? `LinkedIn: ${contact.linkedin}` : "",
      contact.github ? `GitHub: ${contact.github}` : ""
    ].filter(Boolean);

    if (wantsFilipino) {
      return [
        "Pwede mong ma-contact si Kino gamit ang mga details na ito:",
        ...details,
        contact.preferredContactMethod ? `Note: ${contact.preferredContactMethod}` : "Email is preferred for professional inquiries and project requests."
      ].join("\n");
    }

    return [
      "You can contact Kino through these details:",
      ...details,
      contact.preferredContactMethod ? `Note: ${contact.preferredContactMethod}` : "Email is preferred for professional inquiries and project requests."
    ].join("\n");
  }

  function withServiceRecommendation(answer, intentKeys, wantsFilipino) {
    const recommendation = getServiceRecommendation(intentKeys, wantsFilipino);
    if (!recommendation) return answer;
    return `${answer}\n\n${recommendation}`;
  }

  function getServiceRecommendation(intentKeys, wantsFilipino) {
    const intents = new Set(intentKeys);

    if (intents.has("dashboard")) {
      return wantsFilipino
        ? "Recommended service: dashboard development, KPI monitoring setup, data visualization, at automated reporting support."
        : "Recommended service: dashboard development, KPI monitoring setup, data visualization, and automated reporting support.";
    }

    if (intents.has("automation")) {
      return wantsFilipino
        ? "Recommended service: Python automation, report extraction, file processing, at workflow improvement."
        : "Recommended service: Python automation, report extraction, file processing, and workflow improvement.";
    }

    if (intents.has("chatbot")) {
      return wantsFilipino
        ? "Recommended service: portfolio AI chatbot setup, knowledge-base structuring, at visitor inquiry flow."
        : "Recommended service: portfolio AI chatbot setup, knowledge-base structuring, and visitor inquiry flow.";
    }

    if (intents.has("services") || intents.has("availability")) {
      return wantsFilipino
        ? "Pwede kang mag-leave ng project details kung gusto mong i-discuss ang fit, timeline, o requirement."
        : "You can leave project details if you want to discuss fit, timeline, or requirements.";
    }

    return "";
  }

  function getQuickActions(contact = {}) {
    const actions = [
      { label: "View Projects", action: "projects" },
      { label: "Download Resume PDF", action: "resume" },
      { label: "Submit Project Request", action: "project-request", primary: true }
    ];

    if (contact.github) actions.push({ label: "GitHub", href: contact.github });
    if (contact.linkedin) actions.push({ label: "LinkedIn", href: contact.linkedin });
    if (contact.email) actions.push({ label: "Email", href: `mailto:${contact.email}` });
    if (contact.phone) actions.push({ label: "Mobile", href: `tel:${contact.phone}` });
    if (contact.facebook) actions.push({ label: "Facebook", href: contact.facebook });

    return actions;
  }

  function getResponseActions(intentKeys, contact = {}) {
    const intents = new Set(intentKeys);
    const actions = [];

    if (intents.has("projects") || intents.has("dashboard") || intents.has("automation") || intents.has("chatbot")) {
      actions.push({ label: "View Projects", action: "projects" });
    }

    if (intents.has("skills") || intents.has("tools")) {
      actions.push({ label: "View Skills", action: "skills" });
    }

    if (intents.has("contact") || intents.has("availability") || intents.has("services") || intents.has("value") || intents.has("dashboard") || intents.has("automation") || intents.has("chatbot")) {
      actions.push({ label: "Submit Project Request", action: "project-request", primary: true });
    }

    if (!actions.length) {
      actions.push({ label: "View Projects", action: "projects" });
      actions.push({ label: "Submit Project Request", action: "project-request", primary: true });
    }

    if (intents.has("contact")) {
      if (contact.email) actions.push({ label: "Email", href: `mailto:${contact.email}` });
      if (contact.phone) actions.push({ label: "Mobile", href: `tel:${contact.phone}` });
      if (contact.facebook) actions.push({ label: "Facebook", href: contact.facebook });
    }

    return actions.slice(0, 4);
  }

  function generateRetrievalAnswer(question, knowledgeItems) {
    if (!knowledgeItems.length) return getFallbackResponse(question);

    const normalizedQuestion = normalizeText(question);
    if (!normalizedQuestion) return getFallbackResponse(question);

    if (isSensitiveOrUnavailableRequest(normalizedQuestion)) {
      return getPrivacyFallbackResponse(question);
    }

    const wantsFilipino = isLikelyFilipino(question);
    const intentKeys = detectIntentKeys(question);

    const normalizedSearchQuestion = normalizeText(buildSemanticSearchText(question, intentKeys));

    const topMatch = knowledgeItems
      .map((item) => ({ item, score: scoreKnowledgeItem(normalizedSearchQuestion, item) }))
      .sort((a, b) => b.score - a.score)[0];

    if (topMatch && topMatch.score >= CHATBOT_CONFIG.confidenceThreshold + 6 && topMatch.item.sourceType === "faq") {
      return adaptAnswerLanguage(topMatch.item.answer, topMatch.item, wantsFilipino);
    }

    const intentAnswer = composeIntentAnswer(question, intentKeys, knowledgeItems, wantsFilipino);
    if (intentAnswer) return intentAnswer;

    if (!topMatch || topMatch.score < CHATBOT_CONFIG.confidenceThreshold) {
      return getFallbackResponse(question, getRelatedLabel(intentKeys));
    }

    return adaptAnswerLanguage(topMatch.item.answer, topMatch.item, wantsFilipino);
  }

  function getFallbackResponse(question, relatedLabel = "") {
    const english = relatedLabel
      ? `Thank you for your question. I do not have that exact information in the portfolio, but based on the available details, I can share related information about ${relatedLabel}.`
      : CHATBOT_CONFIG.fallbackResponse;
    const filipino = relatedLabel
      ? `Salamat sa tanong. Wala akong exact information na iyon sa portfolio, pero base sa available details, pwede akong mag-share ng related information tungkol sa ${relatedLabel}.`
      : CHATBOT_CONFIG.localizedFallbackResponse;

    return isLikelyFilipino(question) ? filipino : english;
  }

  function getPrivacyFallbackResponse(question) {
    return isLikelyFilipino(question)
      ? CHATBOT_CONFIG.localizedPrivacyFallbackResponse
      : CHATBOT_CONFIG.privacyFallbackResponse;
  }

  function buildSemanticSearchText(question, intentKeys) {
    const intentText = intentKeys.join(" ");
    return `${question} ${intentText} ${intentKeys.map((intent) => getIntentSynonyms(intent).join(" ")).join(" ")}`;
  }

  function composeIntentAnswer(question, intentKeys, knowledgeItems, wantsFilipino) {
    if (!intentKeys.length) return "";

    const profileItems = knowledgeItems
      .filter((item) => item.sourceType === "profile")
      .map((item) => ({
        item,
        rank: rankProfileItemForIntent(item, intentKeys)
      }))
      .filter((match) => match.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 3)
      .map((match) => match.item);

    if (!profileItems.length) return "";

    const labels = profileItems.map((item) => item.sectionLabel).filter(Boolean);
    const answerParts = profileItems.map((item) => {
      if (wantsFilipino && item.answerFilipino) return item.answerFilipino;
      return item.answer;
    }).filter(Boolean);

    if (!answerParts.length) return "";

    if (wantsFilipino) {
      return `Base sa portfolio ni Kino, related ito sa ${formatList(labels)}. ${answerParts.join(" ")}`;
    }

    return `Based on Kino's portfolio, this is related to ${formatList(labels)}. ${answerParts.join(" ")}`;
  }

  function rankProfileItemForIntent(item, intentKeys) {
    const itemIntents = new Set(item.intentKeys || []);
    const itemKeywords = normalizeText((item.keywords || []).join(" "));
    let rank = 0;

    intentKeys.forEach((intent) => {
      if (itemIntents.has(intent)) rank += 6;
      getIntentSynonyms(intent).forEach((term) => {
        if (itemKeywords.includes(normalizeText(term))) rank += 1;
      });
    });

    return rank + (item.priority || 0);
  }

  function formatList(items) {
    const cleanItems = Array.from(new Set(items)).filter(Boolean);
    if (!cleanItems.length) return "the available portfolio information";
    if (cleanItems.length === 1) return cleanItems[0];
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
  }

  function isSensitiveOrUnavailableRequest(normalizedQuestion) {
    return /\b(age|birth|birthday|birthdate|address|salary|compensation|credential|password|username|debtor|account number|private data|client name|bank data|confidential|residential|home|bpi)\b/.test(normalizedQuestion)
      || normalizedQuestion.includes("how old")
      || normalizedQuestion.includes("ilan taon")
      || normalizedQuestion.includes("saan nakatira")
      || normalizedQuestion.includes("date of birth")
      || normalizedQuestion.includes("current address")
      || normalizedQuestion.includes("home address")
      || normalizedQuestion.includes("hourly rate")
      || normalizedQuestion.includes("daily rate")
      || normalizedQuestion.includes("monthly rate")
      || normalizedQuestion.includes("magkano sahod")
      || normalizedQuestion.includes("sahod")
      || normalizedQuestion.includes("password")
      || normalizedQuestion.includes("client names")
      || normalizedQuestion.includes("client handled")
      || normalizedQuestion.includes("handled client")
      || normalizedQuestion.includes("who are your clients")
      || normalizedQuestion.includes("what clients")
      || normalizedQuestion.includes("which client")
      || normalizedQuestion.includes("ano client")
      || normalizedQuestion.includes("anong client")
      || normalizedQuestion.includes("client mo")
      || normalizedQuestion.includes("sino client");
  }

  function isLikelyFilipino(text) {
    const normalized = normalizeText(text);
    const filipinoTerms = [
      "ako",
      "ang",
      "ano",
      "ba",
      "bakit",
      "gamit",
      "ginagamit",
      "ilan",
      "ka",
      "kaya",
      "kukunin",
      "mako",
      "may",
      "meron",
      "mo",
      "mga",
      "ng",
      "namin",
      "paano",
      "po",
      "sa",
      "sino",
      "tagalog",
      "trabaho"
    ];

    return filipinoTerms.some((term) => normalized.split(" ").includes(term));
  }

  function inferIntentKeys(text) {
    return detectIntentKeys(text);
  }

  function detectIntentKeys(question) {
    const normalized = normalizeText(question);
    const words = new Set(normalized.split(" ").filter(Boolean));
    const intents = [];
    const add = (...keys) => keys.forEach((key) => {
      if (!intents.includes(key)) intents.push(key);
    });
    const hasPhrase = (...phrases) => phrases.some((phrase) => normalized.includes(normalizeText(phrase)));
    const hasWord = (...terms) => terms.some((term) => words.has(normalizeText(term)));

    if (hasPhrase("sino ka", "sino si kino", "tell me about yourself", "who is kino", "about me", "introduce yourself")) {
      add("about");
    }

    if (hasPhrase("ano kaya mong gawin", "ano kaya mo", "what can you do", "what do you offer", "services can you offer", "kaya mong i offer", "kaya mo i offer")
      || hasWord("skills", "skill", "kakayahan", "capability", "capabilities", "services", "offer", "service", "need", "kailangan", "gusto")) {
      add("skills", "services");
    }

    if (hasPhrase("marunong ka ba gumawa dashboard", "marunong ka dashboard", "can you build dashboards", "can you make dashboard", "dashboard project")
      || hasWord("dashboard", "dashboards", "monitoring", "kpi", "analytics")) {
      add("dashboard", "projects", "tools");
    }

    if (hasPhrase("may sample work", "may gawa ka", "sample work", "portfolio sample", "work sample", "show project")
      || hasWord("projects", "project", "proyekto", "samples", "sample", "portfolio", "gawa")) {
      add("projects");
    }

    if (hasPhrase("bakit ikaw", "bakit ka namin kukunin", "why should we hire", "why hire", "what makes you qualified", "why choose")
      || hasWord("hire", "qualified", "value", "strengths", "valuable", "kukunin")) {
      add("value", "experience", "achievements");
    }

    if (hasPhrase("how to contact", "how can we contact", "mako contact", "ma contact", "reach you")
      || hasWord("contact", "email", "reach")) {
      add("contact");
    }

    if (hasPhrase("available ka ba", "available for work", "freelance", "full time", "full-time", "open for work")
      || hasWord("available", "freelance", "fulltime")) {
      add("availability", "services");
    }

    if (hasPhrase("submit project request", "project request", "project inquiry", "client inquiry", "send request", "request a quote", "request quotation", "get quotation", "need a project", "need dashboard")
      || hasWord("quote", "quotation", "budget", "inquiry")) {
      add("services", "contact", "availability");
    }

    if (hasPhrase("work experience", "ano experience", "ano ang experience", "ano work experience", "career background")
      || hasWord("experience", "karanasan", "background", "trabaho", "operations")) {
      add("experience");
    }

    if (hasPhrase("tools and technologies", "tech stack", "anong tools", "tools gamit", "tools ginagamit")
      || hasWord("tools", "tool", "technology", "technologies", "python", "excel", "csv", "xlsx", "gamit", "ginagamit")) {
      add("tools");
    }

    if (hasWord("python", "automation", "automate", "extractor", "extract", "workflow")) {
      add("automation", "tools");
    }

    if (hasWord("chatbot", "bot", "ai") || hasPhrase("ai assistant", "portfolio assistant", "portfolio chatbot")) {
      add("chatbot", "services", "automation");
    }

    if (hasWord("achievement", "achievements", "awards", "recognition", "award", "promotion", "promoted")) {
      add("achievements", "value");
    }

    if (hasWord("client", "stakeholder", "business", "manager", "recruiter")) {
      add("services", "value");
    }

    return intents;
  }

  function getIntentSynonyms(intent) {
    const map = {
      about: ["about", "profile", "introduction", "sino", "background"],
      skills: ["skills", "expertise", "kakayahan", "capability", "strengths", "marunong"],
      services: ["services", "offer", "client support", "kaya gawin", "collaboration"],
      dashboard: ["dashboard", "monitoring", "kpi", "analytics", "reporting view"],
      projects: ["projects", "portfolio", "sample work", "gawa", "completed work"],
      tools: ["tools", "technologies", "tech stack", "python", "excel", "csv", "xlsx"],
      value: ["hire", "qualified", "why", "value", "strengths", "bakit ikaw"],
      experience: ["experience", "work", "operations", "career", "background", "karanasan"],
      achievements: ["achievements", "awards", "recognition", "promotion", "impact"],
      contact: ["contact", "reach", "email", "collaboration"],
      availability: ["available", "freelance", "full-time", "job", "client opportunity"],
      automation: ["automation", "python", "extractor", "workflow", "process improvement"],
      chatbot: ["chatbot", "ai assistant", "portfolio bot", "knowledge base", "visitor inquiry"]
    };

    return map[intent] || [intent];
  }

  function getRelatedLabel(intentKeys) {
    const labels = {
      about: "Kino's professional profile",
      skills: "skills and expertise",
      services: "services offered",
      dashboard: "dashboard and reporting capability",
      projects: "projects and sample work",
      tools: "tools and technologies",
      value: "strengths and value proposition",
      experience: "work experience",
      achievements: "achievements and impact",
      contact: "contact information",
      availability: "work availability",
      automation: "Python automation and workflow improvement",
      chatbot: "portfolio AI chatbot support"
    };

    const selected = intentKeys.map((intent) => labels[intent]).filter(Boolean);
    if (!selected.length) return "";
    return formatList(selected);
  }

  function getIntentQuestion(question, wantsFilipino) {
    const normalized = normalizeText(question);
    const has = (...terms) => terms.some((term) => normalized.includes(term));

    if (wantsFilipino) {
      if (has("sino ka", "sino si kino")) return "Sino ka?";
      if (has("skills", "skill", "kakayahan")) return "Ano ang skills mo?";
      if (has("project", "projects", "proyekto")) return "Ano ang mga project mo?";
      if (has("dashboard", "dashboards")) return "Paano gumagana ang dashboard project mo?";
      if (has("tools", "tool", "gamit", "ginagamit", "tech")) return "Anong tools ang ginagamit mo?";
      if (has("kukunin", "hire", "qualified", "bakit ka")) return "Bakit ka namin kukunin?";
      if (has("contact", "mako contact", "mako contact", "ma contact")) return "Paano ka namin mako-contact?";
      if (has("available", "freelance", "full time", "fulltime")) return "Available ka ba for work?";
      if (has("experience", "work experience", "work exp", "exp", "karanasan", "trabaho", "work")) return "Ano ang work experience mo?";
      if (has("offer", "client", "kaya mong", "kaya mo")) return "Ano ang kaya mong i-offer sa client?";
      return "";
    }

    if (has("tell me about yourself", "who is kino", "about yourself", "introduce")) return "Who is Kino?";
    if (has("skills", "expertise", "strengths")) return "What are Kino's main skills?";
    if (has("projects", "project", "portfolio work", "completed")) return "What projects can Kino showcase?";
    if (has("dashboard", "dashboards")) return "Can you explain your dashboard project?";
    if (has("tools", "technologies", "tech stack", "python")) return "What tools and technologies does Kino use?";
    if (has("work experience", "experience", "background")) return "What work experience does Kino have?";
    if (has("services", "offer", "collaborate")) return "What services can Kino offer?";
    if (has("hire", "qualified", "why should", "valuable")) return "Why should someone work with Kino?";
    if (has("contact", "reach")) return "How can someone contact Kino?";
    if (has("available", "freelance", "full time", "full-time")) return "Is Kino available for freelance or full-time work?";
    return "";
  }

  function adaptAnswerLanguage(answer, item, wantsFilipino) {
    if (wantsFilipino && item.answerFilipino) return item.answerFilipino;
    if (!wantsFilipino || isLikelyFilipino(`${item.question} ${answer}`)) return answer;

    const category = normalizeText(item.category);
    const question = normalizeText(item.question);

    if (category.includes("skills") || question.includes("skills")) {
      return "Base sa portfolio, ang strengths ni Kino ay Python automation, data reporting, Excel/CSV/XLSX processing, dashboard monitoring, data validation, process improvement, operations strategy, at clear communication.";
    }

    if (category.includes("projects") || question.includes("project")) {
      return "Ilan sa projects ni Kino ay MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, at Report Auto Extractor.";
    }

    if (category.includes("career") || category.includes("work") || question.includes("experience")) {
      return "May background si Kino sa customer-facing operations, team supervision, collection operations, strategy support, reporting, dashboard monitoring, at Python automation. Ang portfolio niya ay focused ngayon sa future job at client opportunities.";
    }

    if (category.includes("contact") || question.includes("contact")) {
      return "Kung walang contact details na nakalagay sa portfolio, ang best next step ay kontakin si Kino gamit ang channel kung saan na-share ang portfolio.";
    }

    if (category.includes("automation") || question.includes("automation")) {
      return "Base sa portfolio, gumagamit si Kino ng automation para bawasan ang manual reporting work, mapabilis ang data extraction, at gawing mas consistent ang operational outputs.";
    }

    return `Base sa portfolio ni Kino: ${answer}`;
  }

  function scoreKnowledgeItem(normalizedQuestion, item) {
    const queryTerms = expandTerms(tokenize(normalizedQuestion));
    const questionText = normalizeText(item.question);
    const answerText = normalizeText(item.answer);
    const categoryText = normalizeText(item.category);
    const keywordText = normalizeText((item.keywords || []).join(" "));
    const intentText = normalizeText((item.intentKeys || []).join(" "));
    const combined = `${questionText} ${questionText} ${categoryText} ${keywordText} ${intentText} ${answerText}`;
    let score = 0;

    queryTerms.forEach((term) => {
      if (questionText.includes(term)) score += 4;
      if (intentText.includes(term)) score += 4;
      if (keywordText.includes(term)) score += 3;
      if (categoryText.includes(term)) score += 2;
      if (answerText.includes(term)) score += 1;
      if (combined.includes(term)) score += 0.5;
    });

    if (questionText.includes(normalizedQuestion)) score += 8;
    if (normalizedQuestion.includes(questionText) && questionText.length > 8) score += 8;
    if (item.sourceType === "profile") score += item.priority || 0;

    return score;
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(text) {
    const stopWords = new Set([
      "about",
      "after",
      "ako",
      "also",
      "and",
      "ang",
      "ano",
      "are",
      "ba",
      "can",
      "does",
      "for",
      "from",
      "has",
      "have",
      "her",
      "him",
      "his",
      "how",
      "into",
      "is",
      "ka",
      "me",
      "my",
      "mga",
      "mo",
      "ng",
      "of",
      "on",
      "or",
      "po",
      "she",
      "si",
      "the",
      "their",
      "this",
      "to",
      "what",
      "when",
      "where",
      "who",
      "why",
      "with",
      "yung",
      "you"
    ]);

    return normalizeText(text)
      .split(" ")
      .filter((term) => term.length > 2 && !stopWords.has(term));
  }

  function expandTerms(terms) {
    const synonyms = {
      automation: ["automation", "automate", "extractor", "python", "workflow"],
      dashboard: ["dashboard", "monitoring", "kpi", "reporting", "analytics"],
      dashboards: ["dashboard", "monitoring", "kpi", "reporting", "analytics"],
      collection: ["collection", "collections", "debt", "campaign", "strategy"],
      collections: ["collection", "collections", "debt", "campaign", "strategy"],
      report: ["report", "reporting", "excel", "csv", "xlsx"],
      reports: ["report", "reporting", "excel", "csv", "xlsx"],
      python: ["python", "automation", "extractor", "workflow"],
      client: ["client", "coordination", "stakeholder", "communication"],
      clients: ["client", "coordination", "stakeholder", "communication"],
      leadership: ["leadership", "training", "team", "coaching"],
      compliance: ["compliance", "confidential", "sensitive", "data"],
      skills: ["skills", "expertise", "strengths", "capability", "kakayahan"],
      skill: ["skills", "expertise", "strengths", "capability", "kakayahan"],
      gamit: ["tools", "technologies", "tech", "stack"],
      ginagamit: ["tools", "technologies", "tech", "stack"],
      tools: ["tools", "technologies", "tech", "stack"],
      technologies: ["tools", "technologies", "tech", "stack"],
      marunong: ["skills", "capability", "dashboard", "automation"],
      kaya: ["skills", "services", "capability", "offer"],
      project: ["project", "projects", "portfolio", "sample", "work"],
      projects: ["project", "projects", "portfolio", "sample", "work"],
      proyekto: ["project", "projects", "portfolio", "sample", "work"],
      sample: ["project", "projects", "portfolio", "work"],
      samples: ["project", "projects", "portfolio", "work"],
      gawa: ["project", "projects", "portfolio", "sample", "work"],
      karanasan: ["experience", "background", "work", "operations"],
      trabaho: ["work", "experience", "background", "operations"],
      experience: ["experience", "background", "work", "operations"],
      contact: ["contact", "reach", "collaboration"],
      bakit: ["hire", "qualified", "value", "strengths"],
      ikaw: ["hire", "qualified", "value", "strengths"],
      kukunin: ["hire", "qualified", "value", "strengths"],
      hire: ["hire", "qualified", "value", "strengths"],
      offer: ["services", "collaboration", "client", "support"],
      available: ["available", "freelance", "fulltime", "work"],
      chatbot: ["chatbot", "bot", "ai", "assistant", "knowledge", "base"],
      bot: ["chatbot", "bot", "ai", "assistant", "knowledge", "base"],
      kailangan: ["need", "services", "support", "requirement"],
      need: ["need", "services", "support", "requirement"]
    };

    return Array.from(
      new Set(
        terms.flatMap((term) => {
          return synonyms[term] || [term];
        })
      )
    );
  }
})();
