import { ENVELOPE_PLANS } from './household-data.js';

export function summarizeHouseholdLedger(transactions) {
  let income = 0;
  let totalOutflow = 0;
  let needsActual = 0;
  let wantsActual = 0;
  let savingsActual = 0;
  const byCategory = {};

  for (const tx of transactions) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      income += amt;
    } else {
      totalOutflow += amt;
      byCategory[tx.category] = (byCategory[tx.category] || 0) + amt;
      if (tx.bucket === 'Needs') needsActual += amt;
      else if (tx.bucket === 'Wants') wantsActual += amt;
      else if (tx.bucket === 'Savings') savingsActual += amt;
    }
  }

  const envelopes = ENVELOPE_PLANS.map((plan) => {
    const spent = byCategory[plan.name] || 0;
    const remaining = plan.planned - spent;
    const pct = plan.planned > 0 ? Math.min(130, (spent / plan.planned) * 100) : 0;
    return { ...plan, spent, remaining, pct };
  });

  const consumptionSpent = needsActual + wantsActual;
  const netSavedAndUnallocated = income - consumptionSpent;
  const savingsRatePct = income > 0 ? (netSavedAndUnallocated / income) * 100 : 0;

  return {
    income,
    totalOutflow,
    consumptionSpent,
    needsActual,
    wantsActual,
    savingsActual,
    unassignedCash: income - totalOutflow,
    netSavedAndUnallocated,
    savingsRatePct,
    envelopes,
  };
}

export function evaluateBudgetRule(netIncome, rulePercentages, summary) {
  const cleanIncome = Math.max(0, Number(netIncome) || 0);
  const needsTarget = (cleanIncome * rulePercentages.needs) / 100;
  const wantsTarget = (cleanIncome * rulePercentages.wants) / 100;
  const savingsTarget = (cleanIncome * rulePercentages.savings) / 100;

  return [
    {
      bucket: 'Essential Needs',
      rulePct: rulePercentages.needs,
      target: needsTarget,
      actual: summary.needsActual,
      delta: needsTarget - summary.needsActual,
      color: '#14332b',
    },
    {
      bucket: 'Flexible Wants',
      rulePct: rulePercentages.wants,
      target: wantsTarget,
      actual: summary.wantsActual,
      delta: wantsTarget - summary.wantsActual,
      color: '#c2512d',
    },
    {
      bucket: 'Savings & Debt Principal',
      rulePct: rulePercentages.savings,
      target: savingsTarget,
      actual: summary.savingsActual + Math.max(0, summary.unassignedCash),
      delta: summary.savingsActual + Math.max(0, summary.unassignedCash) - savingsTarget,
      color: '#2d6a4f',
      isSavings: true,
    },
  ];
}

export function simulateDebtPayoff(debts, extraMonthlyPayment) {
  const simulateSchedule = (extra) => {
    const items = debts
      .map((d) => ({ ...d, bal: Number(d.balance) }))
      .sort((a, b) => b.apr - a.apr);
    let months = 0;
    let totalInterest = 0;

    while (items.some((d) => d.bal > 0.01) && months < 360) {
      months += 1;
      let extraPool = Number(extra) || 0;
      for (const d of items) {
        if (d.bal <= 0.01) {
          extraPool += d.minPayment;
          continue;
        }
        const monthlyInterest = d.bal * (d.apr / 100 / 12);
        totalInterest += monthlyInterest;
        d.bal += monthlyInterest;
        const pay = Math.min(d.bal, d.minPayment);
        d.bal -= pay;
      }
      for (const d of items) {
        if (d.bal > 0.01 && extraPool > 0) {
          const boost = Math.min(d.bal, extraPool);
          d.bal -= boost;
          extraPool -= boost;
        }
      }
    }
    return { months, totalInterest };
  };

  const baseline = simulateSchedule(0);
  const accelerated = simulateSchedule(extraMonthlyPayment);

  return {
    baseMonths: baseline.months,
    baseInterest: baseline.totalInterest,
    fastMonths: accelerated.months,
    fastInterest: accelerated.totalInterest,
    monthsSaved: Math.max(0, baseline.months - accelerated.months),
    interestSaved: Math.max(0, baseline.totalInterest - accelerated.totalInterest),
  };
}

export function toCsvText(headers, rows) {
  const esc = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
}
