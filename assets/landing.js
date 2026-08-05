/* ==========================================================================
   Projet — landing page behaviour
   Vanilla, no dependencies. Loaded only by index.html.

   Structure: one shared rAF-gated scroll/resize ticker drives every
   continuous scroll-linked effect (progress bar, nav compaction, hero
   handoff, spectrum-split immersion, fluid-flow scrub). Enter/exit-only
   effects use IntersectionObserver instead, since they don't need a
   continuous progress value.

   Every effect checks `reducedMotion` and renders its END STATE immediately
   rather than skipping — nothing on this page is allowed to stay hidden
   because motion is off or JS never ran.
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) document.documentElement.classList.add("reduced-motion");

  var clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };

  /* ---------------- shared scroll ticker ---------------- */
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
        if (!e.isIntersecting) return;
        e.target.classList.add("revealed");
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- scroll progress bar + nav compaction ---------------- */
  (function () {
    var bar = document.getElementById("scrollProgress");
    var nav = document.querySelector("header.nav");
    if (!bar && !nav) return;
    scrollUpdaters.push(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.pageYOffset;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (nav) nav.classList.toggle("is-compact", y > 48);
    });
  })();

  /* ---------------- mobile nav ---------------- */
  (function () {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;
    function set(open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () { set(!menu.classList.contains("open")); });
    // any nav choice closes the sheet, including same-page anchors — otherwise
    // the page scrolls away behind a menu still covering it
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { set(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) set(false); });
  })();

  /* ---------------- Active-section nav highlight ----------------
     Whichever in-page section is actually in view keeps its nav link
     underlined without needing a hover — a quiet wayfinding cue on top of
     the plain anchor list. */
  (function () {
    var links = document.querySelectorAll("[data-nav-link]");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ el: el, link: a });
    });
    if (!sections.length) return;

    function setCurrent(id) {
      links.forEach(function (a) {
        a.classList.toggle("is-current", a.getAttribute("href") === "#" + id);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      // pick the entry closest to the vertical centre of the viewport among
      // those currently intersecting, rather than just "first seen"
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (!visible.length) return;
      var mid = window.innerHeight / 2;
      visible.sort(function (a, b) {
        return Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - mid) -
               Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - mid);
      });
      setCurrent(visible[0].target.id);
    }, { threshold: 0.2, rootMargin: "-88px 0px -40% 0px" });

    sections.forEach(function (s) { io.observe(s.el); });
  })();

  /* ---------------- Audience mode toggle ----------------
     Re-tints --accent (orange for companies, blue for builders/students) via
     html[data-audience] rather than navigating anywhere — this is one shared
     page, not two separate audience pages, so the toggle is a product-level
     control, not a router. Persists the choice and carries it into the
     nav's Sign up link as ?role=, same convention the old audience chooser
     used. Internal value stays "builder" (matches ?role=builder elsewhere)
     even though the visible label reads "For students" — only the label
     text changed, not the plumbing. */
  (function () {
    var opts = document.querySelectorAll(".mode-opt");
    if (!opts.length) return;
    var signupLinks = document.querySelectorAll(
      '.nav-cta a[href^="signup.html"], .mobile-menu-ctas a[href^="signup.html"]'
    );
    // Elements whose whole content differs per mode — data-business/
    // data-builder hold each mode's full markup, swapped in via innerHTML.
    // Some (.flow-steps) get rebuilt entirely by a scroll-scrub that caches
    // its own references to the .flow-step nodes, so it needs a nudge to
    // re-query after its content is replaced out from under it.
    var modeCopyEls = document.querySelectorAll("[data-mode-copy]");

    function applyModeCopy(mode) {
      modeCopyEls.forEach(function (el) {
        var html = el.getAttribute("data-" + mode);
        if (html != null) el.innerHTML = html;
      });
      var flowEl = document.getElementById("flow");
      if (flowEl && flowEl.refreshFlow) flowEl.refreshFlow();
    }

    function apply(mode, persist) {
      document.documentElement.setAttribute("data-audience", mode);
      opts.forEach(function (o) {
        o.setAttribute("aria-current", o.getAttribute("data-audience") === mode ? "true" : "false");
      });
      signupLinks.forEach(function (a) { a.href = "signup.html?role=" + mode; });
      applyModeCopy(mode);
      if (persist) {
        try { localStorage.setItem("projet:audience", mode); } catch (e) {}
      }
    }

    opts.forEach(function (o) {
      o.addEventListener("click", function () { apply(o.getAttribute("data-audience"), true); });
    });

    var stored = null;
    try { stored = localStorage.getItem("projet:audience"); } catch (e) {}
    apply(stored === "builder" ? "builder" : "business", false);
  })();

  /* ---------------- Hero cursor tilt ----------------
     Desktop pointer only — the one interaction the otherwise-static hero
     visual keeps. Transition is set inline only on mouseleave (the snap-back)
     rather than in the stylesheet: .hero-visual also carries [data-reveal]'s
     entrance transition, and a permanent CSS transition on the same
     `transform` property here would win the cascade (equal specificity, later
     in the file) and silently shorten the load-in stagger from .7s to
     whatever this used. */
  (function () {
    var visual = document.getElementById("heroVisual");
    if (!visual || reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var MAX_DEG = 7;
    visual.addEventListener("mousemove", function (e) {
      visual.style.transition = "";
      var r = visual.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform =
        "perspective(900px) rotateX(" + (-py * MAX_DEG).toFixed(2) + "deg) rotateY(" +
        (px * MAX_DEG).toFixed(2) + "deg)";
    });
    visual.addEventListener("mouseleave", function () {
      visual.style.transition = "transform .5s cubic-bezier(.16,.84,.44,1)";
      visual.style.transform = "";
    });
  })();

  /* ---------------- hero count-up ----------------
     Values are pre-rendered in the HTML at their real figures, so no-js and
     reduced-motion visitors just see the finished number. */
  (function () {
    var els = document.querySelectorAll(".count-up");
    if (!els.length || reducedMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute("data-count-to"), 10);
        if (isNaN(target)) return;
        var start = performance.now(), dur = 900;
        (function step(now) {
          var p = clamp((now - start) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- 2. Logo carousel — recycling marquee ----------------
     Not a duplicate-and-reset loop: chips are physically moved from the head
     of the track to its tail the moment they clear the left edge, and the
     offset is credited back by exactly that chip's width. The strip therefore
     never rewinds — it just keeps reintroducing what scrolled off. */
  (function () {
    var track = document.getElementById("logoTrack");
    if (!track) return;

    var GAP = parseFloat(getComputedStyle(track).gap) || 64;
    var SPEED = 46; // px per second

    // clone until the track is at least twice the viewport, so there is always
    // something entering on the right no matter how wide the screen is
    var original = Array.prototype.slice.call(track.children);
    if (!original.length) return;
    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard < 40) {
      original.forEach(function (n) { track.appendChild(n.cloneNode(true)); });
      guard++;
    }

    if (reducedMotion) return; // static strip; all logos still visible

    var offset = 0, last = null;
    var onscreen = true, hovered = false;
    function running() { return onscreen && !hovered; }

    // pause while off-screen so we aren't animating in a background tab
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onscreen = entries[0].isIntersecting;
        if (running()) { last = null; requestAnimationFrame(tick); }
      }, { threshold: 0 }).observe(track.parentNode);
    }

    // pause on hover/focus so a curious visitor can actually read a name —
    // it only paused off-screen before, with no way to stop it in view
    track.parentNode.addEventListener("mouseenter", function () { hovered = true; });
    track.parentNode.addEventListener("mouseleave", function () {
      hovered = false;
      if (running()) { last = null; requestAnimationFrame(tick); }
    });
    track.addEventListener("focusin", function () { hovered = true; });
    track.addEventListener("focusout", function () {
      hovered = false;
      if (running()) { last = null; requestAnimationFrame(tick); }
    });

    function tick(now) {
      if (!running()) return;
      if (last === null) last = now;
      var dt = Math.min((now - last) / 1000, 0.05); // clamp: tab-switch jumps
      last = now;
      offset -= SPEED * dt;

      // recycle every chip that has fully left the left edge
      var first = track.firstElementChild;
      while (first && offset + first.offsetWidth + GAP <= 0) {
        offset += first.offsetWidth + GAP;
        track.appendChild(first);
        first = track.firstElementChild;
      }
      track.style.transform = "translateX(" + offset + "px)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ---------------- 3+4. Spectrum split (light spectrum wave) ----------------
     Same bar mechanic as the old audience chooser: the spectrum image sliced
     into horizontal bars along the seam, shearing away from the active side
     on a sine-curve amplitude with a per-index delay so it cascades.
     Additions here: the white veil that dissolves on scroll-in (and returns on
     scroll-out), and a default resting side rather than a neutral 50/50. */
  (function () {
    var wrap = document.getElementById("spectrumSplit");
    var stage = document.getElementById("ssStage");
    var barsBox = document.getElementById("ssBars");
    var veil = document.getElementById("ssVeil");
    if (!wrap || !stage) return;

    var DEFAULT_SIDE = "challenges";
    var pinned = DEFAULT_SIDE;

    /* --- build the bars --- */
    var BAR_COUNT = 14;
    // spectrum.webp is mostly black margin either side of its diagonal
    // colour band, and — being diagonal — the band's centre drifts by most
    // of the image's width between the top bar and the bottom one. Squeezing
    // the whole image into each bar (the original approach) therefore showed
    // mostly flat black. [zoom, offsetK] per bar below was precomputed by
    // sampling assets/spectrum.webp at each bar's row and solving for the
    // scale + horizontal shift that re-centres that row's own band inside
    // the bar — see the CSS comment on .ss-bar for how they're consumed.
    // Regenerate this table (a small Python/Pillow script) if spectrum.webp
    // is ever re-exported.
    var BAND_ZOOM = [
      [2.527, -1.262], [2.604, -1.232], [2.505, -1.144], [2.409, -1.023],
      [2.292, -0.868], [2.087, -0.68], [1.979, -0.558], [1.841, -0.363],
      [1.687, -0.212], [1.602, -0.11], [1.73, -0.11], [1.916, -0.11],
      [1.977, -0.11], [2.276, -0.11]
    ];
    if (barsBox) {
      barsBox.style.setProperty("--n", BAR_COUNT);
      var frag = document.createDocumentFragment();
      for (var i = 0; i < BAR_COUNT; i++) {
        var bar = document.createElement("div");
        bar.className = "ss-bar";
        // amplitude bulges toward the middle bars so the shear reads as a
        // wave rather than a flat block sliding sideways
        var amp = 14 + Math.round(30 * Math.sin((i / (BAR_COUNT - 1)) * Math.PI));
        var zoomPair = BAND_ZOOM[Math.min(i, BAND_ZOOM.length - 1)];
        bar.style.setProperty("--i", i);
        bar.style.setProperty("--amp", amp + "px");
        bar.style.setProperty("--delay", i * 16 + "ms");
        bar.style.setProperty("--zx", zoomPair[0]);
        bar.style.setProperty("--ox", zoomPair[1]);
        frag.appendChild(bar);
      }
      barsBox.appendChild(frag);
    }

    /* --- which side is active --- */
    var tabs = stage.querySelectorAll(".ss-tab");
    var hint = document.getElementById("ssHint");
    function dismissHint() { if (hint) hint.classList.add("is-hidden"); }
    function setSide(side, remember) {
      stage.setAttribute("data-active", side);
      if (remember) pinned = side;
      tabs.forEach(function (t) {
        t.setAttribute("aria-selected", t.getAttribute("data-side") === side ? "true" : "false");
      });
    }
    setSide(DEFAULT_SIDE, true);

    tabs.forEach(function (t) {
      t.addEventListener("click", function () { dismissHint(); setSide(t.getAttribute("data-side"), true); });
    });

    // Hover previews the other side; leaving returns to whichever side is
    // pinned (the tab choice, or the default). Desktop pointers only — touch
    // has no hover, and the stacked mobile layout shows both sides outright.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      stage.querySelectorAll(".ss-panel").forEach(function (panel) {
        var side = panel.getAttribute("data-side");
        panel.addEventListener("mouseenter", function () { dismissHint(); setSide(side, false); });
        panel.addEventListener("focusin", function () { dismissHint(); setSide(side, false); });
      });
      stage.addEventListener("mouseleave", function () { setSide(pinned, false); });
    }

    /* --- the immersion veil ---
       White at rest so the section starts flush with the page background,
       dissolving to nothing as the stage pins, and fading back on the way out
       so the return to the white page is a transition rather than a cut. */
    if (veil && !reducedMotion) {
      scrollUpdaters.push(function () {
        if (window.innerWidth <= 900) { veil.style.opacity = 0; return; }
        var r = wrap.getBoundingClientRect();
        var vh = window.innerHeight;
        // 0 when the section's top is at the bottom of the viewport, 1 once pinned
        var enter = clamp((vh - r.top) / (vh * 0.75), 0, 1);
        var o = 1 - enter;
        // and back up as the tail of the section clears
        if (r.bottom < vh) o = Math.max(o, clamp((vh - r.bottom) / (vh * 0.75), 0, 1));
        veil.style.opacity = o;
      });
    } else if (veil) {
      veil.style.opacity = 0;
    }
  })();

  /* ---------------- Spectrum split mobile card reveal ----------------
     Below 900px the hover/veil mechanic is dropped entirely (see landing.css)
     and both panels render as plain stacked content, so without this the
     challenge/stat cards would just appear flat with zero motion. Scoped to
     mobile only via matchMedia so it never touches the desktop pin. */
  (function () {
    if (reducedMotion || !window.matchMedia("(max-width:900px)").matches) return;
    var els = document.querySelectorAll(".ss-card, .ss-stat");
    if (!els.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  })();

  /* ---------------- 5. How it works — fluid flow scrub ----------------
     Restored after briefly being a static grid — the user asked specifically
     to bring this back for the current 4 steps. One continuous journey
     through fluid-full.png: background-position tracks scroll progress
     across the whole pinned block while the active step steps through in
     four discrete stages. Collapses to a static stacked list under 900px /
     reduced motion / no-js (see landing.css) — a scroll-gated step that
     never activates would hide its content outright. */
  (function () {
    var wrap = document.getElementById("flow");
    if (!wrap) return;
    var fluid = wrap.querySelector(".flow-fluid");
    var steps = [], dots = [];

    function collapsed() { return reducedMotion || window.innerWidth <= 900; }

    function queryEls() {
      steps = wrap.querySelectorAll(".flow-step");
      dots = wrap.querySelectorAll(".flow-dot");
    }

    function paint(idx) {
      steps.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }

    function tick() {
      if (!steps.length) return;
      if (collapsed()) {
        steps.forEach(function (s) { s.classList.add("is-active"); });
        return;
      }
      var r = wrap.getBoundingClientRect();
      var total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var p = clamp(-r.top / total, 0, 1);

      if (fluid) fluid.style.backgroundPosition = (p * 100).toFixed(2) + "% " + (100 - p * 100).toFixed(2) + "%";

      // 0.999 so the very last pixel of scroll doesn't index past the array
      paint(Math.min(Math.floor(p * steps.length * 0.999), steps.length - 1));
    }

    queryEls();
    if (!steps.length) return;

    // A mode-copy swap (see the audience-toggle IIFE) replaces the whole
    // .flow-steps subtree with the other mode's markup — the `steps`/`dots`
    // NodeLists captured above would otherwise keep pointing at now-detached
    // nodes. Exposed so that swap can force a re-query + repaint.
    wrap.refreshFlow = function () { queryEls(); tick(); };

    tick();
    scrollUpdaters.push(tick);
  })();

  /* ---------------- Testimonials parallax ---------------- */
  (function () {
    var bg = document.querySelector(".t-bg");
    var section = document.querySelector(".testimonials");
    if (!bg || !section || reducedMotion) return;
    scrollUpdaters.push(function () {
      var r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      // drift relative to how far the section has travelled through the viewport
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      bg.style.transform = "translateY(" + (p * 60 - 30).toFixed(1) + "px)";
    });
  })();

  /* ---------------- 6. Testimonials carousel ----------------
     True infinite loop: a clone of the last card sits before the first, and
     a clone of the first sits after the last, so advancing past either end
     keeps sliding in the same direction instead of jumping back across the
     rail. `slot` indexes into the cloned DOM order (0 and slides.length-1
     are the two clone positions); landing on a clone after an animated move
     triggers a silent, transition-less snap to the pixel-identical real
     card, so the loop reads as continuous with no visible jump. The
     highlighted card is the one centred in the viewport; arrows/dots/
     keyboard move the selection, and it auto-advances every 4s until the
     reader engages (hover, focus, or an explicit control). */
  (function () {
    var root = document.getElementById("testimonials");
    if (!root) return;
    var viewport = root.querySelector(".t-viewport");
    var track = root.querySelector(".t-track");
    var originalCards = Array.prototype.slice.call(root.querySelectorAll(".t-card"));
    var dots = root.querySelectorAll(".t-dot");
    var prevBtn = root.querySelector(".t-prev");
    var nextBtn = root.querySelector(".t-next");
    if (!track || !originalCards.length) return;

    var N = originalCards.length;
    var lastClone = originalCards[N - 1].cloneNode(true);
    var firstClone = originalCards[0].cloneNode(true);
    lastClone.setAttribute("aria-hidden", "true");
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.classList.remove("is-active");
    firstClone.classList.remove("is-active");
    track.insertBefore(lastClone, originalCards[0]);
    track.appendChild(firstClone);
    var slides = [lastClone].concat(originalCards, [firstClone]);

    var slot = 1; // 1..N are real cards; 0 and slides.length-1 are clones
    var AUTO_MS = 4000;
    var timer = null;
    var moving = false;

    function realIndexOf(s) {
      if (s === 0) return N - 1;
      if (s === slides.length - 1) return 0;
      return s - 1;
    }

    // Padding the track itself (not the viewport) by half a card's worth of
    // empty space on each side means even the first and last real card have
    // room to reach dead centre — without it, centring one of them would
    // require scrolling past the end of the track, so an end-clamp would
    // silently leave it pinned at the edge instead of centred.
    function updateEdgePadding() {
      // offsetWidth, not getBoundingClientRect() — the inactive-card
      // transform:scale(.9) shrinks the *rendered* rect but not the layout
      // box, and centring below uses offsetLeft/offsetWidth (also
      // transform-independent). Measuring the two with different yardsticks
      // was exactly why only the always-scale(1)-at-measurement-time card
      // centred correctly and the rest didn't.
      var cardW = originalCards[0].offsetWidth;
      var pad = Math.max(0, (viewport.clientWidth - cardW) / 2);
      track.style.paddingLeft = pad + "px";
      track.style.paddingRight = pad + "px";
    }

    function paint() {
      var realIdx = realIndexOf(slot);
      originalCards.forEach(function (c, i) { c.classList.toggle("is-active", i === realIdx); });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === realIdx);
        d.setAttribute("aria-current", i === realIdx ? "true" : "false");
      });
    }

    function center(s, animate) {
      var card = slides[s];
      var shift = card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
      if (!animate) track.style.transition = "none";
      track.style.transform = "translateX(" + -shift + "px)";
      if (!animate) {
        void track.offsetHeight; // force reflow so the jump is instantaneous
        track.style.transition = "";
      }
    }

    function goToSlot(s, animate) {
      slot = s;
      paint();
      center(slot, animate !== false);
    }

    // after animating onto a clone, snap invisibly to the matching real card
    track.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "transform") return;
      if (slot === 0) { slot = slides.length - 2; goToSlot(slot, false); }
      else if (slot === slides.length - 1) { slot = 1; goToSlot(slot, false); }
      moving = false;
    });

    function go(dir) {
      if (moving) return;
      moving = true;
      goToSlot(slot + dir, true);
    }
    function goToReal(realIdx) {
      if (moving) return;
      moving = true;
      goToSlot(realIdx + 1, true);
    }

    function start() {
      if (reducedMotion || timer) return;
      timer = setInterval(function () { go(1); }, AUTO_MS);
    }
    function stop() { clearInterval(timer); timer = null; }

    if (prevBtn) prevBtn.addEventListener("click", function () { stop(); go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stop(); go(1); });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { stop(); goToReal(i); });
    });

    // pause while the reader is engaged, resume when they leave
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);

    // keyboard support on the rail itself
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { stop(); go(-1); }
      else if (e.key === "ArrowRight") { stop(); go(1); }
    });

    // mobile swipe hint — fades permanently after the first touch, so it
    // doesn't linger once the gesture's been discovered
    var swipeHint = document.getElementById("tSwipeHint");

    // real swipe navigation — the hint promises "swipe to browse", so touch
    // needs to actually move the rail, not just tap the arrows/dots. Tracks
    // one finger; a mostly-horizontal drag past SWIPE_THRESHOLD advances/
    // retreats a slot exactly like the arrow buttons (same clone-snap loop).
    var SWIPE_THRESHOLD = 40;
    var touchStartX = 0, touchStartY = 0, touchDX = 0, touchDY = 0, touching = false;
    viewport.addEventListener("touchstart", function (e) {
      if (swipeHint) swipeHint.classList.add("is-hidden");
      if (e.touches.length !== 1) return;
      touching = true;
      touchDX = 0; touchDY = 0;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stop();
    }, { passive: true });
    viewport.addEventListener("touchmove", function (e) {
      if (!touching || e.touches.length !== 1) return;
      touchDX = e.touches[0].clientX - touchStartX;
      touchDY = e.touches[0].clientY - touchStartY;
    }, { passive: true });
    viewport.addEventListener("touchend", function () {
      if (!touching) return;
      touching = false;
      // require a mostly-horizontal drag so a vertical page-scroll gesture
      // that happens to start over the rail never gets mistaken for a swipe
      if (Math.abs(touchDX) > SWIPE_THRESHOLD && Math.abs(touchDX) > Math.abs(touchDY)) {
        go(touchDX < 0 ? 1 : -1);
      }
    });

    window.addEventListener("resize", function () { updateEdgePadding(); goToSlot(slot, false); });
    updateEdgePadding();
    goToSlot(1, false);
    start();
  })();

  /* ---------------- Featured-challenge countdown ----------------
     A real ticking clock against a PLACEHOLDER deadline: hours-from-page-load
     rather than a fixed calendar date, since there's no live challenge data
     yet — see the HTML comment on .ss-countdown for what to change once there
     is. Not gated by reducedMotion: this is a live data readout that updates
     its own text, not a CSS/decorative animation, and the HTML already
     pre-renders a sane starting value so no-js visitors see that and nothing
     ever depends on this running. */
  (function () {
    var el = document.querySelector("[data-countdown-hours]");
    if (!el) return;
    var hours = parseFloat(el.getAttribute("data-countdown-hours")) || 0;
    var deadline = Date.now() + hours * 3600000;
    var dEl = el.querySelector('[data-cd="d"]');
    var hEl = el.querySelector('[data-cd="h"]');
    var mEl = el.querySelector('[data-cd="m"]');
    var sEl = el.querySelector('[data-cd="s"]');
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

  /* Footer "get notified" capture — front end only, same honesty rule as
     login.html/signup.html (see assets/site.js): an empty data-endpoint
     means it says the wiring is pending instead of faking a success. */
  (function () {
    var form = document.getElementById("footerNotify");
    if (!form) return;
    var msg = form.querySelector(".footer-notify-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("data-endpoint");
      msg.classList.add("is-pending");
      if (!endpoint) {
        msg.textContent = "Not connected yet — this form is the finished front end, waiting on the API.";
        return;
      }
      msg.textContent = "Thanks — you’re on the list.";
    });
  })();

  onScroll(); // paint every scroll-linked effect at its correct initial value
})();
