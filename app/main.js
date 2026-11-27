// Router for the budget site. Pages are hash routes so the static files
// work from any server or straight from disk:
//
//   #/                dashboard
//   #/calculator      monthly budget calculator
//   #/tracker         expense tracker
//   #/chart           spending chart
//   #/goals           savings goals and tips
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { calculator, bindCalculator } from './calculator.js';
import { goalsPage } from './goals.js';
import { tracker, bindTracker } from './tracker.js';
import { chartPage, dashboard, missing } from './views.js';

const app = document.getElementById('app');
const TITLES = {
  dashboard: 'RumahBudget — Household Budget for the Hartono Family',
  calculator: 'Budget Calculator | RumahBudget',
  tracker: 'Expense Tracker | RumahBudget',
  chart: 'Spending Chart | RumahBudget',
  goals: 'Savings Goals & Tips | RumahBudget',
};

function route() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/calculator')) return 'calculator';
  if (hash.startsWith('#/tracker')) return 'tracker';
  if (hash.startsWith('#/chart')) return 'chart';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash === '#/' || hash === '' || hash === '#') return 'dashboard';
  return 'missing';
}

function render() {
  window.__shotReady = false;
  const page = route();
  document.title = TITLES[page] || TITLES.dashboard;
  for (const link of document.querySelectorAll('[data-nav]')) {
    link.classList.toggle('active', link.dataset.nav === page);
  }
  if (page === 'calculator') {
    app.innerHTML = calculator();
    bindCalculator(app);
  } else if (page === 'tracker') {
    app.innerHTML = tracker();
    bindTracker(app, render);
  } else if (page === 'chart') {
    app.innerHTML = chartPage();
  } else if (page === 'goals') {
    app.innerHTML = goalsPage();
  } else if (page === 'missing') {
    app.innerHTML = missing();
  } else {
    app.innerHTML = dashboard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
