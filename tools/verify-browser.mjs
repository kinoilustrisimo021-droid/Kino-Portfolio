import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const targets = await fetch("http://127.0.0.1:9448/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No preview page target found.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const browserErrors = [];
let sequence = 0;

await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener("open", resolveOpen, { once: true });
  socket.addEventListener("error", rejectOpen, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolveCommand, rejectCommand } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectCommand(new Error(message.error.message));
    else resolveCommand(message.result || {});
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    browserErrors.push(message.params.exceptionDetails?.text || "Runtime exception");
  }
  if (message.method === "Log.entryAdded" && message.params.entry?.level === "error") {
    browserErrors.push(message.params.entry.text);
  }
});

function command(method, params = {}) {
  return new Promise((resolveCommand, rejectCommand) => {
    const id = ++sequence;
    pending.set(id, { resolveCommand, rejectCommand });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Evaluation failed");
  return result.result?.value;
}

async function screenshot(name) {
  const result = await command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false
  });
  const path = join(tmpdir(), name);
  writeFileSync(path, Buffer.from(result.data, "base64"));
  return path;
}

await command("Page.enable");
await command("Runtime.enable");
await command("Log.enable");
await command("Network.enable");
await command("Network.setCacheDisabled", { cacheDisabled: true });
await command("Emulation.setEmulatedMedia", {
  media: "screen",
  features: [{ name: "prefers-reduced-motion", value: "no-preference" }]
});

const pageUrl = pathToFileURL(resolve("index.html")).href;
await command("Emulation.setDeviceMetricsOverride", {
  width: 1600,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false
});
await command("Page.navigate", { url: pageUrl });
await wait(3200);

const desktopHero = await screenshot("kino-hero-desktop-v4.png");
await evaluate("document.querySelector('#profile').scrollIntoView({block:'start'}); true");
await wait(1400);
const desktopProfile = await screenshot("kino-profile-desktop-v4.png");
await evaluate("document.querySelector('.support-aristotle-stage').scrollIntoView({block:'center'}); true");
await wait(900);
const desktopAristotle = await screenshot("kino-support-aristotle-desktop-v1.png");
const desktopChecks = await evaluate(`(() => {
  const stage = document.querySelector('.support-aristotle-stage');
  const image = document.querySelector('.support-aristotle');
  const active = document.querySelector('.nav-links a[aria-current="location"]');
  return {
    noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    stageWidth: Math.round(stage.getBoundingClientRect().width),
    stageHeight: Math.round(stage.getBoundingClientRect().height),
    imageWidth: Math.round(image.getBoundingClientRect().width),
    imageLoaded: image.complete && image.naturalWidth > 0,
    imageBlendMode: getComputedStyle(image).mixBlendMode,
    imageAnimation: getComputedStyle(image).animationName,
    activeNavigation: active?.textContent?.trim() || null
  };
})()`);

await evaluate("document.querySelector('#projects').scrollIntoView({block:'start'}); true");
await wait(1800);
const desktopProjects = await screenshot("kino-projects-desktop-v1.png");
const projectDiscoveryChecks = await evaluate(`(() => {
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const automationFilter = document.querySelector('[data-project-filter="automation"]');
  automationFilter?.click();
  const filteredCards = cards.filter((card) => !card.hidden);
  const result = {
    cardCount: cards.length,
    cardsWithActions: cards.filter((card) => card.querySelector('.project-open')).length,
    cardsWithTechnology: cards.filter((card) => card.querySelector('.project-card-tools span')).length,
    automationCount: filteredCards.length,
    resultLabel: document.querySelector('[data-project-result-count]')?.textContent?.trim() || null,
    filterPressed: automationFilter?.getAttribute('aria-pressed') || null
  };
  document.querySelector('[data-project-filter="all"]')?.click();
  return result;
})()`);
await wait(300);
await evaluate("document.querySelector('.project-card')?.scrollIntoView({block:'center'}); true");
await wait(500);
const desktopProjectCard = await screenshot("kino-project-card-desktop-v1.png");
await evaluate(`(() => {
  const shot = document.querySelector('.project-shot.has-image');
  if (!shot) return false;
  shot.click();
  return true;
})()`);
await wait(500);
const desktopPreview = await screenshot("kino-project-preview-v4.png");
const previewChecks = await evaluate(`(() => ({
  open: document.querySelector('.image-lightbox')?.classList.contains('is-open') || false,
  title: document.querySelector('.lightbox-copy figcaption')?.textContent?.trim() || null,
  summaryLength: document.querySelector('.lightbox-summary')?.textContent?.trim().length || 0,
  mainInert: document.querySelector('main')?.inert || false,
  visualLayout: (() => {
    const visual = document.querySelector('.lightbox-visual');
    const image = visual?.querySelector('img');
    if (!visual || !image) return null;
    const visualRect = visual.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    return {
      visualTop: Math.round(visualRect.top),
      visualHeight: Math.round(visualRect.height),
      imageTop: Math.round(imageRect.top),
      imageHeight: Math.round(imageRect.height),
      alignItems: getComputedStyle(visual).alignItems,
      imageAlignSelf: getComputedStyle(image).alignSelf,
      imageMarginTop: getComputedStyle(image).marginTop
    };
  })()
}))()`);
await evaluate("document.querySelector('[data-lightbox-next]')?.click(); true");
await wait(250);
const previewNavigationChecks = await evaluate(`(() => ({
  title: document.querySelector('.lightbox-copy figcaption')?.textContent?.trim() || null,
  position: document.querySelector('[data-lightbox-position]')?.textContent?.trim() || null,
  triggerRemainsInert: document.querySelector('main')?.inert || false
}))()`);
await evaluate("document.querySelector('.lightbox-close')?.click(); true");

await command("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 390,
  screenHeight: 844
});
await command("Page.navigate", { url: `${pageUrl}?viewport=mobile` });
await wait(3000);
await evaluate("history.scrollRestoration = 'manual'; window.scrollTo({top: 0, behavior: 'auto'}); true");
await wait(400);
const mobileHero = await screenshot("kino-hero-mobile-v1.png");
const mobileHeroChecks = await evaluate(`(() => {
  const hero = document.querySelector('.hero');
  const copy = document.querySelector('.hero-copy');
  const portrait = document.querySelector('.portrait-card');
  const rect = (element) => {
    const box = element?.getBoundingClientRect();
    return box ? { top: Math.round(box.top), bottom: Math.round(box.bottom), height: Math.round(box.height) } : null;
  };
  return {
    scrollY: Math.round(window.scrollY),
    hero: rect(hero),
    copy: rect(copy),
    portrait: rect(portrait),
    copyDisplay: copy ? getComputedStyle(copy).display : null,
    copyVisibility: copy ? getComputedStyle(copy).visibility : null,
    copyOpacity: copy ? getComputedStyle(copy).opacity : null
  };
})()`);
await evaluate("document.querySelector('#projects').scrollIntoView({block:'start'}); true");
await wait(1000);
const mobileProjects = await screenshot("kino-projects-mobile-v1.png");
const mobileProjectChecks = await evaluate(`(() => ({
  noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
  toolbarScrollsInternally: (() => {
    const toolbar = document.querySelector('.project-toolbar');
    return toolbar ? toolbar.scrollWidth >= toolbar.clientWidth : false;
  })(),
  visibleProjectActions: Array.from(document.querySelectorAll('.project-card:not([hidden]) .project-open')).length
}))()`);
await evaluate("document.querySelector('.project-card')?.scrollIntoView({block:'center'}); true");
await wait(600);
const mobileProjectCard = await screenshot("kino-project-card-mobile-v1.png");
await evaluate("document.querySelector('.support-aristotle-stage').scrollIntoView({block:'center'}); true");
await wait(1000);
const mobileAristotle = await screenshot("kino-support-aristotle-mobile-v1.png");
const mobileChecks = await evaluate(`(() => {
  const stage = document.querySelector('.support-aristotle-stage');
  const image = document.querySelector('.support-aristotle');
  const toggle = document.querySelector('.menu-toggle');
  toggle?.click();
  const result = {
    noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    stageWidth: Math.round(stage.getBoundingClientRect().width),
    stageHeight: Math.round(stage.getBoundingClientRect().height),
    imageWidth: Math.round(image.getBoundingClientRect().width),
    menuOpen: document.body.classList.contains('nav-open'),
    menuExpanded: toggle?.getAttribute('aria-expanded')
  };
  toggle?.click();
  return result;
})()`);

await command("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }]
});
await command("Page.reload", { ignoreCache: true });
await wait(1800);
const reducedMotionChecks = await evaluate(`(() => ({
  pageEntered: document.body.classList.contains('page-entered'),
  counterText: Array.from(document.querySelectorAll('[data-count-to]')).map((item) => item.textContent.trim()),
  decodeComplete: document.querySelector('[data-decode]')?.dataset.decodeComplete || null,
  aristotleAnimation: getComputedStyle(document.querySelector('.support-aristotle')).animationName,
  haloAnimation: getComputedStyle(document.querySelector('.support-aristotle-stage'), '::before').animationName,
  bootRemoved: !document.querySelector('[data-system-boot]')
}))()`);

socket.close();

console.log(JSON.stringify({
  screenshots: { desktopHero, desktopProfile, desktopAristotle, desktopProjects, desktopProjectCard, desktopPreview, mobileHero, mobileProjects, mobileProjectCard, mobileAristotle },
  desktopChecks,
  projectDiscoveryChecks,
  previewChecks,
  previewNavigationChecks,
  mobileChecks,
  mobileHeroChecks,
  mobileProjectChecks,
  reducedMotionChecks,
  browserErrors
}, null, 2));
