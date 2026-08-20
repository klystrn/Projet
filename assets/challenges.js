/* ==========================================================================
   Projet — challenges.html
   Runs alongside assets/landing.js, which already owns the shared chrome
   (mobile menu, audience mode toggle, nav compaction). This file owns the
   listing's discipline filter and the "View brief" modal.

   Progressive enhancement, same rule as the rest of the site: every card is
   rendered visible in the HTML with its own fill bar, counts and short
   description. If this never runs, the filter bar and "View brief" buttons
   are hidden by CSS (.no-js .cl-filters / .cl-view-brief) and the reader
   still sees the full list with everything the modal would have added,
   short of the longer body copy.
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("clGrid");
  if (!grid) return;

  /* ---------------- discipline filter ---------------- */
  (function () {
    var filters = Array.prototype.slice.call(document.querySelectorAll(".cl-filter"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".cl-card"));
    var empty = document.getElementById("clEmpty");
    var count = document.getElementById("clCount");

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
      // aria-live on #clCount announces this, so a screen-reader user gets told
      // the list changed size instead of silently losing rows.
      if (count) count.textContent = shown === 1 ? "1 challenge" : shown + " challenges";
    }

    filters.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-filter"));
      });
    });
  })();

  /* ---------------- "View brief" modal ----------------
     Native <dialog> — showModal()/close() give focus-trapping, ESC-to-close
     and a real ::backdrop for free. Each card carries its own full brief as
     data-brief-* attributes, read fresh on every click rather than cached,
     so this works whichever card (visible after filtering) was clicked. */
  (function () {
    var modal = document.getElementById("clModal");
    if (!modal || typeof modal.showModal !== "function") return;

    var closeBtn = document.getElementById("cmClose");
    var tagEl = document.getElementById("cmTag");
    var titleEl = document.getElementById("cmTitle");
    var bodyEl = document.getElementById("cmBody");
    var fillEl = document.getElementById("cmFillIn");
    var submittedEl = document.getElementById("cmSubmitted");
    var spotsEl = document.getElementById("cmSpots");
    var deadlineEl = document.getElementById("cmDeadline");

    grid.querySelectorAll(".cl-view-brief").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".cl-card");
        if (!card) return;
        var discipline = card.getAttribute("data-brief-discipline") || "";
        var company = card.getAttribute("data-brief-company") || "";
        var submitted = parseInt(card.getAttribute("data-brief-submitted"), 10) || 0;
        var spots = parseInt(card.getAttribute("data-brief-spots"), 10) || 0;

        tagEl.textContent = discipline + (company ? " · " + company : "");
        titleEl.textContent = card.getAttribute("data-brief-title") || "";
        bodyEl.textContent = card.getAttribute("data-brief-body") || "";
        fillEl.style.width = (spots > 0 ? Math.round((submitted / spots) * 100) : 0) + "%";
        submittedEl.textContent = submitted;
        spotsEl.textContent = spots;
        deadlineEl.textContent = card.getAttribute("data-brief-deadline") || "";

        modal.showModal();
      });
    });

    closeBtn.addEventListener("click", function () { modal.close(); });
    // clicking the ::backdrop (a click landing directly on the <dialog>
    // element itself, not any of its children) closes it too
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
  })();
})();
