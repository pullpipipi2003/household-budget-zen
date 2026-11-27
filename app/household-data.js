export const MONTHLY_HISTORY = [
  { month: 'Jun 2026', income: 7650, needs: 3790, wants: 1580, savings: 2280 },
  { month: 'Jul 2026', income: 7650, needs: 3910, wants: 1720, savings: 2020 },
  { month: 'Aug 2026', income: 7850, needs: 3840, wants: 1640, savings: 2370 },
  { month: 'Sep 2026', income: 7850, needs: 3920, wants: 1510, savings: 2420 },
  { month: 'Oct 2026', income: 7850, needs: 3865, wants: 1595, savings: 2390 },
  { month: 'Nov 2026', income: 7850, needs: 3825, wants: 1485, savings: 2540 },
];

export const ENVELOPE_PLANS = [
  { id: 'housing', name: 'Mortgage, Property Tax & HOA', bucket: 'Needs', planned: 2150 },
  { id: 'groceries', name: 'Groceries & Household Pantry', bucket: 'Needs', planned: 820 },
  { id: 'childcare', name: 'Preschool & After-School Care', bucket: 'Needs', planned: 620 },
  { id: 'utilities', name: 'Electric, Water, Gas & Fiber', bucket: 'Needs', planned: 315 },
  { id: 'transport', name: 'Fuel, Transit Pass & Auto Ins.', bucket: 'Needs', planned: 340 },
  { id: 'dining', name: 'Family Dining & Coffee Outings', bucket: 'Wants', planned: 420 },
  { id: 'recreation', name: 'Kids Sports, Books & Streaming', bucket: 'Wants', planned: 290 },
  { id: 'personal', name: 'Apparel, Gifts & Home Care', bucket: 'Wants', planned: 320 },
  { id: 'savings', name: 'Emergency, Sinking & 529 Savings', bucket: 'Savings', planned: 1850 },
  { id: 'debt', name: 'Auto & Student Loan Paydown', bucket: 'Savings', planned: 725 },
];

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', date: '2026-11-01', payee: 'Primary Salary Direct Deposit', category: 'Income', bucket: 'Income', amount: 4950, type: 'income' },
  { id: 'tx-2', date: '2026-11-01', payee: 'Partner Salary & Design Retainer', category: 'Income', bucket: 'Income', amount: 2900, type: 'income' },
  { id: 'tx-3', date: '2026-11-02', payee: 'First Republic Fixed Mortgage', category: 'Mortgage, Property Tax & HOA', bucket: 'Needs', amount: 2150, type: 'expense' },
  { id: 'tx-4', date: '2026-11-04', payee: 'Little Oaks Early Learning', category: 'Preschool & After-School Care', bucket: 'Needs', amount: 620, type: 'expense' },
  { id: 'tx-5', date: '2026-11-06', payee: 'Trader Market & Fresh Produce', category: 'Groceries & Household Pantry', bucket: 'Needs', amount: 418, type: 'expense' },
  { id: 'tx-6', date: '2026-11-08', payee: 'Vanguard High-Yield Emergency Transfer', category: 'Emergency, Sinking & 529 Savings', bucket: 'Savings', amount: 1350, type: 'expense' },
  { id: 'tx-7', date: '2026-11-10', payee: 'City Power, Water & Gigabit Fiber', category: 'Electric, Water, Gas & Fiber', bucket: 'Needs', amount: 298, type: 'expense' },
  { id: 'tx-8', date: '2026-11-12', payee: 'Credit Union Auto & Student Principal', category: 'Auto & Student Loan Paydown', bucket: 'Savings', amount: 725, type: 'expense' },
  { id: 'tx-9', date: '2026-11-15', payee: 'Costco Bulk Pantry & Household', category: 'Groceries & Household Pantry', bucket: 'Needs', amount: 364, type: 'expense' },
  { id: 'tx-10', date: '2026-11-17', payee: 'Pho Saigon & Weekend Bakery', category: 'Family Dining & Coffee Outings', bucket: 'Wants', amount: 186, type: 'expense' },
  { id: 'tx-11', date: '2026-11-19', payee: 'Metro Transit & Mutual Auto Policy', category: 'Fuel, Transit Pass & Auto Ins.', bucket: 'Needs', amount: 312, type: 'expense' },
  { id: 'tx-12', date: '2026-11-21', payee: 'Youth Swim League & Bookstore', category: 'Kids Sports, Books & Streaming', bucket: 'Wants', amount: 245, type: 'expense' },
  { id: 'tx-13', date: '2026-11-23', payee: '529 College Custodial Contribution', category: 'Emergency, Sinking & 529 Savings', bucket: 'Savings', amount: 500, type: 'expense' },
  { id: 'tx-14', date: '2026-11-24', payee: 'Winter Jackets & Thanksgiving Host', category: 'Apparel, Gifts & Home Care', bucket: 'Wants', amount: 348, type: 'expense' },
];

export const SINKING_FUNDS = [
  { id: 'sf-1', name: '6-Month Emergency Reserve', saved: 21400, target: 24000, monthly: 850, targetDate: 'Feb 2027' },
  { id: 'sf-2', name: 'Home Roof & HVAC Sinking Fund', saved: 4650, target: 7500, monthly: 300, targetDate: 'Sep 2027' },
  { id: 'sf-3', name: 'Children 529 Education Annual Goal', saved: 5500, target: 6000, monthly: 500, targetDate: 'Dec 2026' },
  { id: 'sf-4', name: 'Annual Property Insurance & Car Reg.', saved: 1620, target: 1800, monthly: 180, targetDate: 'Jan 2027' },
];

export const HOUSEHOLD_DEBTS = [
  { id: 'd-1', name: 'Family Crossover Auto Loan', balance: 9420, apr: 5.4, minPayment: 365 },
  { id: 'd-2', name: 'Federal Graduate Student Loan', balance: 14800, apr: 4.8, minPayment: 360 },
];

export const RECURRING_BILLS = [
  { id: 'b-1', dueDay: 1, name: 'Fixed 30-Yr Mortgage & Escrow', category: 'Housing', amount: 2150, autopay: true, paid: true },
  { id: 'b-2', dueDay: 4, name: 'Little Oaks Preschool Tuition', category: 'Childcare', amount: 620, autopay: true, paid: true },
  { id: 'b-3', dueDay: 10, name: 'Municipal Electric & Gas Utility', category: 'Utilities', amount: 184, autopay: true, paid: true },
  { id: 'b-4', dueDay: 12, name: 'Fiber 1Gbps Internet Plan', category: 'Utilities', amount: 65, autopay: true, paid: true },
  { id: 'b-5', dueDay: 19, name: 'Auto & Umbrella Liability Policy', category: 'Transport', amount: 178, autopay: true, paid: true },
  { id: 'b-6', dueDay: 28, name: 'Municipal Water & Waste Service', category: 'Utilities', amount: 49, autopay: false, paid: false },
  { id: 'b-7', dueDay: 29, name: 'Term Life Insurance (Both Parents)', category: 'Protection', amount: 94, autopay: true, paid: false },
  { id: 'b-8', dueDay: 30, name: 'Kids Piano & Swim Club Monthly', category: 'Recreation', amount: 135, autopay: false, paid: false },
];
