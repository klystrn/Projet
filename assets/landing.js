/* ==========================================================================
   Projet — v3 landing page behaviour
   Dependency-free. Shared by index.html, challenges.html and dashboard.html;
   every effect self-skips when its element is absent, so the same file can
   drive all three pages.

   Retired in v3 (do not reinstate without a fresh instruction):
     - the spectrum-split (Featured challenges / Success stories) stage
     - the hero cursor-tilt parallax
   The How-it-works pinned scroll-scrub was on this list too, but has since
   been reinstated (reshaped: cropped to the right 5/8, title fixed left,
   step-by-step with a final all-4 recap before it unpins) — see that
   section below.
   The hard rule from v2 still stands: every effect renders its END STATE when
   motion is off or JS never runs. Nothing is gated behind a scroll effect.
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* ---------------- hero dashboard mock's CTA ----------------
     #heroDash's mock ends in an "Open dashboard" button — fine for a
     visitor who already has an account, but a prompt to open a dashboard
     they don't have yet for anyone who doesn't. In practice a signed-in
     visitor never reaches this page at all (see the redirect in index.html's
     own <head>), but this checks the same seam directly rather than leaning
     on that alone, the same way the final-CTA-hiding code below does — a
     visitor with the flag set some other way (a stale value from a past
     session, JS re-run after the redirect somehow didn't fire) should still
     get the right button here, not a dead promise of dashboard access.
     Declared at top level (not nested in the audience-toggle IIFE below) so
     applyModeCopy() can call it every time it rewrites #heroDash's markup —
     a wholesale innerHTML swap would otherwise silently undo whatever this
     function just changed. Self-skips wherever #heroDash doesn't exist. */
  function updateHeroDashCta() {
    var heroDash = document.getElementById("heroDash");
    if (!heroDash) return;
    var link = heroDash.querySelector(".dash-foot a");
    if (!link) return;
    var loggedIn = false;
    try { loggedIn = localStorage.getItem("projet:loggedIn") === "1"; } catch (e) { /* private mode */ }
    if (loggedIn) return; // ships already correct: "Open dashboard" -> dashboard.html
    var business = document.documentElement.getAttribute("data-audience") === "business";
    link.textContent = business ? "Post a challenge" : "Participate";
    link.setAttribute("href", "signup.html?role=" + (business ? "business" : "builder"));
  }

  /* ---------------- shared scroll ticker ----------------
     One rAF-gated listener drives every scroll-linked effect, rather than
     each registering its own. */
  var scrollUpdaters = [];
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      for (var i = 0; i < scrollUpdaters.length; i++) scrollUpdaters[i]();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------------- section reveal ---------------- */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- scroll progress + nav compaction ---------------- */
  (function () {
    var bar = document.getElementById("scrollProgress");
    var nav = document.getElementById("siteNav");
    if (!bar && !nav) return;
    scrollUpdaters.push(function () {
      var y = window.scrollY || 0;
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
      }
      if (nav) nav.classList.toggle("compact", y > 48);
    });
  })();

  /* ---------------- how-it-works: pinned fluid-scrub ----------------
     .flow-scroll is a tall (520vh, desktop-only via CSS) wrapper; .flow-stage
     sticks inside it, split 3/8 (title + rail) : 5/8 (scrub). Scroll progress
     maps to one beat per step, and only the current beat's step carries
     .is-active, so the right-hand panel really does show one at a time.
     The left rail tracks the same beat (.is-active on the current step,
     .is-done on everything before it) — the rail is where each step is
     NAMED and the panel is where it is EXPLAINED, so between them nothing
     is stated on screen twice. There is no separate recap beat any more:
     the rail already shows all four continuously, which is what that beat
     was for. Steps/rail items are re-queried live each frame rather than
     cached, since [data-mode-copy] replaces these nodes wholesale on every
     audience switch. Desktop + motion-ok only: mobile and reduced-motion
     render the plain flat list from CSS alone, no JS needed there. */
  (function () {
    var scrollWrap = document.getElementById("flowScroll");
    var stepsWrap = document.getElementById("flowSteps");
    var rail = document.getElementById("flowRail");
    var fluid = document.getElementById("flowFluid");
    if (!scrollWrap || !stepsWrap) return;
    if (reducedMotion) return;
    if (window.matchMedia && window.matchMedia("(max-width:900px)").matches) return;

    // .flow-fluid's own box is sized larger than .flow-right (see
    // landing.css) so the pan has somewhere to travel; measured in px once
    // (and on resize) rather than every scroll frame, since it only changes
    // when the viewport does. offsetWidth/offsetHeight, not
    // getBoundingClientRect, since the latter would report the *transformed*
    // box once a pan is already applied.
    var overageW = 0, overageH = 0;
    function measureFluid() {
      if (!fluid || !fluid.parentElement) return;
      var container = fluid.parentElement;
      overageW = fluid.offsetWidth - container.clientWidth;
      overageH = fluid.offsetHeight - container.clientHeight;
    }
    measureFluid();
    window.addEventListener("resize", measureFluid);

    scrollUpdaters.push(function () {
      var steps = stepsWrap.querySelectorAll(".flow-step");
      if (!steps.length) return;
      var railItems = rail ? rail.querySelectorAll(".flow-rail-item") : [];
      var rect = scrollWrap.getBoundingClientRect();
      var scrollable = scrollWrap.offsetHeight - window.innerHeight;
      var progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

      // one beat per step, nothing after them
      var stepIdx = clamp(Math.floor(progress * steps.length), 0, steps.length - 1);

      // re-applied every tick rather than only on change: [data-mode-copy]
      // replaces these nodes wholesale on an audience swap, which would
      // otherwise silently lose .is-active until progress next changed.
      for (var i = 0; i < steps.length; i++) steps[i].classList.toggle("is-active", i === stepIdx);
      for (var j = 0; j < railItems.length; j++) {
        railItems[j].classList.toggle("is-active", j === stepIdx);
        railItems[j].classList.toggle("is-done", j < stepIdx);
      }
      // mirrors the old background-position:0%->100% horizontal / 100%->0%
      // vertical pan, just expressed as a compositor-only translate instead
      // of a paint-triggering background-position
      if (fluid) {
        var x = -overageW * progress;
        var y = -overageH * (1 - progress);
        fluid.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      }
    });
  })();

  /* ---------------- mobile nav ---------------- */
  (function () {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;
    function setOpen(open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    // any nav choice closes the sheet, including same-page anchors
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  })();

  /* ---------------- active-section nav highlight ----------------
     One IntersectionObserver over the in-page targets, picking whichever
     section is closest to viewport centre. No scroll listener of its own. */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll("nav.links a[data-nav-link]"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var hash = a.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") return;
      var el = document.querySelector(hash);
      if (!el) return;
      map[hash] = a;
      targets.push(el);
    });
    if (!targets.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visible["#" + e.target.id] = e.isIntersecting
          ? Math.abs((e.boundingClientRect.top + e.boundingClientRect.bottom) / 2 - window.innerHeight / 2)
          : Infinity;
      });
      var best = null, bestDist = Infinity;
      Object.keys(visible).forEach(function (k) {
        if (visible[k] < bestDist) { bestDist = visible[k]; best = k; }
      });
      links.forEach(function (a) { a.classList.remove("is-current"); });
      if (best && map[best]) map[best].classList.add("is-current");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ---------------- audience mode toggle ----------------
     Re-tints the whole page via html[data-audience] (the CSS gradient tokens
     all swap off that one attribute), rewrites every [data-mode-copy]
     element, updates the signup links, and repoints the nav dashboard link
     at the matching view. One shared page, not two routed ones. */
  var SWAP_MS = 160;
  (function () {
    var STORE = "projet:audience";
    var switches = document.querySelectorAll(".mode-switch");
    var copyEls = document.querySelectorAll("[data-mode-copy]");
    var navDash = document.getElementById("navDash");
    var navDashMobile = document.getElementById("navDashMobile");
    var navDashLabel = document.getElementById("navDashLabel");

    var stored = null;
    try { stored = localStorage.getItem(STORE); } catch (e) { /* private mode */ }
    // builder/student is the default mode
    var mode = stored === "business" ? "business" : "builder";

    function applyModeCopy(animate) {
      if (!copyEls.length) return;
      if (!animate) {
        copyEls.forEach(function (el) {
          var next = el.getAttribute("data-" + (mode === "business" ? "business" : "builder"));
          if (next != null) el.innerHTML = next;
        });
        updateHeroDashCta(); // #heroDash's innerHTML was just replaced wholesale
        onScroll(); // re-run scroll-linked updaters against the fresh nodes
        return;
      }
      copyEls.forEach(function (el) {
        // The entrance stagger leaves an inline transition-delay on these
        // elements forever after load, and an inline delay outranks the
        // stylesheet's implicit 0s — it would silently delay this fade too.
        el.style.transitionDelay = "0s";
        el.classList.add("mode-swap");
      });
      setTimeout(function () {
        copyEls.forEach(function (el) {
          var next = el.getAttribute("data-" + (mode === "business" ? "business" : "builder"));
          if (next != null) el.innerHTML = next;
          el.classList.remove("mode-swap");
        });
        updateHeroDashCta(); // same reason as above, on the animated path
        // e.g. the how-it-works pin: .flow-tl's nodes were just replaced
        // wholesale, and nothing re-drives scrollUpdaters until the next
        // real scroll event — without this, .is-active/--flow-progress
        // would sit blank on the new nodes until the reader scrolls again.
        onScroll();
      }, reducedMotion ? 0 : SWAP_MS);
    }

    function apply(animate) {
      document.documentElement.setAttribute("data-audience", mode);
      switches.forEach(function (sw) {
        sw.querySelectorAll(".mode-opt").forEach(function (b) {
          b.setAttribute("aria-current", b.getAttribute("data-audience") === mode ? "true" : "false");
        });
      });
      // signup links carry the role through
      document.querySelectorAll('a[href^="signup.html"]').forEach(function (a) {
        if (a.closest("[data-mode-copy]")) return; // those are rewritten wholesale
        a.setAttribute("href", "signup.html?role=" + (mode === "business" ? "business" : "builder"));
      });
      // dashboard link points at the matching view
      var view = mode === "business" ? "company" : "student";
      var label = mode === "business" ? "Company dashboard" : "My dashboard";
      [navDash, navDashMobile].forEach(function (a) {
        if (a) a.setAttribute("href", "dashboard.html?view=" + view);
      });
      if (navDashLabel) navDashLabel.textContent = label;

      applyModeCopy(animate);
      try { localStorage.setItem(STORE, mode); } catch (e) { /* ignore */ }
    }

    switches.forEach(function (sw) {
      sw.addEventListener("click", function (e) {
        var btn = e.target.closest(".mode-opt");
        if (!btn) return;
        var next = btn.getAttribute("data-audience");
        if (!next || next === mode) return;
        mode = next;
        apply(true);
      });
    });

    // first call: the inline HTML already matches the resolved default, so
    // there is nothing to visibly swap
    apply(false);
  })();

  /* ---------------- final CTA — hidden once signed in ----------------
     No real auth exists yet, so this is a front-end seam matching the
     project's existing conventions (localStorage["projet:audience"],
     dashboard.html's ?view=): reads localStorage["projet:loggedIn"], with
     a ?loggedin=1 / ?loggedin=0 query param so it can actually be tested
     without a backend. Defaults to signed-out (CTA visible) so nothing
     changes for a real visitor until real auth exists. challenges.html has
     its own separate .cl-cta and is untouched by this. */
  (function () {
    var final = document.querySelector(".final");
    if (!final) return;
    var STORE = "projet:loggedIn";
    var params = new URLSearchParams(window.location.search);
    if (params.has("loggedin")) {
      try { localStorage.setItem(STORE, params.get("loggedin") === "1" ? "1" : "0"); } catch (e) { /* private mode */ }
    }
    var loggedIn = false;
    try { loggedIn = localStorage.getItem(STORE) === "1"; } catch (e) { /* private mode */ }
    if (loggedIn) final.hidden = true;
  })();

  /* ---------------- dashboard "Log out" ----------------
     dashboard.html is only ever reached signed in, so its nav offers a way
     OUT of that state instead of the "Log in" prompt every other page shows
     — clearing the same projet:loggedIn seam the pages above read, then
     sending the reader back to the landing page. Self-skips everywhere else,
     since only dashboard.html has these buttons. */
  (function () {
    var buttons = document.querySelectorAll("#navLogout, #navLogoutMobile");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.removeItem("projet:loggedIn"); } catch (e) { /* private mode */ }
        window.location.href = "index.html";
      });
    });
  })();

  /* ---------------- final CTA + footer sized to one screenful ----------------
     .final's own min-height (landing.css) reads --nav-h/--footer-h to cap
     itself at exactly "whatever's left below the nav once the footer's own
     height is subtracted" — so the CTA and footer together land on one
     viewport-height, nav included, rather than spilling an extra stretch
     past it. Both heights are measured LIVE rather than hardcoded: the nav
     changes height when it compacts on scroll, and the footer changes
     height whenever its column grid wraps at a narrower width, so a fixed
     number would drift out of sync with either. Self-skips when there's no
     .final on the page (challenges.html, dashboard.html). */
  (function () {
    var final = document.querySelector(".final");
    var nav = document.getElementById("siteNav");
    var footer = document.getElementById("footer");
    if (!final || !nav || !footer) return;
    function measure() {
      document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
      document.documentElement.style.setProperty("--footer-h", footer.offsetHeight + "px");
    }
    measure();
    window.addEventListener("resize", measure);
    // the nav's own height changes a beat after scrollUpdaters flips .compact
    // (landing.css transitions nav-inner's padding over .3s), so this also
    // rides the shared ticker rather than only firing once on load/resize
    scrollUpdaters.push(measure);
  })();

  /* ---------------- hero count-up ---------------- */
  (function () {
    var nums = document.querySelectorAll(".hero-stat-row b");
    if (!nums.length || reducedMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var text = el.textContent.trim();
        var m = text.match(/^(\d+)(\D*)$/);
        if (!m) return;
        var target = parseInt(m[1], 10);
        var suffix = m[2] || "";
        var start = performance.now();
        var dur = 900;
        function step(now) {
          var p = clamp((now - start) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------------- logo carousel — recycling marquee ----------------
     Chips move from the head of the track to the tail as they clear the left
     edge, crediting the offset back by exactly that chip's width, so the
     transform oscillates near zero forever instead of rewinding. */
  (function () {
    var track = document.getElementById("logoTrack");
    if (!track) return;
    var original = Array.prototype.slice.call(track.children);
    if (!original.length) return;

    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard < 40) {
      original.forEach(function (n) {
        var clone = n.cloneNode(true);
        // Clones are visual filler. Unmarked they would double the strip's
        // tab stops and make a screen reader read the list twice; aria-hidden
        // alone is a violation if the node stays focusable.
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
      });
      guard++;
    }

    if (reducedMotion) return; // static strip; every logo still visible

    var offset = 0, speed = 46, last = 0, running = true, paused = false;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) { last = 0; requestAnimationFrame(tick); }
      }, { threshold: 0 }).observe(track.parentElement || track);
    }
    // pause on hover/focus so a curious visitor can actually read a name,
    // and so a keyboard user is not fighting a moving target
    ["mouseenter", "focusin"].forEach(function (ev) {
      track.addEventListener(ev, function () { paused = true; });
    });
    ["mouseleave", "focusout"].forEach(function (ev) {
      track.addEventListener(ev, function () { paused = false; last = 0; requestAnimationFrame(tick); });
    });

    function tick(now) {
      if (!running) return;
      if (!last) last = now;
      var dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        offset -= speed * dt;
        var first = track.firstElementChild;
        while (first && offset + first.offsetWidth + 56 < 0) {
          offset += first.offsetWidth + 56;
          track.appendChild(first);
          first = track.firstElementChild;
        }
        track.style.transform = "translateX(" + offset + "px)";
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ---------------- testimonials — spotlight + strip ----------------
     Option C: hovering or focusing a .t-chip in the strip promotes its
     content into the #tSpot card above. Hover and focus are wired
     identically (not just :hover in CSS) so keyboard users get the same
     swap. Falls back to the default spotlight — chip[0]'s content, already
     inline in the HTML — for no-js and for anyone who never interacts;
     every chip's own full quote is always readable in the strip itself
     regardless, so nothing is gated behind hover. */
  (function () {
    var spot = document.getElementById("tSpot");
    var chips = document.querySelectorAll(".t-chip");
    if (!spot || !chips.length) return;
    var quoteEl = document.getElementById("tSpotQuote");
    var avatarEl = document.getElementById("tSpotAvatar");
    var nameEl = document.getElementById("tSpotName");
    var roleEl = document.getElementById("tSpotRole");
    var tagEl = document.getElementById("tSpotTag");

    function activate(chip) {
      if (!chip || chip.getAttribute("aria-current") === "true") return;
      chips.forEach(function (c) { c.setAttribute("aria-current", c === chip ? "true" : "false"); });
      spot.setAttribute("data-side", chip.getAttribute("data-side") || "business");
      quoteEl.textContent = chip.getAttribute("data-quote") || "";
      nameEl.textContent = chip.getAttribute("data-name") || "";
      roleEl.textContent = chip.getAttribute("data-role") || "";
      tagEl.textContent = chip.getAttribute("data-tag") || "";
      var avatarId = chip.getAttribute("data-avatar");
      var fill = avatarEl.querySelector("circle");
      if (fill && avatarId) fill.setAttribute("fill", "url(#" + avatarId + ")");
    }

    chips.forEach(function (chip) {
      chip.addEventListener("mouseenter", function () { activate(chip); });
      chip.addEventListener("focus", function () { activate(chip); });
    });

    /* Quotes differ in length, so swapping which one is in the spotlight
       used to change #tSpot's own height and jolt the whole section on
       every hover. Measure every chip's quote against the spotlight's
       real layout (min-height cleared first, so a stale reservation can't
       skew the measurement) and reserve the tallest as min-height — the
       swap only ever changes content after that, never layout. Re-measured
       on resize since wrapping depends on viewport width. */
    function stabilizeHeight() {
      spot.style.minHeight = "";
      var current = quoteEl.textContent;
      var max = 0;
      chips.forEach(function (chip) {
        quoteEl.textContent = chip.getAttribute("data-quote") || "";
        max = Math.max(max, spot.offsetHeight);
      });
      quoteEl.textContent = current;
      spot.style.minHeight = max + "px";
    }
    stabilizeHeight();
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(stabilizeHeight, 150);
    });

    /* ---- pinned dwell: auto-advance the spotlight as the reader scrolls ----
       Desktop + motion-ok only, same gate (and same reasoning) as the
       How-it-works flow-rail above: mobile and reduced-motion render the
       plain static block from CSS alone (.t-scroll/.t-stage reset to
       height:auto/position:static there), so there's no pin for this to
       drive and no scroll listener is even registered.

       Reuses activate() directly rather than a second implementation, so
       the auto-advance and the hover/focus swap can never drift out of
       sync with each other. They coexist for free: this only runs inside
       the shared scrollUpdaters ticker, which itself only fires on a real
       scroll/resize event — a reader who stops scrolling to hover a chip
       gets that chip via the hover listener above and it simply stays
       until the next real scroll event recomputes the auto-selected one. */
    if (!reducedMotion && !(window.matchMedia && window.matchMedia("(max-width:900px)").matches)) {
      var scrollWrap = document.getElementById("tScroll");
      if (scrollWrap) {
        scrollUpdaters.push(function () {
          if (window.innerWidth <= 900) return; // CSS already shows the static block
          var rect = scrollWrap.getBoundingClientRect();
          var total = rect.height - window.innerHeight;
          var progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
          var idx = Math.min(chips.length - 1, Math.floor(progress * chips.length));
          activate(chips[idx]);
        });
      }
    }
  })();

  /* ---------------- featured-challenge ticket rail ----------------
     Enhancement only. The rail itself is a native overflow-x:auto scroller,
     so touch, trackpad and keyboard already work with none of this; all we
     add is arrow buttons, a position bar, and disabled states at each end.
     CSS hides the whole control row under .no-js rather than leaving dead
     buttons on screen. */
  (function () {
    var rail = document.getElementById("chRail");
    var controls = document.getElementById("chRailControls");
    var fill = document.getElementById("chRailFill");
    if (!rail || !controls) return;
    var btns = controls.querySelectorAll("[data-rail-dir]");

    function maxScroll() { return rail.scrollWidth - rail.clientWidth; }

    function sync() {
      var max = maxScroll();
      var x = rail.scrollLeft;
      // a rail that doesn't overflow has nothing to drive: park the bar full
      // and disable both arrows rather than dividing by zero
      var p = max > 1 ? x / max : 1;
      if (fill) fill.style.setProperty("--rail-progress", (max > 1 ? Math.max(p, .08) : 1).toFixed(3));
      btns.forEach(function (b) {
        var dir = Number(b.getAttribute("data-rail-dir"));
        var atEnd = max <= 1 || (dir < 0 ? x <= 1 : x >= max - 1);
        b.disabled = atEnd;
      });
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = Number(b.getAttribute("data-rail-dir"));
        var card = rail.querySelector(".ch-ticket");
        // one card + one gap per press, so a click always lands the next
        // ticket flush against the rail's padding edge
        var step = card ? card.offsetWidth + 18 : rail.clientWidth * .8;
        rail.scrollBy({ left: dir * step, behavior: reducedMotion ? "auto" : "smooth" });
      });
    });

    rail.addEventListener("scroll", function () {
      // passive read-only sync; cheap enough to run raw, and rAF-gating it
      // would lag the bar behind the thumb on a trackpad flick
      sync();
    }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  })();

  /* ---------------- featured-challenge ticket rail: drag-to-scroll ----------------
     Mouse-only click-and-drag panning, on top of the arrow buttons above.
     Touch and trackpad already scroll the native overflow-x:auto container
     for free (that's the whole point of it being a real scroller, see the
     comment on .ch-rail in landing.css) and are untouched here — this only
     reacts to pointerType:"mouse", which browsers don't pan on drag by
     default. Setting scrollLeft directly (not scrollTo/scrollBy) is always
     instant regardless of .ch-rail's own scroll-behavior:smooth, so the
     drag tracks the cursor 1:1 with no lag. */
  (function () {
    var rail = document.getElementById("chRail");
    if (!rail) return;
    var dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      pointerId = e.pointerId;
    });

    rail.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      // capture (and the visual drag state) only start once the cursor has
      // actually moved past a small threshold — capturing unconditionally
      // on every pointerdown redirects the resulting "click" event's target
      // to the rail itself even for an ordinary, un-dragged click (a real
      // browser quirk), which broke opening the ticket modal on a plain
      // click. Deferring capture until a real drag is confirmed keeps a
      // plain click's hit-testing untouched.
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        rail.classList.add("is-dragging");
        rail.setPointerCapture(pointerId);
      }
      if (moved) rail.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    // a drag that actually moved the rail shouldn't also open the ticket
    // modal below — capture phase so this runs before that delegated
    // click handler, which is registered directly on the same element
    rail.addEventListener("click", function (e) {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);
  })();

  /* ---------------- featured-challenge ticket modal ----------------
     Native <dialog> — same pattern as challenges.html's own brief modal
     (assets/challenges.js). Each ticket carries its own brief as
     data-brief-* attributes, read fresh on every open. One click handler on
     #chRail (event delegation) covers both "click anywhere on the ticket"
     and "click the View challenge button" — the button's click bubbles to
     the same .ch-ticket ancestor, so there's nothing to double-wire. */
  (function () {
    var rail = document.getElementById("chRail");
    var modal = document.getElementById("chModal");
    if (!rail || !modal || typeof modal.showModal !== "function") return;

    var closeBtn = document.getElementById("chmClose");
    var tagEl = document.getElementById("chmTag");
    var titleEl = document.getElementById("chmTitle");
    var bodyEl = document.getElementById("chmBody");
    var submittedEl = document.getElementById("chmSubmitted");
    var deadlineEl = document.getElementById("chmDeadline");

    rail.addEventListener("click", function (e) {
      var ticket = e.target.closest(".ch-ticket");
      if (!ticket) return;
      var discipline = ticket.getAttribute("data-brief-discipline") || "";
      var company = ticket.getAttribute("data-brief-company") || "";
      tagEl.textContent = discipline + (company ? " · " + company : "");
      titleEl.textContent = ticket.getAttribute("data-brief-title") || "";
      bodyEl.textContent = ticket.getAttribute("data-brief-body") || "";
      submittedEl.textContent = ticket.getAttribute("data-brief-submitted") || "";
      deadlineEl.textContent = ticket.getAttribute("data-brief-deadline") || "";
      modal.showModal();
    });

    closeBtn.addEventListener("click", function () { modal.close(); });
    // a click landing on the ::backdrop itself (the dialog element, not any
    // of its children) closes it too
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
  })();

  /* ---------------- featured-challenge countdown ----------------
     A real ticking clock against a PLACEHOLDER deadline: hours-from-page-load
     rather than a fixed calendar date, since there is no live challenge data
     yet. Not gated by reducedMotion — this is a live data readout that
     updates its own text, not a decorative animation, and the HTML
     pre-renders a sane starting value for no-js visitors. */
  (function () {
    var el = document.querySelector("[data-countdown-hours]");
    if (!el) return;
    var hours = parseFloat(el.getAttribute("data-countdown-hours")) || 0;
    var deadline = Date.now() + hours * 3600000;
    var dEl = el.querySelector('[data-cd="d"]');
    var hEl = el.querySelector('[data-cd="h"]');
    var mEl = el.querySelector('[data-cd="m"]');
    var sEl = el.querySelector('[data-cd="s"]');
    if (!dEl || !hEl || !mEl || !sEl) return;
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    function tick() {
      var diff = Math.max(0, deadline - Date.now());
      dEl.textContent = pad(Math.floor(diff / 86400000));
      hEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
      sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ---------------- footer "get notified" capture ----------------
     Front end only, same honesty rule as the auth forms: an empty
     data-endpoint means it says the wiring is pending, never fakes success. */
  (function () {
    var form = document.getElementById("footerNotify");
    if (!form) return;
    var msg = form.querySelector(".footer-notify-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        msg.textContent = "Not connected yet. This form is the finished front end, waiting on the API.";
        return;
      }
      msg.textContent = "Thanks. You’re on the list.";
    });
  })();

  onScroll(); // paint every scroll-linked effect at its correct initial value
})();
