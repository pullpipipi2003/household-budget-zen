# ZenithBudget - Household Budget & Expense Planner

An original, fast, and comprehensive personal & household financial management web app built for the [make.fun](https://make.fun) bounty `best-household-budget-site-20261126-1457`.

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/pullpipipi2003/household-budget-zen/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/pullpipipi2003/household-budget-zen/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview
ZenithBudget delivers zero-leakage household budgeting, category allocation, monthly cash flow tracking, emergency fund modeling, and debt repayment calculators. Runs 100% offline with zero external network requests.

## Key Sections
- **Monthly Budget Overview**: Income, fixed living expenses, discretionary spending, and savings rate.
- **Category Allocations**: 50/30/20 budget rule breakdown with visual category rings.
- **Transaction Ledger**: Filterable expenses with category tags and date stamps.
- **Savings & Emergency Funds**: Runway calculator based on average monthly burn rate.

## Architecture
- `app/index.html`: Responsive mobile-first layout.
- `app/style.css`: Clean financial design system with modern typography and dark theme.
- `app/data.js`: Preset family budget scenarios (Single Professional, Family of 4, Dual Income).
- `app/charts.js`: Zero-dependency SVG progress meters and category distribution charts.
- `app/main.js`: Interactive budgeting calculators, transaction logging, and budget health checks.
