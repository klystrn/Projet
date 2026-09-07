# Backend handoff

Front end is done and self-contained. **Nothing on this site talks to a server
yet, by design.** This note is the whole contract.

Division of labour: front end / UI-UX is handled in this repo; the API and data
layer (MongoDB) are Andrei's.

## The convention every seam follows

A seam is an **empty `data-endpoint` attribute**. Set it to a real path and the
feature starts working with no other change. While it is empty:

- forms validate normally and then say the wiring is pending — they never fake
  a success, because nobody should walk away believing they have an account;
- content lists render the sample data already in the HTML, so every page is
  readable before the API exists **and stays readable if the API is down**.

That second half is deliberate. Every fetch below fails soft: a network error,
a non-2xx, or a malformed body leaves what is already on the page alone.
Replacing a readable list with an error state would be strictly worse.

Sample content is tracked separately in `PLACEHOLDERS.md`.

## Seams at a glance

| # | Where | Attribute | Method | What it drives |
|---|---|---|---|---|
| 1 | `signup.html` | `#signupForm[data-endpoint]` | POST | Create account |
| 2 | `login.html` | `#loginForm[data-endpoint]` | POST | Log in |
| 3 | every page footer | `#footerNotify[data-endpoint]` | POST | "Notify me" capture |
| 4 | `challenges.html` | `#clGrid[data-endpoint]` | GET | The live challenge listing |
| 5 | `dashboard.html` | `body.dash-page[data-endpoint]` | GET | Profile, metrics, entries, candidates |
| 6 | `dashboard.html` | — | — | Which view (see below) |

---

## 1 + 2. Auth

Both forms already handle: required/format/min-length validation, per-field
error messaging, `aria-invalid` state, focus management to the first bad field,
a busy state on the submit button, and a form-level status region wired to
`aria-live`. `assets/site.js` owns the single `fetch`.

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

A non-JSON body is tolerated — the UI falls back to a generic error string.

### The `role` field

`role` is `"business"` or `"builder"` and is how the two sides of the product
are distinguished. The front end resolves it from the `?role=` query param,
which the marketing CTAs pass (`signup.html?role=business`); `landing.js`
rewrites every `a[href^="signup.html"]` to carry the current audience mode, so
the nav CTA prefills the picker for free. There is no default-checked radio —
arriving with a role silently pre-picked read as the page deciding for the
reader.

The value is only ever a hint for pre-selecting the radio. **Treat the posted
`role` as user input and validate it server-side.**

## 3. Footer "notify me" capture

```
POST <data-endpoint>
{ "email": "..." }
```

Same honesty rule: with no endpoint it says so rather than thanking the
visitor for a signup that did not happen. `assets/landing.js` owns it.

## 4. Challenge listing

`assets/challenges.js` fetches `#clGrid[data-endpoint]` and rebuilds the grid.
The filter and the brief modal are both delegated, so they keep working across
a re-render. On success the "Sample briefs, not live listings" banner hides
itself and the grid's `data-placeholder` marker is removed.

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

`status` drives the pill's colour ladder and is independent of `statusLabel`,
so the wording can change without touching CSS. `deadline`, `posted` and
`effort` are **display strings**, not timestamps — the front end never
formats them, so the API decides the wording.

**When this goes live**, also: remove `challenges.html`'s
`<meta name="robots" content="noindex">` and add the page to `sitemap.xml`.
Listing a noindex URL in a sitemap is a contradictory signal, which is why it
is not there already.

## 5. Dashboard data

`assets/dashboard.js` fetches `body.dash-page[data-endpoint]`.

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
  "metrics":    [{ "value": "85", "label": "Latest score" }],
  "entries":    [ /* student: past challenges */ ],
  "candidates": [ /* company: ranked submissions */ ]
}
```

An empty `entries` array drives the student empty state — `showEmpty(true)`
already handles the swap.

### Entry detail modal

Each past-hackathon row carries its whole modal payload as `data-hk-*`
attributes, read fresh on every open: `title`, `company`, `discipline`,
`date`, `rank`, `entrants`, `score`, `fit`, `status`, `status-kind`
(`win` | `quiet`), `solution`, `breakdown`, `feedback`. Render those from the
API and the modal needs no changes. `breakdown` is a comma-separated
`"Label:score"` list, e.g. `"Problem framing:88,Execution:86"`.

### Contribution heatmap

`buildHeat()` currently fills the grid from a seeded PRNG so the sample
history is at least stable across reloads. Replace its body with real
per-day counts: **53 weeks × 7 days of levels 0–4, oldest first, column by
column.** The heading text is derived from the same data, so it stays correct
for free.

### Edit profile

Deliberately real but local: it writes `localStorage["projet:profile"]` and
the dialog says exactly that in its own copy. Point it at a `PATCH` endpoint
and delete the localStorage read/write — `reapplyProfileEdits` is the only
other thing it touches.

## 6. Which dashboard view

Right now the view comes from `?view=student|company`, else the saved audience
mode. **There is no view switch on the page at all**: reaching the dashboard
means being signed in, so the audience is a fact about the account rather than
a preference, and the nav's For students / For companies toggle is
deliberately absent there.

Once auth exists, call `window.ProjetDashboard.setView(roleFromSession)`
instead of reading `?view=`. `setView()` is also what re-tints the page, by
setting `html[data-audience]` — nothing else needs to know about the role.

## Still needs a decision

- **Sessions.** No token or cookie handling on the front end. If you return a
  JWT rather than setting an httpOnly cookie, tell me and I'll add storage plus
  an authenticated nav state. `localStorage["projet:loggedIn"]` is currently
  set as a hint only, and drives nothing but the hero CTA's label.
- **Password reset** — no page exists yet.
- **Email verification** — no page exists yet.
- **Social / SSO** — no buttons; say the word and I'll add them.
- **CSRF.** If the API expects a token, tell me where to read it from and I'll
  attach it to the request headers.
- **Brief detail pages.** Challenge cards are deliberately not links: there is
  no per-brief URL yet, and a card that looked clickable but went nowhere is
  the dead end the listing page was built to remove. If briefs get real URLs,
  say so and the cards become links.
- **Inert actions.** Schedule / Compare / Book interviews / View submission are
  `href="#"` placeholders.
- The terms / privacy links on `signup.html` are plain text, not links —
  there are no such pages yet.
