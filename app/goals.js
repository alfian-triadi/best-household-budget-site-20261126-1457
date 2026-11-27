// Savings goals and money-saving tips page.

import { GOALS, TIPS } from './data.js';
import { escapeHtml, idr, pct } from './format.js';

function monthsToGo(goal) {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 'Reached!';
  if (!goal.monthly) return '—';
  const months = Math.ceil(remaining / goal.monthly);
  return `about ${months} month${months === 1 ? '' : 's'} to go at ${idr(goal.monthly)}/month`;
}

function goalCards() {
  return GOALS.map((goal) => {
    const done = goal.saved >= goal.target;
    return `<article class="goal">
    <h3>${escapeHtml(goal.name)}</h3>
    <p>${escapeHtml(goal.note)}</p>
    <div class="goal-bar" role="img" aria-label="${pct(goal.saved, goal.target)} percent saved"><div style="width:${Math.min(pct(goal.saved, goal.target), 100)}%"></div></div>
    <p><strong>${idr(goal.saved)}</strong> of ${idr(goal.target)} saved (${pct(goal.saved, goal.target)}%) — ${done ? 'Goal reached!' : monthsToGo(goal)}</p>
  </article>`;
  }).join('');
}

function tipCards() {
  return TIPS.map(
    (tip) => `<article class="tip"><h3>${escapeHtml(tip.title)}</h3><p>${escapeHtml(tip.text)}</p><p class="tip-save">${tip.save > 0 ? `Saves about ${idr(tip.save)} a month` : 'Keeps the habit automatic'}</p></article>`,
  ).join('');
}

export function goalsPage() {
  const totalTarget = GOALS.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = GOALS.reduce((sum, g) => sum + g.saved, 0);
  const monthlyTips = TIPS.reduce((sum, t) => sum + t.save, 0);
  return `<h1>Savings goals &amp; money-saving tips</h1>
  <p class="lede">Four goals the family is saving for, and six habits that free up the money to fund them. Together the goals need <strong>${idr(totalTarget)}</strong>; <strong>${idr(totalSaved)}</strong> (${pct(totalSaved, totalTarget)}%) is already saved.</p>
  <section class="goals">${goalCards()}</section>
  <section class="panel"><h2>How the family saves ${idr(monthlyTips)} a month</h2>
    <div class="tips">${tipCards()}</div>
    <p>Five habits above save about <strong>${idr(monthlyTips)} a month</strong> — nearly a quarter of the family's Rp 2.000.000 monthly savings. <a href="#/calculator">See how it fits the budget →</a></p>
  </section>`;
}
