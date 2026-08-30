/* ==========================================================================
   Projet — split-spectrum auth stage (login.html / signup.html)

   Runs alongside site.js, which owns the forms themselves (validation, the
   error/pending states, the data-endpoint POST). This file owns only the
   stage: building the spectrum bars and switching which mode is dominant.

   Progressive enhancement, same rule as everywhere else on the site: if this
   never runs, .no-js in auth.css expands BOTH panels and shows BOTH forms,
   so a visitor without JS gets two working forms rather than one form and an
   unreachable prompt. Nothing here is load-bearing for actually signing in.
   ========================================================================== */
(function () {
  "use strict";

  var stage = document.getElementById("authSplit");
  if (!stage) return;

  var barsBox = document.getElementById("asBars");
  var panels = stage.querySelectorAll(".as-panel");

  /* ---------------- build the spectrum bars ----------------
     Lifted from the v2 landing page's own split (archive/v2/assets/
     landing.js). The table is sampled from assets/spectrum.webp at each
     bar's row and solves for the scale + horizontal shift that re-centres
     that row's slice of the diagonal colour band inside the bar. It is
     specific to THIS image: if spectrum.webp is ever re-exported these 14
     [zoom, offsetK] pairs must be regenerated or the wave goes black and
     misaligned again. See the CSS comment on .as-bar for how they're used. */
  var BAR_COUNT = 14;
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
      bar.className = "as-bar";
      // amplitude bulges toward the middle bars so the shear reads as a wave
      // travelling down the seam, not a flat block sliding sideways
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

  /* ---------------- which mode is dominant ----------------
     The page ships with its own data-mode already set (login.html sends
     "login", signup.html sends "signup"), so the first paint is correct
     with no flash and this only has to handle changes. */
  function setMode(mode, focusForm) {
    stage.setAttribute("data-mode", mode);
    // Plain action buttons, not a tab or toggle pattern. role="tab" would
    // promise a tabpanel swap that isn't what happens here, and aria-pressed
    // would describe a switch that is only ever visible in one of its two
    // states — each button just says what it does ("Log in instead").
    panels.forEach(function (p) {
      p.classList.toggle("is-collapsed", p.getAttribute("data-mode-panel") !== mode);
    });

    // Reflect the choice in the URL without navigating, so a reload, a
    // back-button press or a copied link lands on the same mode the reader
    // was actually looking at. replaceState, not pushState: switching modes
    // is not a destination, and stacking history entries would make Back
    // walk through toggles instead of leaving the page.
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState({}, "", url);
    } catch (e) { /* older browsers: the mode still switches, just no URL */ }

    if (focusForm) {
      // Move focus into the form that just became active. Scoped to .as-form
      // specifically, not the whole panel: the panel also still contains its
      // own (now-hidden) .as-prompt earlier in the DOM, and a plain
      // querySelector("input, button, select") on the panel matched the
      // prompt's own switch button first — a visibility:hidden element,
      // which silently swallows .focus() and left focus stranded on <body>.
      var activeForm = stage.querySelector('.as-panel[data-mode-panel="' + mode + '"] .as-form');
      var first = activeForm && activeForm.querySelector("input, button, select");
      if (first) first.focus();
    }
  }

  // ?mode= wins over the page's own default, so signup.html?mode=login and
  // login.html?mode=signup both resolve the way the link asked for.
  var requested = new URLSearchParams(window.location.search).get("mode");
  if (requested === "login" || requested === "signup") setMode(requested, false);
  else setMode(stage.getAttribute("data-mode") || "login", false);

  /* ---------------- the switch ----------------
     Two ways in, deliberately: the whole collapsed panel is a click target
     (it is a large, obvious thing to click at), and it also carries a real
     <button> so the same action is reachable by keyboard and announced to a
     screen reader. A clickable panel alone would be neither. */
  stage.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-goto-mode]");
    if (trigger) {
      setMode(trigger.getAttribute("data-goto-mode"), true);
      return;
    }
    var panel = e.target.closest(".as-panel");
    if (panel && panel.classList.contains("is-collapsed")) {
      setMode(panel.getAttribute("data-mode-panel"), true);
    }
  });
})();
