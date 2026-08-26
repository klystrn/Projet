# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet — website work: handoff from Claude.ai chat

This file exists so Claude Code has full context on a website project that
started in a Claude.ai conversation. Read this before doing anything else
in this folder.

## Commands

There is no build step, bundler, package manager, linter, or test suite in
this repo — it's dependency-free static HTML/CSS/JS (see "Working
conventions" below; this is a deliberate, repeatedly-confirmed choice, not
an oversight). The only "command" you need:

```
python3 -m http.server 8000    # from the repo root, then open http://localhost:8000/
```

`index.html` is both the entry point and the whole public site. There's
nothing to compile — edit `index.html` / `assets/landing.css` /
`assets/landing.js` directly and refresh the browser.

## Impeccable design skill (installed)

`.claude/skills/impeccable/` (vendored from
[github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable),
Apache-2.0) is installed in this repo — invoke it via `/impeccable <command>`
(e.g. `shape`, `critique`, `audit`, `polish`; see its `SKILL.md` for the
full command list). `.claude/settings.json` also wires its `PostToolUse`/
`Stop` hooks, which run its anti-pattern detector automatically after
Edit/Write/MultiEdit on UI files and again as a deeper pass when a turn
ends — expect its findings to show up unprompted. It runs entirely on
local Node scripts with no external dependencies, **except** `npx
impeccable update`/`check`, which reach `impeccable.style` — that host is
blocked by this environment's own egress policy (confirmed via the agent
proxy's status endpoint, not something to route around), so update/check
won't work from inside a sandboxed session; do the install/update from
outside such a sandbox (or fetch straight from the GitHub repo, as was
done for the initial install) if that's ever needed again.

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

## Site architecture — v3 (Aug 2026). Read this first.

**v3 has LANDED for sections 1-3.** What follows immediately below describes
the current live site; the long v2 documentation further down is retained as
history and is explicitly marked where it has been superseded.

```
index.html          v3 landing page
challenges.html     full challenge listing (nav updated for v3)
dashboard.html      NEW in v3 — student + company dashboards
login.html          front-end-only auth
signup.html         front-end-only auth (?role= still prefills)
assets/             landing.css/js + challenges.css/js + dashboard.css/js + site.css
archive/v2/         the complete v2 site, verified-rendering snapshot
```

**What v3 changed, per founder direction:**

1. **Gradient system.** `landing.css` declares gradient tokens once
   (`--grad-accent`, `--grad-soft`, `--grad-glow`, `--grad-rule`,
   `--grad-dark`, plus `--accent-wash`/`--accent-edge`/
   `--accent-glow-shadow`) and every component reads them, so the whole page
   re-tints together on a mode flip. Asked for explicitly ("incorporate
   gradients wherever you can"). **One deliberate carve-out:** gradients go
   on SURFACES, never on text. Gradient *text* was removed earlier in the
   same project as a documented AI tell (see "Known issues" #9) and was not
   reinstated — flagged to the user at the time, not silently decided.
2. **Company mode now actually reads blue.** Previously only `--accent`
   swapped, so company mode was an orange page with blue buttons. Now the
   wash, the radial glow, the dark-section base and the accent shadow all
   swap too under `html[data-audience="business"]`.
3. **Nav has a dashboard link** (`.nav-dash`, an accent chip rather than
   another section anchor, because it is an account destination). `landing.js`
   repoints its href and relabels it per mode.
4. **Hero card is now a dashboard summary**, not the old static progress
   mock, and it **no longer has the cursor-tilt parallax** (removed on
   request). A signed-out gate (`#dashGate`) sits over it so a logged-out
   visitor cannot read the sample numbers as their own.
5. **Section 2 is Featured challenges only** (spotlight + list, "option B"
   from the review canvas). The light-spectrum split and its Success-stories
   half are **retired**; `#stories` no longer exists anywhere, and the dead
   anchors that pointed at it were removed from `challenges.html`.
6. **Section 3 is a static vertical timeline** ("option B"), all four steps
   always present and readable. **The pin came back** (see "How it works —
   pinned scroll-highlight, v3.1" below) — a fresh, later instruction asked
   for the site to lock in place through this section with a moving
   highlight, so "no pin at all" is no longer accurate; "no step ever
   hidden" still is.

**Retired in v3 — do not reinstate without a fresh instruction:** the
light-spectrum wave split and the hero cursor-tilt parallax. The
`BAND_ZOOM` table, `spectrum.*` assets and `fluid-full.*` assets are no
longer referenced by any live page (they remain on disk and in
`archive/v2/`). The How-it-works pin itself is **not** on this retired
list any more — see below.

**The review canvas is a deliverable, keep it.** The v3 direction was chosen
from a multi-artboard design canvas (hero, both dashboards, 3 Featured-
challenges layouts, 3 How-it-works layouts). The user asked to keep it for
presenting later, so it must not be overwritten or repurposed:
`https://claude.ai/code/artifact/c96ff5f2-8c90-4d60-a0c0-87e9557d33e8`
(working files: `scratchpad/v3-canvas/*.dc.html` + `canvas.json`).

**Two bugs caught by screenshot review, not by the Playwright assertion
suite** (worth knowing if either area is touched again):
- The hero's signed-out gate (`#dashGate`) was first built as a full-cover
  blurred scrim, which hid the exact dashboard content it was meant to show
  off. Rebuilt as a slim bottom bar (`.dash-gate`, `position:absolute;
  bottom:0`), with `.dash-card:has(.dash-gate) .dash-foot{display:none}` and
  matching `padding-bottom` on `.dash-body` so the bar doesn't overlap the
  card's own footer or last data row.
- `#dpNoMatch` (`dashboard.html`'s "no candidates match that filter" banner)
  rendered even while `hidden`, because `.dp-empty{display:flex}` is author
  CSS and beats the UA `[hidden]{display:none}` rule regardless of
  specificity. Fixed with an explicit `.dp-empty[hidden]{display:none}`
  override in `assets/dashboard.css`. **General lesson**: any element that
  is toggled via the bare `hidden` attribute needs an explicit
  `[hidden]{display:none}` rule the moment its own class sets `display` to
  anything other than `none` — the attribute alone isn't reliable once a
  class-level `display` declaration exists for that element.

**How it works — pinned scroll-highlight, v3.1.** Explicit follow-up ask
after v3 shipped: *"Create an animated scroll for the how it works such
that the site becomes fixed when the user reaches the How It Works
section and the highlighted text changes as they scroll, not just stuck
on point 1."* The static-timeline content (all 4 steps, all always
present) stays exactly as v3 specified — this only changes how the
*emphasis* moves through it. Structure now:

```
.flow-scroll                 tall (300vh, desktop-only) scroll-room wrapper
  .flow-stage                 position:sticky; top:96px (clears the nav)
    .flow-tl                  unchanged: the 4 .flow-step cards, .flow-fill rail
```

`landing.js` maps scroll progress through `.flow-scroll` to one of the 4
steps and toggles `.is-active` on it — the other three stay fully in the
DOM and readable at `opacity:.55`, never hidden, satisfying the same
"nothing gated behind a scroll effect" rule as everything else on the
page. A `.flow-fill` rail (`--flow-progress` custom property driving
`transform:scaleY()`, not `height`) draws down the timeline alongside it,
so the reader sees continuous progress, not just a jump cut between
steps. Steps are re-queried live off `#flowTl` every frame rather than
cached, since `[data-mode-copy]` replaces that element's whole innerHTML
on an audience swap — caching would go stale the instant the reader
toggles mode.

**The active node reuses the rank-badge contrast fix, not the raw
gradient.** The first version of this used `background:var(--grad-accent)`
on `.tl-node` for the active step, which is the exact same WCAG AA failure
already found and fixed on the dashboard's `.dp-rank.is-top` (small white
text over a two-stop gradient drops as low as ~2.1:1 at the lighter
stop). Fixed the same way: a flat `var(--accent-deep)` fill instead.

**Bug caught mid-build, not by the regression suite:** after any audience
mode swap, `.is-active` and the fill's `--flow-progress` would go blank
and stay blank until the reader scrolled again. Cause: `[data-mode-copy]`
swaps only run in response to a real `scroll`/`resize` event reaching the
shared `scrollUpdaters` ticker, and a mode-toggle click is neither —
`applyModeCopy()` replaces `.flow-tl`'s children (the very nodes the
updater was tracking) without ever re-driving that ticker. Fixed by
calling `onScroll()` directly at the end of `applyModeCopy()`, both on the
instant (`animate:false`, page-load) path and after the `.mode-swap`
crossfade's `setTimeout`. Worth remembering for *any* future scroll-linked
effect anchored inside a `[data-mode-copy]` element: a mode swap is a DOM
replacement, not a scroll, and nothing re-syncs it unless something says
so explicitly.

Mobile (below 900px), `prefers-reduced-motion`, and no-js all render the
same plain stacked list at full opacity with no pin — `.flow-scroll{height:
auto}` / `.flow-stage{position:static}` / `.flow-step{opacity:1}` /
`.flow-fill{display:none}`, gated the same three ways (`@media
(max-width:900px)`, `@media (prefers-reduced-motion:reduce)`, `.no-js`)
every other effect on the page already uses. The JS-side highlight logic
also self-skips at setup time under those same conditions, so no scroll
listener is even registered for a visitor who's never going to see the pin.

**Backend seams for Andrei** (front end is done, nothing else to rewire):
- `body.dash-page[data-endpoint]` on dashboard.html — full dashboard
- `window.ProjetDashboard.setView(role)` / `.showEmpty(bool)` — drive the
  view from a real session instead of `?view=`
- `#footerNotify[data-endpoint]`, and the auth forms' own `data-endpoint`
- Expected response shapes are documented in comment headers in
  `assets/landing.js` and `assets/dashboard.js`
- `#heroDash` (index.html's hero card) is **no longer a backend seam** —
  see "v3.2 updates" below, it's a pure graphic now.

## v3.2 updates (this round, Aug 2026)

A further punch list landed on top of v3, superseding several things
described just above. Read this before trusting anything above it about
the nav, hero, How it works, testimonials, challenges.html, the final CTA/
footer, or about.html.

**Nav.** `Log in` / `Sign up` merged into one `Log in` button (both auth
pages already cross-link each other). The persistent `.nav-dash` "My
dashboard" chip is gone — that's where a session lands *after* auth, not
something the nav needs to keep surfacing pre-login. Added `About us` /
`FAQs`; `dashboard.html`'s nav also picked up the `Testimonials` link it
was missing.

**Hero.** `#heroDash` is now a pure illustrative graphic — dropped
`data-endpoint`, the fetch/backend-hook logic in `landing.js`, and the
signed-out `.dash-gate` bar entirely (nothing to gate; it was never
showing a real logged-in user's data anyway). `.hero`'s gradient wash now
bleeds to the true viewport edges (see "the sticky/overflow-x gotcha"
below for a bug this surfaced later). The `<hr class="rule">` divider
between the hero/logo-carousel and Featured Challenges is gone. Logo
carousel chips are a mark+name lockup now (`.logo-chip-mark` +
`.logo-chip-name`), not a plain text wordmark — still a placeholder (no
real logo images exist), just one that reads as a logo. Hover no longer
tints the chip; only pause-on-hover remains. The whole carousel section
now has `data-carousel-enabled="true|false"` on `.logos`, so it can be
hidden outright (`.logos[data-carousel-enabled="false"]{display:none}`)
whenever there aren't enough real partners to carry a row.

**Dashboard.** The visible Student/Company `.dp-viewswitch` toggle is
gone — the nav's own audience toggle already drives `setView()`
(`dashboard.js` ~line 193), so it was a redundant second control. `?view=`
and the nav toggle both still work exactly as before.

**Auth pages.** Fixed a layout jump on submit: `.field .err`/
`.auth-status` used to toggle `display:none/block`, and because
`.auth-main` vertically centered the card, a newly-appeared error banner
recentered the *whole* card around its new height rather than just
growing downward. Switched both to an animated `max-height`/`opacity`
reveal, and `.auth-main` from `align-items:center` to `align-items:
flex-start` with a fixed top offset, so growth only ever extends downward
from a point that never moves.

**How it works — pinned fluid-scrub, v3.2 (supersedes v3.1's
scroll-highlight above).** A further explicit ask: bring the fluid-artwork
scrub back (the one v3 first retired, described under "5. How it works" in
the v2-history section below), but reshaped — cropped to the right 5/8 of
the viewport instead of full-bleed, with the section title fixed on the
left 3/8, one step visible at a time (not all four dimmed-but-present like
v3.1), and a final "recap" beat showing all four together right before the
pin releases. `--img-fluid-full` (AVIF/WebP via `image-set()`) is back in
`landing.css`'s `:root`, same fallback pattern as before.

```
.flow-scroll                     650vh, desktop-only scroll-room wrapper
  .flow-stage                     sticky; top:0; height:100vh;
                                   grid-template-columns:3fr 5fr
    .flow-left                    static title (eyebrow/h2/p) + .flow-rail
      .flow-rail                  data-mode-copy; 4 .flow-rail-item, the
                                   "design element" filling the space under
                                   the title — doubles as a progress readout
    .flow-right                   overflow:hidden; background:var(--ink)
      .flow-fluid                 the scrub background (cropped to this column)
      .flow-scrim                 readability gradient over it
      .flow-steps                 data-mode-copy; 4 .flow-step, crossfade
                                   stacked, one .is-active at a time
      .flow-recap                 data-mode-copy; all 4 steps' num+title
                                   together, .is-active only for the final beat
```

`landing.js`'s scroll updater divides `.flow-scroll`'s progress into
`steps.length + 1` even segments (4 steps + 1 recap) rather than 4; the
last segment sets `.flow-steps.is-recap` (fades the crossfade stack out)
and `#flowRecap.is-active` (fades the grid of all 4 in). Rail items track
the same beat via `.is-active`/`.is-done`. Steps/rail/recap are re-queried
live every tick (not cached), same reason as v3.1: `[data-mode-copy]`
replaces these nodes wholesale on an audience swap. Below 900px /
reduced-motion / no-js, everything collapses to a plain light-background
stacked list (not the dark image treatment — that was tuned for white
crossfading text over an image, and would just be a contrast problem
re-flowed as static content); the fallback CSS is written three times
(`@media(max-width:900px)`, `@media(prefers-reduced-motion:reduce)`,
`.no-js`), matching the file's existing convention for this kind of thing.

**The sticky/overflow-x gotcha.** Fixing a real ~148px horizontal-scroll
bug (`.hero::after`'s radial bloom bled a fixed 20% of `.hero`'s own width
past its edge, which overflowed the true viewport at widths close to
`--maxw`, confirmed via `window.scrollTo(9999,0)` actually moving
`scrollX`) was first "fixed" by adding `overflow-x:hidden` to `<html>`.
That broke `position:sticky` for *every* sticky element on the page,
including this section's own pin — any non-`visible` overflow on
`html`/`body` changes what `position:sticky` resolves its containing
block against. Reverted; the real fix needed no override at all: capped
`.hero::after`'s bleed at `calc(-1 * min(var(--maxw) * .2, (100vw -
var(--maxw)) / 2))` instead of a flat `-20%`, so it never exceeds
whatever margin actually exists between `.hero` and the true viewport
edge. **If a future overflow bug ever tempts a fix on `html`/`body`'s own
`overflow-x`, check `position:sticky` everywhere on the page before
shipping it** — `body{overflow-x:hidden}` alone (no `html` override) is
the version already proven not to break sticky, even though it doesn't
reliably stop every possible overflow (this bug proved that too).

**Testimonials — option C spotlight + strip, v3.2 (supersedes the
recycling-marquee wall described under "6. Testimonials" in the v2-history
section below).** One promoted `.t-spot` card above a `.t-strip` of 5
`.t-chip` buttons; hovering *or* focusing a chip promotes its quote,
avatar, name/role and company/builder tag into the spotlight and sets
`aria-current`. Every chip already carries its own full quote as
`data-quote` (not a truncated teaser), so a no-js visitor loses only the
swap animation, never any content. Quotes vary in length, so swapping
which one is in the spotlight was changing `#tSpot`'s own height and
jolting the section on every hover — `landing.js` measures every chip's
quote against the spotlight's real layout once (and again on resize) and
reserves the tallest as `min-height`, so the swap only ever changes
content now, never layout.

**Final CTA / footer, v3.2.** `.final` no longer carries `.wrap` directly
(same trap the hero had) — `.final` is now the full-width background
carrier and `.final-wrap` is the text-width-constrained inner content, so
the section stretches edge to edge instead of sitting as a rounded card
with page margins. Its own bottom padding is gone too, so the footer
trails directly off it with zero gap. The footer matches the CTA's dark
background now (was `--paper-warm`) for the same reason — every footer
colour re-tuned for the dark surface via the `rgba(255,255,255,N)` scale
the CTA copy already used, and the footer logo swapped to the existing
`logo-white.png` (no CSS filter hack). `.btn-arrow`'s reveal changed from
`max-width:0→20px` (grew the whole button on hover) to a fixed-size arrow
box animating only `opacity`/`transform:translateX` — same reveal feel,
zero size change, compositor-only. Applies everywhere `.btn-arrow` is
used. `challenges.html`'s own `.cl-cta` is a separate, page-specific
component and keeps its rounded-card treatment — the full-bleed ask was
about the shared `.final` section repeated across index/about/faq, not
every CTA on the site.

**challenges.html rebuilt on the canvas's "option A," v3.2** (supersedes
the six-card version described further down under "`challenges.html` —
the listing page"). Each `.cl-card` gets a timeline progress fill bar and
a "View brief" button that opens a real `<dialog>` modal (native
`showModal()`/`close()` — free focus-trapping, ESC-to-close, `::backdrop`,
no hand-rolled ARIA), populated from the card's own `data-brief-*`
attributes on click. The whole page's class prefix is `.cl-` (challenges
**l**isting), not `.ch-` — `landing.css` already owns `.ch-*` for the
homepage's own Featured Challenges section, and since this page also
loads `landing.css`, the old shared prefix risked those rules leaking
onto this page's markup.

Two further passes since the initial rebuild:
- `.cl-view-brief` now carries `margin-top:auto` so it sits flush at the
  bottom of every card regardless of how much the title/description above
  it wraps — `.cl-grid`'s items already stretch to the row's tallest card
  (grid's default `align-items:stretch`), and without `margin-top:auto`
  nothing was pushing the button down to fill that extra height, so it
  visibly jumped between cards in the same row.
- The "spots" stat is gone entirely — `data-brief-spots`, the "N
  submitted · M spots" meta line, and the modal's third stat cell (now a
  2-column grid, was 3). The timeline fill bar no longer derives its width
  from a submission cap; it keeps its own authored value, and the modal
  mirrors whichever card was clicked instead of recomputing from spots.
- Now **12 sample briefs**, not 6: the original six (Nordwave, Fieldstone,
  Anchorpoint, Cobalt & Co, Meridian Co, Vertex Studio) plus six more —
  Northwind, Acme Labs and Lumen Works (the three established placeholder
  names from the logo carousel that weren't yet used here), plus a second
  brief each for Nordwave/Fieldstone/Anchorpoint in a different discipline
  than their first. All still `data-category`-tagged so the discipline
  filter works against the larger set (4 product / 3 design / 3
  engineering / 2 data).

**about.html gained explicit Problem/Mission/Vision sections, v3.2.** The
former single "Why we exist" / "How it works" `.about-grid` row is now two
rows: Problem/Mission, then Vision/How it works (same `.about-grid`
component reused, not a new one). Content stays inside what's already
public — the AI-generated-resume framing already used in the hero, the
anonymous-scoring model, the Hack & Hire pilot numbers — no new claims
about founders, funding, or anything this project has deliberately kept
off the public site.

**index.html's Featured Challenges is the TICKET RAIL, v3.3 (canvas option
N). This supersedes the deck-of-cards fan entirely** — the fan shipped
briefly, then the whole section was reworked twice: first merged into one
equally-weighted element (no spotlight card), then re-laid-out as a
horizontal rail. Do not reinstate the fan, the `.ch-spot` spotlight card
or the `.ch-layout` two-column split without a fresh instruction; all
three are gone from the CSS, not just unused.

Current structure — three subsections, in this order:

```
.challenges > .wrap        .ch-head (eyebrow/h2/p) + .ch-countdown
.challenges > .ch-rail     the tickets — OUTSIDE .wrap, deliberately
.challenges > .wrap        .ch-rail-controls + .ch-note
```

Each brief is a `.ch-ticket`: `.ch-ticket-body` + `.ch-perf` + `.ch-stub`,
shaped like a torn ticket with the countdown punched into the stub. **The
shape is load-bearing, not decoration.** `challenges.html`'s own card
signature is a white tile with a pill pair on top, a thin orange progress
bar, and a full-width dark "View brief" button; the ask was explicitly
that the homepage section not look like the listing page, so none of those
four appear here. If this section is restyled again, check it against
`.cl-card` before shipping.

**The rail is a native `overflow-x:auto` scroller.** Touch, trackpad and
keyboard all work with zero JS (the container carries `tabindex="0"`), and
the arrows + position bar in `.ch-rail-controls` are pure enhancement.
`.no-js` hides **only** `.ch-rail-btn` and `.ch-rail-track` — *not* the
whole control row, which also carries the "View all challenges" link;
that's real content and has to survive. The fill bar is driven by a
`--rail-progress` custom property on `transform:scaleX()`, not `width`, so
dragging the rail never triggers layout per frame.

**Two gotchas this section hit, both worth not relearning:**

- **`scroll-snap-align:start` fights the scroller's own padding.** The
  rail is padded by `--rail-inset` so its first ticket lines up with
  `.wrap`'s content edge while the row still runs to the true viewport
  edges. But snap positions resolve against the *scrollport* edge, so on
  load the browser silently scrolled the rail to `scrollLeft:132` to snap
  the first card — the row arrived already nudged off its start. Fixed
  with `scroll-padding-inline:var(--rail-inset)` matching the padding
  exactly. **Any padded scroll-snap container needs both.**
- **The inset is computed from `100%`, never `100vw`.** `vw` includes the
  scrollbar gutter, which is the exact cause of the horizontal-overflow
  bug documented under "the sticky/overflow-x gotcha" above. `100%` here
  is the section's own width, which is what's actually wanted.

`.ch-perf`'s two notches are circles filled with `var(--paper-warm)` and
**no border of their own** — a full ring reads as a dot stuck to the edge
rather than a bite taken out of it. They are hard-tied to
`.challenges`'s background: **if that section ever stops being
`--paper-warm`, the notches must follow or they will show as wrong-coloured
blobs.**

---

## Site architecture — v2 history (superseded above)

**The single-page rebuild described in most of this file is now "v2" —
archived whole, at `archive/v2/` (a complete, self-contained, verified-
rendering snapshot: `index.html`, `challenges.html`, `login.html`,
`signup.html`, `robots.txt`, `sitemap.xml`, and `assets/`), per explicit
founder direction to move to a v3.** Unlike every earlier archive entry
(a single superseded page), this is the first whole-site archive, so it
gets its own subfolder rather than joining the flat `archive/*.html`
convention. Raw/unreferenced masters that the archived pages don't
actually load (`fluid_animation_3500ms.mp4`, `official-spectrum.png`,
`fluid-foreground.png`, the raw `Logo Full */Logo 3 V2*` exports, `Test.png`,
`favicon.svg`) were deliberately left OUT of the copy to avoid duplicating
~22MB of dead weight — verified via Playwright that `archive/v2/index.html`
still has zero failed network requests without them. The live `assets/`
folder is untouched; only the archive copy was trimmed.

**v3 is a substantial rework, not an iteration** — new sections, new
navigation model (dashboards), and both the "spectrum wave" split and the
pinned How-it-works scroll-scrub are being retired outright (see below).
Expect large parts of this document to go stale as v3 lands; update
sections in place as each part ships rather than appending v3 notes on top
of v2 documentation that no longer describes the live page.

---

*(Everything below this line describes v2, preserved as historical/working
reference until each part is superseded by v3 — check the top of each
section for a v3 status note before trusting it as current.)*

**The whole previous multi-page site was scrapped on the user's explicit
instruction.** `index.html` is the landing page and the entry point (launching
the site lands you here — there is no longer a chooser gate in front of it).
A second public page, `challenges.html`, was added later (see below); the
scrapped multi-page *audience* structure is still gone and stays gone.

```
index.html          the landing page — the main public surface
challenges.html     the full challenge listing (added Aug 2026 — see below)
login.html          front-end-only auth (kept, still functional)
signup.html         front-end-only auth (kept; ?role= still prefills)
assets/             shared images/video + landing.css/js + challenges.css/js + site.css
archive/            everything the landing page replaced
```

**`challenges.html` — the listing page.** Built to resolve the standing dead
link: `index.html` referenced it from "View all challenges" and every "Browse
challenges" CTA, and it 404'd. It reuses `assets/landing.css` for the tokens
and the shared nav/footer/buttons, then adds `assets/challenges.css` for the
listing grid only — so the two pages can't drift apart on brand. It loads
`assets/landing.js` (which owns the mobile menu, the audience toggle and nav
compaction; every index-only effect in it self-skips when its element is
absent — verified, no console errors) plus `assets/challenges.js`, which adds
*only* the discipline filter.

- The six briefs are **labelled placeholders**, same convention as the
  landing page's logos/testimonials: a `.ch-notice` banner says "Sample
  briefs, not live listings" above the grid, and `<meta name="robots"
  content="noindex">` is set until they're real. Remove both when the API
  serves live challenges.
- Cards are deliberately **not links** — there's no brief-detail page, and a
  card that looked clickable but went nowhere is exactly the dead end this
  page was built to remove.
- The filter is progressive enhancement: all six cards render in the HTML,
  and `.no-js .ch-filters{display:none}` hides the control rather than
  leaving a bar of buttons that do nothing.

**Link convention across the two pages** (settled here, keep it): *section*
links ("Challenges" in the nav/footer) point at the in-page `#challenges`
section; *action* CTAs ("Browse challenges", "View all challenges →") point
at `challenges.html`. Same label, same destination, everywhere.

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

## "Light spectrum wave" — RETIRED IN v3 (kept as history)

> **This entire mechanic is gone from the live site.** Section 2 is now a
> plain Featured-challenges block (spotlight + list). Kept below only because
> the `BAND_ZOOM` regeneration notes are the sort of thing that is painful to
> reconstruct if the split is ever revived. Nothing here describes v3.


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
  Async submission → Live defense → Rubric scoring → Hire decision) for a
  **4-step static grid** the user pointed to directly (a screenshot of the
  archived `business.html`'s own How-it-works section): Business posts a
  challenge → Builders compete → Top performers get evaluated →
  Interviews, internships & recognition. **The pinned-scrub mechanic itself
  was later brought back** (the user liked the old zoomed-background-scroll
  animation and asked for it applied to these same 4 steps) — the content
  stayed defense/rubric-free throughout; only the delivery mechanism
  flip-flopped. See "5. How it works" under "The landing page, section by
  section" below for the current (restored-scrub) implementation.
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
resize past the breakpoint). `nav.links a` now gets an active-section
highlight (`.is-current`) driven by a single `IntersectionObserver` over
the four in-page targets, picking whichever section is closest to
viewport centre — no scroll listener of its own.

**Audience mode toggle** (`.mode-switch`, next to the logo — added after
the initial build; the user asked for it explicitly). **Order and labels
changed once more since**: it now reads **"For students" (left) / "For
companies" (right)** — a deliberate, narrow exception to "Builder, never
Students" (see "Copy framing" above): only this one button's own visible
label says "students"; the internal value is still `data-audience="builder"`
and every other mention of the audience anywhere else on the page still
says "Builder". Re-tints `--accent` site-wide via `html[data-audience]`
and updates the nav's Sign-up link to `signup.html?role=…`, matching the
convention the old audience chooser used. Choice persists via
`localStorage["projet:audience"]`.

**Builder/student is now the DEFAULT mode, not business** — asked
explicitly. `landing.js`'s audience-toggle IIFE resolves to `"builder"`
unless `localStorage["projet:audience"]` says otherwise (was the reverse).
This flows through to every no-js/pre-JS-paint default too, not just the
JS-resolved state: the `:root` `--accent` default, `.mode-indicator`'s
resting position/colour, and the inline HTML fallback content on the H1/
hero-sub/hero-ctas/`.hero-card`/`.flow-steps` were all swapped so a no-js
visitor and a JS visitor see the same thing on first paint.

**Colour mapping reversed: students/builders are ORANGE, companies are
BLUE** — asked explicitly, opposite of the original pairing. `--accent`
now defaults to `var(--orange)` with `html[data-audience="business"]`
overriding to `var(--blue)`; `.mode-indicator`'s resting colour/position
flipped to match. The same pairing was extended to every other place the
two audiences are colour-coded, for consistency: the testimonial
`.t-badge`/top-bar accent (Builder=orange, Company=blue) and the
spectrum-split's two CTA buttons (`.btn-solid-orange` "Sign up to
compete", `.btn-solid-blue` "Post a challenge" — fixed to the literal
colour, not `--accent`, since these tag which SIDE of the split a button
belongs to, not the current toggle state). **Not** extended to
`.hero-card`'s own accents (`.hero-card-live`, `.hc-rank`) — those stayed
fixed orange on purpose, since that card sits on `hero-visual.webp`'s
fixed warm/fire palette and would clash if they turned blue in company
mode.

**It now DOES rewrite copy per mode, reversing the original "re-theme,
not a router" design.** A generic system drives this: any element carrying
`data-mode-copy` plus `data-business="<html>"` / `data-builder="<html>"`
attributes gets its `.innerHTML` swapped by `applyModeCopy()` in
`landing.js` on every toggle. Currently wired to the hero H1, hero
sub-copy, the hero CTAs, the `.hero-card` mock, and all four How-it-works
step cards (see their sections below) — still one shared page, not two
routed ones, just one that relabels its own copy in place. One piece of
plumbing this requires: `.flow-steps` is also re-scanned and re-scrubbed
by the How-it-works scroll effect, which caches its own `NodeList` of
`.flow-step`/`.flow-dot` — a raw `innerHTML` swap would leave that code
holding references to detached nodes, so `#flow` exposes a
`wrap.refreshFlow()` hook that `applyModeCopy()` calls after every swap to
force a re-query + repaint.

**The switch now animates, both the toggle and the page content — asked
explicitly, this used to be an instant snap.** `.mode-indicator`'s slide
already had its own transition; new is a content crossfade on every
`[data-mode-copy]` element (`.mode-swap` class, opacity 0 with `!important`
since `[data-reveal].revealed`'s own higher-specificity rule would
otherwise keep it pinned at opacity 1) — `applyModeCopy()` adds the class,
waits `SWAP_MS` (160ms), swaps `.innerHTML`, then removes it. Skipped
entirely (`animate=false`) on the very first page-load call, where the
inline HTML already matches the resolved default mode, so there's nothing
to visibly swap. One easy-to-miss gotcha it had to work around: the
entrance stagger leaves an inline `transition-delay` (e.g. `.16s`) sitting
on these same elements forever after load, and since inline
`transition-delay` outranks a stylesheet's implicit `0s`, it was also
silently delaying this fade by the same amount — `applyModeCopy()` zeroes
`el.style.transitionDelay` right before adding `.mode-swap` to kill that.

**Footer** got an accent-gradient top edge (`footer::before`, orange →
purple → blue — the same gradient identity as the hero headline and the
mode toggle it tracks) and a "get notified about new challenges" email
capture in the brand column (`#footerNotify`). The capture is **front end
only, same honesty rule as `login.html`/`signup.html`**: its
`data-endpoint` attribute is empty, and submitting says so — "Not
connected yet — this form is the finished front end, waiting on the
API." — rather than faking a success. Point `data-endpoint` at a real
route to wire it up.

### 1. Hero & call to action
Headline "Hire on proof, not paper." (second line carries a spectrum
gradient via `background-clip:text`). **Two CTAs** as specified — "Post a
challenge" (primary) and "Browse challenges" — with the Hack & Hire
statistic directly below them (3 figures, not 4 — see "Copy framing"
above for why "10+ live defenses" is gone).

- The eyebrow reads "Where real work is the strongest hiring signal" (the
  page's own established tagline). It originally had no leading bullet dot
  as a hero-only exception (`.eyebrow--plain`); the dot was later dropped
  from every section eyebrow site-wide (see "Known issues" #10) and that
  class no longer exists — this is now just a plain `.eyebrow`, no
  different from any other section's.
- The `+` in "120+" lives **inside** the `<b>`, not as a bare text node
  after it. `.hero-stat-row span` is a flex row, so its `gap` would
  otherwise land between the number and the plus and render "120 + builders".
  (Same class of bug as the old `.cand-left` one — worth remembering: a flex
  `gap` applies between *anonymous* text-node flex items too.)
- H1, hero sub-copy, hero CTAs, and the `.hero-card` mock are all
  **mode-aware** (`data-mode-copy`, see "Nav / footer" above): business
  mode keeps the copy above; builder/student mode swaps the H1 to "Prove
  your skills, not your resume.", the sub-copy to the builder framing, the
  primary CTA to "Participate" (`signup.html?role=builder`, "Browse
  challenges" is unchanged either mode), and the `.hero-card` mock from a
  "YOUR CHALLENGE" progress readout (challenge live → submissions →
  shortlist → interview) to a "YOUR SUBMISSION" one (challenge joined →
  submitted → ranked → noticed). The count-up numbers inside the card are
  static in the swapped HTML — they don't re-run their count animation on
  a mode switch, an accepted tradeoff.

**The hero visual now has a real background image again — a still frame,
not a photo/video texture that changes on scroll.** `hero-visual.webp`
(92KB, converted+compressed from the existing `assets/Logo Background
2.png` master via `ffmpeg -q:v 82`) sits behind `.hero-card` as a plain
CSS `background-image`; a dark linear-gradient wash on top keeps the card
text legible, and the old flat gradient is still there as a fallback fill
underneath. This is **not** a reintroduction of the earlier
"Spectrum-to-Waveform Hero Handoff" (two images crossfading on scroll) —
there's still no `<video>`, no `<img>`, no scroll listener, and the image
never changes once painted, so the two complaints that got the old
handoff removed (changes on scroll; overuse of the fluid/spectrum texture
specifically) still don't apply. A gentle cursor-tilt (`#heroVisual` in
`landing.js`, desktop pointer only — gated on `(hover:hover) and
(pointer:fine)`, max 7deg, no permanent CSS `transition` on the element
itself to avoid fighting `[data-reveal]`'s own transform transition) is
the one interaction it keeps. Testimonials briefly reused this same file
as its own background too, but that design didn't stick — see "6.
Testimonials" below; `hero-visual.webp` is hero-only now.

**The hero was also resized down to get the logo carousel above the
fold** — asked explicitly ("it is currently just below the end of the
screen"). Two changes together, both scoped to desktop: the H1's clamp max
dropped from 86px to 72px (the builder/student headline is longer than the
business one and was wrapping to 4 lines instead of 2 at the old max,
adding ~170px of height — 72px is the largest size that still fits both
headlines in one line per `<br>` segment within the ~605px text column at
1280–1920px widths), and `.hero-visual`'s aspect ratio went from `1/1.04`
to `1/0.86` (it had become the taller of the two grid columns and was the
height bottleneck once the text column shrank). Together these bring the
logo carousel comfortably on-screen at 1366×768, 1440×900, and 1920×1080
without touching any copy.

**Hero + logo carousel fill the window (Aug 2026).** Asked explicitly: the
Featured challenges / Success stories split must not be visible until the
reader scrolls. Before this the hero + carousel were a fixed ~813px tall
regardless of window height, so the split peeked above the fold on every
window taller than ~810px (measured: 1440x900, 1536x864, 1920x1080 all
showed it). `.hero` now carries

```css
--fold-reserve:234px;                                  /* nav 76 + logo strip 158 */
min-height:min(calc(100svh - var(--fold-reserve)), 900px);
display:flex; align-items:center;                      /* .hero-grid gets width:100% */
```

`min()` and not a fixed height, deliberately, so this can only ever GROW the
hero: on short windows the hero's natural content height is larger than the
computed figure and simply wins, so nothing is ever squashed. The 900px
ceiling is the "within reason" part. Verified the split lands exactly on the
fold at 1536x864, 1440x900, 1600x900 and 1920x1080, stays below it at 1280x720
/ 1366x768 / 1280x800, and is allowed to peek only at 2560x1440, where filling
the window would mean ~1200px of stretched whitespace. `svh` (with a `vh`
fallback line) so mobile browser chrome doesn't push the fold off-screen.
**If the nav or the logo strip ever changes height, update `--fold-reserve`.**

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

Chips are now `<a href="#stories">` (real anchors, not bare `<span>`s), so
the carousel is clickable — each should point at that partner's own real
case study/site once real partners exist; `#stories` is a placeholder
target, not a final one. The marquee also now pauses on hover and on
keyboard focus (`mouseenter`/`focusin` on the track), not just when
scrolled off-screen — needed once the chips became focusable links, so a
keyboard user tabbing through them isn't fighting a moving target.

### 3 + 4. Featured challenges | Success stories — SUPERSEDED BY v3

> v3 replaced this whole split with a single Featured-challenges section
> (spotlight + compact list), identical for both audiences, and dropped
> Success stories entirely. See the v3 architecture section at the top.

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
- A `.ss-view-all` link ("View all challenges →", pointing at
  `challenges.html`) sits after the 3 sample cards, **below** "Sign up to
  compete" — asked twice: first to reorder it under the button, then
  explicitly to make sure the two actually stack vertically rather than
  sitting side by side (`.ss-view-all` is `display:block; width:fit-content`
  now, not `inline-block` — a block-level sibling always starts its own
  line regardless of what precedes it, which is what forces the button
  above it onto its own line too). A reminder in the HTML that this split is
  **a brief overview of a few featured challenges, not a full listing**;
  the complete, filterable list belongs on `challenges.html`, a separate
  page that doesn't exist yet (see "Known issues" #4). A one-line `.ss-story` note
  ("Two of those companies hired directly off the back of a challenge
  submission.") was added under Success stories' `.ss-note` — grounded
  strictly in the existing "2 hires" fact, nothing further invented (an
  earlier draft added "no separate interview loop required," which wasn't
  an established fact, and was cut).
- `#ssHint` ("Hover to explore • tap to switch") sits above `.ss-tabs` and
  dismisses permanently on first tab click or panel hover/focus — hidden
  outright on mobile (`.ss-tabs` itself is gone below 900px).
- **Below 900px, the challenge/stat cards (`.ss-card`, `.ss-stat`) now get
  their own scroll-reveal**, separate from the generic `[data-reveal]`
  system: a dedicated `IntersectionObserver` in `landing.js`, gated by
  `matchMedia("(max-width:900px)")` so it never touches the desktop pin,
  fades/slides each card in with a small per-card stagger. Without this the
  whole split rendered as flat, motionless text on mobile the instant it
  scrolled on screen, since the hover/veil mechanic (the desktop entrance
  motion) is dropped entirely at that width. Reduced-motion and no-js both
  render the end state (`opacity:1`) directly, same rule as everywhere
  else on the page.

### 5. How it works — SUPERSEDED BY v3

> v3 replaced the pinned scroll-scrub with a static vertical timeline; all
> four steps are visible at all times and there is no scroll gating. The
> scrub history below is kept because this section flip-flopped three times
> and the reasoning is worth not relearning.

**This flipped a third time — read carefully before touching it again.**
The first build ran a 5-step pinned scroll-scrub (Post/Apply → Async
submission → Live defense → Rubric scoring → Hire decision) through
`fluid-full.png`, with a Rubric Spectrum Bar on the scoring step. When the
live-defense/rubric content was dropped (see "Copy framing" above) this
was replaced with a plain static 4-card grid matching a screenshot of the
archived `business.html`'s own How-it-works section. **The user then
explicitly asked for the scrub mechanic back** — *"I like the old
animation for the how it works, where it was zoomed in on the fluid
background and moved as the user scrolled. Use that but with the 4
steps"* — so the static grid is gone again and the pinned scrub is back,
restored from git history (`git show <pre-static-grid commit>:assets/
landing.css`/`landing.js`) and adapted from 5 steps to the current 4, with
no rubric content re-added.

Current implementation: `.flow` is a **540vh** wrapper; `.flow-stage` pins
for the duration. **Raised from 368vh (Aug 2026)** because the user reported
the scroll animation "feels too short, it finishes before I even process" a
step: 368vh gave each of the 4 steps only ~92vh (0.75 screen-heights) of
scroll. At 540vh each step gets ~135vh (1.10 screen-heights), measured, so a
headline holds long enough to read. Desktop only, since below 900px `.flow`
collapses to `height:auto` and a plain stacked list. `.flow-fluid` tracks `background-position` on the fluid artwork
(delivered via `--img-fluid-full`, AVIF with a WebP fallback — see "Known
issues" #3) as the reader scrolls (opacity `.58`, own `landing.js` scrub
tied into the shared `scrollUpdaters` ticker, not its own listener).

**The zoom level was reduced and de-distorted (Aug 2026) — don't put
`220% 220%` back.** The user reported the background still looked
low-resolution after the AVIF re-encode, and correctly suspected the zoom.
`background-size:220% 220%` sized *each axis to 220% of the container
independently*, which had two separate faults: it ignored the artwork's own
1080x611 aspect ratio (at 1440x900 that stretched it 10.5% vertically; on a
390px phone it squashed it to a 0.46 aspect vs the source's 1.77 — severe),
and 220% of the viewport meant a 2.9x (1440px) to 5.2x (2560px) upscale of a
1080px-wide source. Past roughly 2x, no encoding quality can compensate.
It now scales to **cover** (aspect preserved via the artwork's own ratio)
and multiplies by a zoom factor for the overhang the scrub pans through:

```css
--fluid-ar:1.7676;   /* 1080 / 611 — regenerate if the artwork changes */
--fluid-zoom:1.4;
background-size:calc(max(100vw, 100vh * var(--fluid-ar)) * var(--fluid-zoom)) auto;
```

Measured upscale went 2.93x -> **2.06x** at 1440px, with the distortion gone
entirely. (`--fluid-zoom` was 1.25 / 1.84x for one round, then nudged up to
1.4 on request for a slightly tighter crop.)
`--fluid-zoom` is the single knob if the motion needs more or less travel;
raising it trades sharpness back for pan distance.

`.flow-scrim` is a
center-heavy radial gradient (not just edge vignette) since the step copy
sits dead centre, which is exactly where the artwork's brightest passages
run — an edge-only vignette left the text unreadable. The 4 steps
crossfade with **asymmetric timing** (outgoing fades in `.24s`, incoming
waits `.14s` then fades in over `.5s`) since all four are stacked at the
same absolute position and a symmetric crossfade briefly rendered two
headlines on top of each other. Numbers are bare (`.flow-num`, "01" not
"STEP 01") per the earlier explicit ask, kept through this restoration.

**Mode-aware, same as the hero**: `.flow-steps` carries `data-mode-copy` +
full `data-business`/`data-builder` HTML strings for all 4 steps. Business:
Business posts a challenge (+ "Post a challenge →" link) → Builders
compete → Top performers get evaluated → Interviews, internships &
recognition. Builder/student: Find a challenge (+ "Browse challenges →"
link) → Submit your best work → Get evaluated on merit → Earn interviews &
recognition. See "Nav / footer" above for the `wrap.refreshFlow()` hook
this requires so the scrub doesn't animate stale, detached nodes after a
mode swap.

Below 900px / reduced motion / no-js, the pin collapses to a plain stacked
list (`.flow-step{position:static; opacity:1}` — a scroll-gated step that
never activates would hide content outright, the site's hard rule).
`fluid-full.png` **is loaded again** as `.flow-fluid`'s background — see
"Known issues" below, this reverses what was previously documented there.

### 6. Testimonials — recycling marquee wall (REBUILT a third time)
**Third distinct design for this section — read carefully before touching
it again.** History, fastest to slowest:
1. A carousel: highlighted centre card, arrow buttons, 4s auto-advance,
   an infinite loop via clone-before-first/clone-after-last with a silent
   snap, real touch-swipe.
2. A pinned scroll-scrub over `hero-visual.webp` ("Logo Background 2"),
   panning right-to-left, each testimonial appearing at its own point in
   the scroll — built on explicit request, but the user didn't like it
   live and asked for a completely fresh design, **"bonus points if it
   uses a projet asset."**
3. **Current**: a continuous recycling marquee — the same technique as the
   logo carousel (see "2. Logo carousel" above), applied to full testimonial
   cards instead of small logo chips, on a light `--paper-warm` background
   instead of a dark image. All of #1 and #2's markup/CSS/JS
   (`.t-viewport`/`.t-track`/`.t-controls` from the carousel;
   `.t-scrub`/`.t-stops`/`.t-dots` from the scroll-scrub) is gone.

**Why a light section, specifically**: Featured challenges/Success stories
and How It Works are both dark, immersive sections — with the old dark
testimonials that was three dark sections in a row before the final CTA.
Testimonials on `--paper-warm` breaks that up and gives the page some
rhythm back.

**The "projet asset" bonus**: `assets/icon-mark.png` (a clean copy of
`Logo O Alone.png`, the icon mark by itself, still has its alpha channel)
sits as a faint (`opacity:.08`) watermark in the top-left corner of every
card, standing in for a literal curly quotation mark — ties the section
back to the brand mark without being a photo/texture background again.

**Mechanic**: `buildMarqueeRow(track, speed, direction)` in `landing.js` is
a generalised twin of the logo carousel's IIFE, not a rewrite of it (that
IIFE is untouched). It uses a different recycling technique than the logo
marquee, though, because it has to run in both directions (the logo
marquee only ever moves one way): instead of physically moving DOM nodes
from head to tail as they clear an edge, it measures `cycleWidth` (the
width of one full, un-cloned pass through the original cards) once, then
just wraps the `offset` by exactly that amount whenever it crosses a cycle
boundary. Because the track's content is cloned until it repeats at least
twice, the pattern lines up with itself exactly every `cycleWidth`, so the
wrap is seamless by construction with zero DOM manipulation mid-animation
— and the same wrap logic works for `direction: 1` or `-1` symmetrically,
which the logo marquee's node-shuffling approach doesn't. Currently one row
(`#tWallTrack`), `direction:-1` (right-to-left), `32px/s` (slower than the
logos' `46px/s` — testimonial cards carry much more to read).

**Fallbacks, same rule as everywhere else on the page**: reduced motion
runs the clone-fill (so the DOM briefly has more than 5 cards) but skips
the animation loop; CSS hides everything past the 5th child
(`.t-card:nth-child(n+6)`) and wraps the remaining 5 into a static grid
(`flex-wrap:wrap`) instead of leaving a frozen, overflowing single row. No-js
never runs the clone loop at all — only 5 cards ever exist — but still
gets the same wrap-into-a-grid CSS, since without it the unclipped
`width:max-content` track would just overflow past the viewport edge with
`.t-wall-row{overflow:hidden}` silently clipping the rest.

- Quotes, names and avatars are **placeholders** — see "Known issues" #1.
  Avatars are illustrated silhouettes: an inline SVG, a gradient-filled
  circle with a clipped head-and-shoulders shape drawn on top (`clipPath`
  keeps the silhouette inside the circle), deliberately not photographs of
  real people.
- **Speaker badges**: each `.t-card` gets a `data-side="business"` /
  `"builder"` attribute and a `.t-badge` ("Company" / "Builder") — tags who's
  speaking, fixed orange/blue regardless of which audience mode the reader
  has toggled (see "Nav / footer" above for the colour pairing itself,
  which reversed this round).

### Final CTA
`.final-fineprint` ("Free for builders — no card required.") under the
buttons is grounded in the existing builder-model fact, not a new one.
Both buttons are `.btn-white` (**asked explicitly to match** — one was
`.btn-white`/filled, the other `.btn-outline-white`/ghost, the same
mismatch already flagged and fixed once for the spectrum-split panel CTAs)
and both carry `.btn-arrow`: a `→` glyph hidden at `max-width:0; opacity:0`
slides/fades in on hover/focus-visible. A slow gradient pulse
(`.final::before`, two radial gradients, `9s ease-in-out infinite`) sits
between the fluid video layer and the readability scrim (`.final::after`)
— explicit z-index stack (video → pulse `z-index:1` → scrim `z-index:2` →
content `z-index:3`) so the pulse never washes out text contrast. Reduced
motion collapses the animation's duration to near-zero via the page's
existing global guard; since the pulse's `0%`/`100%` keyframes share the
same values, it settles cleanly on the resting frame rather than freezing
mid-cycle.

**`.final-quote` was removed** — asked explicitly. It briefly reused the
same testimonial quote above the headline; gone now, along with its CSS.

**`.final-wrap` now has `padding-top:96px` (was `0`, bottom-only).** The
Testimonials scroll-scrub sits flush against this section with no margin
of its own, so with no top padding here the two used to butt directly
together — the dark scrub background ran straight into the CTA card with
no breathing room. Symmetric with the existing `padding-bottom`.

## Animation reference library

`Projet — Scroll Animation Library` (the user's markdown doc, supplied in
chat) is the source for the named effects. Implemented and **still live**:
Section Reveal on Scroll (#2), and **Fluid Flow Steps (#3)** in How It
Works (restored with 4 steps, no rubric content — see "5. How it works"
above). Testimonials briefly ran a second, differently-tuned instance of
Fluid Flow Steps (right-to-left pan, per-stop vertical offsets) before
being rebuilt again into a recycling marquee wall — see "6. Testimonials"
above; that section's motion isn't from this library at all now, it reuses
the Logo Carousel's own marquee technique instead. **Testimonials Fluid
Parallax (#8) is gone** — it was the original carousel's `.t-bg` layer,
removed along with the rest of that carousel.
**Removed and staying removed**: Spectrum-to-Waveform Hero Handoff (#1, see
"1. Hero & call to action" above — the hero's new background image is a
still frame, not this effect) and Rubric Spectrum Bar (#7, moot with the
rubric gone). Not used: Waveform Proof Ticker (#4), Defense Spotlight (#9,
moot now the defense concept itself is gone — see "Copy framing").
**Audience Spectrum Toggle (#5)** — the nav's `.mode-switch` (see "Nav /
footer" above) started as a lighter-weight version of it (re-tint only)
and has since grown into the full thing: it now also rewrites hero and
How-it-works copy per mode, with its own crossfade transition. **CTA
Waveform Pulse (#6) is now partly used** — a slow gradient pulse on the
final CTA's background (see "Final CTA" above), simpler than the
library's original waveform concept but the same "slow pulse" idea.

**Every scroll-linked effect runs off one shared rAF-gated ticker** in
`landing.js` (`scrollUpdaters`), not its own listener. Enter/exit-only
effects use `IntersectionObserver` instead, since they don't need a
continuous progress value.

**The non-negotiable rule on this page: every effect renders its END STATE
when motion is off or JS never runs — it never just skips.** Verified: under
both `prefers-reduced-motion` and JS-disabled, all reveals, all five
testimonials, all counters, the How-it-works steps (collapsed to a plain
stacked list, all visible), and the mobile-only spectrum-split card reveal
all render at their final values.

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
3. **Background artwork — AVIF primary, WebP fallback. The old `ffmpeg
   -q:v 82` WebP convention is RETIRED; do not reapply it to these.**
   The hero background (`.hero-visual`), the How-it-works scrub
   (`.flow-fluid`) and the light-spectrum wave (`.ss-bar`) are all smooth
   gradient artworks, and all three are ZOOMED on screen, which magnifies
   every encoding artifact. (The flow scrub's own zoom was subsequently
   reduced from 2.9x to 1.84x at 1440px — see "5. How it works" above.
   Encoding and magnification were two independent causes of the same
   complaint; both had to be fixed.)

   **Still outstanding — the one thing that needs the user.** The true
   original of the fluid artwork lives in Figma (`fileKey
   KWwUgic3XjFfV5Xyz5VqDI`, nodes `1:22` background + `1:23` foreground,
   composited — `fluid-full.png` is that composite at scale 1). The local
   master is only **1080x611**, so even at the reduced zoom it is still
   upscaled ~1.8x-3.0x. `download_assets` at `defaultScale:4` returns the
   URLs fine, but **this environment's egress policy blocks
   `www.figma.com` outright** (gateway 403 on CONNECT, confirmed via the
   agent proxy's status endpoint — not something to route around), and
   base64-through-context is not viable at that file size. A ~2560px-wide
   PNG export of nodes 1:22+1:23 composited, dropped into `assets/`, is
   the only remaining step; re-run the AVIF command below on it.

   **The bug this caused, and the root cause:** the user reported the
   How-it-works background had "lost its quality." Measured against the
   PNG masters, `fluid-full.webp` was at **31.8dB PSNR** (blue channel
   29.2dB) — visibly mushy filaments and banded gradients. The cause was
   NOT the quality number: **WebP's lossy mode is 4:2:0 only**, so it
   discards half the colour resolution in each axis by design. Re-running
   at q=100 only reached 32.9dB — the slider barely moves, because
   subsampling rather than quantisation is the ceiling. Gradient art is
   the worst possible case for that trade.

   **The fix:** AVIF at true 4:4:4. Measured result —
   `fluid-full` 31.8 → **43.8dB**, `hero-visual` 33.6 → **43.3dB**,
   `spectrum` 41.9 → **45.8dB**, at comparable file sizes (156K/192K/164K;
   ~0.60MB total media for a full scroll-through). Regenerate with:

   ```
   ffmpeg -i <master>.png -c:v libaom-av1 -crf 6 -pix_fmt yuv444p \
          -still-picture 1 -cpu-used 3 <name>.avif
   ```

   **Keep `-pix_fmt yuv444p`** — letting it fall back to `yuv420p` re-creates
   the exact bug. Masters: `fluid-full.png`, `Logo Background 2.png`,
   `official-spectrum.png` (all stay on disk).

   Delivery is via three custom properties at the top of `landing.css`
   (`--img-fluid-full` / `--img-hero-visual` / `--img-spectrum`): a plain
   `url(...webp)` default, upgraded inside `@supports` to
   `image-set(avif, webp)`. That is two independent fallback layers — no
   `image-set` support falls back to the WebP declaration, and `image-set`
   without an AVIF decoder falls back to the WebP entry — so **the `.webp`
   files must be kept**, they are not dead weight.

   One caveat worth knowing: `Logo Background 2.png` has an alpha channel,
   but it is exactly **one semi-transparent row (y=602, the bottom edge,
   alpha 128)** out of 651,240 px — an export artifact, and hidden anyway
   by `.hero-visual`'s `border-radius:26px; overflow:hidden`. That is why
   flattening it to opaque AVIF is safe. (It had to be flattened: this
   ffmpeg's libaom path silently drops alpha, writing `yuv444p` even when
   asked for `yuva444p`. If a future asset has *meaningful* transparency,
   AVIF via this toolchain is not an option — check the alpha histogram
   first, don't assume.)

   `assets/fluid.webp` (the final-CTA video poster) is deliberately left as
   WebP: `poster` takes a single URL and can't use `image-set`, and there
   is no PNG master for it — it is similar to but not the same frame as
   `fluid-full.png` (37.9dB between them), so it can't be regenerated from
   one.
4. **No real backend.** Static HTML/CSS/JS, no framework, no build step.
   **Routing is now resolved**: `challenges.html` was built (see "Site
   architecture" above), so every "Browse challenges" CTA and
   `.ss-view-all` points at a page that exists — nothing on either page
   404s or links to `#`. What's still front-end-only is the *data*: the
   listing is six labelled sample briefs, the auth forms and the footer
   capture all need `data-endpoint` pointing at a real route, and there is
   no brief-detail page (so challenge cards are intentionally not links).
   `About`, `Careers`, `Contact`, `Privacy` and `Terms` don't exist as
   pages; rather than `href="#"` (which silently jumped the reader to the
   top) they render as `.footer-pending` spans — the destination is named
   and marked "soon", the same honesty convention the auth forms use. Swap
   each `<span>` back to an `<a href="…">` as its page ships.
5. **`assets/fluid_animation_3500ms.mp4` (18.7MB, 3840x2160) is the raw
   master export** and is not referenced by any page. `assets/fluid-loop.mp4`
   is what ships (final CTA only now — not the hero, not testimonials).
   **Re-encoded at 1920x1080 (was 1280x720):** the final CTA renders up to
   ~1176px wide, so 720p was being upscaled ~1.8x on a retina display.
   Compression was never its problem (the old file already measured 43.1dB
   against the master); resolution was. Now:

   ```
   ffmpeg -i fluid_animation_3500ms.mp4 -vf "scale=1920:-2:flags=lanczos" \
          -an -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p \
          -movflags +faststart fluid-loop.mp4
   ```

   2.6MB / 44.9dB. The size is affordable specifically because the element
   is `preload="none"` at the bottom of the page — verified it transfers
   0 bytes on a normal load, so it costs nothing against LCP. Never hand the
   raw 4K export to a page.
6. **`spectrum.webp`'s per-bar `BAND_ZOOM` table is tied to the exact
   current image.** See "3 + 4. Featured challenges | Success stories"
   above — if this asset is ever re-exported or replaced, the 14
   `[zoom, offsetK]` pairs in `landing.js` need regenerating from the new
   file, or the wave will show black/misaligned bars again.
7. **Accessibility/perf pass (resolved, Aug 2026)** — an `/impeccable audit`
   flagged several real issues, all now fixed:
   - **WCAG AA contrast failures**: the base `.eyebrow` color (signal/current
     orange or blue at 12px on paper) only hit ~3.1:1; switched to
     `var(--accent-deep)` (5.09-6.68:1) in both `landing.css` and `site.css`.
     The recurring muted-gray captions (`#9c988c`, `#a8a496`, decorative
     placeholder `#c2beb2`) failed at 2.5-2.9:1; darkened into two new
     tokens, `--muted` (#726d5f, 5.16:1 on paper / 4.69:1 on paper-warm) and
     `--muted-large` (#8f8874, 3.53:1 — meets the large-text 3:1 threshold
     the 23px/900-weight logo chips qualify for).
   - **Hardcoded colors consolidated into tokens** (matching DESIGN.md's
     palette): `--blue-deep` (#1d4fd6), `--violet` (#7a3f8f, the gradient
     midpoint DESIGN.md calls Spectrum Violet), `--amber-light` (#ff9a5a),
     `--navy-mid`/`--navy-deep` (#1c3d8f/#0c1638, the hero-visual gradient's
     dark stops) — added to both `landing.css` and `site.css`'s `:root` and
     substituted everywhere the raw hex previously appeared in live-rendered
     CSS. Left untouched: the large amount of dead CSS in `site.css`
     (`.pain-item`, `.compare-card`, `.evidence-side`, `.quote-card`,
     `.hero-visual`, `.final-cta`, etc.) inherited from the archived
     business/builders pages — `login.html`/`signup.html` don't reference
     any of those classes (confirmed by grepping their actual `class=`
     attributes), so reconciling that dead code against DESIGN.md's tokens
     was out of scope.
   - **Sub-44px touch targets** (measured live via Playwright on a 390px
     mobile viewport, not guessed): `.logo` (67×22), `.btn-sm` (84×35),
     the mobile `.mode-opt` (170×36), and `#footerNotifyEmail` (303×37) all
     padded up to clear 44px without changing their visual size/type scale.
     `.logo-chip`, `.ss-view-all`, and `.flow-step-link` were below even the
     24×24 AA minimum (as low as 15px tall); padded to clear 24-30px —
     deliberately not pushed to the full 44px AAA bar, since forcing that on
     a scrolling decorative marquee chip or a secondary in-flow "read more"
     link would visibly bloat them for a stricter target this project isn't
     otherwise holding itself to. `.footer-col a` and the mobile `.m-link`s
     already cleared 24×24 and were left as-is.
   - **Missing `:focus-visible` styling**: added a universal two-tone ring
     (`box-shadow:0 0 0 2px var(--paper), 0 0 0 4px var(--ink)`) to the base
     `.btn` class in both `landing.css` and `site.css` — since every button
     variant on the page carries the base `.btn` class, this one rule covers
     all of them without per-variant color-matching, and the light+dark pair
     means at least one ring is always visible regardless of whether the
     button sits on a light or dark section. Also added to `nav.links a`,
     `.mode-opt`, `.ss-tab`, `.footer-col a`, and `.mobile-menu a.m-link`
     (only `.logo-chip` and the auth-form `.field input` already had their
     own). Strengthened `.footer-notify-row input`'s focus state from a bare
     border-color swap to the same box-shadow ring pattern already used on
     `site.css`'s auth inputs.
   - **Font preconnects**: `fonts.googleapis.com` had one already;
     `fonts.gstatic.com` (the actual Google Fonts file host, not just the
     CSS host), `api.fontshare.com`, and `cdn.fontshare.com` (Fontshare's
     font-file CDN) did not.
   - **`fluid-full.png` → `fluid-full.webp`**: see item 3 above.
8. **Second accessibility pass (resolved, Aug 2026)** — a deeper structural
   audit than #7 (which was mostly colour/contrast/targets). All fixed:
   - **Broken ARIA tab pattern.** `.ss-tabs` used `role="tablist"`/`role="tab"`
     with `aria-selected`, but there were zero `role="tabpanel"`s and no
     `aria-controls` — and, more fundamentally, *both* spectrum-split panels
     stay fully visible; the control only shifts which side is emphasised.
     A tab promises "this panel replaces that one," which isn't what happens.
     Now plain toggle buttons in a `role="group"` with `aria-pressed`
     (`landing.js` sets it, `.ss-tab[aria-pressed="true"]` styles it).
   - **10 duplicate DOM ids.** Each testimonial avatar carried its own
     `<defs>` with `av1..av5`/`avc1..avc5`; the marquee clones every card, so
     each id existed twice — invalid HTML, and every clone's `url(#…)`
     silently resolved to the first match anyway. The gradients and the one
     shared circular clip now live once in a `.t-avatar-defs` sprite outside
     `.t-wall-track`, so cloned cards carry no ids at all.
   - **Logo marquee clones were focusable and read aloud.** They doubled the
     strip's tab stops (8 → 16) and made a screen reader announce the whole
     placeholder list twice. Clones now get `aria-hidden="true"` **and**
     `tabindex="-1"` (aria-hidden alone is a violation if the node stays
     focusable). The testimonial marquee already did this.
   - **Heading order skipped 2 → 6.** Footer column headings were `<h6>`
     under `<h2>` sections; now `<h3>` (`.footer-col h3`, with an explicit
     `line-height` since the base `h1,h2,h3` rule's 1.03 is display-tuned).
   - **No skip link.** Added — it's why `.sr-only` sat unused in
     `landing.css`. `.skip-link` is off-screen until focused; `<main>` got
     `tabindex="-1"` so focus actually lands there rather than only scrolling.
   - **The final-CTA video ignored `prefers-reduced-motion`.** The page's
     reduced-motion guard is CSS-only and CSS cannot stop a `<video autoplay
     loop>`, so it kept looping for exactly the visitors who asked it not to.
     `landing.js` now pauses it to frame 0 under that preference (the poster
     still shows, so the section keeps its artwork). Re-verified with
     Playwright's `reducedMotion:'reduce'`: `paused=true, currentTime=0`.
   - **`autocomplete="email"`/`name`** added to the footer capture (the auth
     forms already had theirs).
   - **Nav "Success stories" landed on the wrong panel.** Both split panels
     share one pinned stage, so `#stories` and `#challenges` resolve to the
     same scroll position — clicking "Success stories" arrived at a stage
     still emphasising Featured challenges. Those links now also set the
     side.
   - **`.ss-stats--three` at 900–1200px.** On the *inactive* (narrower) panel
     the 3-up grid squeezed captions to roughly one word per line ("hires /
     made / off the / back / of it"). Stacked below 1200px. The panel width
     animates, so a container query is the precise tool here if this is ever
     revisited; the media query is the robust equivalent.
   - **`.ss-hint` legibility.** Near-white text sat centred over the
     spectrum band's brightest passage. A text-shadow wasn't enough for
     white-on-white; it now uses the same translucent dark pill as the
     countdown and the toggle beneath it.
9. **"AI tell" cleanup (Aug 2026)** — asked explicitly to remove signs the
   site was AI-generated, em-dashes named as the example. Scope was every
   visitor-visible surface: rendered HTML text/attributes (`title`, meta
   `og:`/`twitter:`/`description`, `aria-label`, tag content) and JS-injected
   `textContent`/`say()` strings across `index.html`, `challenges.html`,
   `login.html`/`signup.html`, `landing.js`, `challenges.js`, `site.js` — 22
   em-dashes (including `&mdash;`/`&#8212;` entity forms) rewritten as plain
   sentences (periods, commas, "and") rather than swapped for a semicolon or
   hyphen. **Deliberately NOT touched**: HTML/CSS/JS comments. Those never
   render to a visitor — reading them requires View Source — and this repo's
   comments are load-bearing engineering documentation (hard-won bug
   fixes, explicit user asks, the "why" behind non-obvious choices); wiping
   them for zero visitor-facing benefit would have cost real institutional
   memory. If that judgment call is wrong, ask for comments specifically.

   Also addressed, since `/impeccable`'s own detector had been naming these
   as literal AI-generation signatures on every turn this session:
   - **Gradient text removed.** `.hero h1 .accent` (`background-clip:text`
     spectrum gradient on "not paper."/"not your resume.") is now a solid
     `var(--orange)`. Single CSS rule, three HTML call sites (business/
     builder mode-swap + static fallback), no DESIGN.md dependency — clean
     to convert. Kept the brand accent colour, dropped the gradient.
   - **Side-tab card border removed.** `.t-card::before`, a 3px top-edge
     accent bar colour-coding testimonial speaker side (blue=company,
     orange=builder), is gone. It was pure redundancy, not just an AI
     tell: `.t-badge` already encodes the same side via both text
     ("Company"/"Builder") and colour. `.t-card`'s `position:relative`
     stays — still needed for the watermark and badge.

   Not touched: the diagonal spectrum-split stripe, the flow-scrub
   background, and other gradient *fills* on decorative surfaces (not
   text) — the flagged pattern is specifically gradient *text*, not colour
   gradients generally, and DESIGN.md documents those as an established
   brand motif (the "light spectrum wave").

10. **Eyebrow dot removed (Aug 2026)** — the user flagged the small coloured
   bullet in front of every section's uppercase mono kicker ("FEATURED
   CHALLENGES", "SUCCESS STORIES", "HOW IT WORKS", etc.) as another AI tell,
   separately from the em-dash/gradient/side-tab pass. `.eyebrow::before`
   and `.ss-eyebrow::before` (both a `width:6px; height:6px; border-radius:
   50%` dot) are gone. The mono/uppercase/letter-spaced label itself stays —
   that's an editorial kicker convention older than any AI tooling, and
   JetBrains Mono for labels is a documented brand token (see "Brand
   tokens" above) — only the dot glyph in front of it was the recognisable
   generic-SaaS-template signature.

   This also resolved a small asymmetry: the hero eyebrow was the one
   deliberate dot-less exception (`eyebrow--plain`, "asked and confirmed"
   per an earlier round), while every other section kept the dot. With the
   dot gone everywhere, `eyebrow--plain` became identical to the base
   `.eyebrow` and was deleted along with its one HTML usage — there is now
   only one eyebrow treatment, used consistently across every section on
   both pages.

## SEO

Added Aug 2026 on request. Static files at the repo root, plus per-page head
tags. Nothing here is generated, so it needs hand-updating.

- **`robots.txt`** — allows everything and points at the sitemap. It
  deliberately does **not** `Disallow` the noindex pages. That is the common
  trap: a `Disallow` stops the crawler fetching the page at all, so it never
  sees the `noindex`, and the bare URL can still surface in results. Allow the
  fetch and let the meta tag do the work.
- **`sitemap.xml`** — lists only `https://myprojet.co/`. `challenges.html`,
  `login.html` and `signup.html` are all `noindex`, and listing a noindex URL
  in a sitemap is a contradictory signal. **Add `challenges.html` at the same
  time its `noindex` comes off**, which is when the API serves real briefs.
  Namespace must be `http://www.sitemaps.org/schemas/sitemap/0.9` (sitemap*s*,
  plural — an easy typo that silently invalidates the file).
- **JSON-LD** on `index.html`: an `@graph` of `Organization` + `WebSite` +
  `WebPage`, cross-referenced by `@id`. Scoped **only to facts already public
  on the page**: name, URL, logo, what the product does, and Singapore (which
  the footer states). Deliberately omitted: founder names, email, phone,
  funding, founding date. None of those appear on the public site, and
  structured data that outruns the visible page is worse than none. There is
  no `SearchAction` because the site has no search.
- **`challenges.html` got a canonical + full OG/Twitter set.** It had none.
  Social tags still matter on a `noindex` page: `noindex` keeps it out of
  search, but the URL can still be pasted into Slack or a DM, and these
  control the unfurl.
- `og:locale` is `en_SG` on both pages. `og-cover.jpg` is a correct 1200x630.

**Caveat worth re-reading before pushing for traffic:** the landing page is
indexable and still carries invented testimonials and fictional partner logos
(see "Known issues" #1). SEO work makes that content easier to find, so the
placeholder swap matters more now, not less.

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
- **Any front-end-only form** (auth forms, the footer's "get notified"
  capture) follows the same honesty rule: an empty `data-endpoint` makes it
  say the wiring is pending, never a faked success. Reuse this convention
  rather than inventing a new one for the next such form.
- **Mobile-only JS effects gate on `matchMedia`, not just CSS breakpoints**,
  and are kept in their own dedicated `IntersectionObserver`/listener
  rather than folded into a desktop mechanic — see the spectrum-split
  card reveal (`landing.js`) as the reference pattern. This keeps them from
  ever touching the desktop behaviour they're not meant to affect.
- **When a component uses two co-applied classes (e.g. `class="t-card
  t-stop"`), give the class that must win a compound selector
  (`.t-card.t-stop`), not a plain single-class one.** Two single-class
  rules of equal specificity fall back to source order, which is easy to
  get backwards by accident as a file grows — the Testimonials rebuild hit
  this twice in one component (see "6. Testimonials" above) before landing
  on this pattern. Fallback overrides (mobile/no-js/reduced-motion) need
  the same treatment, and if a JS-added state class (like `.is-active`) can
  still apply underneath a fallback, the fallback needs `!important` too,
  since a 3-class `.is-active` combination outranks a 2-class fallback
  selector regardless of where either is declared.
