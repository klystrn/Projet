# Fixtures — sample API responses

Static JSON matching every response shape the front end already reads, so
the API can be checked against the contract **before** any server code is
written. Nothing in the site loads these automatically; they exist to be
pointed at by hand.

## How to use them

Serve the repo root and set the relevant `data-endpoint` to a fixture path:

```
python3 -m http.server 8000
```

| Fixture | Point it at | Renders |
|---|---|---|
| `dashboard-student.json` | `<body class="dash-page" data-endpoint="...">` in `dashboard.html` | Full student dashboard: profile, 3-metric row, past hackathons, activity, heatmap total |
| `dashboard-student-empty.json` | same | A brand-new student account. Drives the empty state (`entries: []`) |
| `dashboard-company.json` | same | Full company dashboard: profile, 6-metric row, funnel, monthly chart, brief table, discipline split, candidates |
| `dashboard-company-empty.json` | same | A company that has posted a brief but has **zero** submissions. Every figure reads 0 — this is the state that used to show stale sample data |
| `challenges.json` | `#clGrid[data-endpoint]` in `challenges.html` | Four live briefs replacing the twelve samples |
| `challenges-empty.json` | same | An empty backlog. Clears the grid, hides the filter row, shows `#clNone` |

Edit `data-endpoint` directly in the HTML, or set it from the console
before the page's own script runs.

## What these are for

Match your response to the fixture that corresponds to it and the page
renders with no front-end change. If your response renders wrong, the
difference between it and the fixture is the bug — which is a much shorter
conversation than reading the spec prose in `HANDOVER.md` §2.

## Rules worth knowing before you generate these server-side

- **Send numbers as numbers.** Strings are coerced, but `"40"` used to be
  concatenated rather than added.
- **Zero is a real value.** `dashboard-company-empty.json` exists to prove
  the zero case renders honestly rather than falling back to samples.
- **The company figures derive from `briefs[]`.** The discipline split and
  all four prose notes are computed in JS, never sent. In
  `dashboard-company.json` the brief rows sum to 96 submissions / 31 above
  bar, `funnel[0]` and the 12 `monthly` counts both total 96, and
  `pctOfPeak`/`pctOfTop` are computed from those. **If you change one
  number, re-derive the rest** — a dashboard whose own charts disagree is
  worse than no dashboard.
- **An empty list is not an error.** `challenges-empty.json` is a valid
  answer and renders a real empty state; a failed request instead keeps
  whatever is on the page.

Full field-by-field spec: `HANDOVER.md` §2.4 (listing), §2.5–2.5d
(dashboard), §2.7 (heatmap), §2.8 (company overview).
