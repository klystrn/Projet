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

Full positioning language (headlines, stats, evidence citations, pricing
math) is already written into `projet-landing.html` — treat that file as
the source of truth for copy/voice, don't re-derive it from this summary.

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
Black. It exists in a Figma file (see below) in dark/white/orange variants.
Neither prototype in this folder currently embeds the *real* logo asset —
both use a small CSS-drawn circle as a placeholder to avoid depending on
Figma's temporary export URLs (see "Known issues" below). **Swapping in the
real logo file is an open task.**

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

## Site architecture / user flow (decided)

The user flow is now wired end to end:

```
projet-split-hero/index.html   (the actual landing page / entry point)
        │  choose Business or Builder
        ├──► business.html     (audience-specific home, Willo-style structure)
        └──► builders.html     (audience-specific home, Willo-style structure)

projet-landing.html is now a secondary "Overview" page (audience-agnostic,
reachable from either home page's footer / logo-adjacent link) — it's no
longer the primary entry point.
```

`business.html` and `builders.html` both follow a problem-first narrative
(modeled on how tool-first SaaS pages like Willo's are commonly structured —
explain the pain before pitching the product): hero opens on the *problem*
for that audience specifically (not a product statement), then a proof
strip, problem/stat section, take-homes-broke comparison, how-it-works,
the defense (signature feature), evidence (validity chart), traction
(quotes + stats), an FAQ section (new — addresses that audience's likely
objections), pricing (business page only — the builder page explains it's
free to the candidate instead), and a final CTA. Copy is voiced per
audience but every stat/rubric number/price is the same underlying fact
from the pitch deck — nothing was invented per-audience.

All three pages plus `projet-split-hero/` now share one stylesheet and one
script file: `assets/site.css` and `assets/site.js` (previously each page
carried its own copy of the same ~14KB of CSS — this was extracted once to
kill that duplication). Page-specific tweaks (e.g. the builder page's blue
accent overrides) live in a small inline `<style>` block in that page only.

### `projet-landing.html`
A single-file marketing/overview page (static HTML/CSS/JS, no build step).
The "scroll story" version: hero, problem stats, take-homes-broke
comparison, 5-step how-it-works, an interactive defense rubric section
with animated bars, the Schmidt/Oh/Shaffer evidence chart, traction stats,
pricing cards, final CTA, footer. Content is drawn directly from the pitch
deck (`Projet_consultant` project files / uploaded pitch deck PDF),
upgraded from an earlier, more generic draft that lived at
`https://projet-landing.vercel.app/` (that URL is blocked by this
environment's network policy — CLAUDE-in-this-repo has never actually
fetched it; treat this file's content as the source of truth instead of
trying to diff against the old draft).

**Status**: Functionally complete as a secondary overview page. No longer
the primary entry point (see "Site architecture" above) — its hero now
offers two direct links ("I'm hiring" / "I'm building") into
`business.html` / `builders.html` instead of the old JS toggle that swapped
hero copy in place. The Figma-hosted favicon, logo mark, and hero/final-CTA
texture images have been swapped for local files (`assets/favicon.svg`, a
CSS-drawn `.logo-mark`, and `assets/spectrum.webp`) so the page no longer
depends on expiring Figma export URLs. The texture is a generated
placeholder standing in for the real fluid-swirl composite (see "Known
issues" #4) — swap it for the real export whenever that's available.

### `business.html` / `builders.html`
The two audience-specific home pages a visitor actually lands on after
picking a path in `projet-split-hero/`. See "Site architecture" above for
the shared structure. Both are single, self-contained HTML files that pull
in `assets/site.css` and `assets/site.js` — no page-specific build step.

### `projet-split-hero/`
A second, separate prototype: a full-viewport "choose your path" landing
screen (Business vs. Builder) meant to sit *before* the marketing page in
the user journey. Self-contained, dependency-free static site, structured
for a direct GitHub commit (see its own `README.md` inside the folder for
mechanic details).

**Design history / status — read carefully, this is mid-iteration:**

1. **First version** (superseded): two flex panels with a shared
   `position: fixed` background image behind both, panel width animating
   50/50 → 66/33 on hover via `flex-grow`, plus a cursor-parallax shift on
   the backdrop. User confirmed the proportions/structure were right but
   the *visual design* was wrong.
2. **Current version** (what's in this folder now): the light-spectrum
   image is broken into a vertical stack of horizontal **bars** running
   down the seam *between* the two panels (not as a shared full-bleed
   backdrop anymore). On hover/focus of a panel, the bars shear
   horizontally *away* from the hovered side (`translateX`), each bar
   offset by a different amplitude (bulges toward the middle bars, via a
   sine curve) and a staggered `transition-delay` per bar index, so the
   motion reads as a cascade/ripple rather than a rigid block sliding.
   The hovered panel's `flex-grow` increases simultaneously, so the effect
   reads as "the bars fan open and the chosen side gets bigger."
   - `index.html` and `styles.css` for this version were written and are
     believed correct/current.
   - `script.js` was rewritten in the same pass to: generate the bar
     elements (`BAR_COUNT = 14`, sine-curve amplitude, staggered delay),
     wire `mouseenter`/`mouseleave`/`focus`/`blur` on each `.panel` to set
     `data-hover="business"|"student"` on `#split` (which the CSS reads to
     drive both the panel `flex-grow` and the bar `transform`), and retain
     touch handling (first tap previews via the same `data-hover`
     mechanism, second tap or tapping the CTA text navigates).
   - **Visually verified**: the divisor image (`assets/spectrum.jpg`) bakes
     in 14 bands (matching `BAR_COUNT`) whose black/colour boundary follows
     a slight curve rather than a straight diagonal — the user flagged that
     the straight-line staircase looked wrong and asked for the curve, so
     the asset generation was corrected (power-curve envelope, `t ** 1.55`)
     before it was committed. Re-check in a live browser still worth doing
     for cascade timing/amplitude feel, but the asset itself is confirmed
     correct.
   - The mobile/touch breakpoint logic in `styles.css` (`@media
     (max-width:760px)`) rotates the band 90° for the stacked mobile
     layout — carried over from the previous design, double check it still
     reads well with the new curved asset.

## Known issues / open tasks

1. **`projet-split-hero` visual check — mostly done.** The bar cascade and
   the curved divisor asset have been generated and wired up; still worth
   opening it in a browser (`npx serve .` from inside that folder, or just
   open `index.html` directly) to check cascade timing/amplitude feel and
   the mobile rotation. Tune `BAR_COUNT`, the amplitude curve, and the
   per-bar delay in `script.js` to taste.
2. **Real logo not embedded anywhere yet.** Both prototypes use a CSS-drawn
   stand-in circle instead of the actual exported logomark. Export the real
   logo from the Figma file above (node `1:64` / `1:80` / `1:84` depending
   on background) as a permanent local SVG/PNG and swap it into both
   `projet-landing.html` and `projet-split-hero/index.html`.
3. **Resolved.** Favicon, logo mark, and hero/final-CTA texture all point
   at local files instead of expiring Figma URLs, and (see #4) the
   hero/final-CTA texture is now the real fluid-swirl composite rather
   than a placeholder.
4. **Resolved.** The user exported the real assets directly into
   `assets/`: `official-spectrum.png` (the real diagonal light-spectrum
   stripe) and `fluid-full.png` (the composited background+foreground
   swirl — `fluid-foreground.png` is also there for reference, showing the
   flat corners the user described before compositing). Optimized `.webp`
   derivatives of both are what's actually referenced from HTML/CSS:
   `assets/spectrum.webp` (used by `projet-split-hero`'s bar divisor) and
   `assets/fluid.webp` (used by the hero-visual/final-CTA texture on
   `projet-landing.html`, `business.html`, and `builders.html`). A fluid
   animation export, `assets/This_is_an_image_of_a_fluid_M.mp4`, is also
   committed but not wired into anything yet — available if an animated
   hero background is ever wanted.
5. **Resolved.** `projet-split-hero`'s panels now link to `business.html`
   and `builders.html` (relative paths, `../business.html` /
   `../builders.html` from inside the `projet-split-hero/` folder) — real
   audience-specific home pages, not placeholder routes. See "Site
   architecture / user flow" above for the full picture.
6. **No real backend/routing exists.** Everything so far is static
   HTML/CSS/JS prototypes with no framework, no build step, and no actual
   page-to-page navigation implemented.

## Working conventions established so far

- Copy is written directly from the pitch deck's actual numbers/claims —
  don't invent new stats or soften specific figures (S$250/S$500, the
  rubric percentages, the Schmidt/Oh/Shaffer validity numbers, etc.).
- Keep new pages dependency-free static HTML/CSS/JS unless the user asks
  for a framework — nothing here uses React/Vue/build tooling yet.
- Brand accent orange is `#ff5b24` exactly (confirmed from the real Figma
  file, not eyeballed from a screenshot).
- Fonts are loaded from Fontshare (Satoshi) and Google Fonts (JetBrains
  Mono) via `<link>` tags — no local font files yet.
- Any texture/photo asset pulled from Figma gets downloaded and committed
  as a local file (`/assets/...`) — never a hardcoded `figma.com/api/mcp/asset/...`
  URL, since those expire in ~7 days.
