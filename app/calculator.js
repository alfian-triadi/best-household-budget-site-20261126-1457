// Budget calculator page. The user edits monthly income and each
// category's budget; the totals, the leftover and the savings rate update
// live. "Reset to the family example" restores the Hartono numbers.

import { CATEGORIES, INCOME, totalBudget, totalIncome } from './data.js';
import { escapeHtml, idr, pct } from './format.js';

function incomeInputs() {
  return INCOME.map(
    (item, i) => `<label class="field"><span>${escapeHtml(item.source)}</span><input type="number" min="0" step="50000" data-income="${i}" value="${item.amount}"></label>`,
  ).join('');
}

function categoryInputs() {
  return CATEGORIES.map(
    (category) => `<label class="field"><span>${escapeHtml(category.label)}</span><input type="number" min="0" step="50000" data-category="${category.id}" value="${category.budget}"><small>${escapeHtml(category.note)}</small></label>`,
  ).join('');
}

export function calculator() {
  return `<h1>Monthly budget calculator</h1>
  <p class="lede">Start from the Hartono family's real November budget, then change any number to fit your own household. Everything recalculates as you type — nothing leaves your browser.</p>
  <div class="two-col">
    <div class="col-stack">
      <section class="panel"><h2>Income per month</h2><div class="fields">${incomeInputs()}</div></section>
      <section class="panel result" aria-live="polite">
        <h2>Your result</h2>
        <p class="result-line">Income <strong id="calc-income">${idr(totalIncome())}</strong> − planned spending <strong id="calc-spending">${idr(totalBudget())}</strong> = <strong id="calc-left">${idr(totalIncome() - totalBudget())}</strong> left over.</p>
        <p id="calc-verdict">The plan fits the income, with Rp 50.000 to spare. Savings of Rp 2.000.000 are already inside the plan — a 14% savings rate.</p>
        <p><button class="btn" id="calc-reset" type="button">Reset to the family example</button> <a class="btn secondary" href="#/tracker">Track real spending →</a></p>
      </section>
    </div>
    <section class="panel"><h2>Spending plan per month</h2><div class="fields">${categoryInputs()}</div></section>
  </div>`;
}

function readNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : 0;
}

// Wire the live calculation after the page is rendered.
export function bindCalculator(root) {
  const incomeInputs = [...root.querySelectorAll('input[data-income]')];
  const categoryInputs = [...root.querySelectorAll('input[data-category]')];
  const incomeEl = root.querySelector('#calc-income');
  const spendingEl = root.querySelector('#calc-spending');
  const leftEl = root.querySelector('#calc-left');
  const verdictEl = root.querySelector('#calc-verdict');
  const savingsCategory = CATEGORIES.find((c) => c.id === 'savings');

  function recalc() {
    const income = incomeInputs.reduce((sum, input) => sum + readNumber(input), 0);
    const spending = categoryInputs.reduce((sum, input) => sum + readNumber(input), 0);
    const left = income - spending;
    const savingsInput = categoryInputs.find((input) => input.dataset.category === 'savings');
    const savings = savingsInput ? readNumber(savingsInput) : savingsCategory.budget;
    incomeEl.textContent = idr(income);
    spendingEl.textContent = idr(spending);
    leftEl.textContent = idr(left);
    if (left < 0) {
      verdictEl.textContent = `The plan is ${idr(-left)} over the income. Trim a category above — food and fun are the usual places to start.`;
    } else if (left === 0) {
      verdictEl.textContent = 'The plan uses every rupiah of income. It balances, but there is no room for surprises — keep a small buffer if you can.';
    } else {
      verdictEl.textContent = `The plan fits the income, with ${idr(left)} to spare. Savings of ${idr(savings)} are already inside the plan — a ${pct(savings, income)}% savings rate.`;
    }
  }

  for (const input of [...incomeInputs, ...categoryInputs]) {
    input.addEventListener('input', recalc);
  }
  const reset = root.querySelector('#calc-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      incomeInputs.forEach((input, i) => { input.value = INCOME[i].amount; });
      categoryInputs.forEach((input) => {
        const category = CATEGORIES.find((c) => c.id === input.dataset.category);
        if (category) input.value = category.budget;
      });
      recalc();
    });
  }
  recalc();
}
