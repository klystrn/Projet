(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  var split = document.getElementById("split");
  var barsContainer = document.getElementById("bars");
  var panels = document.querySelectorAll(".panel");

  /* ---------- Build the stripe out of individual bars ----------
     The spectrum image already reads as a stack of horizontal bands,
     so each bar is one full-width slice of it, positioned with a
     background-position offset so the whole stack reassembles into
     one continuous image at rest. */
  var BAR_COUNT = 14;

  function buildBars() {
    if (!barsContainer) return;
    barsContainer.style.setProperty("--n", BAR_COUNT);
    barsContainer.innerHTML = "";

    for (var i = 0; i < BAR_COUNT; i++) {
      var bar = document.createElement("div");
      bar.className = "bar";

      // Amplitude bulges toward the middle bars so the shear reads as
      // a wave rather than a flat shift — an organic cascade, not a slide.
      var amp = 16 + Math.round(34 * Math.sin((i / (BAR_COUNT - 1)) * Math.PI));
      // Delay steps down the stack so bars visibly cascade one after
      // another instead of moving as a single rigid block.
      var delay = i * 16;

      bar.style.setProperty("--i", i);
      bar.style.setProperty("--amp", amp + "px");
      bar.style.setProperty("--delay", delay + "ms");
      barsContainer.appendChild(bar);
    }
  }

  buildBars();

  /* ---------- Hover / focus drives which side the bars shear away from ---------- */
  panels.forEach(function (panel) {
    var audience = panel.getAttribute("data-audience");

    panel.addEventListener("mouseenter", function () {
      if (!isTouch) split.setAttribute("data-hover", audience);
    });
    panel.addEventListener("mouseleave", function () {
      if (!isTouch) split.removeAttribute("data-hover");
    });
    panel.addEventListener("focus", function () {
      split.setAttribute("data-hover", audience);
    });
    panel.addEventListener("blur", function () {
      split.removeAttribute("data-hover");
    });
  });

  /* ---------- Touch: first tap previews (bars shear, panel grows), ----------
     second tap — or tapping the CTA directly — follows the link. */
  if (isTouch) {
    panels.forEach(function (panel) {
      var audience = panel.getAttribute("data-audience");

      panel.addEventListener(
        "click",
        function (e) {
          var alreadyPreviewed = split.getAttribute("data-hover") === audience;
          var hitCta = e.target.closest(".panel-cta");

          if (alreadyPreviewed || hitCta) {
            return; // let the link navigate
          }

          e.preventDefault();
          split.setAttribute("data-hover", audience);
        },
        { passive: false }
      );
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".panel")) {
        split.removeAttribute("data-hover");
      }
    });
  }
})();
