/* ==========================================================================
   Projet — dashboard.html

   Runs alongside assets/landing.js, which owns the shared chrome (mobile
   menu, audience toggle, nav compaction). This file owns only the dashboard:
   which view is showing, and the company view's candidate filter.

   FRONT END ONLY. Every value on the page is sample data.

   BACKEND HOOKS (Andrei) — three seams, nothing else to rewire:

   1. WHICH VIEW.  Right now the view comes from ?view=student|company (or
      the saved audience mode, set via the nav's own For students/For
      companies toggle — there is no dashboard-specific view switch any
      more). Once auth exists, the account type should decide it: call
      setView(roleFromSession) directly instead of reading ?view=/localStorage.

   2. PROFILE + LISTS.  Set data-endpoint on <body class="dash-page"> and
      this file will fetch it and fill the slots. Suggested shape — the
      front end reads these keys and nothing else:

        {
          "role": "student" | "company",
          "profile": { "initials": "CL", "name": "Chloe Lim",
                       "sub": "SUTD · Year 3", "tags": ["Figma", "A11y"],
                       "stats": [{ "label": "Avg. score", "value": "83" }] },
          "metrics": [{ "value": "85", "label": "Latest score" }],
          "entries": [ ... ]        // student: past challenges
          "candidates": [ ... ]     // company: ranked submissions
        }

      An empty `entries` array is what should drive the student empty state —
      showEmpty(true) below already handles the swap.

   3. ACTIONS.  The Schedule / Compare / Book interviews / Edit profile
      buttons are inert placeholders (href="#"). Point them at real routes.
   ========================================================================== */
(function () {
  "use strict";

  var body = document.body;
  if (!body || !body.classList.contains("dash-page")) return;

  var viewStudent = document.getElementById("viewStudent");
  var viewStudentEmpty = document.getElementById("viewStudentEmpty");
  var viewCompany = document.getElementById("viewCompany");
  var switchEl = document.getElementById("dpViewSwitch");

  var eyebrow = document.getElementById("dpEyebrow");
  var heading = document.getElementById("dpHeading");
  var lede = document.getElementById("dpLede");
  var avatar = document.getElementById("dpAvatar");
  var nameEl = document.getElementById("dpName");
  var subEl = document.getElementById("dpSub");
  var tagsEl = document.getElementById("dpTags");
  var railStats = document.getElementById("dpRailStats");
  var railCta = document.getElementById("dpRailCta");

  // sample profiles, one per view — replaced wholesale by a real API response
  var PROFILES = {
    student: {
      eyebrow: "Student dashboard",
      heading: "Your proof, in one place.",
      lede: "Every challenge you have entered, what you scored, and where you ranked.",
      initials: "CL",
      name: "Chloe Lim",
      sub: "SUTD · Year 3 Design & AI",
      tags: ["Figma", "Front-end", "A11y"],
      stats: [
        { label: "Challenges done", value: "3" },
        { label: "Avg. score", value: "83" },
        { label: "Best rank", value: "#2" }
      ],
      cta: "Edit profile"
    },
    company: {
      eyebrow: "Company dashboard",
      heading: "Your shortlist, already ranked.",
      lede: "Every submission to your brief, scored and ordered before you book a single call.",
      initials: "NW",
      name: "Nordwave",
      sub: "Hiring · 1 open brief",
      tags: ["Product", "Front-end"],
      stats: [
        { label: "Open briefs", value: "1" },
        { label: "Submissions", value: "38" },
        { label: "Interviews", value: "4" }
      ],
      cta: "Post a challenge"
    }
  };

  var currentView = "student";

  function setProfile(p) {
    if (eyebrow) eyebrow.textContent = p.eyebrow;
    if (heading) heading.textContent = p.heading;
    if (lede) lede.textContent = p.lede;
    if (avatar) avatar.textContent = p.initials;
    if (nameEl) nameEl.textContent = p.name;
    if (subEl) subEl.textContent = p.sub;
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

    if (switchEl) {
      switchEl.querySelectorAll(".dp-viewopt").forEach(function (b) {
        b.setAttribute("aria-current", b.getAttribute("data-view") === currentView ? "true" : "false");
      });
      // reuse the sliding pill from the audience toggle
      var ind = switchEl.querySelector(".mode-indicator");
      if (ind) ind.style.transform = isCompany ? "translateX(100%)" : "translateX(0)";
    }

    // Keep the page-wide accent in step: company view should read blue, the
    // same way the marketing page does. landing.js owns this attribute, so
    // setting it here keeps both toggles telling the same story.
    document.documentElement.setAttribute("data-audience", isCompany ? "business" : "builder");
    try { localStorage.setItem("projet:audience", isCompany ? "business" : "builder"); } catch (e) { /* ignore */ }
    document.querySelectorAll(".mode-switch").forEach(function (sw) {
      sw.querySelectorAll(".mode-opt").forEach(function (b) {
        var want = isCompany ? "business" : "builder";
        b.setAttribute("aria-current", b.getAttribute("data-audience") === want ? "true" : "false");
      });
    });

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

  if (switchEl) {
    switchEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".dp-viewopt");
      if (!btn) return;
      setView(btn.getAttribute("data-view"));
    });
  }

  // the nav audience toggle should move this page's view too
  document.querySelectorAll(".mode-switch").forEach(function (sw) {
    sw.addEventListener("click", function (e) {
      var btn = e.target.closest(".mode-opt");
      if (!btn) return;
      setView(btn.getAttribute("data-audience") === "business" ? "company" : "student");
    });
  });

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
  window.ProjetDashboard = { setView: setView, showEmpty: showEmpty };
})();
