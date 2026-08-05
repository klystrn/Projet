# Projet — website work: handoff from Claude.ai chat

This file exists so Claude Code has full context on a website project that
started in a Claude.ai conversation. Read this before doing anything else
in this folder.

## Who/what Projet is

Projet is a Singapore pre-seed startup ("hiring on proof") shifting hiring
from resume-based to proof-based: a company posts a real brief from its own
backlog, candidates submit work anonymously, and — the core differentiator —
candidates must **defend their work live**, in a 15-minute call scored on a
rubric (Ownership 40% / Technical depth 25% / Live navigation 20% /
Communication 15%, pass at 3.5/5). The pitch is that AI can generate a
portfolio or a take-home, but it can't sit in the room and defend decisions
under questioning.

- **Website**: myprojet.co
- **Stage**: Pre-seed, raising S$500k, applying to the Block71 @ NUS
  incubator
- **Team**: Le Mai Thi (CEO, NUS Mechatronics), Andrei Loh (Platform & Ops,
  NUS Data Science and Analytics), and the person you're working with now
  (design/web dev consultant, possible future co-founder — design/eng)
- **Business model**: S$250 to list a brief, S$500 to unlock a candidate's
  identity after the defense (charged post-decision, no success fee)
- **Traction**: "Hack & Hire" pilot at Block71 @ NUS — 120+ student
  builders, 7 companies, 10+ live defenses run, 2 hires

The live copy/voice now lives in `index.html` — treat that as the source of
truth, not this summary. (The old `projet-landing.html`, which used to hold
it, is archived; see "Site architecture" below.)

## Brand tokens

```
Ink (near-black):     #14130f   (split-hero prototype uses #08080a, close enough — reconcile if it matters)
Signal orange:        #ff5b24   (primary brand accent, from the real Figma logo file)
Orange deep (hover):  #c73e10 / #c73e10
Navy (from spectrum):  #161c3f / #0c1638
Paper / warm card bg: #ffffff / #f5f4ef
Hairline:             #e6e3da

Display + body font:  Satoshi (via Fontshare: https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap)
Mono / labels / data: JetBrains Mono (Google Fonts)
```

The real logo is "Pr" + a circular orange icon + "jet" set in Satoshi
Black. **Resolved** — the real exports are committed and in use: trimmed
web copies at `assets/logo-dark.png` (light backgrounds) and
`assets/logo-white.png` (dark backgrounds), with favicons generated from the
icon mark (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`). The
originals are also in `assets/` (`Logo Full Black/White/Orange.png`, etc.).

## Figma source files

- **Pitch deck assets / logo exploration** (view-only to the user):
  `https://www.figma.com/design/tdMO3Okc6oRz5dby1AalDT/Test-Logo-Thi`
- **User's own editable copy, used for asset exports**:
  `fileKey: KWwUgic3XjFfV5Xyz5VqDI` — "copy-of-Projet-Assets"
  - Node `1:64` — dark logo (text `#171717`, for light backgrounds)
  - Node `1:80` — white logo (for dark backgrounds)
  - Node `1:84` — orange logo (text `#ff5b24`)
  - Node `1:68` — icon mark alone
  - Node `1:23` — "foreground" fluid swirl layer (used in the marketing
    landing page hero/final-CTA as a texture — **note**: user later found
    that the true polished look needs `background` (`1:22`) **and**
    `foreground` (`1:23`) composited together, not foreground alone. This
    was never actually resolved — see "Known issues."
  - Node `1:37` / `1:38` — the diagonal light-spectrum stripe used in the
    marketing landing page (`typographic_gradient_011_03`)

A Figma MCP connector is available and was used successfully in this chat
via `get_metadata`, `get_design_context`, and `download_assets` tools. It
hit a **Starter-plan rate limit** partway through this session — if you
have Figma MCP tools available in Claude Code and need more exports, expect
the same limit; batch requests together rather than calling one node at a
time.

Every asset URL pulled from Figma via these tools
(`https://www.figma.com/api/mcp/asset/...`) is a **presigned URL that
expires after about 7 days**. None of these should be hardcoded into
shipped code — always download/export the actual asset file locally (as
was done for `projet-split-hero/assets/spectrum.jpg`) rather than linking
the API URL directly.

## Site architecture — REBUILT (Aug 2026). Read this first.

**The whole previous multi-page site was scrapped on the user's explicit
instruction.** There is now one page: a landing page at `index.html`, which
is also the entry point (launching the site lands you here — there is no
longer a chooser gate in front of it).

```
index.html          the landing page — the entire public site
login.html          front-end-only auth (kept, still functional)
signup.html         front-end-only auth (kept; ?role= still prefills)
assets/             shared images/video + landing.css + landing.js + site.css
archive/            everything the landing page replaced
```

Everything below is in `archive/` and is **reference only — do not
resurrect any of it as a live page**:

| Archived | Was |
|---|---|
| `business-v1/v2.html`, `builders-v1/v2.html` | the dual-mode audience homepages |
| `projet-split-hero/` | the "pick your side" chooser that used to be the entry point |
| `projet-landing-v1.html` | the original single-file marketing/overview page |
| `challenges-v1.html` | the challenges stub |
| `tools-build-pages.py` | the generator that produced business/builders |

`assets/site.css` and `assets/site.js` are **still live** — `login.html` and
`signup.html` depend on them. Don't delete them when tidying. The landing
page deliberately does *not* use them; it has its own `assets/landing.css`
and `assets/landing.js` so it can evolve without inheriting the old pages'
layout baggage.

## "Light spectrum wave" — the house name for the signature animation

The user named this. It refers to the bar-shear mechanic first built for the
old audience chooser and now used in the Featured challenges / Success
stories split: the spectrum image (`assets/spectrum.webp`) sliced into a
stack of horizontal bars along a seam, which **shear away from whichever
side is active** — each bar offset by its own amplitude on a sine curve
(bulging toward the middle bars) and delayed by index, so the motion reads
as a cascade rather than a rigid block sliding. Use this name for it.

## Copy framing — the deck framing is BACK. This reverses an earlier decision.

An earlier build deliberately removed the pitch-deck framing (live 15-minute
defense, the rubric, Hack & Hire traction) because the then-current home-page
copy came from Andrei's landing repo, which had none of it. **The user has
now explicitly reinstated it**: they specified the How-it-works flow as
"Post/Apply → Async submission → Live 15-min defense → Rubric scoring → Hire
decision" in their own words. So on `index.html`:

- The **live 15-minute defense** is the centrepiece again (hero, step 03).
- The **rubric** is back and rendered as the Rubric Spectrum Bar in step 04
  — Ownership 40% / Technical depth 25% / Live navigation 20% /
  Communication 15%, pass at 3.5/5.
- The **Hack & Hire pilot numbers** are used as the hero statistic and the
  Success-stories problem validation: 120+ builders, 7 companies, 10+ live
  defenses, 2 hires (Block71 @ NUS).

Andrei's `content.ts` copy ("challenge-based talent discovery", "Where real
work is the strongest hiring signal") is **not** what this page is written
from any more. The archived pages still carry it if it's ever needed.

Still true, and unchanged: **"Builder", never "Students"** in visible copy.

## The landing page, section by section

All six sections the user specified, in order, plus a final CTA. Nav and
footer are the two universal components.

### Nav / footer (universal)
Sticky nav, compacts past 48px of scroll. Anchor links to the four
in-page destinations + Log in / Sign up. Collapses to a hamburger below
900px (`#navToggle` / `#mobileMenu`, closes on link tap, Escape, and on
resize past the breakpoint).

### 1. Hero & call to action
Headline "Hire on proof, not paper." (second line carries a spectrum
gradient via `background-clip:text`). **Two CTAs** as specified — "Post a
challenge" (primary) and "Browse challenges" — with the Hack & Hire
statistic directly below them.

Runs the **Spectrum-to-Waveform Hero Handoff**: two stacked layers in
`.hero-visual`, spectrum at rest, crossfading to the dotted waveform
(`Logo Background 2.png`) once scrolled past ~90px. Both layers are always
in the DOM; only opacity moves, so there's no reflow and nothing loads late.

- The `+` in "120+" / "10+" lives **inside** the `<b>`, not as a bare text
  node after it. `.hero-stat-row span` is a flex row, so its `gap` would
  otherwise land between the number and the plus and render "120 + builders".
  (Same class of bug as the old `.cand-left` one — worth remembering: a flex
  `gap` applies between *anonymous* text-node flex items too.)

### 2. Logo carousel
**A true recycling marquee, not a duplicate-and-reset loop** — the user was
explicit that it must not jump back, only reintroduce what scrolled off.
`landing.js` moves each chip from the head of the track to its tail the
moment it clears the left edge and credits the offset back by exactly that
chip's width, so the transform oscillates near zero forever instead of
rewinding. It clones the source chips until the track is ≥2× viewport width
so something is always entering on the right, and pauses via
`IntersectionObserver` when off-screen.

**The logos are PLACEHOLDERS and are not customers.** See "Known issues" #1
— this is the one thing on the page that must not ship as-is.

### 3 + 4. Featured challenges | Success stories
One "light spectrum wave" stage, split down the middle, exactly as
specified: **featured challenges + sign-up CTA on the left, success stories
+ problem validation on the right, defaulting to featured challenges.**

`.spectrum-split` is a 260vh wrapper; `.ss-stage` sticks for the duration.
Scrolling in fades `.ss-veil` (a white sheet matching the page background)
from 1 to 0, so the white background dissolves and the viewer drops into the
spectrum; it fades back up on the way out so the return to the white page is
a transition rather than a cut.

- Hover previews the other side; leaving returns to whichever side is
  *pinned* (the tab choice, or the `challenges` default). Desktop pointers
  only, gated on `(hover:hover) and (pointer:fine)`.
- `.ss-tabs` exists because hover is unreachable on touch and by keyboard.
- **The bars must not overlap the copy.** They are deliberately wider than
  the band (`--bar-w: 1.7 × --stripe-w`) so they fan past it, and that
  overhang has to land on empty panel margin — hence the seam-side padding
  (`.ss-panel--challenges{padding-right}` / `--stories{padding-left}`).
  This was a real bug on the first pass: at 2.5× the fan sat directly over
  the Success-stories headline and stat numbers.
- Active/inactive ratio is 1.5/1, not harder — the inactive side is real
  content, not a teaser, and has to stay readable.
- Below 900px the whole mechanic is dropped: panels stack, both show their
  copy outright, and the band becomes a horizontal divider. A hover-to-expand
  split has no meaning on a screen that can only show one column.
- **Live countdown** (`.ss-countdown`) sits above the featured-challenge
  cards — see "Known issues" #2 for why it's a relative placeholder
  deadline rather than a real one.

### 5. How it works — Fluid Flow Steps
The five steps the user specified. `.flow` is a 460vh wrapper with a sticky
100vh stage; `background-position` on `.flow-fluid` moves continuously
across `fluid-full.png` with scroll progress while the five steps advance,
so it reads as one journey rather than five blocks. Step 04 draws in the
**Rubric Spectrum Bar**.

- **Step transitions are asymmetric on purpose**: outgoing fades in .24s,
  incoming waits .14s then fades in over .5s. All five steps are stacked at
  the same absolute position, so a symmetric crossfade renders two headlines
  legibly on top of each other for a third of a second.
- **The scrim is heavy in the CENTRE, not just at the edges.** A normal
  vignette (dark rim, light middle) put the fluid's brightest cream/orange
  passages directly behind the white step copy and made it unreadable.
- Collapses to a static stacked list below 900px / no-js / reduced motion.
  In those states `.flow-inner` must be `position:relative`, **never
  `static`** — and `.flow-fluid` must not be `position:fixed`, because
  `overflow:hidden` does not clip fixed descendants and the fluid layer
  escapes the section and paints over the spectrum split above it. That was
  a real bug caught on mobile.

### 6. Testimonials
Carousel with statement + person + photo per card, **highlighted main card,
arrow buttons, and a 4s auto-advance**, all as specified. The active card is
centred in the viewport (clamped at both ends so the rail never shows a
half-empty gap). Auto-advance pauses on hover/focus and stops permanently
once the user touches a control; arrow-key support on the rail.

- Quotes, names and avatars are **placeholders** — see "Known issues" #1.
  Avatars are illustrated silhouettes: an inline SVG, a gradient-filled
  circle with a clipped head-and-shoulders shape drawn on top (`clipPath`
  keeps the silhouette inside the circle), deliberately not photographs of
  real people. An earlier pass used gradient circles with text initials
  instead — swapped to silhouettes on the user's explicit choice between
  the two.
- Inactive dots use `rgba(20,19,15,.22)`, **not** `var(--line)` — that beige
  is invisible against the near-white parallax backdrop and left the row
  looking like one stray pill.

## Animation reference library

`Projet — Scroll Animation Library` (the user's markdown doc, supplied in
chat) is the source for the named effects. Implemented from it so far:
Spectrum-to-Waveform Hero Handoff (#1), Section Reveal on Scroll (#2),
Fluid Flow Steps (#3), Rubric Spectrum Bar (#7), Testimonials Fluid
Parallax (#8). Not yet used: Waveform Proof Ticker (#4), Audience Spectrum
Toggle (#5 — moot, the audience toggle is gone), CTA Waveform Pulse (#6),
Defense Spotlight (#9).

**Every scroll-linked effect runs off one shared rAF-gated ticker** in
`landing.js` (`scrollUpdaters`), not its own listener. Enter/exit-only
effects use `IntersectionObserver` instead, since they don't need a
continuous progress value.

**The non-negotiable rule on this page: every effect renders its END STATE
when motion is off or JS never runs — it never just skips.** Verified: under
both `prefers-reduced-motion` and JS-disabled, all five flow steps, all
reveals, all five testimonials and all counters render at their final values.

## Auth / accounts (front end only)

`login.html` and `signup.html` are kept and still work. **They are front end
only — no credentials go anywhere.** Validation, error/pending states and the
fetch call are written; each form just needs its empty `data-endpoint`
attribute pointed at a real route. With no endpoint set the form says
accounts aren't connected yet rather than faking a success.

**Division of labour: this repo is front end / UI-UX only. The API and the
MongoDB layer are Andrei's (co-founder).** The full contract is in
`BACKEND-HANDOFF.md` — read that before touching the auth forms.

Both pages' logo now links to `index.html` (it pointed at the chooser, which
is archived). `signup.html` still reads `?role=` from the query string, which
is what the landing CTAs pass. Its `localStorage["projet:mode"]` fallback is
vestigial now that the chooser is gone — harmless, just never populated.

## Known issues / open tasks

1. **PLACEHOLDER CONTENT — the launch blocker.** Three things on the landing
   page are stand-ins and are marked as such in the HTML:
   - **The logo carousel** — asked and confirmed: generic, obviously-
     fictional company names (Northwind, Acme Labs, Vertex Studio, Meridian
     Co., Lumen Works, Cobalt & Co, Fieldstone, Anchorpoint), not real
     brands. An earlier pass used real names (Google, Apple, etc.) per the
     user's original phrasing ("e.g. Google, apple"); when asked directly
     whether to keep that or go generic, the user chose generic — zero
     trademark/false-clientele risk if this is ever shared or deployed
     before real partners exist. The strip is still labelled "Placeholder
     logos — pending real partners" rather than "trusted by". **Swap for
     real, permissioned partner logos before any public deploy.**
   - **Testimonials** — quotes are invented, attributed to roles only
     ("Hiring lead, early pilot"), never a named real person. Avatars are
     illustrated silhouettes (a clipped head-and-shoulders shape over a
     gradient, `assets/landing.css` `.t-avatar`) — asked and confirmed over
     gradient-initials or empty photo frames. Replace with real,
     permissioned quotes and portraits before launch.
   - **Featured challenge cards** — three sample briefs, not live listings.
2. **The countdown clock — built, into Featured Challenges, on a placeholder
   deadline.** Asked and confirmed: a "next challenge closes in" timer
   (`.ss-countdown` in `index.html`, ticking logic in `landing.js`) sits
   above the challenge cards. It counts down from a **relative** placeholder
   — `data-countdown-hours="144"` (144h = 6 days, matching the top card's
   "6 days left") computed from page-load time, not a fixed calendar date,
   since there's no live challenge data yet. The HTML pre-renders
   "06d 00h 00m 00s" so a no-js visitor sees a sane static value instead of
   nothing. Swap `data-countdown-hours` (or point it at a real deadline
   timestamp) once real challenge data exists. Distinct from the original
   "clock counting down to the next event" idea floated for the hero — that
   one is still not built, since there's still no real *event* date, only a
   per-challenge deadline concept.
3. **The hero visual's waveform layer uses `Logo Background 2.png`
   (1.1MB, unoptimised).** Every other shipped raster on the page has a
   `.webp` derivative; this one doesn't yet. Generate one the same way
   `fluid.webp` / `spectrum.webp` were made.
4. **`fluid-full.png` (1.2MB) is loaded as a CSS background** in the flow
   section — same optimisation opportunity.
5. **No real backend/routing.** Static HTML/CSS/JS, no framework, no build
   step. `challenges.html` no longer exists, so "Browse challenges" CTAs
   point at `#challenges` (the in-page section) or `signup.html`.
6. **`assets/fluid_animation_3500ms.mp4` (18.7MB) is the raw master export**
   and is not referenced by any page. `assets/fluid-loop.mp4` (~1.1MB,
   `ffmpeg -vf scale=1280:-2 -an -crf 23`) is what ships. Re-run that same
   command if the animation is ever re-exported; never hand the raw export
   to a page.

## Working conventions established so far

- Deck figures are used as-is — don't invent new stats or soften specific
  ones (the rubric percentages, the Hack & Hire pilot numbers, S$250/S$500).
- Placeholder content is always **labelled** as placeholder rather than
  dressed up as real. No invented customer names presented as customers, no
  fake named people attached to invented quotes.
- Keep pages dependency-free static HTML/CSS/JS unless asked for a framework
  — nothing here uses React/Vue/build tooling.
- Brand accent orange is `#ff5b24` exactly (from the real Figma file, not
  eyeballed from a screenshot).
- Fonts load from Fontshare (Satoshi) and Google Fonts (JetBrains Mono) via
  `<link>` — no local font files.
- Any texture/photo asset pulled from Figma gets downloaded and committed as
  a local file (`assets/...`) — never a hardcoded
  `figma.com/api/mcp/asset/...` URL, since those expire in ~7 days.
- Every animation degrades to its end state under `prefers-reduced-motion`
  and with JS off. Nothing is ever gated behind a scroll effect that might
  not run.
