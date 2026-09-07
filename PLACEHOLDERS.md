# Placeholder content — the pre-launch checklist

Everything on the site that is invented, sampled or faked, in one list, so
none of it ships by accident.

## How to find them

Two markers, both greppable, both pointing at the same thing:

```
grep -rn 'data-placeholder=' *.html      # the elements themselves
grep -rn 'PLACEHOLDER\[' *.html assets/  # the comment above each one
```

The convention: an HTML comment `<!-- PLACEHOLDER[key] -->` immediately
above the block, and `data-placeholder="key"` on the block itself. The
attribute exists so the same thing is findable from the DOM at runtime (a
console check before a deploy, say), not only in source.

`data-placeholder` is inert — nothing styles it and no script reads it. It
is safe to delete the attribute and its comment the moment the content
behind it becomes real.

## The list

| key | Where | What is fake | Done when |
|---|---|---|---|
| `partner-logos` | `index.html` logo carousel | Eight invented company names (Northwind, Acme Labs, Vertex Studio, Meridian Co., Lumen Works, Cobalt & Co, Fieldstone, Anchorpoint) as a mark+name lockup. No real logo images exist. | Real, permissioned partner logos are in. Set `data-carousel-enabled="false"` on `.logos` to hide the strip entirely until there are enough to carry a row. |
| `partner-logos-label` | `index.html` | The "Placeholder logos, pending real partners" caption. | Goes with `partner-logos`. |
| `featured-briefs` | `index.html` ticket rail | Six sample briefs. Companies, titles, descriptions, deadlines and submission counts are all invented. | The API serves live challenges. |
| `featured-briefs-note` | `index.html` | The "Sample briefs, not live listings" line under the rail. | Goes with `featured-briefs`. |
| `countdown` | `index.html` | `data-countdown-hours="96"` counts down from **page load**, not a calendar date, because there is no live challenge data. | Point it at a real deadline timestamp. |
| `testimonials` | `index.html` | Five invented quotes, attributed to roles only, never a named real person. Avatars are illustrated silhouettes, not photographs. | Real, permissioned quotes and portraits. |
| `sample-briefs` | `challenges.html` | Twelve sample briefs with invented statuses, activity heatmaps, effort estimates and skills. | The API serves live challenges. Also remove `.cl-notice` and the page's `<meta name="robots" content="noindex">`, and add the page to `sitemap.xml`. |
| `dashboard-entries` | `dashboard.html` | Three past-hackathon rows, plus every `data-hk-*` payload behind their detail modal. | `BACKEND-HANDOFF.md` seam 3. |
| `dashboard-candidates` | `dashboard.html` | Five ranked candidates in the company view. | `BACKEND-HANDOFF.md` seam 2. |
| `dashboard-activity` | `dashboard.html` | Two activity feeds, one per role (`#dpFeedStudent`, `#dpFeedCompany`), six events each. | Real account events. |
| _(company overview)_ | `dashboard.html` | The company view's six metrics, hiring funnel, monthly-submissions chart, brief table and discipline split are all sample figures. They are internally consistent by construction (every number derives from the brief table's 96 submissions / 31 above bar), so if you change one, re-derive the rest. | The API serves real company data. |

## Not in the table, but also not real

These have no marker because they are code, not content blocks:

- **The dashboard heatmap.** `buildHeat()` in `assets/dashboard.js` fills
  371 cells from a seeded PRNG. Seeded rather than random so a given account
  at least shows a stable history across reloads. See `BACKEND-HANDOFF.md`
  seam 4.
- **Every front-end-only form.** `login.html`, `signup.html` and the footer
  "get notified" capture each carry an empty `data-endpoint`. With no
  endpoint set they say the wiring is pending rather than faking a success —
  reuse that convention for any new form rather than inventing another.
- **Edit profile** on the dashboard genuinely saves, but only to
  `localStorage` on that one device, and the dialog says so in its own copy.
- **Inert buttons.** Schedule / Compare / Book interviews / View submission
  are `href="#"`.
- **Footer links that have no page yet.** `Careers`, `Contact`, `Privacy`,
  `Terms` render as `.footer-pending` spans marked "soon" rather than as
  links to nowhere. Swap each back to an `<a href="…">` as its page ships.

## The rule this list exists to keep

Placeholder content is always **labelled as placeholder**, never dressed up
as real. No invented customer names presented as customers, no fake named
people attached to invented quotes, no faked form success. If you add
something sampled, add a marker and a row here at the same time.
