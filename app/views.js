// Dashboard and spending-chart pages.

import { CATEGORIES, FAMILY, GOALS, INCOME, spentByCategory, totalBudget, totalIncome, totalSpent } from './data.js';
import { idr, pct } from './format.js';
import { budgetBars, donutChart } from './charts.js';
import { loadExpenses } from './store.js';

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function summaryCards(income, budget, spent) {
  const left = income - spent;
  return `<section class="cards" aria-label="Month summary">
    <div class="card"><span class="card-label">Monthly income</span><strong class="card-value">${idr(income)}</strong><span class="card-note">3 sources: salary, freelance, shop</span></div>
    <div class="card"><span class="card-label">Planned spending</span><strong class="card-value">${idr(budget)}</strong><span class="card-note">8 categories, savings included</span></div>
    <div class="card"><span class="card-label">Spent so far in Nov</span><strong class="card-value">${idr(spent)}</strong><span class="card-note">${pct(spent, budget)}% of the month's plan</span></div>
    <div class="card highlight"><span class="card-label">Money left this month</span><strong class="card-value">${idr(left)}</strong><span class="card-note">${left >= 0 ? 'On track — nothing over budget yet' : 'Over budget: check the tracker'}</span></div>
  </section>`;
}

export function dashboard() {
  const income = totalIncome();
  const budget = totalBudget();
  const expenses = loadExpenses();
  const spent = totalSpent(expenses);
  const byCategory = spentByCategory(expenses);
  const recent = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const topGoal = [...GOALS].sort((a, b) => b.saved / b.target - a.saved / a.target)[0];
  const rows = recent
    .map(
      (item) => `<li><span>${item.date.slice(8, 10)} Nov</span><span>${item.desc}</span><span>${categoryLabel(item.category)}</span><strong>${idr(item.amount)}</strong></li>`,
    )
    .join('');
  return `<h1>${FAMILY.name} — ${FAMILY.month}</h1>
  <p class="lede">A family of four in ${FAMILY.place} keeping its money in plain sight: what comes in, what goes out, and what is left for the goals that matter.</p>
  ${summaryCards(income, budget, spent)}
  <div class="two-col">
    <section class="panel"><h2>Where the money is planned to go</h2>${donutChart(CATEGORIES, byCategory)}</section>
    <section class="panel"><h2>Latest expenses</h2>
      <ul class="recent">${rows}</ul>
      <p><a class="btn" href="#/tracker">Open the expense tracker →</a></p>
      <h2>Closest savings goal</h2>
      <p><strong>${topGoal.name}</strong> — ${idr(topGoal.saved)} of ${idr(topGoal.target)} saved (${pct(topGoal.saved, topGoal.target)}%).</p>
      <p><a class="btn" href="#/goals">See all savings goals →</a></p>
    </section>
  </div>
  <section class="panel"><h2>Income this month</h2>
    <ul class="income-list">${INCOME.map((item) => `<li><span>${item.source}</span><strong>${idr(item.amount)}</strong></li>`).join('')}</ul>
    <p>Total income <strong>${idr(income)}</strong> · planned spending <strong>${idr(budget)}</strong> · planned leftover <strong>${idr(income - budget)}</strong>. <a href="#/calculator">Try the budget calculator →</a></p>
  </section>`;
}

export function chartPage() {
  const expenses = loadExpenses();
  const spent = totalSpent(expenses);
  const byCategory = spentByCategory(expenses);
  return `<h1>Spending chart — ${FAMILY.month}</h1>
  <p class="lede">Planned vs actually spent, category by category. The family has spent <strong>${idr(spent)}</strong> of its <strong>${idr(totalBudget())}</strong> monthly plan so far.</p>
  <section class="panel"><h2>Planned budget by category</h2>${donutChart(CATEGORIES, byCategory)}</section>
  <section class="panel"><h2>Planned vs spent</h2>${budgetBars(CATEGORIES, byCategory)}</section>
  <p><a class="btn" href="#/tracker">Add an expense in the tracker →</a> <a class="btn secondary" href="#/calculator">Recalculate the budget →</a></p>`;
}

export function missing() {
  return `<h1>Page not found</h1><p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
