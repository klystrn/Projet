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
| Testimonials | `index.html` `.t-spot` (promoted quote) + `.t-strip` / `.t-chip` (the five chips) | Five invented quotes, attributed to roles only, never a named real person. Avatars are illustrated silhouettes, not photographs. | Real, permissioned quotes and portraits. |
| Challenge listing | `challenges.html` `#clGrid` | Twelve sample briefs with invented statuses, activity heatmaps, effort estimates and skills. | The API serves live challenges (§2.4). Also drop the page's `<meta name="robots" content="noindex">` and add it to `sitemap.xml`. |
| Dashboard past-hackathon rows | `dashboard.html` student view | **Wired** (§2.5b) — three sample rows shown until `entries` is sent; each generated row still carries the full `data-hk-*` payload its detail modal reads. | §2.5b / §2.6. |
| Dashboard candidates | `dashboard.html` company view | **Wired** (§2.5c) — five ranked sample candidates shown until `candidates` is sent. | §2.5c. |
| Dashboard activity feeds | `dashboard.html` `#dpFeedStudent` / `#dpFeedCompany` | **Wired** (§2.5d) — six sample events each, shown until `activity` is sent. | §2.5d. |
| Dashboard heatmap | `dashboard.html` `#dpHeat` / `#dpHeatCo` | `buildHeat()` in `assets/dashboard.js` still fills all 371 cells per grid from a seeded PRNG — that part is cosmetic, not real per-day data. The **total each grid sums to is wired**, though: company's from `company.briefs[].submitted` (§2.8), student's from a direct `heatTotal` field (§2.7). | §2.7. |
| Company overview charts | `dashboard.html` company view: 6-metric row, hiring funnel, monthly chart, brief table, discipline split | **Wired, not just sample data** (§2.8) — send real `metrics`/`funnel`/`monthly`/`briefs` and it renders; the discipline split and all prose notes are computed from that data, not separate fields. Until wired, the sample figures shown are internally consistent by construction (everything derives from 96 submissions / 31 above bar / 5 briefs), so if you change one for a screenshot, re-derive the rest. | §2.8. |
| Every front-end-only form | `login.html`, `signup.html`, footer "get notified" capture | Each carries an empty `data-endpoint`. With nothing set they say the wiring is pending rather than faking a success — reuse that convention for any new form. | §2.1–§2.2. |
| Google sign-in button | `login.html`, `signup.html` (`[data-oauth="google"]`) | A real, styled button with **no OAuth wired at all** — clicking it reports "not connected yet" through the shared status region. | §2.1.1. |
| Edit profile | `dashboard.html` | **Wired** (§2.10) — genuinely saves, but only to `localStorage` on that one device until `#editForm`'s `data-endpoint` is set; the dialog says so in its own copy either way. | §2.10. |
| Inert action buttons | `dashboard.html` | Schedule / Compare / Book interviews / View submission are real `<button type="button">` elements with no handler (they were `href="#"` anchors until the Sep 2026 bugs check — those scrolled the page to the top on every click). Clicking one does nothing, visibly. | No spec yet — ask before building; not covered further in this doc. |
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

Every seam below is now a genuine "point `data-endpoint` at a URL" job —
none of them need new render code written, only real data sent in the
documented shape.

| # | Where | Selector | Method | Status |
|---|---|---|---|---|
| 2.1 | `signup.html` | `#signupForm[data-endpoint]` | POST | Wired, needs a URL |
| 2.1.1 | `login.html` / `signup.html` | `[data-oauth="google"]` | — | Stub only, needs a real flow |
| 2.2 | `login.html` | `#loginForm[data-endpoint]` | POST | Wired, needs a URL |
| 2.3 | every footer | `#footerNotify[data-endpoint]` | POST | Wired, needs a URL |
| 2.4 | `challenges.html` | `#clGrid[data-endpoint]` | GET | Wired, needs a URL |
| 2.5 | `dashboard.html` | `body.dash-page[data-endpoint]` | GET | **Fully wired (Sep 2026)** — profile, role, empty-state |
| 2.5a | `dashboard.html` | `.dp-metrics` (student's 3-item row) | (via 2.5, `data.metrics`) | Wired |
| 2.5b | `dashboard.html` | `#dpEntries` (student past hackathons) | (via 2.5, `data.entries`) | Wired, incl. `data-hk-*` generation |
| 2.5c | `dashboard.html` | `#dpCandidates` (company ranked list) | (via 2.5, `data.candidates`) | Wired |
| 2.5d | `dashboard.html` | `#dpFeedStudent` / `#dpFeedCompany` | (via 2.5, `data.activity`) | Wired |
| 2.6 | `dashboard.html` | entry rows, `data-hk-*` | — | Wired via attributes, generated by 2.5b, no fetch of its own |
| 2.7 | `dashboard.html` | `#dpHeat` / `#dpHeatCo` | (via 2.5, `data.heatTotal` / `data.company.briefs`) | Heading total wired for both roles; per-day grid is still cosmetic filler, not real data — see §2.7 |
| 2.8 | `dashboard.html` company view | 6-metric row, funnel, monthly chart, brief table, discipline split | GET (via 2.5, `data.company`) | **Wired (Sep 2026)** — send the four arrays, get all five sections and their notes |
| 2.9 | `dashboard.html` | `window.ProjetDashboard.setView()` / `.showEmpty()` | — | JS hooks, call directly once real auth exists |
| 2.10 | `dashboard.html` | `#editForm[data-endpoint]` | PATCH | Wired, needs a URL |

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

**It really does POST once you set the endpoint.** Worth stating because
it did not until the Sep 2026 deep bugs check: the wired path printed
"Thanks. You're on the list." without calling `fetch` at all, so pointing
`data-endpoint` at a real route would have confirmed a signup that never
left the browser. Now:

- **2xx** → "Thanks. You're on the list." and the field clears.
- **409** → "That address is already on the list." Return this if you
  want the duplicate case worded that way; any other non-2xx gets a
  generic retry message.
- **Network failure** → a generic "Couldn't reach the server" line. The
  browser's own error text is deliberately never shown.
- Double submits are ignored while a request is in flight.

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

**An empty list is not a failure, and is handled separately.** A failed
request, a non-2xx or a malformed body all leave the sample cards
untouched on purpose — a readable list beats an error state. But sending
`{"challenges": []}` clears the samples, hides the filter row and shows
`#clNone` ("No open challenges right now"). Until the Sep 2026 deep bugs
check an empty array went down the same do-nothing path as a network
error, which left twelve **sample** briefs on screen, naming companies
that do not exist. Send `[]` when the backlog is empty and the page says
so honestly.

There are two distinct empty states here and they mean different things:
`#clNone` (`.cl-none`) is "the API returned nothing"; `#clEmpty`
(`.cl-empty`) is the filter's own "nothing in that discipline". Don't
merge them.

**When this goes live**, also drop `challenges.html`'s
`<meta name="robots" content="noindex">` and add the page to
`sitemap.xml` (see the pre-launch checklist).

### 2.5. Dashboard profile, role, and empty state

`assets/dashboard.js` fetches `body.dash-page[data-endpoint]` once, and
that single response now drives every section on the page (2.5a–2.5d,
2.7 and 2.8 below all read from it too — there is only ever one fetch).

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
  "metrics":    [ /* student's 3-item row — see §2.5a */ ],
  "entries":    [ /* student: past hackathons — see §2.5b */ ],
  "candidates": [ /* company: ranked submissions — see §2.5c */ ],
  "activity":   [ /* whichever feed matches `role` — see §2.5d */ ],
  "heatTotal":  52,                /* student heatmap total — see §2.7 */
  "company":    { /* company: the six charts — see §2.8 */ }
}
```

What happens on a successful fetch:
- `data.profile` merges over the matching sample profile (`student` or
  `company`) in `PROFILES`.
- `data.role` calls `setView(data.role)`, which also re-tints the page
  via `html[data-audience]`.
- `Array.isArray(data.entries)` with length `0` triggers the student
  empty state (`showEmpty(true)`); a non-empty array also renders it
  (§2.5b).
- `data.metrics`, if the role is `student`, renders the 3-item row
  (§2.5a). Company's own metrics row is a separate field, `company.metrics`
  (§2.8) — the two rows have different shapes (3 plain vs. 6 with a
  delta), so they're deliberately not the same field.
- `data.candidates`, if present, renders the ranked list (§2.5c).
- `data.activity`, if present, renders whichever feed matches `role`
  (§2.5d).
- `data.heatTotal`, if the role is `student`, re-syncs the heatmap
  heading (§2.7).
- `data.company`, if present, calls `renderCompanyOverview(data.company)`
  (§2.8).

Every one of these fails soft independently: an absent or empty field
just leaves that section's sample content in place, same as the rest of
the site's forms and lists.

### 2.5a. Student metrics row

`.dp-metrics:not(.dp-metrics--six)`, from `data.metrics` — a flat array
of `{ value, label }`, always 3 items in the shipped layout (Latest
score / Latest fit / Latest rank), no delta field (unlike the company
row in §2.8, which does carry one).

### 2.5b. Student past-hackathon entries

`#dpEntries`, from `data.entries`. Each entry becomes a `<button
class="dp-card" data-hk data-hk-*="...">` — the same markup and
attributes the entry-detail modal already reads (§2.6), generated fresh
each time so the modal needs no code changes at all.

```jsonc
{
  "title": "Onboarding conversion", "company": "Nordwave", "discipline": "Product",
  "date": "Aug 2026", "rank": 4, "entrants": 38, "score": 85, "fit": 83,
  "status": "Interview", "statusKind": "win",              // "win" | "quiet" — drives the pill's colour
  "solution": "Reworked the first-run flow so...",
  "breakdown": [{ "label": "Problem framing", "score": 88 }, { "label": "Execution", "score": 86 }],
  "feedback": "Clear reasoning from their funnel data."
}
```

`breakdown` accepts either that array shape or the modal's own raw
`"Label:score,Label:score"` string — `renderEntries()` flattens the
array into that string internally, so send whichever is easier on your
end. The section's own "N entries" / "Showing all N entries" text is
recomputed from `entries.length`, not hardcoded.

**Rank-badge tier is decorative, not a numeric readout** (the rank number
is already the row's own text): the first entry in the array gets the
accent-highlighted tier, the last gets the muted one, everything between
is the plain default fill — a simple first/last split rather than a
proportional one, so it stays sensible at any list length. Send `entries`
in whatever order you want that highlight to land on (newest-first, to
match the sample).

### 2.5c. Company candidates

`#dpCandidates`, from `data.candidates`.

```jsonc
{ "name": "Tan Wei Jie", "meta": "NUS · Year 3 Computer Science",
  "skills": ["React", "TypeScript"], "score": 94, "fit": 92, "rank": 1 }
```

Populates `data-skills`/`data-name` on each generated card too, so the
existing skill-filter and search box (`#dpSearch`, the four
`.dp-filter` buttons) keep working against real cards with no changes —
`assets/dashboard.js`'s `applyCandidateFilter()` re-queries `.dp-card`
from the DOM on every call rather than caching a NodeList once, so a
render happening after the filter's listeners were already wired doesn't
strand it (a real bug this fixed: the previous version cached the
sample cards at page load and hardcoded "38" as the total shown-count,
both of which broke the moment a real list replaced the sample one).
Same first/last rank-badge tiering as §2.5b — the Schedule button is
`.btn-primary` on the top-tier row, `.btn-ghost` on every other.

**The four skill-filter chips (React / A11y / Node) are fixed, not
generated from whichever skills happen to be in the current list** — a
hiring lead filters by the skills they usually care about, not by
whatever one fetch happens to contain. Add/remove `.dp-filter` buttons
in `dashboard.html` directly if the set of skills worth filtering by
changes; nothing in the JS needs updating to match, since a filter
simply matches its own `data-skill` substring against each card's
`data-skills`.

### 2.5d. Activity feed

`#dpFeedStudent` / `#dpFeedCompany` (`assets/dashboard.js` picks
whichever matches `role`), from `data.activity`.

```jsonc
{ "kind": "win" | "score" | null, "title": "Shortlisted for interview",
  "sub": "Nordwave · Onboarding conversion", "date": "28 Aug 2026" }
```

`kind` drives the feed dot's colour (omit it, or send `null`, for a
plain neutral dot — used by the sample data for "submitted"/"joined"
style events that aren't a win or a score). The tab's own "N events"
count is recomputed from the real feed's length once it renders.

### 2.6. Entry detail modal (student past-hackathon rows)

No fetch of its own — generated by §2.5b. Each row carries its whole
modal payload as `data-hk-*` attributes, read fresh every time it's
opened: `title`, `company`, `discipline`, `date`, `rank`, `entrants`,
`score`, `fit`, `status`, `status-kind` (`win` | `quiet`), `solution`,
`breakdown`, `feedback`. `breakdown` on the DOM attribute is always the
comma-separated `"Label:score"` string; send the array shape in §2.5b's
JSON and `renderEntries()` converts it for you.

### 2.7. Contribution heatmap

`buildHeat(isCompany)` in `assets/dashboard.js` fills `#dpHeat`
(student) / `#dpHeatCo` (company), 53 weeks × 7 days per grid. **Two
different things are wired here, and only one of them is real data —
read this before assuming the whole grid reflects real per-day counts:**

- **The heading total** (the number in "N submissions/contributions in
  the last year") is real once you send it: `company.briefs[].submitted`
  summed (§2.8, no separate field needed) drives the company grid's
  total; the top-level `heatTotal` field (§2.5) drives the student
  grid's, since entries (§2.5b, individual completed hackathons) aren't
  the same count as the broader "entered, scored, ranked" activity the
  student heatmap claims to cover — there's nothing else in this file's
  shape to derive it from, so it has to be sent directly.
- **Which individual days are "active," and how heavily** is still a
  seeded PRNG, cosmetically distributed to sum to that real total — not
  actual per-day counts from your database. If real day-by-day activity
  ever matters (not just the yearly total), replace the cell-generation
  loop in `buildHeat()` with real data: it wants `{ level: 0-4, count,
  date }` per cell, oldest first, column by column — `level` drives the
  colour, `count`/`date` drive the hover tooltip, and the two need to
  agree (derive `count` from `level`, or vice versa, whichever your data
  naturally gives you — never draw them independently, or a darker cell
  can end up with a smaller tooltip figure than a lighter one beside it).

**A real bug the total-wiring caught, worth knowing if you touch this
function**: every "active" cell is floored to `count >= 1`, and for a
small `heatTotal` (a brand-new account with only a handful of events)
that floor alone can sum past the real total, since it forces more
total activity than the number actually calls for — confirmed with a
target of 33 against ~111 candidate active days, which floored to 114
before this was fixed. `buildHeat()` now caps the number of active cells
at the target total before distributing it (dropping the
weakest-weighted candidates first), so this can't recur regardless of
how small a real total ends up being.

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

### 2.10. Edit profile (dashboard.html) — wired, needs a URL

`#editForm[data-endpoint]`, same convention as every other seam. Empty
(the shipped default): saves only to `localStorage["projet:profile"]`,
and the dialog's own note says exactly that ("Saved on this device
only..."). Set the attribute to a real URL and three things change
automatically, no other code to touch:

```
PATCH <data-endpoint>
Content-Type: application/json

{ "name": "...", "org": "...", "loc": "...", "bio": "...", "tags": "Figma, Front-end, A11y" }
```

- The dialog's own note switches to "Saved to your account." (read once
  at page load, from whether the attribute is set — see
  `assets/dashboard.js`, the block right after `editForm` is looked up).
- Submitting PATCHes that endpoint. On success, the status line says
  "Saved." — a real account save, not the local one.
- On a network error or non-2xx, it **fails soft into the existing local
  save** rather than losing the edit or claiming a false success: the
  edit still applies to the page and still writes to `localStorage`, but
  the status line says "Couldn't reach the server — Saved on this
  device." rather than silently claiming the account save worked.

`reapplyProfileEdits` (in `assets/dashboard.js`) still re-applies
whatever's in `localStorage` on a role switch, regardless of whether an
endpoint is set — that part didn't need to change, since even a real
account save should feel instant on this same device without waiting on
a re-fetch. Once a real account exists, the local copy becomes a client-
side cache of the last known save rather than the only copy — nothing
here needs to delete it.

Tested with a stubbed `fetch` (this environment's dev server can't
itself serve a `PATCH`) confirming the exact method/headers/body sent,
and all three paths — success, request failure, and no endpoint set —
end with the correct status text and, in every case, the visible profile
already showing the edit.

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
  View submission are `<button type="button">` placeholders with no
  handler and no spec yet. When they get one, the `renderCandidates()`
  template in `assets/dashboard.js` is where the per-candidate Schedule
  button is generated — attach a delegated click handler on
  `#dpCandidates` rather than per-button, since that list is rebuilt on
  every fetch.
- **Terms / privacy links** on `signup.html` are plain text, not links —
  no such pages exist yet.
- **`archive/` folder removal** — see the pre-launch checklist. Not a
  backend question, but flagged here since it's the one item in this
  handover that's a "delete this" instruction rather than a "build this."

---

## 3.1. Sending data this front end won't choke on

From the second, deeper bugs pass (Sep 2026), which drove malformed,
empty, hostile and oversized payloads through every render function.
Nothing below throws any more, but two of these produce *wrong* output
rather than an error, so they are worth knowing before you build the API:

- **Send numbers as numbers.** `"submitted": "40"` (a string) used to be
  concatenated rather than added — two briefs summed to `"04030"`, which
  then drove the brief-table note, the discipline percentages and the
  heatmap total. Every figure is coerced with a `num()` helper now, so a
  string won't break it, but numeric JSON types are still what to send.
- **Zero is a real value and is honoured.** A company with briefs posted
  and no submissions yet correctly renders 0 everywhere, including the
  heatmap heading. (It used to fall back to the sample 96 there, because
  the guard was a truthiness test.)
- **Disciplines outside Product / Engineering / Data / Design** all fall
  into one shared "Other" segment, labelled "Other". Two unknown
  disciplines will be summed together, so if Marketing and Legal both
  matter as separate lines, add them to `DISCIPLINE_SEGS` in
  `assets/dashboard.js` (and give each a colour in `dashboard.css`).
- **Array lengths are not clamped.** The six-metric row, the 12-month
  chart and the funnel render exactly what you send; sending 14 metrics
  lays out 14. Stick to the documented counts.
- **Every string is escaped** (`textContent` throughout, verified with
  script payloads in every field), so markup in a name or title renders
  as visible text rather than executing. It will still look wrong, so
  sanitise server-side.
- **Long unbroken strings** (a pasted URL in a name field, a 60-character
  skill tag) now wrap instead of pushing the page into horizontal scroll,
  but they are ugly. Validate lengths on input.

---

## 3.2. Fixtures and the smoke test

Two things in the repo exist to make wiring the API a shorter conversation
than reading §2.

### `fixtures/` — sample responses you can point a seam at

Static JSON matching every response shape the front end reads, including
the awkward cases. Serve the repo and set the relevant `data-endpoint` to
a fixture path:

| Fixture | Seam | What it proves |
|---|---|---|
| `dashboard-student.json` | `<body class="dash-page">` | Full student dashboard renders |
| `dashboard-student-empty.json` | same | `entries: []` drives the empty state |
| `dashboard-company.json` | same | All six company charts, every figure derived from `briefs[]` |
| `dashboard-company-empty.json` | same | A company with **zero** submissions reads 0 everywhere |
| `challenges.json` | `#clGrid` | Live briefs replace the twelve samples |
| `challenges-empty.json` | same | An empty backlog shows a real empty state, not sample briefs |

If your response renders wrong, diff it against the matching fixture —
that difference is the bug. `fixtures/README.md` has the details.

### `test/smoke.mjs` — run it before you push

```
node test/smoke.mjs              # everything
node test/smoke.mjs --pages      # the seven pages only
node test/smoke.mjs --fixtures   # the seams only
```

Dependency-free (no `npm install`), needs **Node 22+** and any Chrome or
Chromium — set `CHROME_PATH` if it isn't found automatically. It spawns
its own static server and browser, so nothing needs to be running first.
Exit code is 1 on any failure.

Across the seven pages at desktop and phone width it checks: uncaught
exceptions, `console.error`, failed local requests, horizontal overflow,
duplicate ids, skipped heading levels, `<h1>` count, missing `alt`, broken
images, unlabelled inputs, buttons with no accessible name,
`target="_blank"` without `rel="noopener"`, in-page anchors with no target,
and `href="#"` links. Then it loads each fixture through the real seam and
asserts the rendered result.

`.github/workflows/smoke.yml` runs it on every push and PR.

**It is verified to actually fail.** Injecting a dead link, a duplicate id
and a short fixture was caught as seven failures with exit code 1 — worth
re-checking if you ever change the harness, since a smoke test that cannot
fail is worse than none.

---

## 4. Bugs check (Sep 2026) — what was verified, what wasn't, what's yours

A full functionality / compatibility / performance / security / visual
pass was run before this handover. Everything below "Verified clean" was
actually executed in a headless browser against every page at desktop
(1440) and phone (390) width, not read off the source. The fixes it
produced are in the git history (commit "Bugs check…") and described in
`CLAUDE.md` under "v3.9 updates".

### Verified clean

- **Functionality.** Every nav/footer/CTA link resolves; no `#` dead
  links remain (the dashboard's placeholder actions are now real
  `<button type="button">`s — see the checklist row); no broken images;
  no local 404s; zero console errors and zero uncaught exceptions on all
  seven pages. Every interactive control was driven and checked: the
  audience toggle (desktop + mobile menu), the mobile menu open/close,
  the featured-challenge rail arrows + ticket modal, the challenges
  filter + brief modal, the FAQ accordion, the about-page story pin, the
  dashboard tabs (mouse + arrow keys), candidate search/filters + empty
  state, the entry-detail and edit-profile modals, the heatmap tooltip,
  the footer capture, both auth forms' validation and their honest
  "not connected yet" states, the Google stub, and the login↔signup
  switch. All forms behave as §2 documents.
- **Accessibility.** Every image has `alt` + `width`/`height`; every
  input is labelled; every button has a name; no duplicate ids; heading
  order is skip-free on every page (dashboard now has an `<h1>`); both
  `target="_blank"` links carry `rel="noopener noreferrer"`; every
  interactive element clears the 24×24 minimum on a 390px screen. Text
  contrast was measured from computed styles on every visible node —
  three real AA failures were found and fixed; the remaining flags are
  text over gradients, where the probe can't read the real backdrop.
- **Layout.** Zero horizontal overflow on every page at both widths;
  cumulative layout shift 0.0000 on every page (with fonts unavailable —
  see below). Mobile: the company brief table scrolls inside its own
  container, the six-metric grid drops to two columns.
- **Injection.** `?role=` and `?view=` are the only URL inputs the front
  end reads; both are matched against fixed allow-lists and never
  written into markup. No inline event handlers anywhere; every piece of
  dynamic text goes through `textContent`. No third-party scripts at all
  — the only external requests are the two font CDNs, both `https`.

### Could NOT be verified from the build environment — please check

- **Browsers other than Chromium.** Only headless Chromium runs in the
  sandbox. Nothing in the CSS/JS is outside the evergreen baseline
  (`svh` has a `vh` fallback line, `image-set()` is inside `@supports`,
  `<dialog>`, `inert`, `backdrop-filter`, scroll-snap are all baseline
  across Chrome/Firefox/Safari/Edge), but a real pass in **Safari
  (macOS + iOS)**, **Firefox** and **Edge** is still owed. The two
  Safari-specific things to eyeball: the sticky How-it-works pin and the
  auth page's `100svh` stage on iOS with the address bar collapsing.
- **Real devices.** Responsive layouts were checked by viewport
  emulation, not on hardware. Worth 10 minutes on one iPhone and one
  Android phone — touch scrolling the featured-challenge rail and the
  brief table especially.
- **Webfont layout shift.** The sandbox blocks Fontshare/Google Fonts,
  so the CLS figure above was measured with fallback fonts. Satoshi and
  JetBrains Mono load with `display=swap`, so expect a small swap shift
  on a cold cache. If it's visible, the fix is a `<link rel="preload">`
  for the two WOFF2 files, not a code change.
- **Network speed.** Page weight is small (see below) but wasn't
  throttled — run Lighthouse once against the deployed URL, on a 4G
  profile.

### Security — the parts that are the API's, not the front end's

Listed so nobody assumes the front end covers them:

- **SSL/HTTPS.** Hosting concern. Every resource the pages request is
  already `https://`, so there's no mixed content to fix once the site
  is served over TLS. Add HSTS at the host.
- **SQL/NoSQL injection.** Server-side only. The front end sends plain
  JSON (`{ email, password, role, … }`, see §2.1) — treat every field as
  untrusted and use parameterised queries / a schema validator on the
  Mongo side. Nothing the front end does prevents injection; nothing it
  does needs to.
- **Password rules.** The signup field enforces `minlength="8"` and the
  browser's own `type="password"` handling, nothing more. Length,
  breach-list checks, hashing (bcrypt/argon2), rate limiting and lockout
  are the API's. The front end will display whatever `error` string the
  API returns for a rejected password (§2.1).
- **CSRF / sessions / cookies.** See §3 — no token handling exists yet
  because there's no API to agree it with.
- **Dependencies.** There are none. No npm, no framework, no bundler,
  no third-party script — so there is nothing to keep patched on the
  front end. The one "component" is the vendored `.claude/skills/
  impeccable/` design tool, which is dev-only and never served.

### Deploy weight — most of `assets/` should not ship

`assets/` is **31.8MB**, but the live pages load about **1.3MB** of it
(fonts excluded). The rest is masters and retired artwork kept on disk
for regeneration, which this repo's conventions deliberately preserve
but which has no business on a CDN:

| Size | File | Why it's there |
|---|---|---|
| 18.7MB | `fluid_animation_3500ms.mp4` | raw 4K master, referenced by no page |
| 2.7MB + 0.9MB | `fluid-loop.mp4` / `.webm` | the retired final-CTA video |
| 2.7MB | `official-spectrum.png` | master for the retired spectrum split |
| 1.2MB | `fluid-full.png` | master for the How-it-works AVIF/WebP |
| 1.2MB + 0.6MB | `Logo Background 2.png` / `4.png` | masters for retired hero art |
| 0.8MB + 0.5MB | `founder-le-mai-thi.png` / `founder-andrei-loh.png` | 800px originals; the live avatars are the 168px `.webp` |
| 0.6MB | `fluid-foreground.png` | Figma layer export, unused |
| 0.4MB | `hero-visual.avif` / `.webp`, `fluid.webp` | retired v2 hero/poster |
| ~0.2MB | `Logo Full *.png`, `Logo 3 V2*.png`, `Logo O Alone.png`, `icon-mark.png`, `Test.png`, `favicon.svg` | raw logo exports; the live logos are `logo-dark.png`/`logo-white.png` + the generated favicons |

Plus `archive/` (7.3MB) — already on the checklist.

**Recommendation:** either exclude the above from the deploy (a
`.vercelignore`/`.netlifyignore`/build-copy step listing them), or move
the masters into a `masters/` folder outside the web root before the
first deploy. Do not delete them without checking `CLAUDE.md`'s "Known
issues" #3 and #5 first — the regeneration commands there depend on the
`.png` masters. A one-line check for what's actually loaded: open each
page with DevTools' Network panel and filter by `assets/`.
