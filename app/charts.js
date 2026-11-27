// SVG charts drawn from the budget data. No chart library is used: a
// donut shows each category's share of planned spending and horizontal
// bars compare planned vs spent per category.

import { idr, idrShort, pct } from './format.js';

export function donutChart(categories, spent) {
  const total = categories.reduce((sum, c) => sum + c.budget, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = categories
    .map((category) => {
      const share = category.budget / total;
      const length = share * circumference;
      const segment = `<circle cx="110" cy="110" r="${radius}" fill="none" stroke="${category.color}" stroke-width="34" stroke-dasharray="${length.toFixed(1)} ${(circumference - length).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
      offset += length;
      return segment;
    })
    .join('');
  const legend = categories
    .map(
      (category) => `<li><span class="dot" style="background:${category.color}"></span>${category.label} — <strong>${idrShort(category.budget)}</strong> (${pct(category.budget, total)}%)</li>`,
    )
    .join('');
  return `<div class="chart-wrap">
    <svg class="donut" viewBox="0 0 220 220" role="img" aria-label="Donut chart of planned monthly spending by category">
      ${segments}
      <text x="110" y="104" text-anchor="middle" class="donut-total">${idrShort(total)}</text>
      <text x="110" y="126" text-anchor="middle" class="donut-label">planned / month</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

export function budgetBars(categories, spent) {
  const max = Math.max(...categories.map((c) => Math.max(c.budget, spent[c.id] || 0)), 1);
  const rows = categories
    .map((category) => {
      const used = spent[category.id] || 0;
      const over = used > category.budget;
      return `<li class="bar-row">
      <div class="bar-head"><span>${category.label}</span><span>${idr(used)} of ${idr(category.budget)}${over ? ' — over budget!' : ''}</span></div>
      <div class="bar-track"><div class="bar-planned" style="width:${((category.budget / max) * 100).toFixed(1)}%"></div><div class="bar-spent${over ? ' over' : ''}" style="width:${((used / max) * 100).toFixed(1)}%;background:${category.color}"></div></div>
      <div class="bar-note">${pct(used, category.budget)}% of budget used · ${idr(Math.max(category.budget - used, 0))} left</div>
    </li>`;
    })
    .join('');
  return `<ul class="bars">${rows}</ul>
  <p class="chart-note">Light bar: planned budget. Coloured bar: spent so far in November 2026. Red means the category is over its budget.</p>`;
}
