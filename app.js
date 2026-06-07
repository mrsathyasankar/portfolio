/* ============================================================
   Sathya Sankar — Portfolio interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme toggle (persisted) ---------------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored) root.setAttribute("data-theme", stored);
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      themeBtn.setAttribute("aria-label", "Switch to " + (next === "light" ? "dark" : "light") + " theme");
    });
  }

  /* ---------------- Nav: scroll state + mobile menu ---------------- */
  var nav = document.querySelector(".nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------------- Scroll reveals ----------------
     Scroll-based checker (works in every render context, unlike a pure
     IntersectionObserver which can stay silent in some embedded previews).
     Self-healing: if the transition clock is frozen (some headless/embedded
     renderers), force the end-state so content is never left hidden. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function settle(el) {
    if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
      el.style.transition = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  }
  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var arm = function (el) { el.classList.add("in"); setTimeout(function () { settle(el); }, 900); };
    var revealCheck = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = reveals.length - 1; i >= 0; i--) {
        var el = reveals[i];
        if (el.getBoundingClientRect().top < vh * 0.92) { arm(el); reveals.splice(i, 1); }
      }
    };
    revealCheck();
    window.addEventListener("scroll", revealCheck, { passive: true });
    window.addEventListener("resize", revealCheck, { passive: true });
    window.addEventListener("load", revealCheck);
    setTimeout(revealCheck, 400);
    // final safety net: nothing stays hidden
    setTimeout(function () { document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); settle(el); }); }, 2600);
  }

  /* ---------------- Active nav link on scroll ---------------- */
  var spySections = ["work", "build", "skills", "about", "contact"].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navAnchors = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) { navAnchors[a.getAttribute("href").slice(1)] = a; });
  function syncActiveNav() {
    var pos = window.scrollY + window.innerHeight * 0.4;
    var currentId = null;
    spySections.forEach(function (s) { if (s.offsetTop <= pos) currentId = s.id; });
    Object.keys(navAnchors).forEach(function (k) {
      if (k === currentId) navAnchors[k].setAttribute("aria-current", "true");
      else navAnchors[k].removeAttribute("aria-current");
    });
  }
  if (spySections.length) {
    syncActiveNav();
    window.addEventListener("scroll", syncActiveNav, { passive: true });
  }

  /* ============================================================
     Signature motif — live parallel agent lanes
     ============================================================ */
  var AGENTS = [
    { nm: "claude-code", cls: "", tasks: ["impl gst tax engine · paise precision", "wire razorpay edge function", "add ADR-007: offline sync", "write drift migration v12", "harden multi-tenant auth guard"] },
    { nm: "codex", cls: "g", tasks: ["generate DRF serializers", "refactor invoice numbering (FY)", "unit tests · CGST/SGST split", "expo screen: care-plan view", "type-safe MCP tool schema"] },
    { nm: "antigravity", cls: "v", tasks: ["scaffold next.js 14 route", "terraform: cloud run service", "vertex ai gemini prompt eval", "documentai field mapping", "semantic planner follow-ups"] },
    { nm: "verifier", cls: "o", tasks: ["run suite · 214 passing", "lint + typecheck clean", "PHI-safe evidence audit", "lighthouse 98 · a11y pass", "review diff · approve & ship"] }
  ];

  function lane(el, agent) {
    var taskEl = el.querySelector(".lane-task");
    var bar = el.querySelector(".lane-prog i");
    var i = Math.floor(Math.random() * agent.tasks.length);
    var raf, timer;

    function typeTask(text, done) {
      var n = 0;
      el.classList.remove("done");
      el.classList.add("active");
      (function step() {
        n++;
        taskEl.innerHTML = text.slice(0, n) + '<span class="cursor">▍</span>';
        if (n < text.length) { timer = setTimeout(step, 14 + Math.random() * 26); }
        else { taskEl.innerHTML = text + '<span class="cursor">▍</span>'; done(); }
      })();
    }

    function run() {
      var text = agent.tasks[i % agent.tasks.length];
      i++;
      bar.style.transition = "none"; bar.style.width = "0%";
      // force reflow
      void bar.offsetWidth;
      typeTask(text, function () {
        var dur = 1400 + Math.random() * 1600;
        bar.style.transition = "width " + dur + "ms linear";
        bar.style.width = "100%";
        timer = setTimeout(function () {
          el.classList.remove("active");
          el.classList.add("done");
          taskEl.innerHTML = text;
          timer = setTimeout(run, 900 + Math.random() * 1100);
        }, dur);
      });
    }
    // stagger start
    timer = setTimeout(run, Math.random() * 1400);
    return function stop() { clearTimeout(timer); cancelAnimationFrame(raf); };
  }

  var laneEls = document.querySelectorAll(".lane");
  if (laneEls.length && !reduceMotion) {
    laneEls.forEach(function (el, idx) { lane(el, AGENTS[idx % AGENTS.length]); });
  } else if (laneEls.length) {
    // static state for reduced motion
    laneEls.forEach(function (el, idx) {
      var a = AGENTS[idx % AGENTS.length];
      el.querySelector(".lane-task").textContent = a.tasks[0];
      el.querySelector(".lane-prog i").style.width = idx % 2 ? "100%" : "62%";
      if (idx % 2) el.classList.add("done");
    });
  }

  /* ---------------- How I Build: cycle highlight steps ---------------- */
  var steps = document.querySelectorAll(".flow-step");
  var graphNodes = document.querySelectorAll("[data-node]");
  if (steps.length) {
    var cur = 0;
    function lightStep(n) {
      steps.forEach(function (s, idx) { s.classList.toggle("lit", idx === n); });
      graphNodes.forEach(function (g) { g.classList.toggle("on", Number(g.getAttribute("data-node")) === n); });
    }
    lightStep(0);
    if (!reduceMotion) {
      setInterval(function () { cur = (cur + 1) % steps.length; lightStep(cur); }, 2600);
    }
    steps.forEach(function (s, idx) {
      s.addEventListener("mouseenter", function () { cur = idx; lightStep(idx); });
    });
  }

  /* ============================================================
     Project detail modals
     ============================================================ */
  var scrim = document.getElementById("modal-scrim");
  var modalRoot = document.getElementById("modal-root");
  var lastFocus = null;
  var PROJECTS = window.__PROJECTS__ || {};

  function openModal(key) {
    var p = PROJECTS[key];
    if (!p || !scrim || !modalRoot) return;
    lastFocus = document.activeElement;
    modalRoot.innerHTML = renderModal(p);
    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
    var closeBtn = scrim.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!scrim) return;
    scrim.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  function chip(t) { return '<span class="chip">' + t + "</span>"; }
  function bullet(b) {
    return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + b + "</span></li>";
  }
  function linkBtn(l) {
    var cls = l.primary ? "btn btn-soft" : "btn btn-ghost";
    return '<a class="' + cls + '" href="' + l.href + '"' + (l.href.charAt(0) === "#" ? "" : ' target="_blank" rel="noopener"') + ">" + l.label + "</a>";
  }
  function renderModal(p) {
    return '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<div class="modal-hd"><div><div class="role">' + p.role + '</div><h3 id="modal-title">' + p.title + '</h3></div>' +
      '<button class="modal-close" aria-label="Close dialog"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="modal-bd">' +
        '<div class="mb-block"><h4>The problem</h4><p>' + p.problem + "</p></div>" +
        '<div class="mb-block"><h4>What I built</h4><p>' + p.built + "</p></div>" +
        '<div class="mb-block"><h4>Impact</h4><ul class="mb-list">' + p.impact.map(bullet).join("") + "</ul></div>" +
        '<div class="mb-block"><h4>Stack</h4><div class="chips">' + p.stack.map(chip).join("") + "</div></div>" +
        (p.links && p.links.length ? '<div class="modal-links">' + p.links.map(linkBtn).join("") + "</div>" : "") +
      "</div></div>";
  }

  document.querySelectorAll("[data-modal]").forEach(function (el) {
    el.addEventListener("click", function () { openModal(el.getAttribute("data-modal")); });
  });
  if (scrim) {
    scrim.addEventListener("click", function (e) {
      if (e.target === scrim || e.target.closest(".modal-close")) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrim && scrim.classList.contains("open")) closeModal();
    // focus trap
    if (e.key === "Tab" && scrim && scrim.classList.contains("open")) {
      var f = scrim.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- Year ---------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
