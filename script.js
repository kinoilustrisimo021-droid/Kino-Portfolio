(function () {
  document.documentElement.classList.add("has-js");

  const progress = document.querySelector(".scroll-progress");
  const revealItems = document.querySelectorAll(".reveal");
  const navLinks = document.querySelectorAll(".nav-links a");
  const portraitCard = document.querySelector(".portrait-card");
  const profilePhoto = document.querySelector("#profilePhoto");
  const systemBoot = document.querySelector("[data-system-boot]");
  const printResumeButton = document.querySelector("[data-print-resume]");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduceMotion = reduceMotionQuery.matches;
  const canUsePointerMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;
  const decodeTargets = document.querySelectorAll("[data-decode]");
  const heroCounters = document.querySelectorAll("[data-count-to]");
  const CHATBOT_CONFIG = {
    botName: "Kino Portfolio Assistant",
    provider: "hybrid",
    structuredProfileUrl: "portfolio-profile.json",
    portfolioTextUrl: "portfolio.txt",
    skillsUrl: "skills.json",
    projectsUrl: "projects.json",
    servicesUrl: "services.json",
    contactUrl: "contact.json",
    faqUrl: "faq.txt",
    knowledgeBaseUrl: "questionnaire.txt",
    confidenceThreshold: 5,
    fallbackResponse:
      "I don't see that exact detail in Kino's public portfolio, so I don't want to guess. I can still help with his work, skills, project fit, availability, or contact details.",
    localizedFallbackResponse:
      "Wala ang exact detail na iyon sa public portfolio ni Kino, kaya ayokong manghula. Matutulungan pa rin kita sa work, skills, project fit, availability, o contact details niya.",
    privacyFallbackResponse:
      "That detail isn't public, and I won't guess or expose private information. I can help with Kino's verified work, skills, experience, projects, or contact options instead.",
    localizedPrivacyFallbackResponse:
      "Hindi public ang detail na iyon, at hindi ako manghuhula o maglalabas ng private information. Matutulungan kita sa verified work, skills, experience, projects, o contact options ni Kino.",
    suggestedQuestions: [
      "What problems can Kino solve?",
      "Can he automate our reporting?",
      "Show me his strongest work.",
      "Is Kino a fit for our team?",
      "What tools does he use?",
      "How can I contact Kino?"
    ],
    futureModel: {
      type: "secure-backend",
      endpoint: "/api/portfolio-chat",
      timeoutMs: 16_000,
      maxHistoryMessages: 8
    }
  };

  const PROJECT_SHOWCASE_DETAILS = {
    "MC6 Collection Pipeline": {
      problem: "Campaign teams needed clearer visibility on endorsement movement, worked accounts, RPC, PTP, kept, BP, and other collection indicators.",
      tools: ["Python", "Excel/CSV workflows", "Dashboard reporting"],
      impact: "Improves campaign review by making performance movement easier to monitor and compare."
    },
    "Digital Omnichannel Monitoring Dashboard": {
      problem: "The team needed one place to monitor digital collection activities across Email, Viber, SMS, and CYN touchpoints.",
      tools: ["Python", "DuckDB", "Dashboard UI", "CSV/XLSX uploads"],
      impact: "Creates a single source of truth for digital performance, faster reporting, and better campaign governance."
    },
    "Digital Reporting App": {
      problem: "Internal users needed an easier way to build reports and extract raw data for strategy review.",
      tools: ["Python", "Excel", "CSV/XLSX processing"],
      impact: "Reduces manual report preparation and gives users faster access to strategy-ready outputs."
    },
    "Excel Reporting Result": {
      problem: "Performance results needed to be visible immediately in a structured Excel format.",
      tools: ["Excel", "Python-supported preparation", "CSV/XLSX workflows"],
      impact: "Makes performance review faster by organizing multiple channel results into readable Excel outputs."
    },
    "Predictive Summary Extractor": {
      problem: "Lead extraction was time-consuming during dialer strategy work and needed automation for faster reporting.",
      tools: ["Python", "Desktop UI", "File automation"],
      impact: "Reduces manual extraction effort and makes lead reports easier to prepare when needed."
    },
    "Alloc Review Builder": {
      problem: "The team needed a better way to review endorsements, work frequency, hierarchy status, pulled-out activity, and report rows.",
      tools: ["Python", "Web dashboard UI", "CSV/XLSX workflows"],
      impact: "Improves review speed and gives campaign teams cleaner endorsement visibility."
    },
    "Auto Redial Automation": {
      problem: "Repeated manual redial triggers created delay and effort when handling many daily leads.",
      tools: ["Python", "Desktop automation UI", "Workflow automation"],
      impact: "Helps reduce repetitive work and improves consistency in high-volume lead handling."
    },
    "MC6 Analytics Hub": {
      problem: "Operational teams needed a unified hub for pipeline, penetration, and dialer monitoring.",
      tools: ["Python", "Dashboard UI", "MySQL-connected reporting"],
      impact: "Supports clearer operational monitoring across collection intelligence modules."
    },
    "Report Auto Extractor": {
      problem: "Previous-day activity extraction needed to be prepared faster for next-day reporting.",
      tools: ["Python", "Automation UI", "Report extraction workflow"],
      impact: "Speeds up daily reporting and reduces repetitive extraction work."
    }
  };

  const PROJECT_CATEGORIES = {
    "MC6 Collection Pipeline": ["dashboards", "reporting"],
    "Digital Omnichannel Monitoring Dashboard": ["dashboards", "reporting"],
    "Digital Reporting App": ["automation", "reporting"],
    "Excel Reporting Result": ["reporting"],
    "Predictive Summary Extractor": ["automation", "reporting"],
    "Alloc Review Builder": ["dashboards", "reporting"],
    "Auto Redial Automation": ["automation"],
    "MC6 Analytics Hub": ["dashboards", "reporting"],
    "Report Auto Extractor": ["automation", "reporting"]
  };

  if (reduceMotion) {
    document.body.classList.add("page-ready", "page-entered");
  } else {
    document.body.classList.add("motion-ready");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => document.body.classList.add("page-ready", "page-entered"));
    });
  }

  function completeSystemBoot() {
    document.body.classList.add("boot-complete");
    if (!systemBoot) return;
    window.setTimeout(() => systemBoot.remove(), reduceMotionQuery.matches ? 0 : 460);
  }

  if (reduceMotion || !systemBoot) {
    completeSystemBoot();
  } else {
    window.setTimeout(completeSystemBoot, 940);
  }

  printResumeButton?.addEventListener("click", () => window.print());

  reduceMotionQuery.addEventListener?.("change", (event) => {
    if (!event.matches) return;
    document.body.classList.add("page-ready", "page-entered");
    decodeTargets.forEach((target) => {
      target.textContent = target.dataset.decodeText || target.textContent;
    });
    heroCounters.forEach(setCounterFinal);
    document
      .querySelectorAll("[style*='--tilt'], [style*='--magnetic'], [style*='--spotlight']")
      .forEach((target) => {
        target.classList.remove("is-interacting");
        ["--tilt-x", "--tilt-y", "--magnetic-x", "--magnetic-y", "--spotlight-x", "--spotlight-y"].forEach(
          (property) => target.style.removeProperty(property)
        );
      });
  });

  function setCounterFinal(counter) {
    const value = Number(counter.dataset.countTo || 0);
    const suffix = counter.dataset.countSuffix || "";
    counter.textContent = `${value}${suffix}`;
  }

  function decodeText(target) {
    if (!target || target.dataset.decodeComplete === "true") return;

    const original = target.textContent || "";
    target.dataset.decodeText = original;
    if (reduceMotionQuery.matches) {
      target.dataset.decodeComplete = "true";
      return;
    }

    const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mutableIndexes = Array.from(original)
      .map((character, index) => (/\p{L}|\p{N}/u.test(character) ? index : -1))
      .filter((index) => index >= 0);
    const startedAt = performance.now();
    const duration = 920;

    function render(now) {
      if (reduceMotionQuery.matches) {
        target.textContent = original;
        target.dataset.decodeComplete = "true";
        return;
      }

      const progress = Math.min((now - startedAt) / duration, 1);
      const revealCount = Math.floor(progress * mutableIndexes.length);
      const revealed = new Set(mutableIndexes.slice(0, revealCount));
      target.textContent = Array.from(original)
        .map((character, index) => {
          if (!mutableIndexes.includes(index) || revealed.has(index)) return character;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      if (progress < 1) {
        window.requestAnimationFrame(render);
      } else {
        target.textContent = original;
        target.dataset.decodeComplete = "true";
        document.body.classList.add("system-ready");
      }
    }

    window.requestAnimationFrame(render);
  }

  function animateCounter(counter) {
    if (!counter || counter.dataset.countComplete === "true") return;
    if (reduceMotionQuery.matches) {
      setCounterFinal(counter);
      counter.dataset.countComplete = "true";
      return;
    }

    const target = Number(counter.dataset.countTo || 0);
    const suffix = counter.dataset.countSuffix || "";
    const startedAt = performance.now();
    const duration = 980;
    counter.textContent = `0${suffix}`;

    function render(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1 && !reduceMotionQuery.matches) {
        window.requestAnimationFrame(render);
      } else {
        setCounterFinal(counter);
        counter.dataset.countComplete = "true";
      }
    }

    window.requestAnimationFrame(render);
  }

  if (reduceMotion) {
    decodeTargets.forEach((target) => {
      target.dataset.decodeText = target.textContent || "";
      target.dataset.decodeComplete = "true";
    });
    heroCounters.forEach(setCounterFinal);
    document.body.classList.add("system-ready");
  } else {
    window.setTimeout(() => decodeTargets.forEach(decodeText), 260);

    const metrics = document.querySelector(".hero-metrics");
    if (metrics && "IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          heroCounters.forEach(animateCounter);
          counterObserver.disconnect();
        },
        { threshold: 0.45 }
      );
      counterObserver.observe(metrics);
    } else {
      heroCounters.forEach(animateCounter);
    }
  }

  if (canUsePointerMotion) {
    let auraFrame = 0;
    let auraPointer = null;
    window.addEventListener(
      "pointermove",
      (event) => {
        auraPointer = event;
        if (auraFrame) return;
        auraFrame = window.requestAnimationFrame(() => {
          auraFrame = 0;
          if (!auraPointer || reduceMotionQuery.matches) return;
          document.documentElement.style.setProperty("--cursor-x", `${auraPointer.clientX}px`);
          document.documentElement.style.setProperty("--cursor-y", `${auraPointer.clientY}px`);
        });
      },
      { passive: true }
    );
  }

  const siteHeader = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNavigation = document.querySelector("#primaryNavigation");

  function closeNavigation({ returnFocus = false } = {}) {
    if (!menuToggle || !mobileNavigation) return;
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) menuToggle.focus();
  }

  if (menuToggle && mobileNavigation) {
    menuToggle.addEventListener("click", () => {
      const willOpen = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", willOpen);
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
      if (willOpen) {
        window.setTimeout(() => mobileNavigation.querySelector("a")?.focus(), reduceMotionQuery.matches ? 0 : 380);
      }
    });

    navLinks.forEach((link) => link.addEventListener("click", () => closeNavigation()));

    window.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("nav-open")) return;

      if (event.key === "Escape") {
        closeNavigation({ returnFocus: true });
        return;
      }

      if (event.key === "Tab" && window.innerWidth <= 760) {
        const mobileFocusOrder = [menuToggle, ...mobileNavigation.querySelectorAll("a")];
        const first = mobileFocusOrder[0];
        const firstLink = mobileFocusOrder[1];
        const last = mobileFocusOrder[mobileFocusOrder.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (event.shiftKey && document.activeElement === firstLink) {
          event.preventDefault();
          first.focus();
        } else if (!event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          firstLink.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNavigation();
    });
  }

  function updateHeaderState() {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function updateCompactChatState() {
    document.body.classList.add("compact-chat-ready");
  }

  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
    progress.style.setProperty("--scroll-progress", ratio.toFixed(4));
  }

  let viewportFrame = 0;

  function updateViewportState() {
    viewportFrame = 0;
    updateProgress();
    updateHeaderState();
    updateCompactChatState();
  }

  function scheduleViewportUpdate() {
    if (viewportFrame) return;
    viewportFrame = window.requestAnimationFrame(updateViewportState);
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => {
      const revealSiblings = Array.from(item.parentElement?.children || []).filter((sibling) =>
        sibling.classList.contains("reveal")
      );
      const siblingIndex = Math.max(0, revealSiblings.indexOf(item));
      const isVerticalList = item.parentElement?.matches(".experience-list");
      const delay = revealSiblings.length > 1 && !isVerticalList ? (siblingIndex % 4) * 72 : 0;
      item.style.setProperty("--reveal-delay", `${delay}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const ambientRegions = document.querySelectorAll(".hero, .ticker, .support-aristotle-stage, .stack-category-grid, .support-section, .closing-section");
  if ("IntersectionObserver" in window && ambientRegions.length) {
    const ambientObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
      },
      { rootMargin: "10% 0px 10% 0px", threshold: 0.01 }
    );
    ambientRegions.forEach((region) => ambientObserver.observe(region));
  } else {
    ambientRegions.forEach((region) => region.classList.add("is-in-view"));
  }

  updateViewportState();
  window.addEventListener("scroll", scheduleViewportUpdate, { passive: true });
  window.addEventListener("resize", scheduleViewportUpdate, { passive: true });

  if (portraitCard && profilePhoto) {
    const sources = (profilePhoto.dataset.photoSources || "")
      .split(",")
      .map((source) => source.trim())
      .filter(Boolean);
    const initialSource = profilePhoto.getAttribute("src") || "";
    const initialSourceIndex = sources.indexOf(initialSource);
    let sourceIndex = initialSourceIndex >= 0 ? initialSourceIndex + 1 : 0;

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

    if (profilePhoto.complete) {
      if (profilePhoto.naturalWidth > 0) {
        showLoaded();
      } else {
        tryNextSource();
      }
    } else if (!initialSource) {
      tryNextSource();
    }
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navMap = new Map(
    Array.from(navLinks).map((link) => [link.getAttribute("href")?.replace("#", ""), link])
  );
  const getNavGroup = (section) => section.dataset.navGroup || section.id;
  const navSections = sections.filter((section) => navMap.has(getNavGroup(section)));

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const isActive = link === navMap.get(id);
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && navSections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry) setActiveNav(getNavGroup(activeEntry.target));
      },
      {
        rootMargin: "-34% 0px -55% 0px",
        threshold: [0.08, 0.22, 0.5]
      }
    );

    navSections.forEach((section) => navObserver.observe(section));
  }

  let activeNavFrame = 0;

  function updateActiveNavFromScroll() {
    activeNavFrame = 0;
    if (!navSections.length || !navLinks.length) return;

    const headerHeight = siteHeader?.getBoundingClientRect().height || 0;
    const sampleLine = Math.min(window.innerHeight * 0.42, headerHeight + 320);
    const passedSections = navSections.filter(
      (section) => section.getBoundingClientRect().top <= sampleLine
    );
    const activeSection = passedSections[passedSections.length - 1];
    setActiveNav(activeSection ? getNavGroup(activeSection) : "");
  }

  function scheduleActiveNavUpdate() {
    if (activeNavFrame) return;
    activeNavFrame = window.requestAnimationFrame(updateActiveNavFromScroll);
  }

  updateActiveNavFromScroll();
  window.addEventListener("scroll", scheduleActiveNavUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveNavUpdate, { passive: true });

  document.querySelectorAll(".timeline").forEach((scroller) => {
    scroller.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (scroller.scrollWidth <= scroller.clientWidth) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      scroller.scrollBy({
        left: direction * Math.max(scroller.clientWidth * 0.78, 260),
        behavior: reduceMotionQuery.matches ? "auto" : "smooth"
      });
    });
  });

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
    const spotlightTargets = document.querySelectorAll(
      ".project-card, .glass-card, .timeline-item, .experience-item, .responsibility-grid article, .stack-category, .support-spotlight, .support-card"
    );

    spotlightTargets.forEach((target) => {
      const canTilt = target.matches(".project-card, .glass-card, .responsibility-grid article, .stack-category, .support-spotlight, .support-card");
      let pointerFrame = 0;
      let latestPointer = null;

      const renderPointerMotion = () => {
        pointerFrame = 0;
        if (!latestPointer || reduceMotionQuery.matches) return;

        const rect = target.getBoundingClientRect();
        const xRatio = Math.min(Math.max((latestPointer.clientX - rect.left) / rect.width, 0), 1);
        const yRatio = Math.min(Math.max((latestPointer.clientY - rect.top) / rect.height, 0), 1);
        target.style.setProperty("--spotlight-x", `${(xRatio * 100).toFixed(2)}%`);
        target.style.setProperty("--spotlight-y", `${(yRatio * 100).toFixed(2)}%`);

        if (canTilt) {
          const strength = target.classList.contains("project-card") ? 2.4 : 1.8;
          target.style.setProperty("--tilt-x", `${((yRatio - 0.5) * -strength).toFixed(2)}deg`);
          target.style.setProperty("--tilt-y", `${((xRatio - 0.5) * strength).toFixed(2)}deg`);
        }
      };

      target.addEventListener("pointerenter", () => target.classList.add("is-interacting"));
      target.addEventListener("pointermove", (event) => {
        latestPointer = event;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointerMotion);
      });

      const resetPointerMotion = () => {
        if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        latestPointer = null;
        target.classList.remove("is-interacting");
        target.style.removeProperty("--tilt-x");
        target.style.removeProperty("--tilt-y");
        target.style.removeProperty("--spotlight-x");
        target.style.removeProperty("--spotlight-y");
      };

      target.addEventListener("pointerleave", resetPointerMotion);
      target.addEventListener("pointercancel", resetPointerMotion);
    });

    document.querySelectorAll(".magnetic").forEach((target) => {
      let magneticFrame = 0;
      let latestPointer = null;

      const renderMagneticMotion = () => {
        magneticFrame = 0;
        if (!latestPointer || reduceMotionQuery.matches) return;
        const rect = target.getBoundingClientRect();
        const xRatio = (latestPointer.clientX - rect.left) / rect.width - 0.5;
        const yRatio = (latestPointer.clientY - rect.top) / rect.height - 0.5;
        target.style.setProperty("--magnetic-x", `${(xRatio * 4).toFixed(2)}px`);
        target.style.setProperty("--magnetic-y", `${(yRatio * 4).toFixed(2)}px`);
      };

      target.addEventListener("pointerenter", () => target.classList.add("is-interacting"));
      target.addEventListener("pointermove", (event) => {
        latestPointer = event;
        if (!magneticFrame) magneticFrame = window.requestAnimationFrame(renderMagneticMotion);
      });
      target.addEventListener("pointerleave", () => {
        if (magneticFrame) window.cancelAnimationFrame(magneticFrame);
        magneticFrame = 0;
        latestPointer = null;
        target.classList.remove("is-interacting");
        target.style.removeProperty("--magnetic-x");
        target.style.removeProperty("--magnetic-y");
      });
    });
  }

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("aria-labelledby", "projectPreviewTitle");
  lightbox.inert = true;
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close preview">Close</button>
    <figure class="lightbox-panel">
      <div class="lightbox-visual">
        <img alt="">
      </div>
      <div class="lightbox-copy">
        <p class="lightbox-kicker">Verified system preview</p>
        <figcaption id="projectPreviewTitle"></figcaption>
        <div class="lightbox-contribution">
          <span>Contribution</span>
          <strong>System design &amp; development</strong>
        </div>
        <div class="lightbox-detail-block">
          <span>Problem addressed</span>
          <p class="lightbox-problem"></p>
        </div>
        <div class="lightbox-detail-block">
          <span>System response</span>
          <p class="lightbox-summary"></p>
        </div>
        <div class="lightbox-technology">
          <span>Technology</span>
          <div></div>
        </div>
        <div class="lightbox-capabilities">
          <span>Core capabilities</span>
          <ul></ul>
        </div>
        <div class="lightbox-impact">
          <span>Operational impact</span>
          <p></p>
        </div>
        <div class="lightbox-navigation" aria-label="Project preview navigation">
          <button type="button" data-lightbox-previous><span aria-hidden="true">&larr;</span> Previous</button>
          <span data-lightbox-position>01 / 09</span>
          <button type="button" data-lightbox-next>Next <span aria-hidden="true">&rarr;</span></button>
        </div>
      </div>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const lightboxKicker = lightbox.querySelector(".lightbox-kicker");
  const lightboxProblem = lightbox.querySelector(".lightbox-problem");
  const lightboxSummary = lightbox.querySelector(".lightbox-summary");
  const lightboxTechnology = lightbox.querySelector(".lightbox-technology > div");
  const lightboxCapabilities = lightbox.querySelector(".lightbox-capabilities");
  const lightboxFeatureList = lightbox.querySelector(".lightbox-capabilities ul");
  const lightboxImpact = lightbox.querySelector(".lightbox-impact p");
  const lightboxPrevious = lightbox.querySelector("[data-lightbox-previous]");
  const lightboxNext = lightbox.querySelector("[data-lightbox-next]");
  const lightboxPosition = lightbox.querySelector("[data-lightbox-position]");
  const closeLightbox = lightbox.querySelector(".lightbox-close");
  const lightboxPageTargets = document.querySelectorAll(".site-header, main, .chatbot-widget, .site-footer");
  const lightboxInertState = new Map();
  let lightboxTrigger = null;
  let activeLightboxImage = null;

  function getAvailableProjectImages() {
    return Array.from(document.querySelectorAll(".project-card:not([hidden]) .project-shot.has-image .project-image"));
  }

  function setLightboxPageInert(willBeInert) {
    lightboxPageTargets.forEach((target) => {
      if (willBeInert) {
        lightboxInertState.set(target, target.inert);
        target.inert = true;
      } else {
        target.inert = lightboxInertState.get(target) || false;
      }
    });
    if (!willBeInert) lightboxInertState.clear();
  }

  function openLightbox(img, { preserveTrigger = false } = {}) {
    const card = img.closest(".project-card");
    const title = card?.querySelector("h3")?.textContent?.trim() || "Project screenshot";
    const category = card?.querySelector(".project-type")?.textContent?.trim() || "System preview";
    const summary = Array.from(card?.children || []).find(
      (child) => child.matches?.("p:not(.project-type)")
    )?.textContent?.trim() || "A practical system designed around a real operational workflow.";
    const features = Array.from(card?.querySelectorAll(":scope > ul li") || [])
      .map((item) => item.textContent?.trim())
      .filter(Boolean);
    const details = PROJECT_SHOWCASE_DETAILS[title] || {
      problem: summary,
      tools: [],
      impact: "Designed to make a real operational workflow clearer, faster, and easier to manage."
    };
    if (!img.src || !lightboxImage || !lightboxCaption) return;

    if (!preserveTrigger) lightboxTrigger = img.closest(".project-shot");
    activeLightboxImage = img;
    lightboxImage.src = img.src;
    lightboxImage.alt = `${title} project screenshot`;
    lightboxCaption.textContent = title;
    if (lightboxKicker) lightboxKicker.textContent = category;
    if (lightboxProblem) lightboxProblem.textContent = details.problem;
    if (lightboxSummary) lightboxSummary.textContent = summary;
    if (lightboxTechnology) {
      lightboxTechnology.replaceChildren();
      details.tools.forEach((tool) => {
        const tag = document.createElement("span");
        tag.textContent = tool;
        lightboxTechnology.appendChild(tag);
      });
    }
    if (lightboxFeatureList) {
      lightboxFeatureList.replaceChildren();
      features.forEach((feature) => {
        const item = document.createElement("li");
        item.textContent = feature;
        lightboxFeatureList.appendChild(item);
      });
    }
    if (lightboxCapabilities) lightboxCapabilities.hidden = features.length === 0;
    if (lightboxImpact) lightboxImpact.textContent = details.impact;
    const availableImages = getAvailableProjectImages();
    const projectIndex = Math.max(0, availableImages.indexOf(img));
    if (lightboxPosition) {
      lightboxPosition.textContent = `${String(projectIndex + 1).padStart(2, "0")} / ${String(availableImages.length).padStart(2, "0")}`;
    }
    if (lightboxPrevious) lightboxPrevious.hidden = availableImages.length < 2;
    if (lightboxNext) lightboxNext.hidden = availableImages.length < 2;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.inert = false;
    document.body.classList.add("lightbox-open");
    setLightboxPageInert(true);
    closeLightbox?.focus();
  }

  function navigateLightbox(direction) {
    const availableImages = getAvailableProjectImages();
    if (!activeLightboxImage || availableImages.length < 2) return;
    const currentIndex = Math.max(0, availableImages.indexOf(activeLightboxImage));
    const nextIndex = (currentIndex + direction + availableImages.length) % availableImages.length;
    openLightbox(availableImages[nextIndex], { preserveTrigger: true });
    lightbox.querySelector(".lightbox-copy")?.scrollTo({ top: 0, behavior: "auto" });
  }

  function hideLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.inert = true;
    document.body.classList.remove("lightbox-open");
    setLightboxPageInert(false);
    lightboxTrigger?.focus();
    lightboxTrigger = null;
    activeLightboxImage = null;
  }

  document.querySelectorAll(".project-shot").forEach((shot) => {
    const cardTitle = shot.closest(".project-card")?.querySelector("h3")?.textContent?.trim();
    shot.removeAttribute("aria-hidden");
    shot.setAttribute("role", "button");
    shot.setAttribute("tabindex", "0");
    shot.setAttribute("aria-label", `Open ${cardTitle || "project"} preview`);

    shot.addEventListener("click", () => {
      const img = shot.querySelector(".project-image");
      if (img && shot.classList.contains("has-image")) openLightbox(img);
    });

    shot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const img = shot.querySelector(".project-image");
      if (img && shot.classList.contains("has-image")) openLightbox(img);
    });
  });

  closeLightbox?.addEventListener("click", hideLightbox);
  lightboxPrevious?.addEventListener("click", () => navigateLightbox(-1));
  lightboxNext?.addEventListener("click", () => navigateLightbox(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hideLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") hideLightbox();
    if (event.key === "ArrowLeft") navigateLightbox(-1);
    if (event.key === "ArrowRight") navigateLightbox(1);
    if (event.key === "Tab") {
      const focusable = Array.from(lightbox.querySelectorAll("button:not([hidden]):not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  function setupProjectDiscovery() {
    const projectGrid = document.querySelector(".project-grid");
    const projectCards = Array.from(document.querySelectorAll(".project-card"));
    const filterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
    const resultCount = document.querySelector("[data-project-result-count]");
    const carouselCount = document.querySelector(".projects-section .carousel-hint strong");
    if (!projectGrid || !projectCards.length) return;

    projectGrid.id ||= "selectedProjectGrid";

    projectCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent?.trim() || "Project";
      const details = PROJECT_SHOWCASE_DETAILS[title] || { tools: [] };
      const categories = PROJECT_CATEGORIES[title] || [];
      card.dataset.projectCategories = categories.join(" ");

      if (!card.querySelector(".project-card-meta")) {
        const footer = document.createElement("div");
        footer.className = "project-card-meta";

        const tools = document.createElement("div");
        tools.className = "project-card-tools";
        tools.setAttribute("aria-label", "Key technologies");
        details.tools.slice(0, 3).forEach((toolName) => {
          const tag = document.createElement("span");
          tag.textContent = toolName;
          tools.appendChild(tag);
        });

        const openButton = document.createElement("button");
        openButton.className = "project-open";
        openButton.type = "button";
        openButton.setAttribute("aria-label", `Open ${title} case study`);
        openButton.append("Case study ");
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        openButton.appendChild(arrow);
        openButton.addEventListener("click", () => {
          const shot = card.querySelector(".project-shot.has-image");
          const image = shot?.querySelector(".project-image");
          if (image) openLightbox(image);
        });

        footer.append(tools, openButton);
        card.appendChild(footer);
      }
    });

    filterButtons.forEach((button) => {
      button.setAttribute("aria-controls", projectGrid.id);
      button.addEventListener("click", () => {
        const filter = button.dataset.projectFilter || "all";
        filterButtons.forEach((control) => {
          const isActive = control === button;
          control.classList.toggle("is-active", isActive);
          control.setAttribute("aria-pressed", String(isActive));
        });

        let visibleCount = 0;
        projectCards.forEach((card) => {
          const categories = (card.dataset.projectCategories || "").split(" ").filter(Boolean);
          const isVisible = filter === "all" || categories.includes(filter);
          card.hidden = !isVisible;
          if (isVisible) visibleCount += 1;
        });

        if (resultCount) resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "system" : "systems"} online`;
        if (carouselCount) carouselCount.innerHTML = `01 / ${String(visibleCount).padStart(2, "0")} &rarr;`;
      });
    });
  }

  setupProjectDiscovery();

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
    const sendButton = form?.querySelector("button[type='submit']");
    const messages = widget.querySelector("[data-chatbot-messages]");
    const status = widget.querySelector("[data-chatbot-status]");
    const suggestions = widget.querySelector("[data-chatbot-suggestions]");
    const quickActions = widget.querySelector("[data-chatbot-quick-actions]");
    const backdrop = document.querySelector("[data-chatbot-backdrop]");
    let started = false;
    let knowledgeItems = [];
    let knowledgeLoadPromise = null;
    let projectData = [];
    let contactData = {};
    let projectRequestModal = null;
    let chatbotCloseTimer = 0;
    let isResponding = false;
    let conversationVersion = 0;
    let aiConnectionEstablished = false;
    let aiStatusResolved = false;
    let projectRequestReturnFocus = null;
    let conversationContext = {
      lastQuestion: "",
      intentKeys: [],
      projectName: ""
    };
    let conversationHistory = [];
    const SAVED_REQUEST_LIMIT = 5;
    const SAVED_REQUEST_TTL_MS = 30 * 24 * 60 * 60 * 1000;

    const fallbackKnowledge = parseKnowledgeBase(`
# Portfolio Summary
Q: Who is Kino?
A: Kino Ilustrisimo is an automation, data operations, and business-support professional focused on reporting, dashboards, customer and CRM workflows, administrative coordination, and process improvement.
Q: What is Kino's technical focus?
A: Kino's technical focus includes Python 3.14, FastAPI, Uvicorn, DuckDB, Pandas, PyArrow, MySQL, PyMySQL, plain HTML/CSS/JavaScript, Selenium, Chrome automation, CustomTkinter, XlsxWriter, CSV generation, PowerPoint report automation, dashboard monitoring, data validation, and workflow improvement.
Q: What projects can Kino showcase?
A: Kino can showcase the MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, and Report Auto Extractor.
Q: What are your skills?
A: Kino's skills include Python automation, data analytics, reporting, dashboards, customer and CRM support, calls/email/SMS communication, account handling, spreadsheet tracking, data entry, records, inbox and calendar coordination, document preparation, workflow improvement, and communication.
Q: What tools and technologies do you use?
A: Kino's stack includes Python 3.14, FastAPI, Uvicorn, DuckDB, Pandas, PyArrow, MySQL, PyMySQL, HTML/CSS/JavaScript, Selenium, Chrome automation, CustomTkinter, XlsxWriter, CSV and PowerPoint reporting, plus Excel, Google Sheets, Google Docs, Word, Gmail, Outlook, Google Drive, OneDrive, and ChatGPT.
Q: What services can you offer?
A: Kino can support web applications, reporting automation, dashboards, spreadsheet workflows, customer and CRM operations, data entry and records, email and calendar coordination, document preparation, data validation, and workflow improvement.
Q: What makes Kino valuable to future employers or clients?
A: Kino connects operational experience with practical automation, helping teams reduce manual work, improve reporting visibility, and monitor performance through usable tools.
Q: Sino ka?
A: Ako ang portfolio assistant ni Kino Ilustrisimo. Pwede akong sumagot tungkol sa kanyang skills, projects, work experience, tools, achievements, at professional background.
Q: Ano ang skills mo?
A: Ang main skills ni Kino ay Python automation, data reporting, Excel at Google Sheets workflows, dashboard monitoring, customer at CRM support, calls/email/SMS communication, account handling, data entry, records, email at calendar coordination, document preparation, at workflow improvement.
Q: Ano ang mga project mo?
A: Ilan sa projects ni Kino ay MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, at Report Auto Extractor.
Q: What should the assistant do if information is unavailable?
A: The assistant should avoid inventing information and say that the specific information is not currently available in the portfolio.
    `);
    knowledgeItems = fallbackKnowledge;

    if (!toggle || !panel || !form || !input || !messages || !status || !suggestions || !quickActions) return;
    panel.inert = true;

    const chatbotPageTargets = document.querySelectorAll(".site-header, main, .site-footer");
    const chatbotInertState = new Map();

    function setChatbotPageInert(willBeInert) {
      chatbotPageTargets.forEach((target) => {
        if (willBeInert) {
          chatbotInertState.set(target, target.inert);
          target.inert = true;
        } else {
          target.inert = chatbotInertState.get(target) || false;
        }
      });
      if (!willBeInert) chatbotInertState.clear();
    }

    function trapFocusWithin(event, container) {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        container.querySelectorAll(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => element.getClientRects().length && !element.closest("[inert]"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    renderSuggestedQuestions();
    renderQuickActions();
    getSavedLeads();

    function ensurePortfolioKnowledge() {
      if (knowledgeLoadPromise) return knowledgeLoadPromise;

      if (window.location.protocol === "file:") {
        knowledgeLoadPromise = Promise.resolve().then(() => {
          knowledgeItems = fallbackKnowledge;
          projectData = Object.entries(PROJECT_SHOWCASE_DETAILS).map(([name, details]) => ({
            name,
            problemSolved: details.problem,
            toolsUsed: details.tools,
            businessImpact: details.impact,
            mainFeatures: []
          }));
          contactData = {
            email: "kinoilustrisimo.021@gmail.com",
            phone: "+639927911469",
            facebook: "https://www.facebook.com/palonpon.kino"
          };
          renderQuickActions();
          if (!aiStatusResolved) status.textContent = "Ready with verified built-in portfolio information.";
        });
        return knowledgeLoadPromise;
      }

      knowledgeLoadPromise = loadPortfolioKnowledge()
        .then(({ items, projects, contact }) => {
          knowledgeItems = items.length ? items : fallbackKnowledge;
          projectData = projects;
          contactData = contact;
          renderQuickActions();
          if (!aiStatusResolved) {
            status.textContent = items.length
              ? "Ready — ask naturally about Kino or a general question."
              : "Ready with limited portfolio information.";
          }
        })
        .catch(() => {
          knowledgeItems = fallbackKnowledge;
          if (!aiStatusResolved) status.textContent = "Ready with limited portfolio information.";
        });

      return knowledgeLoadPromise;
    }

    function openChatbot() {
      ensurePortfolioKnowledge();
      window.clearTimeout(chatbotCloseTimer);
      widget.classList.remove("is-closing");
      widget.classList.add("is-open");
      backdrop?.classList.add("is-open");
      document.body.classList.add("chatbot-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      panel.inert = false;
      setChatbotPageInert(true);

      if (!started) {
        addMessage(
          "bot",
          "Hi — I'm Kino's AI Portfolio Assistant. Ask about his work, fit, or services, or ask a general question. I'll separate verified portfolio facts from general guidance and keep the answer clear."
        );
        started = true;
      }

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      if (reduceMotionQuery.matches && !coarsePointer) {
        input.focus({ preventScroll: true });
      } else if (!coarsePointer) {
        let focusSettled = false;
        const focusInput = () => {
          if (focusSettled || !widget.classList.contains("is-open")) return;
          focusSettled = true;
          input.focus({ preventScroll: true });
        };
        const handlePanelTransition = (event) => {
          if (event.target !== panel || event.propertyName !== "transform") return;
          panel.removeEventListener("transitionend", handlePanelTransition);
          focusInput();
        };
        panel.addEventListener("transitionend", handlePanelTransition);
        window.setTimeout(focusInput, 560);
      }
    }

    function closeChatbot() {
      widget.classList.remove("is-open");
      widget.classList.add("is-closing");
      backdrop?.classList.remove("is-open");
      document.body.classList.remove("chatbot-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      panel.inert = true;
      setChatbotPageInert(false);
      window.clearTimeout(chatbotCloseTimer);
      chatbotCloseTimer = window.setTimeout(() => {
        widget.classList.remove("is-closing");
        toggle.focus({ preventScroll: true });
      }, reduceMotionQuery.matches ? 0 : 430);
    }

    function clearChatbot() {
      messages.innerHTML = "";
      started = false;
      conversationContext = { lastQuestion: "", intentKeys: [], projectName: "" };
      conversationHistory = [];
      conversationVersion += 1;
      isResponding = false;
      form.removeAttribute("aria-busy");
      if (sendButton) sendButton.disabled = false;
      openChatbot();
    }

    function renderSuggestedQuestions() {
      suggestions.innerHTML = "";

      const title = document.createElement("p");
      title.className = "chatbot-suggestions-title";
      title.textContent = "Good places to start";
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
      if (isResponding) return;
      isResponding = true;
      const requestVersion = conversationVersion;
      form.setAttribute("aria-busy", "true");
      if (sendButton) sendButton.disabled = true;
      addMessage("user", question);
      const typing = addTyping();

      window.setTimeout(async () => {
        try {
          await ensurePortfolioKnowledge();
          if (requestVersion !== conversationVersion) return;
          const contextualQuestion = resolveConversationalQuestion(question, conversationContext);
          const localResponse = generatePortfolioResponse(contextualQuestion, knowledgeItems, projectData, contactData);
          const aiResult = await requestPortfolioAI(contextualQuestion, conversationHistory);
          const aiAnswer = aiResult.answer;
          if (requestVersion !== conversationVersion) return;

          const response = aiAnswer
            ? {
                text: aiAnswer,
                confidence: "model",
                actions: getResponseActions(detectIntentKeys(contextualQuestion), contactData, contextualQuestion)
              }
            : localResponse;
          const nextIntents = detectIntentKeys(contextualQuestion);
          const nextProject = findProjectMatch(contextualQuestion, projectData);
          const responseProjectMatches = projectData.filter((project) => (
            project.name && normalizeText(response.text).includes(normalizeText(project.name))
          ));
          const responseProject = responseProjectMatches.length === 1
            ? responseProjectMatches[0]
            : null;

          conversationContext = {
            lastQuestion: contextualQuestion,
            intentKeys: nextIntents.length ? nextIntents : conversationContext.intentKeys,
            projectName: nextProject?.confident
              ? nextProject.project.name
              : (responseProject?.name || "")
          };
          conversationHistory = [
            ...conversationHistory,
            { role: "user", content: question },
            { role: "assistant", content: response.text }
          ].slice(-(CHATBOT_CONFIG.futureModel.maxHistoryMessages || 8));

          aiStatusResolved = true;
          if (aiAnswer) {
            aiConnectionEstablished = true;
            status.textContent = "AI connected — using Kino's public portfolio.";
          } else if (aiResult.reason === "rate-limited") {
            status.textContent = "Live AI is resting for a moment — verified local answers are active.";
          } else if (aiResult.reason === "timeout") {
            status.textContent = "Live AI timed out — verified local answers are active.";
          } else if (aiConnectionEstablished) {
            status.textContent = "Live AI is temporarily unavailable — verified local answers are active.";
          } else {
            status.textContent = "Verified local answers are active — live AI is unavailable right now.";
          }

          addMessage("bot", response.text);
          addResponseActions(response.actions);
        } catch (error) {
          if (requestVersion === conversationVersion) {
            aiStatusResolved = true;
            status.textContent = "Verified local answers are active — please try that question again.";
            addMessage("bot", CHATBOT_CONFIG.fallbackResponse);
          }
        } finally {
          typing.remove();
          if (requestVersion === conversationVersion) {
            isResponding = false;
            form.removeAttribute("aria-busy");
            if (sendButton) sendButton.disabled = false;
          }
        }
      }, reduceMotionQuery.matches ? 80 : 520);
    }

    async function requestPortfolioAI(question, history) {
      const modelConfig = CHATBOT_CONFIG.futureModel || {};
      if (CHATBOT_CONFIG.provider === "retrieval" || !modelConfig.endpoint) {
        return { answer: "", reason: "disabled" };
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), modelConfig.timeoutMs || 12_000);

      try {
        const response = await fetch(modelConfig.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            history: history.slice(-(modelConfig.maxHistoryMessages || 8))
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          return {
            answer: "",
            reason: response.status === 429 ? "rate-limited" : "unavailable"
          };
        }
        const payload = await response.json();
        return {
          answer: typeof payload.answer === "string" ? payload.answer.trim() : "",
          reason: "connected"
        };
      } catch (error) {
        return {
          answer: "",
          reason: error?.name === "AbortError" ? "timeout" : "unavailable"
        };
      } finally {
        window.clearTimeout(timeout);
      }
    }

    function runChatbotAction(action) {
      if (action === "projects") {
        document.querySelector("#projects")?.scrollIntoView({ behavior: reduceMotionQuery.matches ? "auto" : "smooth" });
        return;
      }

      if (action === "skills") {
        document.querySelector("#skills")?.scrollIntoView({ behavior: reduceMotionQuery.matches ? "auto" : "smooth" });
        return;
      }

      if (action === "contact") {
        handleQuestion("How can I contact Kino?");
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

    function renderLeadCaptureForm(
      initialValues = {},
      returnFocusTarget = projectRequestReturnFocus || document.activeElement
    ) {
      closeProjectRequestModal({ restoreFocus: false });
      projectRequestReturnFocus =
        returnFocusTarget instanceof HTMLElement && returnFocusTarget.isConnected
          ? returnFocusTarget
          : toggle;

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
            <p class="project-request-kicker">Optional Project Brief</p>
            <h3 id="projectRequestTitle">Share a brief with Kino</h3>
            <p>Use this only when you want Kino to reply directly. You can keep chatting with the assistant without completing this form.</p>
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
          <label>Project type
            <select name="projectType">
              <option value=""${initialValues.projectType ? "" : " selected"}>Select if known (optional)</option>
              ${renderOption("AI Chatbot", initialValues.projectType)}
              ${renderOption("Dashboard Development", initialValues.projectType)}
              ${renderOption("Automation", initialValues.projectType)}
              ${renderOption("Data Reporting", initialValues.projectType)}
              ${renderOption("Portfolio Website", initialValues.projectType)}
              ${renderOption("Business Website", initialValues.projectType)}
              ${renderOption("System Development", initialValues.projectType)}
              ${renderOption("Excel / Google Sheet Automation", initialValues.projectType)}
              ${renderOption("Virtual Assistance / Business Support", initialValues.projectType)}
              ${renderOption("Customer / CRM Support", initialValues.projectType)}
              ${renderOption("Other Custom Project", initialValues.projectType)}
            </select>
          </label>
          <label>Estimated budget
            <input name="budget" type="text" placeholder="Optional budget or range" value="${escapeHtml(initialValues.budget)}">
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
          <label class="wide-field">What do you need? <span class="required">*</span>
            <textarea name="requirement" placeholder="Describe the problem and the result you want in your own words..." required>${escapeHtml(initialValues.requirement)}</textarea>
          </label>
          <label class="wide-field">Additional notes
            <textarea name="notes" placeholder="Optional notes, references, existing tools, or special requirements...">${escapeHtml(initialValues.notes)}</textarea>
          </label>
        </div>
        <p class="chatbot-form-note">Only your name, email, and message are required. Submitted details go through the configured form provider. If delivery fails, this browser keeps up to five failed requests for 30 days so you can download or retry them.</p>
        <div class="chatbot-lead-footer">
          <button class="chatbot-lead-submit" type="submit">Review & Continue</button>
        </div>
      `;

      card.addEventListener("submit", (event) => {
        event.preventDefault();
        const request = readProjectRequest(card);
        if (!request.name || !request.email || !request.requirement) return;
        renderProjectRequestSummary(card, request);
      });

      modal.appendChild(card);
      modal.querySelectorAll("[data-close-project-modal]").forEach((control) => {
        control.addEventListener("click", closeProjectRequestModal);
      });

      document.body.appendChild(modal);
      projectRequestModal = modal;
      document.body.classList.add("project-modal-open");
      widget.inert = true;
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");
      modal.addEventListener("keydown", (event) => trapFocusWithin(event, card));
      window.requestAnimationFrame(() => modal.classList.add("is-visible"));
      window.setTimeout(() => card.querySelector("input, select, textarea")?.focus(), reduceMotionQuery.matches ? 0 : 420);
    }

    function closeProjectRequestModal({ restoreFocus = true } = {}) {
      if (!projectRequestModal) return;

      const modal = projectRequestModal;
      const returnFocusTarget = projectRequestReturnFocus;
      projectRequestModal = null;
      if (restoreFocus) projectRequestReturnFocus = null;
      modal.classList.remove("is-visible");
      document.body.classList.remove("project-modal-open");
      widget.inert = false;
      if (widget.classList.contains("is-open")) {
        panel.inert = false;
        panel.setAttribute("aria-hidden", "false");
      }
      window.setTimeout(() => {
        modal.remove();
        if (restoreFocus && !projectRequestModal) {
          const focusTarget =
            returnFocusTarget instanceof HTMLElement &&
            returnFocusTarget.isConnected &&
            !returnFocusTarget.closest("[inert]")
              ? returnFocusTarget
              : toggle;
          focusTarget?.focus({ preventScroll: true });
        }
      }, reduceMotionQuery.matches ? 0 : 420);
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
            <h3 id="projectRequestTitle">Confirm and Send Project Request</h3>
            <p>Please review the details before sending. Kino will review the request and reply through the email address provided.</p>
          </div>
          <button class="project-request-close" type="button" data-close-project-modal aria-label="Close project request form">Close</button>
        </div>
        <dl class="chatbot-request-summary">
          ${renderSummaryRow("Client Name", request.name)}
          ${renderSummaryRow("Email Address", request.email)}
          ${renderSummaryRow("Company / Organization", request.company || "Not provided")}
          ${renderSummaryRow("Contact Number", request.phone || "Not provided")}
          ${renderSummaryRow("Project Type", request.projectType || "Not specified")}
          ${renderSummaryRow("Project Description", request.requirement)}
          ${renderSummaryRow("Estimated Budget", request.budget || "Not specified")}
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
        renderLeadCaptureForm(request, projectRequestReturnFocus);
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

      let result = { sent: false, mode: "local" };
      try {
        result = await sendProjectRequest(request, config);
      } catch (error) {
        result = { sent: false, mode: "error", error };
      }

      closeProjectRequestModal();

      if (result.sent) {
        addMessage("bot", "Thank you. Your project request has been submitted successfully. Kino can review the details and respond through the email address you provided.");
        return;
      }

      if (result.mode === "mailto") {
        saveFailedRequest(request);
        addMessage("bot", "Your project request was prepared in your email app. Please send the email there to complete the submission. A local copy was also saved in this browser.");
        addResponseActions([{ label: "Download Request JSON", action: "download-lead", primary: true }]);
        return;
      }

      saveFailedRequest(request);
      addMessage("bot", "Your project request was saved locally in this browser, but automatic email delivery could not be completed. Please check the FormSubmit activation/configuration in contact.json, or switch the provider to Formspree, EmailJS, or a backend email API.");
      addResponseActions([{ label: "Download Request JSON", action: "download-lead", primary: true }]);
    }

    function getSavedLeads() {
      try {
        const cutoff = Date.now() - SAVED_REQUEST_TTL_MS;
        const saved = JSON.parse(localStorage.getItem("kinoPortfolioProjectRequests") || "[]");
        if (!Array.isArray(saved)) return [];
        const retained = saved
          .filter((lead) => {
            const capturedAt = Date.parse(lead?.capturedAt || "");
            return Number.isFinite(capturedAt) && capturedAt >= cutoff;
          })
          .slice(-SAVED_REQUEST_LIMIT);
        if (retained.length !== saved.length) saveLeads(retained);
        return retained;
      } catch {
        try {
          localStorage.removeItem("kinoPortfolioProjectRequests");
        } catch {
          // Ignore storage restrictions in private or hardened browser contexts.
        }
        return [];
      }
    }

    function saveFailedRequest(request) {
      const requests = [...getSavedLeads(), request].slice(-SAVED_REQUEST_LIMIT);
      saveLeads(requests);
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
        addMessage("bot", "No failed project requests are saved in this browser.");
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
    panel.addEventListener("keydown", (event) => trapFocusWithin(event, panel));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim().slice(0, 1_200);
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

  function resolveConversationalQuestion(question, context = {}) {
    const cleanQuestion = String(question || "").trim();
    const normalized = normalizeText(cleanQuestion);
    if (!normalized || !context.lastQuestion) return cleanQuestion;

    const projectFollowUp = context.projectName && (
      /\b(it|that|this|those|project|system|tool|built|used|impact|feature|result|work)\b/.test(normalized)
      || /^(tell me more|more details|explain more|how does|how did|what about)/.test(normalized)
    );

    if (projectFollowUp && !normalized.includes(normalizeText(context.projectName))) {
      return `${cleanQuestion} Context: ${context.projectName}.`;
    }

    const referentialFollowUp = /^(what|how|why|when|where|which)\b.*\b(it|that|this|one|they|those)\b/.test(normalized)
      && normalized.split(" ").length <= 10;
    if (referentialFollowUp) {
      return `${cleanQuestion} Previous topic: ${context.lastQuestion}`;
    }

    const genericFollowUp = /^(tell me more|more details|go on|explain more|can you expand|how so|why is that)\??$/.test(normalized);
    if (genericFollowUp) {
      return `${context.lastQuestion} Follow-up: ${cleanQuestion}`;
    }

    return cleanQuestion;
  }

  function getConversationalResponse(question, contact = {}) {
    const normalized = normalizeText(question);
    const wantsFilipino = isLikelyFilipino(question);
    const email = contact.email || "";

    if (/^(hi|hello|hey|good morning|good afternoon|good evening|kumusta|kamusta|musta|yo)( there| po)?$/.test(normalized)) {
      return {
        text: wantsFilipino
          ? "Hello! Kumusta? Ano ang maitutulong ko sa iyo ngayon?"
          : "Hello! How can I help you today?",
        actions: []
      };
    }

    if (/^(how are you|how are you doing|kamusta ka|kumusta ka)( today| po)?$/.test(normalized)) {
      return {
        text: wantsFilipino
          ? "Ready akong tumulong. Ano ang gusto mong pag-usapan?"
          : "I'm ready to help. What would you like to discuss?",
        actions: []
      };
    }

    if (/^(what|how|why|when|where|which)\b.*\b(it|that|this|one|they|those)\b/.test(normalized)
      && normalized.split(" ").length <= 10
      && !normalized.includes("previous topic")
      && !normalized.includes("context")) {
      return {
        text: wantsFilipino
          ? "Aling project, skill, o portfolio item ang tinutukoy mo?"
          : "Which project, skill, or portfolio item are you referring to?",
        actions: []
      };
    }

    if (/^(thank you|thanks|thankyou|salamat)( so much| very much| po)?$/.test(normalized)) {
      return {
        text: wantsFilipino
          ? "You're welcome! Sabihin mo lang kung ano pa ang maitutulong ko."
          : "You're welcome! Let me know what else I can help with.",
        actions: []
      };
    }

    if (/\b(are you human|are you a human|human employee|human representative|who are you|what are you|are you kino|real ai|actual ai)\b/.test(normalized)) {
      return {
        text: wantsFilipino
          ? "Ako ang AI Portfolio Assistant ni Kino, hindi human employee. Gumagamit ako ng verified public portfolio details at malinaw kong ihihiwalay ang general guidance sa confirmed facts."
          : "I'm Kino's AI Portfolio Assistant, not a human employee. I use his verified public portfolio details and clearly separate general guidance from confirmed facts.",
        actions: []
      };
    }

    if (/\b(price|pricing|cost|quote|quotation|budget|rate|rates|how much|magkano)\b/.test(normalized)) {
      return {
        text: wantsFilipino
          ? `Walang fixed project rate na naka-publish dahil nakadepende ang quote sa scope, data volume, current workflow, at deadline. I-describe mo lang dito ang expected output — walang form na required${email ? ` — o mag-email sa ${email}` : ""}.`
          : `Kino doesn't publish a fixed project rate because quotes depend on scope, data volume, the current workflow, and deadline. Describe the desired output here — no form is required${email ? ` — or email ${email}` : ""}.`,
        actions: getResponseActions(["pricing", "contact"], contact, question)
      };
    }

    if (/\b(timeline|deadline|delivery|turnaround|how long|when can|gaano katagal|kailan)\b/.test(normalized)) {
      return {
        text: wantsFilipino
          ? "Walang generic delivery time na naka-publish. Ang realistic timeline ay depende sa data source, output, automation complexity, at review needs. I-share mo lang ang target result at deadline para ma-assess ang fit."
          : "There isn't a generic delivery time published. A realistic timeline depends on the data source, desired output, automation complexity, and review needs. Share the target result and deadline to assess fit.",
        actions: getResponseActions(["timeline", "contact"], contact, question)
      };
    }

    return null;
  }

  function isLikelyGeneralKnowledgeQuestion(question) {
    const normalized = normalizeText(question);
    const referencesPortfolio = /\b(kino|his|him|he|portfolio|resume|project|work|experience|skill|service|contact|employer|client)\b/.test(normalized);
    if (referencesPortfolio) return false;

    return /^(define|explain|generally|what is|what are|what does|what s the difference|difference between|compare|how does|why does|in [a-z0-9]+ sentences)\b/.test(normalized);
  }

  function getLocalGeneralUnavailableResponse(question) {
    return isLikelyFilipino(question)
      ? "Hindi available ang live AI connection ngayon, kaya hindi ako mag-iimbento ng sagot sa general question na iyon gamit lang ang local portfolio data. Matutulungan pa rin kita sa verified work, skills, projects, at professional fit ni Kino."
      : "The live AI connection is unavailable right now, so I won't invent an answer to that general question from the local portfolio data. I can still help with Kino's verified work, skills, projects, and professional fit.";
  }

  function composeDirectPortfolioAnswer(question, intentKeys, wantsFilipino) {
    const intents = new Set(intentKeys);
    const normalized = normalizeText(question);

    if (intents.has("availability")) {
      return wantsFilipino
        ? "Oo — open si Kino sa selected job at client opportunities sa Python automation, data operations, dashboards, reporting, customer at CRM support, at administrative coordination."
        : "Yes — Kino is open to selected job and client opportunities in Python automation, data operations, dashboards, reporting, customer and CRM support, and administrative coordination.";
    }

    if (intents.has("value") && /\b(hire|fit|qualified|choose|kukunin|bagay|team|role)\b/.test(normalized)) {
      return wantsFilipino
        ? "Strong fit si Kino para sa operations, reporting, automation, virtual assistance, o business-support work na kailangan ng practical execution. Pinagsasama niya ang frontline, customer, at leadership experience sa Python, reporting discipline, at maayos na follow-through."
        : "Kino is a strong fit for operations, reporting, automation, virtual-assistance, or business-support work that needs practical execution. He combines frontline, customer, and leadership experience with Python, reporting discipline, and dependable follow-through.";
    }

    if (intents.has("support")) {
      return wantsFilipino
        ? "Oo. Confirmed ang experience ni Kino sa customer support gamit ang calls, email, at SMS; CRM at account handling; payment-arrangement support; Excel formulas at Google Sheets tracking; data entry at records; at email, calendar, file, at document management."
        : "Yes. Kino has confirmed experience in customer support through calls, email, and SMS; CRM and account handling; payment-arrangement support; Excel formulas and Google Sheets tracking; data entry and records; and email, calendar, file, and document management.";
    }

    if (intents.has("dashboard")) {
      return wantsFilipino
        ? "Oo. Kaya ni Kino gumawa ng KPI dashboards at operational monitoring views para sa campaign movement, digital activity, performance summaries, at reporting visibility."
        : "Yes. Kino can build KPI dashboards and operational monitoring views for campaign movement, digital activity, performance summaries, and reporting visibility.";
    }

    if (intents.has("automation") && /\b(error|errors|quality|validate|validation|cleanup|address|fix)\b/.test(normalized)) {
      return wantsFilipino
        ? "Base sa verified portfolio niya, kayang i-address ni Kino ang reporting errors sa pamamagitan ng input validation, consistent CSV/XLSX processing, automated checks, at mas malinaw na output monitoring. Ang exact controls ay kailangang iayon sa data source at reporting rules ng client."
        : "Based on his verified portfolio, Kino can address reporting errors through input validation, consistent CSV/XLSX processing, automated checks, and clearer output monitoring. The exact controls should be tailored to the client's data sources and reporting rules.";
    }

    if (intents.has("automation")) {
      return wantsFilipino
        ? "Oo. Kaya ni Kino i-automate ang repetitive reporting, CSV/XLSX processing, data extraction, validation, browser workflows gamit ang Selenium/Chrome automation, at recurring workflow steps gamit ang Python."
        : "Yes. Kino can automate repetitive reporting, CSV/XLSX processing, data extraction, validation, browser workflows with Selenium/Chrome automation, and recurring workflow steps with Python.";
    }

    if (intents.has("projects") && /\b(strongest|best|top|show|sample|samples|work|portfolio|gawa)\b/.test(normalized)) {
      return wantsFilipino
        ? "Para sa dashboards, magandang samples ang Digital Omnichannel Monitoring Dashboard at MC6 Analytics Hub. Para sa automation, tingnan ang Report Auto Extractor, Predictive Summary Extractor, at Auto Redial Automation."
        : "For dashboard work, start with the Digital Omnichannel Monitoring Dashboard and MC6 Analytics Hub. For automation, see Report Auto Extractor, Predictive Summary Extractor, and Auto Redial Automation.";
    }

    if (intents.has("services") && /\b(problem|problems|solve|help|need|offer|service|support|client|error|errors|address|fix|quality|validate|validation|cleanup|kailangan)\b/.test(normalized)) {
      return wantsFilipino
        ? "Pinakamalakas si Kino sa work kung saan kailangan ang structured execution: report automation, Excel/Google Sheets outputs, KPI monitoring, data validation, customer at CRM support, administrative coordination, at workflow improvement."
        : "Kino is strongest where work needs structured execution: report automation, Excel/Google Sheets outputs, KPI monitoring, data validation, customer and CRM support, administrative coordination, and workflow improvement.";
    }

    if (intents.has("tools") && !intents.has("projects")) {
      return wantsFilipino
        ? "Kasama sa confirmed stack ni Kino ang Python, FastAPI, DuckDB, Pandas, MySQL, HTML/CSS/JavaScript, Selenium, CustomTkinter, XlsxWriter, CSV at PowerPoint reporting, pati Excel, Google Sheets, Google Docs, Word, Gmail, Outlook, Google Drive, OneDrive, at ChatGPT."
        : "Kino's confirmed stack includes Python, FastAPI, DuckDB, Pandas, MySQL, HTML/CSS/JavaScript, Selenium, CustomTkinter, XlsxWriter, CSV and PowerPoint reporting, plus Excel, Google Sheets, Google Docs, Word, Gmail, Outlook, Google Drive, OneDrive, and ChatGPT.";
    }

    if (intents.has("experience")) {
      return wantsFilipino
        ? "May experience si Kino sa S.P. Madrid & Associates Law Firm, Everything But Cheese Sherwood, RLX Pharmacy, Jollibee Aduana, at Tabo Rice—mula customer service, calls/email/SMS, CRM at account handling, at supervision hanggang data operations, reporting, at automation."
        : "Kino's background spans S.P. Madrid & Associates Law Firm, Everything But Cheese Sherwood, RLX Pharmacy, Jollibee Aduana, and Tabo Rice—from customer service, calls/email/SMS, CRM and account handling, and supervision to data operations, reporting, and automation.";
    }

    if (intents.has("education")) {
      return wantsFilipino
        ? "Natapos ni Kino ang senior high school sa Taal National High School sa Computer Programming strand. Nag-aral siya sa Angel John Integrated Academy para sa elementary at junior high school."
        : "Kino completed senior high school at Taal National High School under the Computer Programming strand. He attended Angel John Integrated Academy for elementary and junior high school.";
    }

    if (intents.has("about")) {
      return wantsFilipino
        ? "Si Kino Ilustrisimo ay automation, data operations, at business-support professional na gumagawa ng practical reporting workflows at dashboards, at may experience sa customer, CRM, spreadsheet, at administrative support."
        : "Kino Ilustrisimo is an automation, data operations, and business-support professional who builds practical reporting workflows and dashboards and brings experience in customer, CRM, spreadsheet, and administrative support.";
    }

    return "";
  }

  function getUnconfirmedCapabilityResponse(question, wantsFilipino) {
    const normalized = normalizeText(question);
    const unconfirmedCapabilities = [
      ["power bi", "Power BI"],
      ["tableau", "Tableau"],
      ["looker", "Looker"],
      ["qlik", "Qlik"],
      ["react", "React"],
      ["angular", "Angular"],
      ["vue", "Vue"],
      ["node js", "Node.js"],
      ["wordpress", "WordPress"],
      ["mobile app", "mobile app development"],
      ["aws", "AWS"],
      ["azure", "Microsoft Azure"],
      ["google cloud", "Google Cloud"],
      ["figma", "Figma"]
    ];
    const match = unconfirmedCapabilities.find(([term]) => normalized.includes(term));
    if (!match) return "";

    return wantsFilipino
      ? `Hindi listed ang ${match[1]} bilang confirmed capability sa public portfolio ni Kino, kaya ayokong mag-overclaim. Ang verified stack niya ay Python 3.14, FastAPI, Uvicorn, DuckDB, Pandas, PyArrow, MySQL, PyMySQL, plain HTML/CSS/JavaScript, Selenium, Chrome automation, CustomTkinter, XlsxWriter, CSV generation, at automated PowerPoint o management report scripts.`
      : `${match[1]} isn't listed as a confirmed capability in Kino's public portfolio, so I don't want to overclaim. His verified stack is Python 3.14, FastAPI, Uvicorn, DuckDB, Pandas, PyArrow, MySQL, PyMySQL, plain HTML/CSS/JavaScript, Selenium, Chrome automation, CustomTkinter, XlsxWriter, CSV generation, and automated PowerPoint or management report scripts.`;
  }

  function generatePortfolioResponse(question, knowledgeItems, projects, contact) {
    const normalizedQuestion = normalizeText(question);
    const wantsFilipino = isLikelyFilipino(question);

    const conversationalResponse = getConversationalResponse(question, contact);
    if (conversationalResponse) {
      return {
        ...conversationalResponse,
        confidence: "conversational"
      };
    }

    if (isLikelyGeneralKnowledgeQuestion(question)) {
      return {
        text: getLocalGeneralUnavailableResponse(question),
        confidence: "general-unavailable",
        actions: []
      };
    }

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
        text: formatContactResponse(contact, wantsFilipino, question),
        confidence: "high",
        actions: getResponseActions(["contact", ...intentKeys], contact, question)
      };
    }

    const projectMatch = findProjectMatch(question, projects);

    if (projectMatch?.confident) {
      return {
        text: formatProjectAnswer(projectMatch.project, wantsFilipino, question),
        confidence: "high",
        actions: getResponseActions(["projects", ...(projectMatch.project.intentKeys || [])], contact)
      };
    }

    const capabilityBoundary = getUnconfirmedCapabilityResponse(question, wantsFilipino);
    if (capabilityBoundary) {
      return {
        text: capabilityBoundary,
        confidence: "boundary",
        actions: getResponseActions(["skills", "tools"], contact)
      };
    }

    const directAnswer = composeDirectPortfolioAnswer(question, intentKeys, wantsFilipino);
    if (directAnswer) {
      return {
        text: directAnswer,
        confidence: "high",
        actions: getResponseActions(intentKeys, contact)
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

      const exactName = Boolean(project.name && normalizedQuestion.includes(normalizeText(project.name)));
      if (exactName) score += 12;
      terms.forEach((term) => {
        if (searchable.includes(term)) score += 1.5;
      });

      return { project, score, exactName };
    }).sort((a, b) => b.score - a.score);

    const top = matches[0];
    if (!top) return null;
    const runnerUpScore = matches[1]?.score || 0;
    return {
      ...top,
      runnerUpScore,
      confident: top.exactName || (top.score >= 6 && top.score - runnerUpScore >= 2)
    };
  }

  function formatProjectAnswer(project, wantsFilipino, question = "") {
    const tools = Array.isArray(project.toolsUsed) ? project.toolsUsed.join(", ") : "";
    const features = Array.isArray(project.mainFeatures) ? project.mainFeatures.join("; ") : "";
    const normalizedQuestion = normalizeText(question);

    if (/\b(tool|tools|technology|technologies|built with|stack|used|ginamit|gamit)\b/.test(normalizedQuestion)) {
      return wantsFilipino
        ? `Para sa ${project.name}, ang confirmed tools ay ${tools || "hindi naka-specify sa public portfolio"}.`
        : `For ${project.name}, the confirmed tools are ${tools || "not specified in the public portfolio"}.`;
    }

    if (/\b(impact|result|results|outcome|benefit|value|epekto|resulta)\b/.test(normalizedQuestion)) {
      return wantsFilipino
        ? `${project.name}: ${project.businessImpactFilipino || project.businessImpact}`
        : `${project.name}: ${project.businessImpact}`;
    }

    if (/\b(feature|features|how does|how it works|what does|function|capability|paano)\b/.test(normalizedQuestion)) {
      return wantsFilipino
        ? `${project.name} includes ${features || "features that are not itemized in the public portfolio"}.`
        : `${project.name} includes ${features || "features that are not itemized in the public portfolio"}.`;
    }

    if (wantsFilipino) {
      return [
        project.name,
        `Problem: ${project.problemSolvedFilipino || project.problemSolved}`,
        `Built with: ${tools || "Hindi naka-specify ang exact tools."}`,
        `What it does: ${features || "Hindi naka-specify ang exact feature list."}`,
        `Impact: ${project.businessImpactFilipino || project.businessImpact}`
      ].filter(Boolean).join("\n");
    }

    return [
      project.name,
      `Problem: ${project.problemSolved}`,
      `Built with: ${tools || "The exact tools are not specified."}`,
      `What it does: ${features || "The exact feature list is not specified."}`,
      `Impact: ${project.businessImpact}`
    ].filter(Boolean).join("\n");
  }

  function hasContactDetails(contact = {}) {
    return Boolean(contact.email || contact.phone || contact.facebook || contact.linkedin || contact.github);
  }

  function formatContactResponse(contact = {}, wantsFilipino, question = "") {
    const normalized = normalizeText(question);
    const channels = [
      { key: "email", label: "Email", value: contact.email, pattern: /\b(email|mail)\b/ },
      { key: "phone", label: "Mobile", value: contact.phone, pattern: /\b(phone|mobile|number|call|text)\b/ },
      { key: "facebook", label: "Facebook", value: contact.facebook, pattern: /\b(facebook|fb|messenger)\b/ },
      { key: "linkedin", label: "LinkedIn", value: contact.linkedin, pattern: /\b(linkedin)\b/ },
      { key: "github", label: "GitHub", value: contact.github, pattern: /\b(github)\b/ }
    ].filter((channel) => channel.value);
    const wantsEveryChannel = /\b(all|every|complete|other channels|all contact)\b/.test(normalized);
    const specificallyRequested = channels.filter((channel) => channel.pattern.test(normalized));
    const preferred = channels.find((channel) => channel.key === "email") || channels[0];
    const selected = wantsEveryChannel
      ? channels
      : (specificallyRequested.length ? specificallyRequested : (preferred ? [preferred] : []));
    const details = selected.map((channel) => `${channel.label}: ${channel.value}`);

    if (!details.length) {
      return wantsFilipino
        ? "Walang public contact channel na naka-list sa portfolio ngayon."
        : "There is no public contact channel listed in the portfolio right now.";
    }

    if (wantsFilipino) {
      const lead = specificallyRequested.length || wantsEveryChannel
        ? "Narito ang requested public contact information ni Kino:"
        : "Ang preferred way para ma-contact si Kino ay email:";
      const alternative = !specificallyRequested.length && !wantsEveryChannel && channels.length > 1
        ? "May mobile at Facebook options din kung kailangan mo ng ibang channel."
        : "";
      return [lead, ...details, alternative].filter(Boolean).join("\n");
    }

    const lead = specificallyRequested.length || wantsEveryChannel
      ? "Here is the public contact information you requested:"
      : "The preferred way to contact Kino is by email:";
    const alternative = !specificallyRequested.length && !wantsEveryChannel && channels.length > 1
      ? "Mobile and Facebook are also available if you need another channel."
      : "";
    return [lead, ...details, alternative].filter(Boolean).join("\n");
  }

  function withServiceRecommendation(answer, intentKeys, wantsFilipino) {
    const recommendation = getServiceRecommendation(intentKeys, wantsFilipino);
    if (!recommendation) return answer;
    return `${answer}\n\n${recommendation}`;
  }

  function getServiceRecommendation(intentKeys, wantsFilipino) {
    const intents = new Set(intentKeys);

    if (intents.has("support")) {
      return wantsFilipino
        ? "Recommended service: customer at CRM support, spreadsheet tracking, data entry at records, email/calendar coordination, at document preparation."
        : "Recommended service: customer and CRM support, spreadsheet tracking, data entry and records, email/calendar coordination, and document preparation.";
    }

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
      { label: "Download Resume", action: "resume" },
      { label: "Contact Kino", action: "contact" }
    ];

    actions.push({ label: "Optional Project Brief", action: "project-request" });

    return actions;
  }

  function getResponseActions(intentKeys, contact = {}, question = "") {
    const intents = new Set(intentKeys);
    const actions = [];

    if (intents.has("projects") || intents.has("dashboard") || intents.has("automation") || intents.has("chatbot")) {
      actions.push({ label: "View Projects", action: "projects" });
    }

    if (intents.has("skills") || intents.has("tools") || intents.has("support")) {
      actions.push({ label: "View Skills", action: "skills" });
    }

    if (intents.has("contact")) {
      const normalized = normalizeText(question);
      const wantsEveryChannel = /\b(all|every|complete|other channels|all contact)\b/.test(normalized);
      const requestedChannels = [
        { label: "Mobile", href: contact.phone ? `tel:${contact.phone}` : "", pattern: /\b(phone|mobile|number|call|text)\b/ },
        { label: "Facebook", href: contact.facebook || "", pattern: /\b(facebook|fb|messenger)\b/ },
        { label: "LinkedIn", href: contact.linkedin || "", pattern: /\b(linkedin)\b/ },
        { label: "GitHub", href: contact.github || "", pattern: /\b(github)\b/ },
        { label: "Email Kino", href: contact.email ? `mailto:${contact.email}` : "", pattern: /\b(email|mail)\b/, primary: true }
      ].filter((channel) => channel.href);
      const selectedChannels = wantsEveryChannel
        ? requestedChannels
        : requestedChannels.filter((channel) => channel.pattern.test(normalized));
      const channelsToShow = selectedChannels.length
        ? selectedChannels
        : requestedChannels.filter((channel) => channel.label === "Email Kino").slice(0, 1);
      channelsToShow.forEach((channel) => {
        actions.push({
          label: channel.label,
          href: channel.href,
          primary: Boolean(channel.primary)
        });
      });
    }

    if (intents.has("project-request")) {
      actions.push({ label: "Share Optional Brief", action: "project-request", primary: !contact.email });
    }

    return actions
      .filter((action, index, list) => list.findIndex((candidate) => (
        candidate.label === action.label && candidate.href === action.href && candidate.action === action.action
      )) === index)
      .slice(0, 3);
  }

  function getFallbackResponse(question, relatedLabel = "") {
    const english = relatedLabel
      ? `I don't see that exact detail in Kino's public portfolio. I can confirm related information about ${relatedLabel}, but I won't guess beyond what is verified.`
      : CHATBOT_CONFIG.fallbackResponse;
    const filipino = relatedLabel
      ? `Wala ang exact detail na iyon sa public portfolio ni Kino. Kaya kong i-confirm ang related information tungkol sa ${relatedLabel}, pero hindi ako manghuhula.`
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
      .slice(0, 1)
      .map((match) => match.item);

    if (!profileItems.length) return "";

    const answerParts = profileItems.map((item) => {
      if (wantsFilipino && item.answerFilipino) return item.answerFilipino;
      return item.answer;
    }).filter(Boolean);

    if (!answerParts.length) return "";

    return answerParts.join(" ");
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
    return /\b(age|birth|birthday|birthdate|salary|compensation|credential|password|username|debtor|account number|private data|client name|bank data|confidential|residential|bpi)\b/.test(normalizedQuestion)
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
      || hasPhrase("what problems can kino solve", "how can kino help", "what can kino help with")
      || hasWord("skills", "skill", "kakayahan", "capability", "capabilities", "services", "offer", "service", "need", "kailangan", "gusto", "solve", "problems", "communication", "leadership", "adaptability")) {
      add("skills", "services");
    }

    if (hasPhrase("virtual assistant", "business support", "administrative support", "customer support", "customer service", "client support", "account management", "payment arrangement", "email management", "calendar management", "schedule management", "record management", "document management", "data entry")
      || hasWord("crm", "admin", "administrative", "calendar", "scheduling", "records", "inbox", "onedrive", "gmail", "outlook")) {
      add("support", "skills", "services");
    }

    if (hasPhrase("marunong ka ba gumawa dashboard", "marunong ka dashboard", "can you build dashboards", "can you make dashboard", "dashboard project")
      || hasWord("dashboard", "dashboards", "monitoring", "kpi", "analytics")) {
      add("dashboard", "projects", "tools");
    }

    if (hasPhrase("may sample work", "may gawa ka", "sample work", "portfolio sample", "work sample", "show project", "show me his work", "strongest work", "best work")
      || hasWord("projects", "project", "proyekto", "samples", "sample", "portfolio", "gawa", "showcase")) {
      add("projects");
    }

    if (hasPhrase("bakit ikaw", "bakit ka namin kukunin", "why should we hire", "why hire", "what makes you qualified", "why choose", "fit for our team", "fit for the role", "good fit", "is kino a fit")
      || hasWord("hire", "qualified", "value", "strengths", "valuable", "kukunin", "fit")) {
      add("value", "experience", "achievements");
    }

    if (hasPhrase("how to contact", "how can we contact", "mako contact", "ma contact", "reach you", "email address", "what is your email", "kino email")
      || hasWord("contact", "reach", "phone", "mobile", "facebook", "fb", "messenger", "linkedin", "github")) {
      add("contact");
    }

    if (hasPhrase("available ka ba", "available for work", "freelance", "full time", "full-time", "open for work")
      || hasWord("available", "freelance", "fulltime")) {
      add("availability", "services");
    }

    if (hasPhrase("submit project request", "project request", "project inquiry", "client inquiry", "send request")) {
      add("project-request", "services", "contact", "availability");
    }

    if (hasPhrase("request a quote", "request quotation", "get quotation", "need a project", "need dashboard")
      || hasWord("quote", "quotation", "budget", "inquiry")) {
      add("services", "contact", "availability");
    }

    if (hasPhrase("work experience", "ano experience", "ano ang experience", "ano work experience", "career background", "where did kino work", "where has kino worked", "companies did kino work")
      || hasWord("experience", "karanasan", "background", "trabaho", "operations")) {
      add("experience");
    }

    if (hasPhrase("tools and technologies", "tech stack", "anong tools", "tools gamit", "tools ginagamit", "chrome automation", "google chrome automation", "management report", "powerpoint automation", "google workspace", "microsoft office")
      || hasWord("tools", "tool", "technology", "technologies", "python", "fastapi", "uvicorn", "duckdb", "pandas", "pyarrow", "mysql", "pymysql", "html", "css", "javascript", "selenium", "customtkinter", "xlsxwriter", "excel", "sheets", "docs", "word", "gmail", "outlook", "drive", "onedrive", "chatgpt", "csv", "xlsx", "powerpoint", "gamit", "ginagamit")) {
      add("tools");
    }

    if (hasWord("python", "automation", "automate", "extractor", "extract", "workflow", "selenium", "chrome")) {
      add("automation", "tools");
    }

    if (hasWord("report", "reports", "reporting", "error", "errors", "validation", "validate", "quality", "cleanup", "cleaning")) {
      add("services", "automation");
    }

    if (hasWord("chatbot", "bot", "ai") || hasPhrase("ai assistant", "portfolio assistant", "portfolio chatbot")) {
      add("chatbot", "services", "automation");
    }

    if (hasWord("achievement", "achievements", "awards", "recognition", "award", "promotion", "promoted")) {
      add("achievements", "value");
    }

    if (hasPhrase("academic background", "computer programming strand", "where did kino study")
      || hasWord("education", "school", "college", "degree", "graduate", "strand")) {
      add("education");
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
      support: ["virtual assistant", "customer support", "crm", "administrative support", "data entry", "email management", "calendar", "records", "documents"],
      dashboard: ["dashboard", "monitoring", "kpi", "analytics", "reporting view"],
      projects: ["projects", "portfolio", "sample work", "gawa", "completed work"],
      tools: ["tools", "technologies", "tech stack", "python", "excel", "csv", "xlsx"],
      value: ["hire", "qualified", "why", "value", "strengths", "bakit ikaw"],
      experience: ["experience", "work", "operations", "career", "background", "karanasan"],
      achievements: ["achievements", "awards", "recognition", "promotion", "impact"],
      education: ["education", "school", "academic", "strand", "computer programming"],
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
      support: "customer, CRM, and administrative support",
      dashboard: "dashboard and reporting capability",
      projects: "projects and sample work",
      tools: "tools and technologies",
      value: "strengths and value proposition",
      experience: "work experience",
      achievements: "achievements and impact",
      education: "education and academic background",
      contact: "contact information",
      availability: "work availability",
      automation: "Python automation and workflow improvement",
      chatbot: "portfolio AI chatbot support"
    };

    const selected = intentKeys.map((intent) => labels[intent]).filter(Boolean);
    if (!selected.length) return "";
    return formatList(selected);
  }

  function adaptAnswerLanguage(answer, item, wantsFilipino) {
    if (wantsFilipino && item.answerFilipino) return item.answerFilipino;
    if (!wantsFilipino || isLikelyFilipino(`${item.question} ${answer}`)) return answer;

    const category = normalizeText(item.category);
    const question = normalizeText(item.question);

    if (category.includes("skills") || question.includes("skills")) {
      return "Base sa portfolio, ang strengths ni Kino ay Python automation, data reporting, Excel/Google Sheets workflows, dashboards, customer at CRM support, data entry at records, email/calendar coordination, document preparation, process improvement, at clear communication.";
    }

    if (category.includes("projects") || question.includes("project")) {
      return "Ilan sa projects ni Kino ay MC6 Collection Pipeline, Digital Omnichannel Monitoring Dashboard, Digital Reporting App, Excel Reporting Result, Predictive Summary Extractor, Alloc Review Builder, Auto Redial Automation, MC6 Analytics Hub, at Report Auto Extractor.";
    }

    if (category.includes("career") || category.includes("work") || question.includes("experience")) {
      return "May background si Kino sa customer-facing operations, calls/email/SMS communication, CRM at account handling, team supervision, reporting, dashboard monitoring, at Python automation. Ang portfolio niya ay focused sa future job at client opportunities.";
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
