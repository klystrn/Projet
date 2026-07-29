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

  /* True only for focus that should behave like hover (keyboard tabbing),
     not the incidental focus a touch tap puts on a link. */
  function keyboardFocused(el) {
    try {
      return el.matches(":focus-visible");
    } catch (e) {
      return !isTouch; // pre-:focus-visible browsers: assume mouse/keyboard
    }
  }

  /* ---------- Hover / focus drives which side the bars shear away from ---------- */
  panels.forEach(function (panel) {
    var audience = panel.getAttribute("data-audience");

    panel.addEventListener("mouseenter", function () {
      if (!isTouch) split.setAttribute("data-hover", audience);
    });
    panel.addEventListener("mouseleave", function () {
      if (!isTouch) split.removeAttribute("data-hover");
    });
    /* Keyboard focus mirrors hover. Guarded by :focus-visible because tapping
       a link on touch also focuses it — and firing this on tap would mark the
       panel "already previewed" before the click handler below runs, so the
       first tap would navigate instead of previewing. */
    panel.addEventListener("focus", function () {
      if (!keyboardFocused(panel)) return;
      split.setAttribute("data-hover", audience);
    });
    panel.addEventListener("blur", function () {
      split.removeAttribute("data-hover");
    });
  });

  /* ---------- Touch ----------
     No preview step here: on touch both panels already show their copy (see
     styles.css), so a tap is an unambiguous choice and follows the link
     natively. An intercepted first tap would read as a dead tap on the one
     screen whose entire job is letting someone pick a side.

     We only light the chosen side up briefly, so the tap is acknowledged
     while the next page loads. */
  if (isTouch) {
    panels.forEach(function (panel) {
      var audience = panel.getAttribute("data-audience");
      panel.addEventListener(
        "touchstart",
        function () {
          split.setAttribute("data-hover", audience);
        },
        { passive: true }
      );
    });
  }
})();
