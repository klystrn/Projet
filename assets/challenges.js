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
    var empty = document.getElementById("clEmpty");
    var count = document.getElementById("clCount");
    var current = "all";

    function apply(value) {
      var shown = 0;
      current = value;
      // Queried live rather than cached at setup: renderChallenges() below
      // can replace every card in this grid, and a cached NodeList would
      // leave the filter driving detached nodes.
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".cl-card"));

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

    // re-run the active filter over freshly rendered cards
    grid.addEventListener("projet:rendered", function () { apply(current); });
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
    var coEl = document.getElementById("cmCo");
    var statusEl = document.getElementById("cmStatus");
    var postedEl = document.getElementById("cmPosted");
    var effortEl = document.getElementById("cmEffort");
    var skillsEl = document.getElementById("cmSkills");
    var formatEl = document.getElementById("cmFormat");
    var heatEl = document.getElementById("cmHeat");
    var heatNoteEl = document.getElementById("cmHeatNote");
    var titleEl = document.getElementById("cmTitle");
    var bodyEl = document.getElementById("cmBody");
    var fillEl = document.getElementById("cmFillIn");
    var submittedEl = document.getElementById("cmSubmitted");
    var deadlineEl = document.getElementById("cmDeadline");

    // remembered so Escape hands the focus ring back only to a keyboard
    // opener — see suppressReturnRing() in landing.js for the full reasoning
    var lastTrigger = null, pointerOpened = false;

    /* Delegated off the grid rather than bound per button: renderChallenges()
       can swap the whole card set out, and per-button listeners would go with
       the nodes they were attached to. */
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".cl-view-brief");
      if (btn && grid.contains(btn)) {
        var card = btn.closest(".cl-card");
        if (!card) return;
        pointerOpened = e.detail > 0;
        lastTrigger = btn;
        var discipline = card.getAttribute("data-brief-discipline") || "";
        var company = card.getAttribute("data-brief-company") || "";
        var submitted = parseInt(card.getAttribute("data-brief-submitted"), 10) || 0;
        var cardFill = card.querySelector(".cl-fill-in");

        // two separate fields now, not one string joined by a middot
        tagEl.textContent = discipline;
        coEl.textContent = company;
        statusEl.textContent = card.getAttribute("data-brief-status-label") || "Open";
        statusEl.setAttribute("data-status", card.getAttribute("data-brief-status") || "open");
        titleEl.textContent = card.getAttribute("data-brief-title") || "";
        bodyEl.textContent = card.getAttribute("data-brief-body") || "";
        // mirrors the card's own timeline fill exactly rather than
        // recomputing it, since there's no submission cap to derive it from
        fillEl.style.width = cardFill ? cardFill.style.width : "0%";
        submittedEl.textContent = submitted;
        deadlineEl.textContent = card.getAttribute("data-brief-deadline") || "";
        postedEl.textContent = card.getAttribute("data-brief-posted") || "\u2014";
        effortEl.textContent = card.getAttribute("data-brief-effort") || "\u2014";
        skillsEl.textContent = card.getAttribute("data-brief-skills") || "\u2014";
        formatEl.textContent = card.getAttribute("data-brief-format") || "\u2014";

        /* Rebuilt from scratch on every open rather than reusing the last
           card's cells: the levels differ per brief, and a stale cell left
           over from a previous open would be a silently wrong data point,
           not just a cosmetic glitch. */
        var activity = (card.getAttribute("data-brief-activity") || "").split(",")
          .map(function (n) { return Math.max(0, Math.min(4, parseInt(n, 10) || 0)); });
        heatEl.textContent = "";
        var busiest = 0, quiet = 0;
        activity.forEach(function (level) {
          var cell = document.createElement("i");
          cell.setAttribute("data-lv", level);
          heatEl.appendChild(cell);
          if (level > busiest) busiest = level;
          if (level === 0) quiet++;
        });
        // the same information as the grid, in a sentence, so the chart is
        // never the only way to get at it
        heatNoteEl.textContent = activity.length
          ? "Last " + activity.length + " days. Busiest day: " + busiest +
            " submission" + (busiest === 1 ? "" : "s") + ". " +
            quiet + " day" + (quiet === 1 ? "" : "s") + " with none."
          : "";

        modal.showModal();
      }
    });

    closeBtn.addEventListener("click", function () { modal.close(); });
    // clicking the ::backdrop (a click landing directly on the <dialog>
    // element itself, not any of its children) closes it too
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
    // Escape path only, and before the dialog restores focus — the "close"
    // event is too late, the ring has already painted by then.
    modal.addEventListener("cancel", function () {
      var s = window.ProjetUI && window.ProjetUI.suppressReturnRing;
      if (pointerOpened && s) s(lastTrigger);
    });
  })();

  /* ---------------- live listing (BACKEND SEAM) ----------------
     Inert until #clGrid carries a non-empty data-endpoint, which is the same
     convention every other seam on this site uses (the auth forms, the footer
     capture, the dashboard). With it empty, the twelve sample cards already
     in the HTML are what the reader sees, so this page is fully readable
     before the API exists and stays readable if the API is down.

     Expected response — the front end reads these keys and nothing else:

       { "challenges": [ {
           "id": "nordwave-pricing",
           "title": "Rebuild the pricing page conversion flow",
           "company": "Nordwave",
           "discipline": "Product",          // display case
           "category": "product",            // filter key, lowercase
           "status": "open",                 // new | open | filling | closing
           "statusLabel": "Open",
           "summary": "One or two lines for the card.",
           "body": "The full brief, shown in the modal.",
           "deadline": "6 days left",
           "submitted": 14,
           "progress": 37,                   // percent, drives the fill bar
           "posted": "14 days ago",
           "effort": "8-12 hrs",
           "skills": "Product sense, Analytics",
           "format": "Async, individual",
           "activity": [1,2,1,0,0,2,0,1,1,1,1,1,0,1]   // 14 days, levels 0-4
         } ] }

     A failed request, a non-2xx, or a malformed body all leave the existing
     cards untouched on purpose: replacing a readable list with an error state
     would be strictly worse than showing the list that is already there. */
  function renderChallenges(items) {
    var frag = document.createDocumentFragment();

    items.forEach(function (c) {
      var card = document.createElement("article");
      card.className = "cl-card";
      card.setAttribute("data-category", String(c.category || "").toLowerCase());
      var attrs = {
        title: c.title, company: c.company, discipline: c.discipline,
        deadline: c.deadline, submitted: c.submitted, body: c.body,
        status: c.status, "status-label": c.statusLabel,
        posted: c.posted, effort: c.effort, skills: c.skills,
        format: c.format,
        activity: Array.isArray(c.activity) ? c.activity.join(",") : ""
      };
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] != null && attrs[k] !== "") card.setAttribute("data-brief-" + k, attrs[k]);
      });

      // built node by node rather than with an innerHTML template: every
      // value here is server data, and textContent cannot be talked into
      // executing anything the way an interpolated HTML string can.
      var top = el("div", "cl-card-top");
      top.appendChild(el("span", "cl-tag", c.discipline));
      top.appendChild(el("span", "cl-co", c.company));
      var pill = el("span", "cl-pill", c.statusLabel || "Open");
      pill.setAttribute("data-status", c.status || "open");
      top.appendChild(pill);

      var fill = el("div", "cl-fill");
      var fillIn = el("div", "cl-fill-in");
      fillIn.style.width = Math.max(0, Math.min(100, Number(c.progress) || 0)) + "%";
      fill.appendChild(fillIn);

      var meta = el("div", "cl-meta");
      meta.appendChild(el("span", "cl-deadline", c.deadline));
      meta.appendChild(el("span", "", c.submitted + " submitted"));

      var btn = el("button", "cl-view-brief", "View brief");
      btn.type = "button";

      card.appendChild(top);
      card.appendChild(el("h2", "", c.title));
      card.appendChild(el("p", "", c.summary));
      card.appendChild(fill);
      card.appendChild(meta);
      card.appendChild(btn);
      frag.appendChild(card);
    });

    grid.textContent = "";
    grid.appendChild(frag);
    // these are real listings now, so the sample-brief banner has to go
    var notice = document.querySelector(".cl-notice");
    if (notice) notice.hidden = true;
    grid.removeAttribute("data-placeholder");
    grid.dispatchEvent(new CustomEvent("projet:rendered"));
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  (function () {
    var endpoint = grid.getAttribute("data-endpoint");
    if (!endpoint) return;
    fetch(endpoint, { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (data) {
        if (data && Array.isArray(data.challenges) && data.challenges.length) {
          renderChallenges(data.challenges);
        }
      })
      .catch(function () { /* keep whatever is already on the page */ });
  })();
})();
