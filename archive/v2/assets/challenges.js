/* ==========================================================================
   Projet — challenges.html
   Runs alongside assets/landing.js, which already owns the shared chrome
   (mobile menu, audience mode toggle, nav compaction). This file only adds
   the listing's discipline filter.

   Progressive enhancement, same rule as the rest of the site: every card is
   rendered visible in the HTML. If this never runs, the filter bar is hidden
   by CSS (.no-js .ch-filters) and the reader still sees the full list.
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("chGrid");
  if (!grid) return;

  var filters = Array.prototype.slice.call(document.querySelectorAll(".ch-filter"));
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".ch-card"));
  var empty = document.getElementById("chEmpty");
  var count = document.getElementById("chCount");

  function apply(value) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = value === "all" || card.getAttribute("data-category") === value;
      // hidden, not just visually gone: a filtered-out card must leave the
      // accessibility tree and the tab order too, not linger invisibly.
      card.hidden = !match;
      if (match) shown++;
    });

    filters.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === value ? "true" : "false");
    });

    if (empty) empty.classList.toggle("is-shown", shown === 0);
    // aria-live on #chCount announces this, so a screen-reader user gets told
    // the list changed size instead of silently losing rows.
    if (count) count.textContent = shown === 1 ? "1 challenge" : shown + " challenges";
  }

  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      apply(b.getAttribute("data-filter"));
    });
  });
})();
