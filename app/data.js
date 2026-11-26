// Realistic household financial presets and transaction ledgers
export const SCENARIOS = {
  family4: {
    name: 'Family of 4 (Homeowners)',
    income: 9800,
    savingsTarget: 2200,
    emergencyFund: 32000,
    monthlyBurn: 7600,
    cards: [
      { title: 'Monthly Net Income', value: '$9,800', meta: 'Post-tax primary salary' },
      { title: 'Fixed Obligations', value: '$4,650', meta: 'Mortgage, utilities, insurance' },
      { title: 'Discretionary Spend', value: '$2,950', meta: 'Groceries, dining, activities' },
      { title: 'Monthly Net Savings', value: '$2,200', meta: '22.4% savings rate' },
      { title: 'Emergency Runway', value: '4.2 Months', meta: '$32,000 cash reserve' },
    ],
    categories: [
      { name: 'Housing & Mortgage', amount: 2650, group: 'needs', color: '#3b82f6' },
      { name: 'Groceries & Household', amount: 1200, group: 'needs', color: '#60a5fa' },
      { name: 'Healthcare & Insurance', amount: 800, group: 'needs', color: '#93c5fd' },
      { name: 'Dining & Entertainment', amount: 950, group: 'wants', color: '#f59e0b' },
      { name: 'Family Activities & Sports', amount: 650, group: 'wants', color: '#fbbf24' },
      { name: 'Travel & Vacations', amount: 550, group: 'wants', color: '#fde68a' },
      { name: 'Retirement & Index Funds', amount: 1500, group: 'savings', color: '#10b981' },
      { name: 'College 529 Plan', amount: 700, group: 'savings', color: '#34d399' },
    ],
    ledger: [
      { date: '2026-11-25', item: 'Monthly Mortgage Payment', category: 'Housing', group: 'needs', amount: '-$2,650.00' },
      { date: '2026-11-24', item: 'Costco Wholesale Grocery', category: 'Groceries', group: 'needs', amount: '-$384.20' },
      { date: '2026-11-22', item: 'Family Dinner - Trattoria', category: 'Dining', group: 'wants', amount: '-$145.50' },
      { date: '2026-11-20', item: 'Automatic Transfer: 529 College', category: 'Savings', group: 'savings', amount: '-$700.00' },
      { date: '2026-11-18', item: 'Electric & Gas Utility Bill', category: 'Housing', group: 'needs', amount: '-$215.40' },
      { date: '2026-11-15', item: 'Bi-Weekly Paycheck Direct Deposit', category: 'Income', group: 'income', amount: '+$4,900.00' },
    ]
  },
  dual: {
    name: 'Dual Income No Kids (DINK)',
    income: 13500,
    savingsTarget: 4800,
    emergencyFund: 55000,
    monthlyBurn: 8700,
    cards: [
      { title: 'Monthly Net Income', value: '$13,500', meta: 'Dual professional income' },
      { title: 'Fixed Obligations', value: '$4,800', meta: 'Rent, luxury lease, health' },
      { title: 'Discretionary Spend', value: '$3,900', meta: 'Dining, fitness, travel' },
      { title: 'Monthly Net Savings', value: '$4,800', meta: '35.5% savings rate' },
      { title: 'Emergency Runway', value: '6.3 Months', meta: '$55,000 liquid reserves' },
    ],
    categories: [
      { name: 'Urban Apartment Rent', amount: 3400, group: 'needs', color: '#3b82f6' },
      { name: 'Auto Lease & EV Charging', amount: 900, group: 'needs', color: '#60a5fa' },
      { name: 'Fine Dining & Social', amount: 1800, group: 'wants', color: '#f59e0b' },
      { name: 'International Travel Fund', amount: 1500, group: 'wants', color: '#fbbf24' },
      { name: 'Health & Wellness/Gym', amount: 600, group: 'wants', color: '#fde68a' },
      { name: 'Brokerage & Stocks', amount: 3600, group: 'savings', color: '#10b981' },
      { name: 'Emergency High-Yield Savings', amount: 1200, group: 'savings', color: '#34d399' },
    ],
    ledger: [
      { date: '2026-11-26', item: 'Equinox Tier 3 Membership', category: 'Health', group: 'wants', amount: '-$320.00' },
      { date: '2026-11-24', item: 'Whole Foods Market', category: 'Groceries', group: 'needs', amount: '-$198.40' },
      { date: '2026-11-23', item: 'Flight Tickets - Tokyo Spring', category: 'Travel', group: 'wants', amount: '-$1,420.00' },
      { date: '2026-11-15', item: 'Primary Partner Direct Deposit', category: 'Income', group: 'income', amount: '+$6,800.00' },
      { date: '2026-11-15', item: 'Secondary Partner Direct Deposit', category: 'Income', group: 'income', amount: '+$6,700.00' },
    ]
  },
  single: {
    name: 'Single Professional',
    income: 5600,
    savingsTarget: 1400,
    emergencyFund: 18000,
    monthlyBurn: 4200,
    cards: [
      { title: 'Monthly Net Income', value: '$5,600', meta: 'Tech salary post-tax' },
      { title: 'Fixed Obligations', value: '$2,450', meta: 'Studio rent, internet, transit' },
      { title: 'Discretionary Spend', value: '$1,750', meta: 'Dining, hobbies, subscriptions' },
      { title: 'Monthly Net Savings', value: '$1,400', meta: '25.0% savings rate' },
      { title: 'Emergency Runway', value: '4.3 Months', meta: '$18,000 liquid fund' },
    ],
    categories: [
      { name: 'Studio Apartment Rent', amount: 1950, group: 'needs', color: '#3b82f6' },
      { name: 'Groceries & Cooking', amount: 500, group: 'needs', color: '#60a5fa' },
      { name: 'Transit & Commute', amount: 180, group: 'needs', color: '#93c5fd' },
      { name: 'Restaurants & Coffee', amount: 750, group: 'wants', color: '#f59e0b' },
      { name: 'Tech & Gaming Gear', amount: 450, group: 'wants', color: '#fbbf24' },
      { name: 'Streaming & Digital Subscriptions', amount: 90, group: 'wants', color: '#fde68a' },
      { name: 'Roth IRA Contribution', amount: 600, group: 'savings', color: '#10b981' },
      { name: 'S&P 500 ETF Allocation', amount: 800, group: 'savings', color: '#34d399' },
    ],
    ledger: [
      { date: '2026-11-25', item: 'Monthly Rent Payment', category: 'Housing', group: 'needs', amount: '-$1,950.00' },
      { date: '2026-11-24', item: 'Local Supermarket', category: 'Groceries', group: 'needs', amount: '-$86.20' },
      { date: '2026-11-21', item: 'Specialty Coffee Roasters', category: 'Dining', group: 'wants', amount: '-$18.50' },
      { date: '2026-11-15', item: 'Direct Deposit Paycheck', category: 'Income', group: 'income', amount: '+$2,800.00' },
    ]
  }
};
