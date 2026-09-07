/* ==========================================================================
   Projet — dashboard.html

   Runs alongside assets/landing.js, which owns the shared chrome (mobile
   menu, audience toggle, nav compaction). This file owns only the dashboard:
   which view is showing, and the company view's candidate filter.

   FRONT END ONLY. Every value on the page is sample data.

   BACKEND HOOKS (Andrei) — five seams, nothing else to rewire:

   1. WHICH VIEW.  Right now the view comes from ?view=student|company, else
      the saved audience mode. There is no view switch on this page at all
      any more: reaching the dashboard means you are signed in, so the
      audience is a fact about the account rather than a preference, and the
      nav's For students / For companies toggle is deliberately absent here.
      Once auth exists, call setView(roleFromSession) directly instead of
      reading ?view=. setView() is also what re-tints the page, by setting
      html[data-audience] — nothing else needs to know about the role.

   2. PROFILE + LISTS.  Set data-endpoint on <body class="dash-page"> and
      this file will fetch it and fill the slots. Suggested shape — the
      front end reads these keys and nothing else:

        {
          "role": "student" | "company",
          "profile": { "initials": "CL", "name": "Chloe Lim",
                       "handle": "@chloelim", "bio": "...",
                       "org": "SUTD · Year 3", "loc": "Singapore",
                       "joined": "Joined February 2026",
                       "tagsLabel": "Skills", "tags": ["Figma", "A11y"],
                       "stats": [{ "label": "Avg. score", "value": "83" }] },
          "metrics": [{ "value": "85", "label": "Latest score" }],
          "entries": [ ... ]        // student: past challenges
          "candidates": [ ... ]     // company: ranked submissions
        }

      An empty `entries` array is what should drive the student empty state —
      showEmpty(true) below already handles the swap.

   3. ENTRY DETAIL.  Each past-hackathon row carries its whole modal payload
      as data-hk-* attributes (title, company, discipline, date, rank,
      entrants, score, fit, status, status-kind, solution, breakdown,
      feedback), read fresh on every open. Render those attributes from the
      API and the modal needs no changes. `breakdown` is a comma-separated
      "Label:score" list.

   4. HEATMAP.  buildHeat() currently fills the grid from a seeded PRNG so
      the sample history is at least stable across reloads. Replace its body
      with real per-day counts: it wants 53 weeks x 7 days of {level 0-4,
      count, date} per cell, oldest first, column by column — level drives
      the colour, count and date drive the hover tooltip, and both should
      agree (a real API naturally keeps them consistent since they come
      from the same row; the sample data derives count from the same draw
      that picked level for exactly that reason). The heading text is
      derived from the summed counts, so it stays correct for free.

   5. COMPANY OVERVIEW.  The company view carries its own charts: a hiring
      funnel, a 12-month submissions column chart, a per-brief table and a
      discipline split. All of them are plain elements sized by percentage
      (no charting library), and all of their figures are derived from the
      same brief table, so they cannot contradict each other. Feed them from
      the API the same way — the funnel wants stage counts, the columns want
      12 monthly counts, the table wants a row per brief, the split wants
      per-discipline shares. buildHeat()'s targetTotal is what keeps the
      heatmap's own heading agreeing with the submissions figure beside it.

   6. ACTIONS + PROFILE EDITS.  The Schedule / Compare / Book interviews /
      View submission buttons are inert placeholders (href="#"). The Edit
      profile dialog is deliberately real but local: it writes to
      localStorage["projet:profile"] and says so in its own copy. Point it
      at a PATCH endpoint and delete the localStorage read/write — the
      re-apply hook (reapplyProfileEdits) is the only other thing it
      touches.
   ========================================================================== */
(function () {
  "use strict";

  var body = document.body;
  if (!body || !body.classList.contains("dash-page")) return;

  var viewStudent = document.getElementById("viewStudent");
  var viewStudentEmpty = document.getElementById("viewStudentEmpty");
  var viewCompany = document.getElementById("viewCompany");

  var avatar = document.getElementById("dpAvatar");
  var nameEl = document.getElementById("dpName");
  var subEl = document.getElementById("dpSub");
  var tagsEl = document.getElementById("dpTags");
  var railStats = document.getElementById("dpRailStats");
  var railCta = document.getElementById("dpRailCta");

  // sample profiles, one per view — replaced wholesale by a real API response
  var PROFILES = {
    student: {
      initials: "CL",
      name: "Chloe Lim",
      sub: "SUTD · Year 3 Design & AI",
      handle: "@chloelim",
      bio: "Design engineer in training. I like interfaces that survive contact with real users.",
      org: "SUTD · Year 3 Design & AI",
      loc: "Singapore",
      joined: "Joined February 2026",
      tagsLabel: "Skills",
      tags: ["Figma", "Front-end", "A11y"],
      stats: [
        { label: "Challenges done", value: "3" },
        { label: "Avg. score", value: "83" },
        { label: "Best rank", value: "#2" }
      ],
      cta: "Edit profile"
    },
    company: {
      initials: "NW",
      name: "Nordwave",
      sub: "Hiring · 3 open briefs",
      handle: "@nordwave",
      bio: "Series A team in Singapore. We post briefs straight off our own backlog.",
      org: "Nordwave · Product & Platform",
      loc: "Singapore",
      joined: "Joined January 2026",
      tagsLabel: "Hiring for",
      tags: ["Product", "Front-end"],
      stats: [
        { label: "Open briefs", value: "3" },
        { label: "Submissions", value: "96" },
        { label: "Hires made", value: "2" }
      ],
      cta: "Post a challenge"
    }
  };

  var currentView = "student";

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  /* Set by the edit-profile block below. setProfile() paints the sample (or
     API) profile into the rail, so any locally-saved edit has to be
     re-applied on top of it afterwards or a role switch would silently
     revert the visitor's own changes. A hook here rather than wrapping the
     public ProjetDashboard.setView: that object is assigned at the very end
     of this file and would overwrite any wrapper installed before it. */
  var reapplyProfileEdits = null;

  function setProfile(p) {
    if (avatar) avatar.textContent = p.initials;
    if (nameEl) nameEl.textContent = p.name;
    if (subEl) subEl.textContent = p.sub;
    setText("dpHandle", p.handle);
    setText("dpBio", p.bio);
    setText("dpDetOrg", p.org);
    setText("dpDetLoc", p.loc);
    setText("dpDetJoined", p.joined);
    setText("dpTagsH", p.tagsLabel);
    if (tagsEl) {
      tagsEl.innerHTML = "";
      p.tags.forEach(function (t) {
        var s = document.createElement("span");
        s.className = "dp-tag";
        s.textContent = t;
        tagsEl.appendChild(s);
      });
    }
    if (railStats) {
      railStats.innerHTML = "";
      p.stats.forEach(function (st) {
        var row = document.createElement("div");
        row.className = "dp-stat";
        var label = document.createElement("span");
        label.textContent = st.label;
        var val = document.createElement("b");
        val.textContent = st.value;
        row.appendChild(label);
        row.appendChild(val);
        railStats.appendChild(row);
      });
    }
    if (railCta) railCta.textContent = p.cta;
    if (reapplyProfileEdits) reapplyProfileEdits();
  }

  /* Student empty state. Exposed so a real API can flip it from an empty
     entries array without touching anything else. */
  var studentIsEmpty = false;
  function showEmpty(isEmpty) {
    studentIsEmpty = !!isEmpty;
    if (currentView !== "student") return;
    if (viewStudent) viewStudent.hidden = studentIsEmpty;
    if (viewStudentEmpty) viewStudentEmpty.hidden = !studentIsEmpty;
  }

  function setView(view) {
    currentView = view === "company" ? "company" : "student";
    var isCompany = currentView === "company";

    if (viewCompany) viewCompany.hidden = !isCompany;
    if (viewStudent) viewStudent.hidden = isCompany || studentIsEmpty;
    if (viewStudentEmpty) viewStudentEmpty.hidden = isCompany || !studentIsEmpty;

    setProfile(PROFILES[currentView]);

    /* Reaching this page means you are signed in, so the audience is a
       property of the ACCOUNT, not a preference to toggle — the nav's
       For students / For companies switch is deliberately absent here (see
       dashboard.html). Setting the attribute is therefore the only thing
       that re-tints the page, and it has to happen after landing.js has
       applied whatever was in localStorage on load; this file loads second,
       so it wins.

       Deliberately does NOT write projet:audience back. The visitor's
       marketing-site preference is theirs; their account role should not
       silently overwrite it just because they opened their dashboard. */
    document.documentElement.setAttribute("data-audience", isCompany ? "business" : "builder");

    // the heatmap re-seeds per role: different totals, different story
    buildHeat(isCompany);

    /* The activity feed is role-specific too. Before this the company view
       showed the student's own history ("Scored 85, ranked #4") because
       there was only one feed in the markup — a company account tracks
       brief- and candidate-level events instead. */
    var feedStudent = document.getElementById("dpFeedStudent");
    var feedCompany = document.getElementById("dpFeedCompany");
    if (feedStudent) feedStudent.hidden = isCompany;
    if (feedCompany) feedCompany.hidden = !isCompany;
    setText("dpActTitle", isCompany ? "Workspace activity" : "Recent activity");
    var shownFeed = isCompany ? feedCompany : feedStudent;
    if (shownFeed) setText("dpActCount", shownFeed.children.length + " events");

    var url = new URL(window.location.href);
    url.searchParams.set("view", currentView);
    history.replaceState(null, "", url);
  }

  // initial view: ?view= wins, else the saved audience mode, else student
  (function () {
    var param = new URLSearchParams(window.location.search).get("view");
    if (param === "company" || param === "student") {
      setView(param);
      return;
    }
    var saved = null;
    try { saved = localStorage.getItem("projet:audience"); } catch (e) { /* ignore */ }
    setView(saved === "business" ? "company" : "student");
  })();


  /* ---------------- company view: candidate filter ----------------
     Progressive enhancement: every card is rendered in the HTML, so with no
     JS the full ranking is still readable and only the controls are inert. */
  (function () {
    var list = document.getElementById("dpCandidates");
    if (!list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll(".dp-card"));
    var filters = Array.prototype.slice.call(document.querySelectorAll(".dp-filter"));
    var search = document.getElementById("dpSearch");
    var noMatch = document.getElementById("dpNoMatch");
    var shown = document.getElementById("dpShown");
    var activeSkill = "all";

    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var count = 0;
      cards.forEach(function (card) {
        var skills = card.getAttribute("data-skills") || "";
        var name = card.getAttribute("data-name") || "";
        var okSkill = activeSkill === "all" || skills.indexOf(activeSkill) !== -1;
        var okName = !q || name.indexOf(q) !== -1;
        var match = okSkill && okName;
        // hidden, not just visually gone: a filtered-out card should leave
        // the accessibility tree and the tab order too
        card.hidden = !match;
        if (match) count++;
      });
      if (noMatch) noMatch.hidden = count !== 0;
      if (shown) {
        shown.textContent = count === 38
          ? "38 of 38 shown"
          : count + (count === 1 ? " candidate" : " candidates") + " shown of 38";
      }
    }

    filters.forEach(function (b) {
      b.addEventListener("click", function () {
        activeSkill = b.getAttribute("data-skill") || "all";
        filters.forEach(function (o) {
          o.setAttribute("aria-pressed", o === b ? "true" : "false");
        });
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
  })();

  /* ---------------- optional: hydrate from a real endpoint ----------------
     Inert until <body data-endpoint> is set. See the header comment for the
     shape this expects. */
  (function () {
    var endpoint = body.getAttribute("data-endpoint");
    if (!endpoint) return;
    fetch(endpoint, { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        if (data.profile) {
          var base = PROFILES[data.role === "company" ? "company" : "student"];
          PROFILES[data.role === "company" ? "company" : "student"] = Object.assign({}, base, data.profile);
        }
        if (data.role) setView(data.role);
        if (Array.isArray(data.entries)) showEmpty(data.entries.length === 0);
        if (switchEl) switchEl.hidden = true; // a real session decides the view
      })
      .catch(function () { /* keep the sample dashboard */ });
  })();

  // expose the two seams a backend needs to drive

  /* ---------------- contribution heatmap ----------------
     53 weeks x 7 days, the GitHub profile idiom the founder pointed at.

     Cells are generated rather than authored: 371 <i> elements in the HTML
     would be unreadable markup for a chart whose values are all sample data
     anyway. The number the grid encodes is written into the heading as real
     text, so a no-js visitor loses the picture but never the figure.

     Values come from a small seeded PRNG, not Math.random: the grid has to
     be stable across a re-render (a role switch re-runs this) and across
     reloads, or the same account would appear to have a different history
     every time the page was opened. */
  function seeded(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6D2B79F5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function formatHeatDate(d) {
    var MONTHS_FULL = ["January","February","March","April","May","June","July",
      "August","September","October","November","December"];
    return MONTHS_FULL[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  /* One shared tooltip element, positioned in the viewport via a transform
     rather than reflowed per grid, and reused across both the student and
     company heatmaps since only one is ever visible at a time. Delegated
     mouseover/mouseout on the grid rather than a listener per cell: a role
     switch rebuilds all 371 cells (buildHeat clears grid.textContent), so a
     per-cell listener would need re-attaching on every rebuild, while a
     single delegated pair on the grid element itself survives it — the
     grid node is never replaced, only its children.

     Hover-only, no keyboard path: the grid is aria-hidden (colour-only data
     that is already restated as a sentence below it, per that existing
     design decision), so giving individual cells tabindex would create
     focusable stops with nothing for assistive tech to announce at them —
     a worse outcome than the tooltip simply not being keyboard-reachable. */
  /* Declared bare, no initializer — the same hoisting trap as MONTHS above,
     just one statement type sneakier. This whole heatmap block sits AFTER
     the "initial view" IIFE further up the file, and that IIFE calls
     setView() immediately, which reaches all the way down into
     ensureHeatTip() and assigns heatTip to a real DOM node before the
     script has finished running top to bottom. If this line were
     `var heatTip = null;`, execution would then continue downward, reach
     THIS statement, and the `= null` would re-run and clobber the value
     ensureHeatTip() had just set — not a redeclaration (harmless), an
     ASSIGNMENT (not). Every call after that recreated a fresh tooltip
     element that no listener was ever wired to, which is exactly what
     happened: confirmed by logging heatTip's value inside ensureHeatTip on
     each call — undefined (not yet reached) on the first, then null (freshly
     clobbered) on every one after. A bare `var heatTip;` has no assignment
     to re-run, so nothing downstream can stomp on what this function sets. */
  var heatTip;
  function ensureHeatTip() {
    if (heatTip) return heatTip;
    heatTip = document.createElement("div");
    heatTip.className = "dp-heat-tip";
    heatTip.setAttribute("role", "tooltip");
    heatTip.hidden = true;
    document.body.appendChild(heatTip);
    return heatTip;
  }

  function wireHeatTooltip(grid) {
    if (grid.getAttribute("data-heat-wired")) return;
    grid.setAttribute("data-heat-wired", "1");
    var tip = ensureHeatTip();

    function show(cell) {
      var count = parseInt(cell.getAttribute("data-count"), 10) || 0;
      var noun = cell.getAttribute("data-noun") || "contribution";
      var date = cell.getAttribute("data-date");
      tip.textContent = (count === 0 ? "No " + noun + "s" : count + " " + noun + (count === 1 ? "" : "s")) +
        " on " + date;
      tip.hidden = false;
      var r = cell.getBoundingClientRect();
      var tr = tip.getBoundingClientRect();
      var x = Math.round(r.left + r.width / 2 - tr.width / 2);
      var y = Math.round(r.top - tr.height - 8);
      // clamp horizontally so a cell near either edge of the scrollable
      // heatmap does not push the tooltip off the actual viewport
      x = Math.max(6, Math.min(x, window.innerWidth - tr.width - 6));
      tip.style.transform = "translate(" + x + "px," + y + "px)";
    }
    function hide() { tip.hidden = true; }

    grid.addEventListener("mouseover", function (e) {
      var cell = e.target.closest("i[data-date]");
      if (cell) show(cell);
    });
    grid.addEventListener("mouseout", function (e) {
      var cell = e.target.closest("i[data-date]");
      if (cell) hide();
    });
    // a rebuild (role switch) replaces the cells out from under an open
    // tooltip; hiding it here means it never points at a stale cell
    grid.addEventListener("mouseleave", hide);
  }

  function buildHeat(isCompany) {
    /* Declared inside, not as a module-level var: setView() calls this from
       an IIFE near the top of the file, which runs BEFORE any var further
       down has been assigned. A hoisted `var MONTHS` would still be
       undefined at that point and this would throw on MONTHS[m] — which is
       exactly what it did, silently, leaving an empty grid and a stale
       heading. Function declarations hoist with their body; var
       initialisers do not. */
    var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var grid = document.getElementById(isCompany ? "dpHeatCo" : "dpHeat");
    var months = document.getElementById(isCompany ? "dpHeatMonthsCo" : "dpHeatMonths");
    var title = document.getElementById(isCompany ? "dpHeatTitleCo" : "dpHeatTitle");
    if (!grid) return;

    var WEEKS = 53, DAYS = 7;
    var rand = seeded(isCompany ? "projet:company:v1" : "projet:student:v1");
    grid.textContent = "";

    // The grid ends on the current week, so the last column is "this week"
    // and the month labels below line up with real calendar months.
    var end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - end.getDay()); // back to the week's Sunday

    var total = 0;
    var frag = document.createDocumentFragment();
    var labels = [];
    var lastMonth = -1;
    var noun = isCompany ? "submission" : "contribution";
    var cells = [], weights = [];
    /* How many days see any activity at all, and how many events to spread
       across them. Both are per-role because the two grids describe
       different things: a builder contributes fairly often in small
       amounts, a company receives submissions in bursts around its briefs'
       deadlines, so the company grid is sparser but heavier where it lands.

       targetTotal matters for more than realism. The company overview
       states "96 submissions" in its metrics row, its funnel and its brief
       table, so a heatmap that summed to its own unrelated figure (486, as
       it did) put two contradictory numbers for the same quantity on one
       screen. Deriving the counts FROM the target is what keeps the
       heading honest, rather than hoping the two happen to agree. */
    var activeRate = isCompany ? 0.07 : 0.30;
    var targetTotal = isCompany ? 96 : 214;

    for (var w = 0; w < WEEKS; w++) {
      var weekStart = new Date(end);
      weekStart.setDate(weekStart.getDate() - (WEEKS - 1 - w) * 7);
      var m = weekStart.getMonth();
      // one label per month, at the first week that lands in it
      labels.push(m !== lastMonth ? MONTHS[m] : "");
      lastMonth = m;

      for (var d = 0; d < DAYS; d++) {
        var cellDate = new Date(weekStart);
        cellDate.setDate(cellDate.getDate() + d);
        var cell = document.createElement("i");
        cell.setAttribute("data-date", formatHeatDate(cellDate));
        cell.setAttribute("data-noun", noun);
        cells.push(cell);
        // weight only for now — the actual counts need the total of these,
        // so they are assigned in a second pass below
        weights.push(rand() > (1 - activeRate) ? 0.25 + rand() : 0);
        frag.appendChild(cell);
      }
    }
    /* Second pass: hand out targetTotal across the active days in
       proportion to their weights, then derive each cell's LEVEL from the
       count it actually got. Deriving the colour from the number (rather
       than drawing them independently) is what guarantees a darker cell
       can never show a smaller tooltip figure than a lighter one beside
       it — they are the same fact, rendered twice. */
    var weightSum = 0;
    weights.forEach(function (w) { weightSum += w; });
    var counts = weights.map(function (w) {
      return weightSum > 0 && w > 0 ? Math.max(1, Math.round(targetTotal * w / weightSum)) : 0;
    });
    /* Rounding each day independently lands a few either side of the target
       (97 against a stated 96, in practice). Since the whole point of the
       target is that the heading agrees with the metrics row, walk the
       difference off the busiest days — they absorb +/-1 without changing
       which colour bucket they fall in, whereas a 1-count day would flip to
       0 and leave a hole in the grid. */
    var drift = targetTotal - counts.reduce(function (a, n) { return a + n; }, 0);
    var order = counts.map(function (n, i) { return i; })
      .filter(function (i) { return counts[i] > 0; })
      .sort(function (a, b) { return counts[b] - counts[a]; });
    for (var k = 0; drift !== 0 && order.length; k++) {
      var idx = order[k % order.length];
      if (drift > 0) { counts[idx]++; drift--; }
      else if (counts[idx] > 1) { counts[idx]--; drift++; }
      if (k > order.length * 4) break; // nothing left that can absorb it
    }
    cells.forEach(function (cell, i) {
      var count = counts[i];
      var level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4;
      cell.setAttribute("data-lv", level);
      cell.setAttribute("data-count", count);
      total += count;
    });

    grid.appendChild(frag);
    wireHeatTooltip(grid);

    if (months) {
      months.textContent = "";
      labels.forEach(function (label) {
        var sp = document.createElement("span");
        sp.textContent = label;
        // 11px cell + 3px gap, matching .dp-heat's own grid in dashboard.css
        sp.style.width = "14px";
        months.appendChild(sp);
      });
    }
    if (title) {
      title.textContent = total + (isCompany ? " submissions received" : " contributions") +
        " in the last year";
    }
  }

  /* ---------------- tabs ----------------
     A real tablist: aria-selected drives the styling, panels carry
     role="tabpanel", and the tab strip uses roving tabindex plus arrow-key
     navigation, which is what makes the pattern actually behave like tabs
     for a keyboard user rather than just look like them. */
  (function () {
    var strip = document.getElementById("dpTabs");
    if (!strip) return;
    var tabs = Array.prototype.slice.call(strip.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, moveFocus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (moveFocus) tab.focus();
    }

    strip.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) select(tab, false);
    });
    strip.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      select(next, true);
    });
  })();

  /* ---------------- hackathon entry modal ----------------
     Same native <dialog> pattern as the two brief modals elsewhere on the
     site, including the pointer-opened-then-Escape focus-ring suppression
     (see suppressReturnRing in landing.js for why that case is special). */
  (function () {
    var modal = document.getElementById("hkModal");
    var list = document.getElementById("dpEntries");
    if (!modal || !list || typeof modal.showModal !== "function") return;

    var closeBtn = document.getElementById("hkClose");
    var lastTrigger = null, pointerOpened = false;

    function fill(row) {
      var get = function (k) { return row.getAttribute("data-hk-" + k) || ""; };
      document.getElementById("hkTag").textContent = get("discipline");
      document.getElementById("hkTitle").textContent = get("title");
      document.getElementById("hkSub").textContent =
        get("company") + " · " + get("date") + " · " + get("entrants") + " entrants";
      document.getElementById("hkRank").textContent = "#" + get("rank");
      document.getElementById("hkScore").textContent = get("score");
      document.getElementById("hkFit").textContent = get("fit") + "%";
      document.getElementById("hkSolution").textContent = get("solution");
      document.getElementById("hkFeedback").textContent = "“" + get("feedback") + "”";

      var status = document.getElementById("hkStatus");
      status.textContent = get("status");
      status.classList.toggle("is-quiet", get("status-kind") === "quiet");

      // "Problem framing:88,Execution:86" -> one labelled bar each
      var bars = document.getElementById("hkBars");
      bars.textContent = "";
      get("breakdown").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length !== 2) return;
        var li = document.createElement("li");
        var label = document.createElement("span");
        label.textContent = bits[0].trim();
        var val = document.createElement("b");
        val.textContent = bits[1].trim();
        var track = document.createElement("div");
        track.className = "dp-bar";
        var fillEl = document.createElement("i");
        fillEl.style.width = Math.max(0, Math.min(100, parseInt(bits[1], 10) || 0)) + "%";
        track.appendChild(fillEl);
        li.appendChild(label);
        li.appendChild(val);
        li.appendChild(track);
        bars.appendChild(li);
      });
    }

    list.addEventListener("click", function (e) {
      var row = e.target.closest("[data-hk]");
      if (!row) return;
      pointerOpened = e.detail > 0;
      lastTrigger = row;
      fill(row);
      modal.showModal();
    });
    closeBtn.addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener("cancel", function () {
      var sup = window.ProjetUI && window.ProjetUI.suppressReturnRing;
      if (pointerOpened && sup) sup(lastTrigger);
    });
  })();

  /* ---------------- edit profile ----------------
     Semi-functional on purpose, and honest about it: the edits are real and
     they persist, but only into localStorage on this device. The dialog says
     so in its own copy rather than implying a saved account, which is the
     same rule the auth forms and the footer capture already follow — never
     fake a save that did not happen.

     Only the student profile is editable. The company profile is an org
     record, and letting one browser rewrite it locally would imply an
     ownership model that does not exist yet. */
  (function () {
    var modal = document.getElementById("editModal");
    var openBtn = document.getElementById("dpEditBtn");
    if (!modal || !openBtn || typeof modal.showModal !== "function") return;

    var STORE = "projet:profile";
    var form = document.getElementById("editForm");
    var statusEl = document.getElementById("editStatus");
    var fields = {
      name: document.getElementById("editName"),
      org: document.getElementById("editOrg"),
      loc: document.getElementById("editLoc"),
      bio: document.getElementById("editBio"),
      tags: document.getElementById("editTags")
    };

    function read() {
      try { return JSON.parse(localStorage.getItem(STORE) || "null"); }
      catch (e) { return null; }
    }

    // Applied over whatever setProfile() just wrote, so a saved edit
    // survives a role switch re-render rather than being silently reverted.
    function apply(data) {
      if (!data) return;
      if (data.name) {
        setText("dpName", data.name);
        // initials follow the name, the same way the sample profile's do
        var initials = data.name.trim().split(/\s+/).slice(0, 2)
          .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
        if (initials) setText("dpAvatar", initials);
        setText("dpHandle", "@" + data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, ""));
      }
      if (data.org) { setText("dpDetOrg", data.org); setText("dpSub", data.org); }
      if (data.loc) setText("dpDetLoc", data.loc);
      if (data.bio) setText("dpBio", data.bio);
      if (data.tags) {
        var tagsEl2 = document.getElementById("dpTags");
        var list = data.tags.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
        if (tagsEl2 && list.length) {
          tagsEl2.textContent = "";
          list.forEach(function (t) {
            var sp = document.createElement("span");
            sp.className = "dp-tag";
            sp.textContent = t;
            tagsEl2.appendChild(sp);
          });
        }
      }
    }

    function say(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle("is-shown", !!msg);
    }

    function seedForm() {
      // seeded from what is on the page right now, not from the store, so
      // the form always opens showing exactly what the visitor can see
      fields.name.value = (document.getElementById("dpName") || {}).textContent || "";
      fields.org.value = (document.getElementById("dpDetOrg") || {}).textContent || "";
      fields.loc.value = (document.getElementById("dpDetLoc") || {}).textContent || "";
      fields.bio.value = (document.getElementById("dpBio") || {}).textContent || "";
      var tagsEl2 = document.getElementById("dpTags");
      fields.tags.value = tagsEl2
        ? Array.prototype.map.call(tagsEl2.querySelectorAll(".dp-tag"), function (t) {
            return t.textContent;
          }).join(", ")
        : "";
      say("");
    }

    var pointerOpened = false;
    openBtn.addEventListener("click", function (e) {
      pointerOpened = e.detail > 0;
      seedForm();
      modal.showModal();
      fields.name.focus();
    });
    document.getElementById("editClose").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener("cancel", function () {
      var sup = window.ProjetUI && window.ProjetUI.suppressReturnRing;
      if (pointerOpened && sup) sup(openBtn);
    });

    form.addEventListener("submit", function (e) {
      // method="dialog" would close before this runs, so take the wheel
      e.preventDefault();
      if (!fields.name.value.trim()) { say("A name is required."); return; }
      var data = {
        name: fields.name.value.trim(),
        org: fields.org.value.trim(),
        loc: fields.loc.value.trim(),
        bio: fields.bio.value.trim(),
        tags: fields.tags.value.trim()
      };
      apply(data);
      var saved = true;
      try { localStorage.setItem(STORE, JSON.stringify(data)); }
      catch (err) { saved = false; }
      // Private mode and full storage both throw here. The page still shows
      // the edit, so saying "saved" would be a lie by one word.
      say(saved ? "Saved on this device." : "Applied, but this browser blocked saving it.");
      setTimeout(function () { modal.close(); }, 650);
    });

    document.getElementById("editReset").addEventListener("click", function () {
      try { localStorage.removeItem(STORE); } catch (err) { /* ignore */ }
      setProfile(PROFILES[currentView]);
      seedForm();
      say("Reset to the sample profile.");
    });

    // Only the student profile is editable, so the override is scoped to it:
    // a role switch into the company view paints the org record untouched.
    reapplyProfileEdits = function () {
      if (currentView === "student") apply(read());
    };
    reapplyProfileEdits();
  })();

  window.ProjetDashboard = { setView: setView, showEmpty: showEmpty };
})();
