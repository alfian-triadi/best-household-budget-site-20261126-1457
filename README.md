# RumahBudget — Household Budget Site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/alfian-triadi/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/alfian-triadi/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

A working household budget site for a family of four in Jakarta — built for the [make.fun "Make the best household budget site" bounty](https://make.fun/c/best-household-budget-site-20261126-1457).

## What it does

- **Dashboard** — monthly income (Rp 14.200.000 from 3 sources), planned spending (Rp 14.150.000 across 8 categories), spent so far, money left, a donut chart of the plan, and the latest expenses.
- **Budget Calculator** — edit any income or category figure and the leftover, verdict and savings rate recalculate live; one click resets to the family's real November 2026 example.
- **Expense Tracker** — 15 real November expenses to start from; add or delete entries, with totals and over-budget warnings updating at once. Entries are stored only in the browser's localStorage.
- **Spending Chart** — donut of the planned budget plus planned-vs-spent bars per category.
- **Savings Goals & Tips** — 4 goals with progress bars and months-to-go, plus 6 money-saving habits worth about Rp 1.450.000 a month.

## Run it

No build step, no network. Serve `app/` with any static server:

```sh
node serve.ts        # then open http://localhost:8080
```

or open `app/index.html` directly. Pages are hash routes: `#/`, `#/calculator`, `#/tracker`, `#/chart`, `#/goals`.

## Layout

- `app/` — the site: `index.html`, `style.css`, `main.js` (hash router), `data.js` (the family's real figures), `format.js` (rupiah formatting), `store.js` (localStorage), `charts.js` (SVG donut + bars), `views.js` (dashboard + chart), `calculator.js`, `tracker.js`, `goals.js`.
- `main.ts` — Node 22 entry program: copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with `vendor/makefun-frontend.ts`.
- `screenshots/` — 4 real renders of the site (desktop dashboard, calculator, tracker, phone goals).
- `shots.json` — which view each screenshot was taken of.

## License

MIT — see [LICENSE](LICENSE).
