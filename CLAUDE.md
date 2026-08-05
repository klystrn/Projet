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

## Copy framing — live defense / rubric REMOVED AGAIN. Third reversal, read carefully.

This has now flipped twice in this project's history — don't re-add either
side of it without an explicit, current instruction:

1. An early build removed the pitch-deck's live-15-minute-defense/rubric
   framing because the home-page copy at the time came from Andrei's
   landing repo, which had none of it.
2. The user then explicitly reinstated it for `index.html`'s first build,
   dictating the flow themselves as "Post/Apply → Async submission → Live
   15-min defense → Rubric scoring → Hire decision."
3. **The user has now explicitly removed it again**: *"I dont want the
   15min call scored on a rubric. Keep that in memory for now, but remove
   it."* The "keep in memory" is why this is written up in this much
   detail rather than just deleted — treat a future request to bring the
   defense/rubric concept back as a real possibility, not a closed
   question.

Current state of `index.html`, as a result:

- **No live defense, no 15-minute call, no rubric anywhere** — not in the
  hero (copy, eyebrow, or the hero-card mock), not in How it works, not in
  Success stories, not in testimonials, not in the final CTA or footer.
  "Defend"/"defense" as verbs are gone from visible copy entirely — the
  narrative is "post a challenge → builders submit real work → evaluated
  on real output → hire," full stop.
- **How it works dropped the 5-step pinned-scrub design** (Post/Apply →
  Async submission → Live defense → Rubric scoring → Hire decision) and
  reverted to the **4-step static grid** the user pointed to directly (a
  screenshot of the archived `business.html`'s own How-it-works section):
  Business posts a challenge → Builders compete → Top performers get
  evaluated → Interviews, internships & recognition. See "The landing
  page, section by section" below for the rebuilt implementation.
- The **Hack & Hire pilot numbers that were defense-specific are gone**:
  "10+ live defenses" is dropped from both the hero stat row and the
  Success-stories stat grid (each now shows 3 stats, not 4) since the
  number has no meaning without the defense concept to anchor it. The
  other three figures (120+ builders, 7 companies, 2 hires) are unaffected
  — they aren't defense-specific.

Andrei's `content.ts` copy ("challenge-based talent discovery") is still
not what this page is written from. The hero eyebrow now reads "Where real
work is the strongest hiring signal" instead (that phrase's own established
tagline, not new copy) — see "The landing page, section by section" below.

Still true, and unchanged: **"Builder", never "Students"** in visible copy
— even though the reference screenshot for the How-it-works rebuild (the
archived page) uses "Students," the rebuilt version here says "Builders."

## The landing page, section by section

All six sections the user specified, in order, plus a final CTA. Nav and
footer are the two universal components.

### Nav / footer (universal)
Sticky nav, compacts past 48px of scroll. Anchor links to the four
in-page destinations + Log in / Sign up. Collapses to a hamburger below
900px (`#navToggle` / `#mobileMenu`, closes on link tap, Escape, and on
resize past the breakpoint).

**Audience mode toggle** (`.mode-switch`, next to the logo — added after
the initial build; the user asked for it explicitly). "For companies" /
"For builders" re-tints `--accent` site-wide (orange ↔ blue) via
`html[data-audience]` and updates the nav's Sign-up link to
`signup.html?role=…`, matching the convention the old audience chooser
used. It does **not** navigate anywhere or rewrite copy per mode — this is
one shared page, not two audience-specific ones, so the toggle is a
lightweight re-theme, not a router. Choice persists via
`localStorage["projet:audience"]`.

### 1. Hero & call to action
Headline "Hire on proof, not paper." (second line carries a spectrum
gradient via `background-clip:text`). **Two CTAs** as specified — "Post a
challenge" (primary) and "Browse challenges" — with the Hack & Hire
statistic directly below them (3 figures, not 4 — see "Copy framing"
above for why "10+ live defenses" is gone).

- The eyebrow reads "Where real work is the strongest hiring signal" (the
  page's own established tagline) and has **no leading bullet dot**
  (`.eyebrow--plain` — every other section eyebrow keeps the dot; this was
  a specific ask for the hero only).
- The `+` in "120+" lives **inside** the `<b>`, not as a bare text node
  after it. `.hero-stat-row span` is a flex row, so its `gap` would
  otherwise land between the number and the plus and render "120 + builders".
  (Same class of bug as the old `.cand-left` one — worth remembering: a flex
  `gap` applies between *anonymous* text-node flex items too.)

**The hero visual is a static gradient card — no photo/video texture, no
scroll-linked change.** An earlier pass ran a "Spectrum-to-Waveform Hero
Handoff" here (two image layers crossfading on scroll); the user removed
it on two separate, related complaints: the visual shouldn't change on
scroll at all, and the fluid/spectrum imagery is overused elsewhere on the
page (final CTA, testimonials parallax) so it shouldn't also be in the
hero. `.hero-visual` is now just its own CSS gradient background plus the
`.hero-card` mock — no `<video>`, no `<img>`, no scroll listener. Don't
reintroduce either without being asked again.

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

`.spectrum-split` is a **170vh** wrapper (was 260vh — the user flagged "too
much scrolling without any movement," so this was cut by roughly a third
while keeping the veil-dissolve entrance/exit intact); `.ss-stage` sticks
for the duration. Scrolling in fades `.ss-veil` (a white sheet matching the
page background) from 1 to 0, so the white background dissolves and the
viewer drops into the spectrum; it fades back up on the way out so the
return to the white page is a transition rather than a cut.

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
- **The bars showed flat black instead of colour — fixed by zooming into
  each bar's own row of the source image, not just recolouring the gaps.**
  `assets/spectrum.webp` is mostly black margin either side of its diagonal
  colour band, and because the band is diagonal, its centre drifts by most
  of the image's width between the top bar and the bottom one. The original
  approach squeezed the *whole* image into each narrow bar
  (`background-size:var(--bar-w) 100vh`), so most of each bar showed
  black margin, not colour, and no single recolour/gradient trick on the
  container behind the bars could fix that — the black pixels were coming
  from the bars themselves, not gaps between them. The fix: a small
  Python/Pillow script (see below) sampled the image at each of the 14
  bars' rows, found where the colour band actually sits at that row, and
  computed a per-bar zoom + horizontal offset that re-centres just that
  row's band inside the bar. `landing.js`'s `BAND_ZOOM` table (14
  `[zoom, offsetK]` pairs) feeds `--zx`/`--ox` custom properties per bar;
  `.ss-bar`'s `background-size`/`background-position` in `landing.css`
  consume them. **Regenerate `BAND_ZOOM` with a fresh sampling script if
  `spectrum.webp` is ever re-exported** — the table is specific to this
  exact image.
- `.ss-stage`'s own background is a warm-to-cool gradient (not flat
  `#08080a`) and `.ss-stripe-inner` carries a second, more saturated
  version of the same gradient confined to the narrow stripe itself — belt
  and braces so any sliver the bars still don't cover (mask fade at each
  bar's edges, sub-pixel gaps) reads as part of the scene rather than a
  seam. Getting the *stripe's own* colours right mattered more than the
  page-wide gradient: a first attempt only tinted `.ss-stage`, but by the
  time that 90deg gradient reached the ~50% mark where the stripe actually
  sits, its stops were already close enough to black to look like the
  original bug hadn't been fixed at all.
- Active/inactive ratio is 1.5/1, not harder — the inactive side is real
  content, not a teaser, and has to stay readable.
- **The two panel CTAs ("Sign up to compete" / "Post a challenge") are both
  `.btn-white`** — filled, not one filled and one outlined. They were
  visually mismatched (one solid, one ghost) until this was flagged.
- Below 900px the whole mechanic is dropped: panels stack, both show their
  copy outright, and the band becomes a horizontal divider. A hover-to-expand
  split has no meaning on a screen that can only show one column.
- **Live countdown** (`.ss-countdown`) sits above the featured-challenge
  cards — see "Known issues" for why it's a relative placeholder deadline
  rather than a real one.
- Success-stories stats are a **3-item** grid (`.ss-stats--three`), not 4 —
  "10+ live defenses" was dropped along with the defense concept; see
  "Copy framing" above.

### 5. How it works — static 4-card grid (rebuilt; was a pinned fluid-scrub)
**This section has been rebuilt from scratch and no longer matches its
original design.** The first build ran a 5-step "Fluid Flow Steps" pinned
scroll-scrub (Post/Apply → Async submission → Live defense → Rubric
scoring → Hire decision) through `fluid-full.png`, with a Rubric Spectrum
Bar drawn on the scoring step. All of that — `.flow`, `.flow-inner`,
`.flow-fluid`, `.flow-scrim`, `.flow-stage`, `.flow-steps`, `.flow-step`,
`.flow-dots`, `.rubric*`, and the matching `landing.js` scrub IIFE — is
gone. Two independent reasons converged on removing it: the live-defense/
rubric content itself was dropped (see "Copy framing" above), and
separately the user pointed to a screenshot of the *archived*
`business.html`'s own How-it-works section — a plain static 4-card
grid — and asked for that instead, along with "remove the step (just keep
the number)" (drop the "STEP" word, bare numbers only: "01" not "STEP 01").

Current implementation: `.steps-grid` is a static CSS grid (4 cols desktop,
2 tablet, 1 mobile — plain `@media` breakpoints, no scroll JS at all).
Each `.step-card` has an icon in a rounded square (`.step-icon`, inline SVG
— plus/trophy/checkmark/star, matching the reference screenshot), a bare
`.step-num`, a heading, and a description. Content is the same 4 steps the
old `business.html`/`builders.html` generator used (`HOW` list in the
archived `tools-build-pages.py`): Business posts a challenge → Builders
compete → Top performers get evaluated → Interviews, internships &
recognition — translated to "Builders," never the reference image's own
"Students" wording (see "Copy framing" above).

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
- **Only the first/last card would centre correctly at first — fixed by
  giving `.t-track` `width:max-content`.** Without it, this flex box (whose
  cards are `flex:0 0 <fixed-width>` and don't shrink) stayed clamped to
  `.t-viewport`'s width instead of growing to fit its overflowing children,
  so `track.scrollWidth`/`offsetWidth` silently under-reported the real
  content extent — the centring math in `landing.js` (which needs the true
  total width to clamp correctly at both ends) was wrong as a result. Same
  reason `.logo-track` already needed this for the marquee. Separately,
  `updateEdgePadding()` must measure card width via `offsetWidth`, not
  `getBoundingClientRect()` — the inactive-card `transform:scale(.9)`
  shrinks the *rendered* rect but not the layout box, so measuring via the
  rect silently used a different yardstick than the `offsetLeft`-based
  centring math and only looked right for whichever card happened to be
  `.is-active` (scale 1) at measurement time.

## Animation reference library

`Projet — Scroll Animation Library` (the user's markdown doc, supplied in
chat) is the source for the named effects. Implemented and **still live**:
Section Reveal on Scroll (#2), Testimonials Fluid Parallax (#8). **Removed
after initially being built** — Spectrum-to-Waveform Hero Handoff (#1, see
"1. Hero & call to action" above) and Fluid Flow Steps (#3) / Rubric
Spectrum Bar (#7) (see "5. How it works" above, now a static grid). Not
used: Waveform Proof Ticker (#4), CTA Waveform Pulse (#6), Defense
Spotlight (#9, moot now the defense concept itself is gone — see "Copy
framing"). **Audience Spectrum Toggle (#5) came back** — the nav's
`.mode-switch` (see "Nav / footer" above) is a lighter-weight version of
it (re-tints `--accent`, doesn't rewrite per-mode copy).

**Every scroll-linked effect runs off one shared rAF-gated ticker** in
`landing.js` (`scrollUpdaters`), not its own listener. Enter/exit-only
effects use `IntersectionObserver` instead, since they don't need a
continuous progress value.

**The non-negotiable rule on this page: every effect renders its END STATE
when motion is off or JS never runs — it never just skips.** Verified: under
both `prefers-reduced-motion` and JS-disabled, all reveals, all five
testimonials, all counters, and the (now static, so trivially always
visible) How-it-works cards render at their final values.

## Auth / accounts (front end only)

`login.html` and `signup.html` are kept and still work. **They are front end
only — no credentials go anywhere.** Validation, error/pending states and the
fetch call are written; each form just needs its empty `data-endpoint`
attribute pointed at a real route. With no endpoint set the form says
accounts aren't connected yet rather than faking a success.

**Division of labour: this repo is front end / UI-UX only. The API and the
MongoDB layer are Andrei's (co-founder).** The full contract is in
`BACKEND-HANDOFF.md` — read that before touching the auth forms.

**The two pages are mirrored, not identical: `login.html` is image-left/
form-right; `signup.html` is image-right/form-left.** Asked and confirmed.
Both share the exact same `.auth-page{grid-template-columns:1fr 1fr}` /
`.auth-aside` / `.auth-main` markup and CSS in `assets/site.css` — nothing
in that CSS is order-dependent, so the mirroring is done purely by which
element (`<aside>` vs `<main>`) comes first in each file's DOM. Don't
"fix" this by making them consistent — the asymmetry is the point.

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
3. **Resolved by removal, not optimisation.** The hero no longer has a
   waveform/`Logo Background 2.png` layer at all (see "1. Hero & call to
   action" above), and How it works no longer loads `fluid-full.png` as a
   CSS background (it's a static grid now — see "5. How it works" above).
   Neither file is referenced from `index.html` any more; no `.webp`
   derivative is needed for either.
4. **No real backend/routing.** Static HTML/CSS/JS, no framework, no build
   step. `challenges.html` no longer exists, so "Browse challenges" CTAs
   point at `#challenges` (the in-page section) or `signup.html`.
5. **`assets/fluid_animation_3500ms.mp4` (18.7MB) is the raw master export**
   and is not referenced by any page. `assets/fluid-loop.mp4` (~1.1MB,
   `ffmpeg -vf scale=1280:-2 -an -crf 23`) is what ships (final CTA and
   testimonials background only now — not the hero). Re-run that same
   command if the animation is ever re-exported; never hand the raw export
   to a page.
6. **`spectrum.webp`'s per-bar `BAND_ZOOM` table is tied to the exact
   current image.** See "3 + 4. Featured challenges | Success stories"
   above — if this asset is ever re-exported or replaced, the 14
   `[zoom, offsetK]` pairs in `landing.js` need regenerating from the new
   file, or the wave will show black/misaligned bars again.

## Working conventions established so far

- Deck figures are used as-is — don't invent new stats or soften specific
  ones (the Hack & Hire pilot numbers, S$250/S$500). The rubric percentages
  aren't currently live copy at all (see "Copy framing" above) — don't
  reintroduce them without a fresh instruction to do so.
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
