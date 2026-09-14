# Handover — front end to backend (Andrei)

The front end is functionally done. This is the one file to read before
wiring up a real backend: what's fake and needs to change, and every
endpoint/integration point the pages already expect, with exact file/line
locations so this is workable straight in Cursor.

It replaces `PLACEHOLDERS.md` and `BACKEND-HANDOFF.md`, which covered this
ground in two separate files and have been folded in here and removed —
one document, not three that can drift out of sync with each other.

**Division of labour, unchanged**: this repo is front end / UI-UX only,
dependency-free static HTML/CSS/JS (no build step, no framework). The API
and the MongoDB layer are yours.

---

## 1. Pre-launch checklist

Everything below is sample, invented, or otherwise standing in for real
data or a real integration. None of it is disclosed on the live pages
any more (the "sample briefs," "placeholder logos," "front end only" and
"SOON" banners/badges were deliberately removed from the rendered site
for the investor/handover demo — see "Notice removal" at the bottom of
this section) — this table is now the only place that disclosure lives,
so treat it as the actual source of truth for what still needs to become
real before any public launch.

| What | Where | What's fake | Done when |
|---|---|---|---|
| Partner logos | `index.html` logo carousel (`#logoTrack`) | Eight invented company names (Northwind, Acme Labs, Vertex Studio, Meridian Co., Lumen Works, Cobalt & Co, Fieldstone, Anchorpoint) as a mark+name lockup. No real logo images exist. | Real, permissioned partner logos are in. Set `data-carousel-enabled="false"` on `.logos` to hide the strip entirely until there are enough to carry a row. |
| Featured-challenge tickets | `index.html` ticket rail (`.ch-rail`, `#chRail`) | Six sample tickets, static HTML, deliberately **not wired to any endpoint** (see §2.3 — this is a preview only; the real listing lives on `challenges.html`). | Not a backend task at all unless a fresh ask changes that — see §2.3 for why. |
| Countdown | `index.html` `.ch-countdown` | `data-countdown-hours="96"` counts down from **page load**, not a calendar date — there's no live challenge data yet. | Point it at a real deadline timestamp (see §2.3). |
| Testimonials | `index.html` `#tWallTrack` | Five invented quotes, attributed to roles only, never a named real person. Avatars are illustrated silhouettes, not photographs. | Real, permissioned quotes and portraits. |
| Challenge listing | `challenges.html` `#clGrid` | Twelve sample briefs with invented statuses, activity heatmaps, effort estimates and skills. | The API serves live challenges (§2.4). Also drop the page's `<meta name="robots" content="noindex">` and add it to `sitemap.xml`. |
| Dashboard past-hackathon rows | `dashboard.html` student view | Three sample rows, plus every `data-hk-*` payload behind their detail modal. | §2.6. |
| Dashboard candidates | `dashboard.html` company view | Five ranked sample candidates. | §2.6. |
| Dashboard activity feeds | `dashboard.html` `#dpFeedStudent` / `#dpFeedCompany` | Six sample events each. | Real account events, same fetch as §2.5. |
| Dashboard heatmap | `dashboard.html` `#dpHeat` / `#dpHeatCo` | `buildHeat()` in `assets/dashboard.js` fills 371 cells per grid from a seeded PRNG (seeded so a given account at least looks stable across reloads, not random). | §2.7. |
| Company overview charts | `dashboard.html` company view: 6-metric row, hiring funnel, monthly chart, brief table, discipline split | **Wired, not just sample data** (§2.8) — send real `metrics`/`funnel`/`monthly`/`briefs` and it renders; the discipline split and all prose notes are computed from that data, not separate fields. Until wired, the sample figures shown are internally consistent by construction (everything derives from 96 submissions / 31 above bar / 5 briefs), so if you change one for a screenshot, re-derive the rest. | §2.8. |
| Every front-end-only form | `login.html`, `signup.html`, footer "get notified" capture | Each carries an empty `data-endpoint`. With nothing set they say the wiring is pending rather than faking a success — reuse that convention for any new form. | §2.1–§2.2. |
| Google sign-in button | `login.html`, `signup.html` (`[data-oauth="google"]`) | A real, styled button with **no OAuth wired at all** — clicking it reports "not connected yet" through the shared status region. | §2.1.1. |
| Edit profile | `dashboard.html` | Genuinely saves, but only to `localStorage` on that one device; the dialog says so in its own copy. | §2.7 (Edit profile). |
| Inert action buttons | `dashboard.html` | Schedule / Compare / Book interviews / View submission are `href="#"`. | No spec yet — ask before building; not covered further in this doc. |
| Footer links with no page yet | Every page footer | Careers / Contact / Privacy / Terms now render as plain, dimmed `.footer-pending` text (no "SOON" badge any more, but still not links — see "Notice removal" below). | Swap each back to a real `<a href="…">` as its page ships. |
| `noindex` tags | `challenges.html`, `login.html`, `signup.html` `<head>` | Kept out of search while their content/flow is sample or non-functional. | Remove per-page once that page's content is real, and add the URL to `sitemap.xml` at the same time (contradictory to list a noindexed URL there). |
| `archive/` folder | repo root (~7.3MB: `archive/v2/`, `archive/split-spectrum-auth/`, `archive/projet-split-hero/`, and five standalone superseded HTML files) | Every previous major iteration of this site, kept as design history during the build. Nothing in it is linked from any live page. | **Delete the whole `archive/` folder** once the design history has no further reference value to the team (e.g. after the round of feedback following this handover). Confirm with the founders before deleting — it's history, not a support requirement, but it's their call, not a technical one. |

### Notice removal (context, not an action item)

For this handover round the on-page disclosures that used to say things
like "Sample briefs, not live listings," "Placeholder logos, pending real
partners," and the dashboard's "Front end only" banner were **removed from
the rendered pages** so the site reads as production-ready for a demo —
along with the "SOON" pill badges on the four not-yet-built footer links
(the plain text label stays, the badge icon doesn't). The underlying
sample **data** was not touched or replaced — only the banners that said
so out loud. This table is where that disclosure now lives instead.
`data-placeholder="…"` attributes and `<!-- PLACEHOLDER[…] -->` comments
are still in the HTML source (invisible to a visitor, greppable by you):

```
grep -rn 'data-placeholder=' *.html
grep -rn 'PLACEHOLDER\[' *.html assets/
```

---

## 2. Endpoints & integration seams

The convention every wired seam already follows: an **empty
`data-endpoint` attribute**. Set it to a real path and the feature starts
working with no other front-end change needed. While it's empty, forms say
the wiring is pending instead of faking success, and lists keep showing
their sample data so the page is readable with the API down, not just
before it exists. Every fetch below **fails soft**: a network error, a
non-2xx status, or a malformed body leaves whatever's already on the page
alone — never swap a readable page for an error state.

Not every seam below is at that stage yet — §2.6's entry-detail modal
still needs its `entries` payload shaped correctly. Each section says
plainly which kind it is.

| # | Where | Selector | Method | Status |
|---|---|---|---|---|
| 2.1 | `signup.html` | `#signupForm[data-endpoint]` | POST | Wired, needs a URL |
| 2.1.1 | `login.html` / `signup.html` | `[data-oauth="google"]` | — | Stub only, needs a real flow |
| 2.2 | `login.html` | `#loginForm[data-endpoint]` | POST | Wired, needs a URL |
| 2.3 | every footer | `#footerNotify[data-endpoint]` | POST | Wired, needs a URL |
| 2.4 | `challenges.html` | `#clGrid[data-endpoint]` | GET | Wired, needs a URL |
| 2.5 | `dashboard.html` | `body.dash-page[data-endpoint]` | GET | Partially wired (profile + role + empty-state only) |
| 2.6 | `dashboard.html` | entry rows, `data-hk-*` | — | Wired via attributes, no fetch of its own |
| 2.7 | `dashboard.html` | `#dpHeat` / `#dpHeatCo` | (via 2.5) | `buildHeat()` needs its body replaced (company total already syncs to real data via 2.8) |
| 2.8 | `dashboard.html` company view | 6-metric row, funnel, monthly chart, brief table, discipline split | GET (via 2.5, `data.company`) | **Wired (Sep 2026)** — send the four arrays, get all five sections and their notes |
| 2.9 | `dashboard.html` | `window.ProjetDashboard.setView()` / `.showEmpty()` | — | JS hooks, call directly once real auth exists |

### 2.1. Signup

`login.html` / `signup.html`, `assets/site.js`. Both forms already handle
required/format/min-length validation, per-field error messages,
`aria-invalid`, focus management to the first bad field, a submit busy
state, and a form-level `aria-live` status region. `site.js` owns the one
`fetch` call for both forms.

```html
<form id="signupForm" data-auth-form data-endpoint="/api/auth/signup" novalidate>
<form id="loginForm"  data-auth-form data-endpoint="/api/auth/login"  novalidate>
```

```
POST <data-endpoint>
Content-Type: application/json

signup  { role: "business" | "builder", name, email, password }
login   { email, password }
```

| Status | Body | Front-end behaviour |
|---|---|---|
| 2xx | `{ "redirect": "/dashboard" }` | Navigates to `redirect` (falls back to `dashboard.html`) |
| non-2xx | `{ "message": "Email already in use" }` | Shows `message` in the status region, clears the busy state |

A non-JSON body is tolerated — the UI falls back to a generic error
string.

**The `role` field**: `"business"` or `"builder"`, resolved from the
`?role=` query param the marketing CTAs already pass
(`signup.html?role=business`) — `landing.js` rewrites every
`a[href^="signup.html"]` to carry the current audience mode, so the nav
CTA prefills the picker for free. There's no default-checked radio.
**Treat the posted `role` as user input and validate it server-side** —
it's only ever a UI hint for pre-selecting the radio on this end.

#### 2.1.1. Google sign-in (new, front end only — the whole reason this button exists)

`login.html` and `signup.html` both carry a real, styled "Continue with
Google" button on each face (login + signup), added specifically for you
to attach real OAuth to:

```html
<button type="button" class="auth-google" data-oauth="google">…</button>
```

Right now it does nothing real — clicking it reports "Google sign-in
isn't connected yet" through the same `.auth-status` region the email
form above it uses. The entire seam is one handler in `assets/site.js`:

```js
document.querySelectorAll('[data-oauth="google"]').forEach(function (btn) {
  var status = btn.parentElement.querySelector('.auth-status');
  btn.addEventListener('click', function () {
    if (!status) return;
    status.className = 'auth-status show pending';
    status.textContent = 'Google sign-in isn’t connected yet…';
  });
});
```

Replace this one handler with the real flow — a redirect into your
backend's OAuth endpoint, or a Google Identity Services popup/One Tap
init — and both buttons on both pages start working with **no markup
changes**. There are 4 buttons total (login face + signup face, on both
`login.html` and `signup.html`, which carry byte-identical stage markup
by convention — edit one, edit the other to match).

### 2.2. Footer "notify me" capture

Every page footer, `#footerNotify[data-endpoint]`, owned by
`assets/landing.js`.

```
POST <data-endpoint>
{ "email": "..." }
```

Same honesty rule as the auth forms: with no endpoint set it says so
rather than thanking the visitor for a signup that didn't happen.

### 2.3. Featured challenges on index.html — NOT a seam, by design

Worth flagging explicitly since it's the first "cards" example the brief
mentioned: the Featured Challenges ticket rail on `index.html`
(`.ch-rail`, six `.ch-ticket` elements) is deliberately **static HTML
with no `data-endpoint` and nothing fetched**. It's a fixed preview of a
few sample briefs, not a live feed — the real, filterable, API-backed
listing is `challenges.html` (§2.4). Leave this rail alone unless a
fresh ask changes that; wiring it up would duplicate §2.4 for no reason.

The one small thing on this page that IS a countdown, not a fetch:
`.ch-countdown[data-countdown-hours="96"]` counts down live from page
load in `landing.js`. Point `data-countdown-hours` at real remaining
hours (or swap the logic for a real deadline timestamp) once there's a
real "next challenge closes" date to show.

### 2.4. Challenge listing (challenges.html)

`assets/challenges.js` fetches `#clGrid[data-endpoint]` and rebuilds the
grid. The discipline filter and the brief-detail modal are both
delegated off the grid (not per-node listeners), so they keep working
across a re-render.

```
GET <data-endpoint>  ->  { "challenges": [ Challenge ] }
```

```jsonc
{
  "id": "nordwave-pricing",
  "title": "Rebuild the pricing page conversion flow",
  "company": "Nordwave",
  "discipline": "Product",        // display case, shown on the card
  "category": "product",          // filter key, lowercase: product|design|engineering|data
  "status": "open",               // new | open | filling | closing
  "statusLabel": "Open",          // the words on the pill
  "summary": "One or two lines for the card.",
  "body": "The full brief, shown in the modal.",
  "deadline": "6 days left",
  "submitted": 14,
  "progress": 37,                 // percent, drives the timeline fill bar
  "posted": "14 days ago",
  "effort": "8-12 hrs",
  "skills": "Product sense, Analytics",
  "format": "Async, individual",
  "activity": [1,2,1,0,0,2,0,1,1,1,1,1,0,1]   // 14 days, levels 0-4, oldest first
}
```

`status` drives the pill's colour ladder independently of `statusLabel`,
so wording can change without touching CSS. `deadline`, `posted` and
`effort` are **display strings**, not timestamps — the front end never
formats them, the API decides the wording.

**When this goes live**, also drop `challenges.html`'s
`<meta name="robots" content="noindex">` and add the page to
`sitemap.xml` (see the pre-launch checklist).

### 2.5. Dashboard profile + role + empty state

`assets/dashboard.js` fetches `body.dash-page[data-endpoint]`. **The
fetch handler consumes `profile`, `role`, the length of `entries`, and
now `company` (§2.8) — `candidates` is still just documented intent, not
yet rendered** (the company view's candidate list, like the student
`entries` list, is real markup on the page already; wiring its own fetch
is the one piece of §2.5 still open).

```jsonc
{
  "role": "student",              // "student" | "company"
  "profile": {
    "initials": "CL", "name": "Chloe Lim", "handle": "@chloelim",
    "bio": "...", "org": "SUTD · Year 3", "loc": "Singapore",
    "joined": "Joined February 2026",
    "tagsLabel": "Skills", "tags": ["Figma", "A11y"],
    "stats": [{ "label": "Avg. score", "value": "83" }]
  },
  "entries":    [ /* student: past challenges, see §2.6 */ ],
  "candidates": [ /* company: ranked submissions — documented, NOT yet rendered */ ],
  "company":    { /* company: the six charts — see §2.8 for the full shape, now wired */ }
}
```

What actually happens on a successful fetch today:
- `data.profile` merges over the matching sample profile (`student` or
  `company`) in `PROFILES`.
- `data.role` calls `setView(data.role)`, which also re-tints the page
  via `html[data-audience]`.
- `Array.isArray(data.entries)` with length `0` triggers the student
  empty state (`showEmpty(true)`) — this is the one real signal the
  dashboard currently reacts to for "no data yet."
- `data.company`, if present, calls `renderCompanyOverview(data.company)`
  — see §2.8.

### 2.6. Entry detail modal (student past-hackathon rows)

No fetch of its own. Each row carries its whole modal payload as
`data-hk-*` attributes, read fresh every time it's opened: `title`,
`company`, `discipline`, `date`, `rank`, `entrants`, `score`, `fit`,
`status`, `status-kind` (`win` | `quiet`), `solution`, `breakdown`,
`feedback`. Render these attributes from the API response (e.g. as part
of `entries` in §2.5) and the modal itself needs no code changes.
`breakdown` is a comma-separated `"Label:score"` list, e.g.
`"Problem framing:88,Execution:86"`.

### 2.7. Contribution heatmap

`buildHeat(isCompany)` in `assets/dashboard.js` currently fills
`#dpHeat` (student) / `#dpHeatCo` (company) from a seeded PRNG, so the
sample history is at least stable across reloads rather than reshuffling
on every visit. Replace its body with real per-day data: **53 weeks × 7
days, oldest first, column by column**, each cell needing `{ level: 0-4,
count, date }` — `level` drives the colour, `count`/`date` drive the
hover tooltip, and the two must agree (the sample data derives `count`
from the same draw that picked `level` for exactly this reason — a real
API keeps them consistent for free since they come from the same row).
The heading text ("38 submissions in the last year," etc.) is derived
from the summed counts, so it stays correct automatically once the data
is real.

### 2.8. Company overview charts — WIRED (Sep 2026), point `data-endpoint` at a URL and go

**This used to be the one real gap in this handoff — it's a real seam
now, same shape as the others.** `assets/dashboard.js` has
`renderCompanyOverview(data.company)`, called from the same
`body.dash-page[data-endpoint]` fetch as §2.5, whenever the response
carries a `company` key. It replaces the six-metric row, hiring funnel,
12-month submissions chart, and per-brief table wholesale (same pattern
`setProfile()` already uses for the profile rail's tags/stats). No
charting library — still plain percentage-sized `<div>`s and one real
`<table>`, matching the rest of the site's dependency-free rule.

```jsonc
"company": {
  "metrics": [{ "value": "3", "label": "Open briefs", "delta": "+1", "direction": "up" }],  // 6 entries
  "funnel":  [{ "label": "Submissions", "count": 96, "pctOfTop": 100 }],                     // top-to-bottom, ordered
  "monthly": [{ "month": "Sep", "count": 17, "pctOfPeak": 100 }],                            // 12 entries, oldest first, last = current month
  "briefs":  [{ "title": "...", "discipline": "Product", "status": "open",
                "statusLabel": "Open", "submitted": 38, "aboveBar": 12,
                "topScore": 94, "closesIn": "6 days" }]                                      // one row per brief
}
```

**Deliberately smaller than the table two rows up used to suggest.**
The discipline split (`.dp-split` / `.dp-split-key`) and all four prose
sentences under these charts (the funnel's "X hires from Y
submissions...", the monthly chart's "busiest month...", the table's "N
briefs clear your bar most often...") are **not API fields** — they're
computed in JS from `funnel` and `briefs` every time this renders. This
is the fix for the exact bug class the old hand-typed sample data hit
once already (see CLAUDE.md, "Every company figure derives from the
brief table"): two parallel fields for the same fact can drift apart the
moment one gets updated and the other doesn't. Deriving instead means
there is only one number to get right per fact, and it is structurally
impossible for the split or the notes to disagree with the funnel/table
they describe. Send `funnel` and `briefs` correctly and everything else
follows.

- **Discipline split** buckets each brief's `discipline` against the
  site's own four-category taxonomy (Product/Engineering/Data/Design,
  the same set `challenges.html` filters by, case-insensitive). Anything
  outside those four (a `"Marketing"` brief, say) lands in a shared
  `other` segment (`[data-seg="other"]` in `dashboard.css`, a neutral
  grey) rather than borrowing one of the four colours and visually
  merging two unrelated disciplines.
- **`closesIn`**: pass `null` for a closed brief and the table shows
  `—`, matching the sample convention.
- **`status`**: `new | open | filling | closing | closed` — the first
  four are `challenges.html`'s own status ladder (`open` uses the
  unstyled base `.cl-pill`), `closed` is dashboard-only styling in
  `dashboard.css`.

**The heatmap heading stays in sync automatically now, too.**
`renderCompanyOverview()` sums `briefs[].submitted` into a module-level
`companyHeatTotal`, and `buildHeat()`'s `targetTotal` (§2.7) reads that
instead of the old hardcoded `96` — so as soon as real `briefs` data
comes in, the heatmap's own heading re-renders against the real total
with no extra wiring.

**A real bug caught while wiring this, not by inspection:** the fetch
handler's success callback referenced a variable (`switchEl`) this file
never actually declares — a leftover from the `.dp-viewswitch` toggle
removed in an earlier round (see CLAUDE.md "v3.2 updates"). It never
threw because the callback only runs once a real `data-endpoint` exists,
which nothing has set yet — but it would have thrown a `ReferenceError`
on the very first real response, right where this whole company-overview
wiring now lives. Removed; nothing replaced it, since the audience
toggle it referred to no longer exists on this page.

Verified against a local JSON fixture (deliberately including a brief
with a discipline outside the known four, to exercise the `other`
fallback) via a headless-browser check, not just written: all five
sections render correctly, every derived note's numbers were hand-checked
against the fixture, the discipline split's `other` bucket rendered with
the right label and colour, the heatmap heading updated to the real
total, the student view was unaffected, and there were zero console
errors.

### 2.9. Which dashboard view

Right now the view comes from `?view=student|company` in the URL, else
the visitor's saved audience-mode preference. **There is no view switch
on the dashboard page itself** — reaching it at all means being signed
in, so which view to show is a fact about the account, not a preference,
and the nav's usual "For students / For companies" toggle is
deliberately absent here.

Once real auth exists, call `window.ProjetDashboard.setView(roleFromSession)`
directly instead of reading `?view=`. `setView()` is also what re-tints
the whole page (sets `html[data-audience]`) — nothing else needs to know
the role. `window.ProjetDashboard.showEmpty(bool)` is the other exposed
hook, for forcing the student empty state independent of a fetch.

### Edit profile (dashboard.html)

Deliberately real but local right now: it writes to
`localStorage["projet:profile"]` and the dialog's own copy says exactly
that ("Saved on this device"). Point it at a `PATCH`/`PUT` endpoint and
delete the localStorage read/write — `reapplyProfileEdits` (in
`assets/dashboard.js`) is the only other thing that touches it.

---

## 3. Open decisions — need an answer before they can be built

- **Sessions.** No token/cookie handling on the front end at all. If the
  API returns a JWT rather than setting an httpOnly cookie, say so and
  storage + an authenticated nav state can be added.
  `localStorage["projet:loggedIn"]` is currently a hint only — it drives
  the auto-redirect off `index.html` to `dashboard.html` for a "logged
  in" visitor, and nothing else.
- **Password reset** — no page exists yet.
- **Email verification** — no page exists yet.
- **Social / SSO beyond Google** — only the one Google button exists
  (§2.1.1), added specifically for this handover. Say the word for
  others (GitHub, LinkedIn, etc.) and they can be added the same way.
- **CSRF.** If the API expects a token, say where to read it from and
  it'll be attached to request headers.
- **Brief detail pages.** Challenge cards on `challenges.html` are
  deliberately not links — there's no per-brief URL yet, and a card that
  looks clickable but goes nowhere is the exact dead end that page was
  built to avoid. If briefs get real URLs, say so and the cards become
  links.
- **Inert dashboard actions.** Schedule / Compare / Book interviews /
  View submission are `href="#"` placeholders with no spec yet.
- **Terms / privacy links** on `signup.html` are plain text, not links —
  no such pages exist yet.
- **`archive/` folder removal** — see the pre-launch checklist. Not a
  backend question, but flagged here since it's the one item in this
  handover that's a "delete this" instruction rather than a "build this."
