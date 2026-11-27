// Expense tracker page. Lists every expense of the month, lets the user
// add a new one or delete one, and keeps the running totals honest.
// Changes are saved in localStorage (store.js).

import { CATEGORIES, spentByCategory, totalSpent } from './data.js';
import { escapeHtml, idr, pct, prettyDate } from './format.js';
import { loadExpenses, resetExpenses, saveExpenses } from './store.js';

function categoryOptions(selected) {
  return CATEGORIES.map(
    (category) => `<option value="${category.id}"${category.id === selected ? ' selected' : ''}>${escapeHtml(category.label)}</option>`,
  ).join('');
}

function expenseRows(expenses) {
  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  return sorted
    .map((item) => {
      const category = CATEGORIES.find((c) => c.id === item.category);
      return `<li class="expense"><span class="exp-date">${prettyDate(item.date)}</span><span class="exp-desc">${escapeHtml(item.desc)}</span><span class="exp-cat">${escapeHtml(category ? category.label : item.category)}</span><strong class="exp-amount">${idr(item.amount)}</strong><button type="button" class="delete" data-delete="${escapeHtml(item.id)}" aria-label="Delete ${escapeHtml(item.desc)}">Delete</button></li>`;
    })
    .join('');
}

export function tracker() {
  const expenses = loadExpenses();
  const spent = totalSpent(expenses);
  const byCategory = spentByCategory(expenses);
  const over = CATEGORIES.filter((c) => (byCategory[c.id] || 0) > c.budget);
  const today = new Date().toISOString().slice(0, 10);
  return `<h1>Expense tracker — November 2026</h1>
  <p class="lede">Every rupiah the family spent this month, in one list. Add an expense as it happens; the totals and the chart update at once. Entries are stored only in this browser.</p>
  <section class="cards" aria-label="Tracker summary">
    <div class="card"><span class="card-label">Total spent</span><strong class="card-value">${idr(spent)}</strong><span class="card-note">${expenses.length} expenses recorded</span></div>
    <div class="card"><span class="card-label">Biggest category</span><strong class="card-value">${idr(Math.max(...CATEGORIES.map((c) => byCategory[c.id] || 0)))}</strong><span class="card-note">${escapeHtml(CATEGORIES.reduce((top, c) => ((byCategory[c.id] || 0) > (byCategory[top.id] || 0) ? c : top), CATEGORIES[0]).label)}</span></div>
    <div class="card${over.length ? ' warn' : ''}"><span class="card-label">Over budget</span><strong class="card-value">${over.length ? over.map((c) => escapeHtml(c.label)).join(', ') : 'None — all good'}</strong><span class="card-note">${over.length ? 'Trim these categories before month end' : 'No category has passed its budget'}</span></div>
  </section>
  <section class="panel"><h2>Add an expense</h2>
    <form id="expense-form" class="expense-form">
      <label class="field"><span>Date</span><input type="date" name="date" value="${today}" required></label>
      <label class="field"><span>What was it?</span><input type="text" name="desc" maxlength="80" placeholder="e.g. Weekly market vegetables" required></label>
      <label class="field"><span>Category</span><select name="category">${categoryOptions('food')}</select></label>
      <label class="field"><span>Amount (Rp)</span><input type="number" name="amount" min="1000" step="1000" placeholder="125000" required></label>
      <button class="btn" type="submit">Add expense</button>
      <p class="form-error" id="form-error" role="alert"></p>
    </form>
  </section>
  <section class="panel"><h2>All expenses (${expenses.length})</h2>
    <ul class="expenses">${expenseRows(expenses)}</ul>
    <p><button class="btn secondary" id="tracker-reset" type="button">Reset to the family's November list</button> <a class="btn secondary" href="#/chart">See the spending chart →</a></p>
  </section>`;
}

// Wire add / delete / reset after the page is rendered. onRender re-renders
// the page so totals and lists stay in sync.
export function bindTracker(root, onRender) {
  const form = root.querySelector('#expense-form');
  const errorEl = root.querySelector('#form-error');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const desc = String(data.get('desc') || '').trim();
      const amount = Number(data.get('amount'));
      const date = String(data.get('date') || '');
      const category = String(data.get('category') || '');
      if (!desc || !Number.isFinite(amount) || amount <= 0 || !date || !CATEGORIES.some((c) => c.id === category)) {
        errorEl.textContent = 'Please fill in a description, a date, a category and an amount above Rp 0.';
        return;
      }
      const expenses = loadExpenses();
      expenses.push({ id: `u${Date.now()}`, date, desc, category, amount: Math.round(amount) });
      saveExpenses(expenses);
      onRender();
    });
  }
  for (const button of root.querySelectorAll('[data-delete]')) {
    button.addEventListener('click', () => {
      saveExpenses(loadExpenses().filter((item) => item.id !== button.dataset.delete));
      onRender();
    });
  }
  const reset = root.querySelector('#tracker-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      resetExpenses();
      onRender();
    });
  }
}
