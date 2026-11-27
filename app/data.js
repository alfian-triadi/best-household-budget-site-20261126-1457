// The Hartono family's November 2026 budget. All figures are realistic
// monthly rupiah amounts for a family of four living in Jakarta.
// The expense tracker starts from these entries; the user can add or
// delete entries and the list is then kept in the browser's localStorage.

export const FAMILY = {
  name: 'The Hartono Family',
  place: 'Jakarta, Indonesia',
  month: 'November 2026',
  members: 4,
};

export const INCOME = [
  { source: "Budi's salary — logistics supervisor", amount: 8500000 },
  { source: "Sari's freelance design work", amount: 3700000 },
  { source: 'Online shop (weekend sales)', amount: 2000000 },
];

export const CATEGORIES = [
  { id: 'housing', label: 'Housing & Rent', budget: 3500000, color: '#2e7d6b', note: 'Rent Rp 3.000.000 + building fee Rp 500.000' },
  { id: 'food', label: 'Food & Groceries', budget: 3200000, color: '#d98e32', note: 'Weekly market Rp 650.000 + daily meals' },
  { id: 'transport', label: 'Transport', budget: 1400000, color: '#4a7fb5', note: 'Motorbike fuel Rp 500.000 + TransJakarta & ride-hailing' },
  { id: 'utilities', label: 'Utilities & Bills', budget: 950000, color: '#7a5fb5', note: 'Electricity, water, internet, phone' },
  { id: 'education', label: 'Education', budget: 1800000, color: '#c25b7a', note: 'School fees for two children + books' },
  { id: 'health', label: 'Health', budget: 600000, color: '#4fa08a', note: 'BPJS top-up, vitamins, pharmacy' },
  { id: 'fun', label: 'Fun & Leisure', budget: 700000, color: '#b56a4a', note: 'One family outing + streaming' },
  { id: 'savings', label: 'Savings', budget: 2000000, color: '#3a6ea5', note: 'Moved to savings on payday' },
];

export const EXPENSES = [
  { id: 'e01', date: '2026-11-02', desc: 'Monthly rent — November', category: 'housing', amount: 3000000 },
  { id: 'e02', date: '2026-11-03', desc: 'Weekly market: rice, chicken, vegetables', category: 'food', amount: 648000 },
  { id: 'e03', date: '2026-11-04', desc: 'Motorbike fuel (Pertalite, full tank)', category: 'transport', amount: 125000 },
  { id: 'e04', date: '2026-11-05', desc: 'Electricity token (PLN)', category: 'utilities', amount: 420000 },
  { id: 'e05', date: '2026-11-07', desc: 'School fee — Dimas (grade 5)', category: 'education', amount: 950000 },
  { id: 'e06', date: '2026-11-08', desc: 'Groceries: Indomaret weekly shop', category: 'food', amount: 512000 },
  { id: 'e07', date: '2026-11-10', desc: 'Internet bill (IndiHome)', category: 'utilities', amount: 385000 },
  { id: 'e08', date: '2026-11-12', desc: 'School fee — Kirana (grade 2)', category: 'education', amount: 850000 },
  { id: 'e09', date: '2026-11-14', desc: 'Weekly market: fish, fruit, eggs', category: 'food', amount: 590000 },
  { id: 'e10', date: '2026-11-16', desc: 'Ride-hailing to Sari’s client meeting', category: 'transport', amount: 86000 },
  { id: 'e11', date: '2026-11-18', desc: 'Pharmacy: vitamins + fever medicine', category: 'health', amount: 214000 },
  { id: 'e12', date: '2026-11-20', desc: 'Family outing: Ragunan Zoo tickets', category: 'fun', amount: 185000 },
  { id: 'e13', date: '2026-11-22', desc: 'Groceries: cooking oil, milk, bread', category: 'food', amount: 437000 },
  { id: 'e14', date: '2026-11-24', desc: 'Motorbike service + oil change', category: 'transport', amount: 310000 },
  { id: 'e15', date: '2026-11-25', desc: 'Moved to emergency fund', category: 'savings', amount: 2000000 },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund — 3 months of expenses', target: 12000000, saved: 7400000, monthly: 1000000, note: 'Covers rent, food and bills if income stops.' },
  { id: 'g2', name: 'Family holiday — Bali, 5 days', target: 6000000, saved: 2250000, monthly: 500000, note: 'Flights, guesthouse in Ubud and meals.' },
  { id: 'g3', name: 'New motorbike — Honda Beat', target: 15000000, saved: 4800000, monthly: 500000, note: 'Replace the 2016 bike before it needs big repairs.' },
  { id: 'g4', name: 'Children’s education fund', target: 25000000, saved: 9600000, monthly: 750000, note: 'Junior high fees for Dimas in two years.' },
];

export const TIPS = [
  { title: 'Shop the morning market twice a week', text: 'Pasar Santa prices drop before 8 am. Buying vegetables and fish there instead of the supermarket saves the family about Rp 320.000 a month.', save: 320000 },
  { title: 'Cook lunch for the office', text: 'Budi takes rice, chicken and vegetables from home four days a week instead of buying lunch near the warehouse.', save: 480000 },
  { title: 'Cap ride-hailing at Rp 350.000', text: 'Trips under 3 km are walked or taken by TransJakarta. The tracker flags the transport category when it passes 80% of budget.', save: 260000 },
  { title: 'Pay the electricity token on the 1st', text: 'A fixed Rp 420.000 token on payday stops the mid-month top-ups that used to add up to Rp 150.000 extra.', save: 150000 },
  { title: 'One paid outing a month', text: 'Free parks, the library and family movie night at home replace the second paid outing. The kids pick the film.', save: 240000 },
  { title: 'Move savings on payday, not payday-plus', text: 'Rp 2.000.000 leaves the account the morning the salary lands, before any spending can eat it.', save: 0 },
];

export function totalIncome() {
  return INCOME.reduce((sum, item) => sum + item.amount, 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((sum, item) => sum + item.budget, 0);
}

export function spentByCategory(expenses) {
  const spent = {};
  for (const category of CATEGORIES) spent[category.id] = 0;
  for (const expense of expenses) {
    if (spent[expense.category] === undefined) spent[expense.category] = 0;
    spent[expense.category] += expense.amount;
  }
  return spent;
}

export function totalSpent(expenses) {
  return expenses.reduce((sum, item) => sum + item.amount, 0);
}
