# Backend handoff — auth

Front end is done and self-contained. **Nothing on this site talks to a server
yet, by design.** This note is the whole contract.

Division of labour: front end / UI-UX is handled in this repo; the API and data
layer (MongoDB) are Andrei's.

## What exists

| File | What it is |
|---|---|
| `signup.html` | Create-account form — role, name, email, password |
| `login.html` | Log-in form — email, password |
| `assets/site.js` | Validation, error/pending states, and the single `fetch` call |

Both forms already handle: required/format/min-length validation, per-field
error messaging, `aria-invalid` state, focus management to the first bad field,
a busy state on the submit button, and a form-level status region wired to
`aria-live`.

## Wiring it up

Each form carries an empty `data-endpoint`. Set it and the form starts working
with no other change:

```html
<form id="signupForm" data-auth-form data-endpoint="/api/auth/signup" novalidate>
<form id="loginForm"  data-auth-form data-endpoint="/api/auth/login"  novalidate>
```

While `data-endpoint` is empty the form validates normally and then says
accounts aren't connected yet. It deliberately does **not** fake a success —
nobody should walk away believing they have an account.

## Contract

```
POST <data-endpoint>
Content-Type: application/json

signup  { role: "business" | "builder", name, email, password }
login   { email, password }
```

Responses:

| Status | Body | Front-end behaviour |
|---|---|---|
| 2xx | `{ "redirect": "/dashboard" }` | Navigates to `redirect` (falls back to `business.html`) |
| non-2xx | `{ "message": "Email already in use" }` | Shows `message` in the status region, clears the busy state |

A non-JSON body is tolerated — the UI falls back to a generic error string.

## The `role` field

`role` is `"business"` or `"builder"` and is how the two sides of the product
are distinguished. The front end resolves it in this order:

1. `?role=` query param (the marketing CTAs pass this, e.g.
   `signup.html?role=business`)
2. `localStorage["projet:mode"]` — set when someone picks a side on the
   split-hero chooser
3. the radio's default (`business`)

The value is only ever a hint for pre-selecting the radio. **Treat the posted
`role` as user input and validate it server-side.**

## Not done / needs a decision

- **Sessions.** No token or cookie handling on the front end. If you return a
  JWT rather than setting an httpOnly cookie, tell me and I'll add storage plus
  an authenticated nav state (logged-in avatar / log out).
- **Password reset** — no page exists yet.
- **Email verification** — no page exists yet.
- **Social / SSO** — no buttons; say the word and I'll add them.
- **CSRF.** If the API expects a token, tell me where to read it from and I'll
  attach it to the request headers.
- The terms / privacy links on `signup.html` are plain text, not links —
  there are no such pages yet.
