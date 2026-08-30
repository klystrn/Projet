---
name: Projet
description: Hiring on proof, not paper — a two-audience Singapore startup landing page where a single accent color signals which side (builder or company) is speaking.
colors:
  signal: "#ff5b24"
  signal-deep: "#c73e10"
  current: "#2f6bff"
  current-deep: "#1d4fd6"
  spectrum-violet: "#7a3f8f"
  ink: "#14130f"
  ink-soft: "#3a382f"
  paper: "#ffffff"
  paper-warm: "#f5f4ef"
  hairline: "#e6e3da"
  muted: "#726d5f"
  muted-large: "#8f8874"
typography:
  display:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.625rem, 6vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.75rem, 3.6vw, 3.25rem)"
    fontWeight: 900
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14.5px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "11.5px"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  pill: "999px"
  sm: "13px"
  md: "16px"
  lg: "20px"
  xl: "26px"
  xxl: "28px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
  button-accent:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-accent-hover:
    backgroundColor: "{colors.signal-deep}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  card-testimonial:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px 26px"
  card-mini:
    backgroundColor: "rgba(255,255,255,0.09)"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 13px"
  badge:
    backgroundColor: "rgba(47,107,255,0.12)"
    textColor: "{colors.current-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 9px"
---

# Design System: Projet

## Overview

**Creative North Star: "Signal Flare"**

Projet's whole surface is built around one idea: a single warm accent burning against a calm, mostly-neutral field, and that flare only ever means one thing — real activity, happening right now. The countdown ticking down to a challenge deadline, the recycling logo marquee, the Featured Challenges ticket rail a visitor can drag through like a real feed of open work, the How-it-works panel that pins in place and scrubs through its own background as you scroll, the testimonial spotlight promoting a different quote the instant you hover its chip — none of it is ambient decoration. Every moving element on the page is standing in for the same claim the copy makes in words: that proof is live and ongoing, not a static portfolio.

The system carries a second, cooler signal alongside the first: builders and students read the page in Signal orange, companies read it in Current blue, and the accent color itself is the audience switch. This is not two different designs pretending to be one — it's one calm, confident-startup shell (bold black-on-white type, real stated numbers, no soft SaaS gradients or stock illustration standing in for substance) that relabels its own accent depending on who's looking. Headline text itself stays a flat, solid accent color rather than a gradient (a gradient-text word was tried and removed as a recognisable AI-generated-site tell); the audience switch shows up in flat color, not a rainbow bridge.

Density is generous, not dense — this is a persuade-mode marketing surface, not a dashboard, and it gives its stats, cards, and CTAs room to breathe. Nothing renders in hard corners, and nothing sits completely still without a reason: every interactive control confirms itself with a lift, a color shift, or a sliding glyph the instant it's touched.

**Key Characteristics:**
- One accent lit against a mostly-neutral (ink/paper) field, never two accents competing for attention on the same surface
- The accent itself carries meaning — it names which audience is currently being addressed
- Motion is evidentiary, not decorative: it always stands in for "this is live, this is real work happening now"
- Confident, plainly-stated startup tone: bold headlines, real numbers, no hedge-everything softness
- Every interactive element visibly responds to hover/focus — nothing is static once touched

## Colors

The palette is two accents and a warm-neutral field: nothing else competes for the eye except when the two accents deliberately meet in the connecting gradient.

### Primary
- **Signal** (`#ff5b24`): The builder/student accent and the page's default accent color. Used on primary CTAs in builder mode, the live-pulse dot, the hero card's rank markers, the mode-switch pill, eyebrow dots, and the "For students" nav toggle. Reads as urgent and warm — the color of something happening right now.
- **Signal Deep** (`#c73e10`): Hover/active state of Signal, and also the resting color of small mono eyebrow text/dots on paper — the base Signal hue only hits ~3.1:1 contrast at that size, which fails WCAG AA; Signal Deep hits 5.09:1.

### Secondary
- **Current** (`#2f6bff`): The company accent. Overrides Signal site-wide the moment `data-audience="business"` is set — CTAs, the mode-switch pill, badges, and the "For companies" nav toggle all re-tint to Current. Cooler and steadier than Signal on purpose: it reads as trust and process rather than urgency.
- **Current Deep** (`#1d4fd6`): Hover/active state of Current, mirroring Signal Deep's role on the other side of the toggle — including the same eyebrow-text contrast fix (6.68:1 on paper).

### Tertiary
- **Spectrum Violet** (`#7a3f8f`, `--violet`): Defined as a token but currently unused anywhere in the live site — its former roles (the hero headline's gradient word, the footer's top accent edge, the light-spectrum wave's seam) were all retired along with the components that carried them. Left in place as a reserved token rather than deleted, in case a future gradient divider wants a middle stop between Signal and Current again; don't assume it's rendering anywhere today.

### Neutral
- **Ink** (`#14130f`): Primary text color and the fill for dark surfaces (final CTA background, primary/ghost buttons at rest).
- **Ink Soft** (`#3a382f`): Secondary/body text — sub-headlines, descriptive copy, nav links at rest.
- **Paper** (`#ffffff`): The default page and card background.
- **Paper Warm** (`#f5f4ef`): A warmer off-white reserved for sections that need to feel calmer than pure white — the testimonials section, the mode-switch track.
- **Hairline** (`#e6e3da`): The only border color on light surfaces — dividers, card outlines, input borders at rest.
- **Muted Label** (`#726d5f`): The color of every small mono caption — stat captions, footer labels, testimonial role lines. Now a real CSS custom property (`--muted`); darkened from an earlier `#9c988c` that failed WCAG AA (2.6-2.9:1) at the 10-12.5px sizes it's used at — this passes 5.16:1 on paper / 4.69:1 on paper-warm.
- **Muted Label Large** (`#8f8874`): The placeholder-logo marquee's wordmark color (`--muted-large`) — 23px/900-weight text qualifies for the large-text 3:1 threshold rather than the 4.5:1 small-text one, so it's darkened less than Muted Label.

### Named Rules
**The Two-Signal Rule.** Only Signal or Current is active as the page's accent at any moment — never both, and a surface never lets orange and blue compete as two live CTAs. The one deliberate exception is the testimonial spotlight's speaker tag (`.t-spot-tag`), which is pinned to blue for a company speaker or orange for a builder speaker regardless of audience mode, because its job is to label who is speaking, not to reflect who's currently browsing.

## Typography

**Display Font:** Satoshi (with -apple-system, BlinkMacSystemFont, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (monospace fallback)

**Character:** Satoshi at heavy weight (900) carries every headline with a tight, confident, slightly compressed feel (`-0.02em` letter-spacing); JetBrains Mono at small sizes and wide tracking (`0.14em`+) marks anything that's a label, a stat, or a status — the pairing reads as "bold startup voice, backed by real data," not decoration on top of decoration.

### Hierarchy
- **Display** (900, `clamp(42px, 6vw, 68px)`, line-height 1.05): The H1 only. Capped at 68px rather than the type scale's natural ceiling because the builder/student headline is longer than the business one and was wrapping past two lines at a larger max.
- **Headline** (900, `clamp(28px, 3.6vw, 52px)`, line-height ~1.03): Section H2s (How it works, Featured challenges/Success stories, Testimonials, Final CTA).
- **Title** (700, 14.5px, line-height 1.2): Card and component titles — testimonial names, challenge-card titles, hero-card headings.
- **Body** (400–500, 16–18.5px, line-height 1.55–1.6, ~34–52ch max width): Hero sub-copy, section ledes, testimonial quotes.
- **Label** (600–700, 10–12.5px, letter-spacing 0.06em–0.16em, uppercase, JetBrains Mono): Eyebrows, nav mono data, badges, stat captions, countdown digits.

### Named Rules
**The Mono-Label Rule.** Any small-caps or label-scale text — eyebrows, badges, nav toggle labels, stat captions, countdown digits — is always set in JetBrains Mono, never Satoshi. It's the page's dedicated typeface for "this is data or status," distinct from Satoshi's role carrying voice and headlines.

## Layout

The page is a single scrolling document (`max-width: 1240px`, `padding: 0 32px` down to `20px` under 640px) built from full-bleed sections rather than a persistent grid — each section (hero, logo marquee, Featured Challenges ticket rail, How it works, testimonials, final CTA) owns its own internal layout and background treatment. Section padding is generous and consistent: `96px` top/bottom on desktop, collapsing to `64px` under 640px.

Three sections break the single-column flow deliberately. The hero uses a near-even `1.02fr / .98fr` two-column grid (collapsing to one column under 1080px). Featured Challenges is a native horizontally-scrolling rail — deliberately outside the page's own `.wrap` padding so it can run to the true viewport edge while its own inset re-aligns the first card with the content column — draggable with a mouse in addition to touch/trackpad. How it works is a sticky-pinned `3fr / 5fr` grid (title+rail : cropped fluid-scrub) that only exists above 900px; below that breakpoint it unwinds into a plain stacked list with every step visible at once. Nothing on the page is ever hidden outright at a breakpoint; scroll-pinned and hover-driven mechanics always collapse to a plain stacked, fully-visible list rather than disappearing.

## Elevation & Depth

The system is layered, not flat and not heavily skeuomorphic: most of the page (nav, footer, running text) sits with no shadow at all, and depth is reserved for a specific set of "floating" elements — the hero's dashboard-summary card, ticket-rail and testimonial-spotlight cards, and the compacted nav bar. Shadows are soft and diffused (14–90px blur radius, low opacity, always with a negative spread to keep the shadow tucked close to its source rather than smearing outward), never a hard drop shadow. Buttons carry no shadow at rest or on hover at all — their interactivity is signaled by a translateY lift instead (see the Named Rule below), keeping shadow reserved purely for surface separation, not for interaction feedback.

### Shadow Vocabulary
- **Card ambient** (`box-shadow: 0 14px 40px -20px rgba(20,19,15,.22)`): Resting elevation for light-surface cards (testimonial strip chips).
- **Hero dashboard card** (`box-shadow: 0 34px 80px -38px rgba(20,19,15,.4)`): The hero's static dashboard-summary card, wrapped in a thin gradient-edge border.
- **Compact nav** (`box-shadow: 0 8px 26px -20px rgba(20,19,15,.3)`): Applied only once the nav has scrolled past 48px and gone compact — a flat sticky header with zero visual change on scroll reads as static.
- **Ticket rail hover** (rest `box-shadow: 0 14px 30px -26px rgba(20,19,15,.3)`, hover `0 26px 48px -28px rgba(20,19,15,.38)`): Featured Challenges' ticket cards, paired with a `translateY(-4px)` lift.
- **Testimonial spotlight** (`box-shadow: 0 34px 76px -40px rgba(20,19,15,.5)`): The dark promoted-quote card, the single deepest shadow on the page next to the brief/ticket modals.
- **Modal** (`box-shadow: 0 40px 90px -30px rgba(20,19,15,.5)`): The challenge-brief and ticket modals — deliberately the heaviest shadow on the page, since a modal has to read as floating fully above everything else.

### Named Rules
**The Motion-Over-Shadow Rule.** Buttons never change shadow on hover — they lift (`translateY(-2px)`) instead. Shadow answers "is this surface floating above another," motion answers "did you just interact with this."

## Shapes

Every visible rectangle on the page rounds — there is no hard 0px corner anywhere in the system. Radius scales with a component's size and weight: interactive controls (buttons, badges, chips, inputs, the mode-switch track) are always full pill (`999px`), while containers round more generously as they grow — `13px` for compact mini-cards, `16px` for ticket-rail cards, `20px` for testimonial/founder/dashboard cards (`--radius-lg`), up to `26px` for the hero dashboard card and `26–28px` for the largest final-CTA/modal frames (`--radius-xl`). Borders are hairline (`1px`, `var(--line)` / `#e6e3da`) on light surfaces and translucent white (`rgba(255,255,255,.15–.4)`) on dark or glass surfaces — never a heavy or colored border.

### Named Rules
**The No-Hard-Corner Rule.** Nothing in the system ships a 0px corner. The only question is how generous the round is, never whether to round at all.

## Components

Every interactive component is pill-shaped and always visibly in motion — buttons lift, nav links grow an underline sweep, badges and cards shift color or position on hover/focus. Nothing renders as a dead, static control.

### Buttons
- **Shape:** Full pill (`border-radius: 999px`), `13px 24px` padding, `14.5px` / 700-weight label text.
- **Primary** (`.btn-primary`): Ink (`#14130f`) background, white text; hovers to Signal orange.
- **Accent** (`.btn-accent`): Filled with the current accent (Signal or Current); hovers to that accent's deep variant.
- **White** (`.btn-white`): White-fill variant used on dark backgrounds (final CTA, footer). Hovers to a solid fill of the current accent color rather than revealing any extra glyph — a straightforward color swap, chosen specifically to keep the button's own footprint and the surrounding text perfectly centered (an earlier arrow-reveal variant shifted the label off-center while the arrow was hidden).
- **Hover / Focus:** All variants share a `translateY(-2px)` lift (never a shadow change). Keyboard focus adds a universal two-tone ring (`box-shadow: 0 0 0 2px paper, 0 0 0 4px ink`) instead of the browser default outline — a light-then-dark pair so at least one ring is visible whether the button sits on a light or dark section, without needing per-variant color-matching.

### Cards / Containers
- **Corner Style:** `16px` (ticket-rail cards) to `20px` (testimonial/founder/dashboard cards) to `26–28px` (hero dashboard card, final CTA, modals).
- **Background:** White (`#fff`) on light sections; translucent white (`rgba(255,255,255,.07–.16)` with `backdrop-filter: blur`) on dark sections.
- **Shadow Strategy:** See Elevation & Depth — soft ambient ~14–40px blur, negative spread.
- **Border:** Hairline on light cards where present; translucent white border (`1px`) on glass/dark cards.
- **Internal Padding:** `14–16px` for compact cards, `16px 17px` for testimonial chips, `clamp(30px,4vw,46px)` for the testimonial spotlight.

### Inputs / Fields
- **Style:** Full pill (`999px` radius), `1px` hairline border, white background, `10px 13px` padding.
- **Focus:** Border shifts to the current accent color; no glow or ring.
- **Error:** Border shifts to the fail-red (`#c73e10`, shared with Signal Deep); an inline error line appears below the field.

### Navigation
- Sticky header, translucent white with backdrop blur, becomes visibly "compact" (tighter padding, a hairline border, and the Compact-nav shadow) once scrolled past 48px. Links carry a bottom-border sweep on hover that fills from 0 to 100% width; the section currently in view keeps that same underline permanently via an `is-current` class, driven by scroll position rather than hover.

### Audience Mode Toggle (signature component)
A pill-track toggle beside the logo with a sliding indicator pill behind whichever option is active (rather than each option independently toggling its own fill). The indicator's color and position both animate (`.32s`) between Signal-orange/left ("For students," the default) and Current-blue/right ("For companies"). Selecting an option re-tints the page's `--accent` custom property site-wide and cross-fades every audience-aware copy block (`opacity → swap innerHTML → opacity`, 160ms) rather than snapping the text instantly.

### Featured Challenges Ticket Rail (signature component)
Each open challenge renders as a torn-ticket shape — a body (company, title, description, submission count, a "View challenge" button) joined by a dashed perforation to a stub carrying the days-left countdown and discipline tag. Shaped deliberately unlike the full listing page's own card (a white tile with pill pair, progress bar, and full-width dark button), so the homepage teaser and the full `challenges.html` list never read as the same component twice. The rail is a native horizontally-scrolling container — touch, trackpad, and keyboard (`tabindex="0"`) work for free — enhanced with arrow buttons, a scroll-position fill bar, and mouse click-and-drag panning (`cursor:grab` → `grabbing`). Clicking a ticket, or its own button, opens a modal with the full brief; a real drag doesn't also trigger that open.

### How It Works Pinned Fluid-Scrub (signature component)
A `3fr / 5fr` split: the left column's title and a 4-step rail stay fixed while the right column, cropped to that column's own width, pans a moving fluid-artwork background as the visitor scrolls through a tall (`720vh`) scroll-room wrapper. Only one of the 4 steps is shown at a time in the right panel (crossfading in/out), while the left rail shows all 4 continuously with the current one highlighted — so each step is stated exactly once on screen between the two halves, never twice. Background position is driven by `transform: translate3d()`, not `background-position`, so the pan is compositor-only and never repaints the artwork per frame.

## Do's and Don'ts

### Do:
- **Do** let the accent color (`--accent`) name the audience — never hardcode Signal or Current onto a control that should track the current mode.
- **Do** pair every hover/focus state with visible motion (lift, underline sweep, fill-color swap) — a static default-only control reads as dead.
- **Do** round every corner — pill for controls, 13–28px for containers, scaled to size.
- **Do** set any label-scale text (eyebrows, badges, stats, captions) in JetBrains Mono, uppercase, wide tracking.
- **Do** treat scroll-linked and hover-driven motion as enhancement only — every effect must render its end state under `prefers-reduced-motion` or with JavaScript disabled, never disappear.

### Don't:
- **Don't** run Signal and Current as two live, competing CTAs on the same surface outside the testimonial spotlight's speaker tag.
- **Don't** apply a shadow change as a button's hover feedback — use the `translateY(-2px)` lift instead.
- **Don't** revert Muted Label to a lighter value than `#726d5f` (or Muted Label Large below `#8f8874`) — both were darkened specifically to clear WCAG AA at the small sizes they're used at; a lighter shade reintroduces the contrast failure this fixed.
- **Don't** apply the base Signal or Current hue directly to small text (eyebrows, labels) — use Signal Deep / Current Deep instead; the base hues fail WCAG AA at those sizes.
- **Don't** introduce a third accent hue. Spectrum Violet exists only as a gradient midpoint, never as a control fill.
