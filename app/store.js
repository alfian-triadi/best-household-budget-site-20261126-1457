// The expense tracker's storage. The site ships with the family's real
// November expenses (data.js); once the user adds or deletes an entry the
// list lives in localStorage under this key and survives reloads. Nothing
// is ever sent to a server — there is no server.

import { EXPENSES } from './data.js';

const KEY = 'rumahbudget-expenses-v1';

export function loadExpenses() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EXPENSES.map((item) => ({ ...item }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EXPENSES.map((item) => ({ ...item }));
    return parsed;
  } catch {
    return EXPENSES.map((item) => ({ ...item }));
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(KEY, JSON.stringify(expenses));
  } catch {
    // Storage full or unavailable: the page still works for this visit.
  }
}

export function resetExpenses() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore: the defaults load again on the next visit.
  }
  return EXPENSES.map((item) => ({ ...item }));
}
