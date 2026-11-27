import { ENVELOPE_PLANS, HOUSEHOLD_DEBTS, MONTHLY_HISTORY, SINKING_FUNDS } from './household-data.js';
import { evaluateBudgetRule, simulateDebtPayoff, summarizeHouseholdLedger } from './budget-math.js';
import { renderCashflowHistoryChart, renderRuleComparisonBars } from './budget-charts.js';

const fmtUsd = (n) => `$${Math.round(Number(n) || 0).toLocaleString()}`;

export function renderDashboardView(state) {
  const summary = summarizeHouseholdLedger(state.transactions);
  const unpaidBills = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaidBills.reduce((acc, b) => acc + b.amount, 0);

  const envelopeHtml = summary.envelopes.slice(0, 7).map((env) => {
    const over = env.remaining < 0;
    const color = over ? '#c2512d' : env.bucket === 'Savings' ? '#2d6a4f' : '#14332b';
    const badge = over
      ? `<span class="badge badge-over">$${Math.abs(env.remaining)} over</span>`
      : `<span class="badge badge-good">$${env.remaining} left</span>`;
    return `<div>
      <div class="env-row-head">
        <span><strong>${env.name}</strong></span>
        <span>${fmtUsd(env.spent)} / ${fmtUsd(env.planned)} ${badge}</span>
      </div>
      <div class="bar-bg">
        <div class="bar-fg" style="width:${Math.min(100, env.pct).toFixed(1)}%; background:${color}"></div>
      </div>
    </div>`;
  }).join('');

  return `
    <section class="hero-head">
      <div>
        <h1>November 2026 Household Budget Overview</h1>
        <p>Live zero-based envelope status, 6-month savings momentum, and upcoming cashflow commitments.</p>
      </div>
      <div class="toolbar">
        <a class="btn" href="#/planner">Adjust 50/30/20 Split</a>
        <a class="btn btn-solid" href="#/ledger">+ Log Income / Expense</a>
      </div>
    </section>

    <section class="summary-grid">
      <article class="metric-card forest">
        <div class="metric-label">Net Monthly Income</div>
        <div class="metric-val">${fmtUsd(summary.income)}</div>
        <div class="metric-note">2 household salaries + design retainer</div>
      </article>
      <article class="metric-card terra">
        <div class="metric-label">Living Expenses (Needs + Wants)</div>
        <div class="metric-val">${fmtUsd(summary.consumptionSpent)}</div>
        <div class="metric-note">Needs ${fmtUsd(summary.needsActual)} • Wants ${fmtUsd(summary.wantsActual)}</div>
      </article>
      <article class="metric-card">
        <div class="metric-label">Savings &amp; Debt Principal</div>
        <div class="metric-val">${fmtUsd(summary.netSavedAndUnallocated)}</div>
        <div class="metric-note"><span class="badge badge-good">${summary.savingsRatePct.toFixed(1)}% Savings Rate</span></div>
      </article>
      <article class="metric-card ochre">
        <div class="metric-label">Remaining Bills Due (Nov)</div>
        <div class="metric-val">${fmtUsd(unpaidTotal)}</div>
        <div class="metric-note">${unpaidBills.length} bills left before month-end • <a href="#/bills">View</a></div>
      </article>
    </section>

    <section class="split-grid">
      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">6-Month Cashflow &amp; Savings Trajectory</h2>
            <p class="card-sub">Consistent 26%–32% monthly wealth-building rate since June 2026</p>
          </div>
          <button class="btn btn-small" data-action="export-ledger-csv">Export CSV</button>
        </div>
        ${renderCashflowHistoryChart(MONTHLY_HISTORY)}
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Monthly Category Envelopes</h2>
            <p class="card-sub">Planned monthly cap versus actual posted spending</p>
          </div>
          <a class="btn btn-small" href="#/ledger">All ${summary.envelopes.length} Categories</a>
        </div>
        <div class="envelope-list">${envelopeHtml}</div>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <div>
          <h2 class="card-title">Recent Household Ledger Activity</h2>
          <p class="card-sub">Latest posted income deposits, fixed bills, and variable envelope purchases</p>
        </div>
        <a class="btn btn-small" href="#/ledger">Open Full Ledger (${state.transactions.length}) →</a>
      </div>
      <div class="table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payee / Description</th>
              <th>Envelope</th>
              <th>Bucket</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${state.transactions.slice(0, 5).map((tx) => `<tr>
              <td>${tx.date}</td>
              <td><strong>${tx.payee}</strong></td>
              <td>${tx.category}</td>
              <td><span class="badge ${tx.type === 'income' ? 'badge-good' : 'badge-warn'}">${tx.bucket}</span></td>
              <td class="right ${tx.type === 'income' ? 'amt-in' : 'amt-out'}">${tx.type === 'income' ? '+' : '-'}${fmtUsd(tx.amount)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export function renderLedgerView(state) {
  const summary = summarizeHouseholdLedger(state.transactions);
  const categories = ['Income', ...ENVELOPE_PLANS.map((e) => e.name)];
  const filterOpts = ['ALL', 'Needs', 'Wants', 'Savings', 'Income']
    .map((b) => `<option value="${b}" ${state.ledgerBucket === b ? 'selected' : ''}>${b === 'ALL' ? 'All Buckets' : b}</option>`)
    .join('');

  const catOptions = ENVELOPE_PLANS
    .map((e) => `<option value="${e.name}" data-bucket="${e.bucket}">${e.name} (${e.bucket})</option>`)
    .join('');

  const needle = state.ledgerSearch.trim().toLowerCase();
  const visible = state.transactions.filter((tx) => {
    const bucketOk = state.ledgerBucket === 'ALL' || tx.bucket === state.ledgerBucket;
    const searchOk = !needle || tx.payee.toLowerCase().includes(needle) || tx.category.toLowerCase().includes(needle);
    return bucketOk && searchOk;
  });

  const rows = visible.map((tx) => `<tr>
    <td>${tx.date}</td>
    <td><strong>${tx.payee}</strong></td>
    <td>${tx.category}</td>
    <td><span class="badge ${tx.type === 'income' ? 'badge-good' : 'badge-warn'}">${tx.bucket}</span></td>
    <td class="right ${tx.type === 'income' ? 'amt-in' : 'amt-out'}">${tx.type === 'income' ? '+' : '-'}${fmtUsd(tx.amount)}</td>
    <td class="right"><button class="btn btn-small" data-action="delete-tx" data-id="${tx.id}">Remove</button></td>
  </tr>`).join('');

  return `
    <section class="hero-head">
      <div>
        <h1>Household Transaction Ledger (${visible.length} Entries)</h1>
        <p>Log new household income or expenses below — all category envelopes and ratios recalculate immediately.</p>
      </div>
      <div class="toolbar">
        <input type="search" placeholder="Search payee or category..." value="${state.ledgerSearch}" data-input="ledger-search" aria-label="Search transactions">
        <select data-input="ledger-bucket" aria-label="Filter bucket">${filterOpts}</select>
        <button class="btn btn-solid" data-action="export-ledger-csv">Download CSV</button>
      </div>
    </section>

    <section class="card">
      <form id="add-tx-form" class="entry-form">
        <div class="field">
          <label for="tx-payee">Payee / Description</label>
          <input id="tx-payee" name="payee" type="text" placeholder="e.g. Trader Market Groceries" required>
        </div>
        <div class="field">
          <label for="tx-cat">Envelope Category</label>
          <select id="tx-cat" name="category">
            ${catOptions}
            <option value="Income">Household Income (+)</option>
          </select>
        </div>
        <div class="field">
          <label for="tx-amount">Amount ($USD)</label>
          <input id="tx-amount" name="amount" type="number" min="1" step="1" value="85" required>
        </div>
        <div class="field">
          <label for="tx-date">Date</label>
          <input id="tx-date" name="date" type="date" value="2026-11-26" required>
        </div>
        <button type="submit" class="btn btn-solid">Add Entry</button>
      </form>

      <div class="table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payee / Note</th>
              <th>Envelope</th>
              <th>Bucket</th>
              <th class="right">Amount</th>
              <th class="right">Action</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="6">No transactions match current filter (${categories.length} categories configured).</td></tr>`}</tbody>
        </table>
      </div>
      <p class="card-sub" style="margin-top:10px;">Unassigned cash remaining in November checking buffer: <strong>${fmtUsd(summary.unassignedCash)}</strong></p>
    </section>
  `;
}

export function renderPlannerView(state) {
  const summary = summarizeHouseholdLedger(state.transactions);
  const rows = evaluateBudgetRule(state.plannerIncome, state.ruleSplit, summary);

  const rowCards = rows.map((r) => {
    const ok = r.delta >= 0;
    const statusText = r.isSavings
      ? ok
        ? `Exceeding savings target by ${fmtUsd(r.delta)}/mo`
        : `Short of savings goal by ${fmtUsd(Math.abs(r.delta))}/mo`
      : ok
        ? `${fmtUsd(r.delta)} under monthly cap`
        : `${fmtUsd(Math.abs(r.delta))} above target cap`;
    return `<tr>
      <td><strong>${r.bucket}</strong></td>
      <td class="right">${r.rulePct}%</td>
      <td class="right">${fmtUsd(r.target)}</td>
      <td class="right">${fmtUsd(r.actual)}</td>
      <td><span class="badge ${ok ? 'badge-good' : 'badge-over'}">${statusText}</span></td>
    </tr>`;
  }).join('');

  return `
    <section class="hero-head">
      <div>
        <h1>Household Budget Rule &amp; Allocation Calculator</h1>
        <p>Benchmark your real household spending against classic 50/30/20, high-cost-city 60/20/20, or aggressive savings rules.</p>
      </div>
      <div class="toolbar">
        <button class="btn ${state.rulePreset === '50-30-20' ? 'btn-solid' : ''}" data-action="set-rule" data-needs="50" data-wants="30" data-savings="20" data-preset="50-30-20">50 / 30 / 20 Classic</button>
        <button class="btn ${state.rulePreset === '60-20-20' ? 'btn-solid' : ''}" data-action="set-rule" data-needs="60" data-wants="20" data-savings="20" data-preset="60-20-20">60 / 20 / 20 Metro Family</button>
        <button class="btn ${state.rulePreset === '50-20-30' ? 'btn-solid' : ''}" data-action="set-rule" data-needs="50" data-wants="20" data-savings="30" data-preset="50-20-30">50 / 20 / 30 FIRE Builder</button>
      </div>
    </section>

    <section class="half-grid">
      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Monthly Take-Home Income Assumption</h2>
            <p class="card-sub">Test pay raises, parental leave, or single-income scenarios</p>
          </div>
        </div>
        <div class="rule-box">
          <div class="field" style="margin-bottom:10px;">
            <label for="planner-income">Household Net Take-Home Pay ($USD / Month)</label>
            <input id="planner-income" type="number" min="1500" step="100" value="${state.plannerIncome}" data-input="planner-income">
          </div>
          <div class="callout">
            Selected Rule: <strong>${state.ruleSplit.needs}% Needs / ${state.ruleSplit.wants}% Wants / ${state.ruleSplit.savings}% Savings</strong>
            <div>Annualized Savings &amp; Principal Target: <strong>${fmtUsd((state.plannerIncome * state.ruleSplit.savings * 12) / 100)} / year</strong></div>
          </div>
        </div>
        ${renderRuleComparisonBars(rows)}
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Target vs Actual Household Variance</h2>
            <p class="card-sub">Compared directly against your live November ledger</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>Budget Tier</th>
                <th class="right">Rule %</th>
                <th class="right">Target</th>
                <th class="right">Actual</th>
                <th>Variance Guidance</th>
              </tr>
            </thead>
            <tbody>${rowCards}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function renderGoalsAndDebtView(state) {
  const payoff = simulateDebtPayoff(HOUSEHOLD_DEBTS, state.extraDebtPayment);

  const sinkingHtml = SINKING_FUNDS.map((sf) => {
    const pct = Math.min(100, (sf.saved / sf.target) * 100);
    return `<div>
      <div class="env-row-head">
        <span><strong>${sf.name}</strong> (Target ${sf.targetDate})</span>
        <span>${fmtUsd(sf.saved)} / ${fmtUsd(sf.target)} <span class="badge badge-good">+${fmtUsd(sf.monthly)}/mo</span></span>
      </div>
      <div class="bar-bg">
        <div class="bar-fg" style="width:${pct.toFixed(1)}%; background:#2d6a4f"></div>
      </div>
    </div>`;
  }).join('');

  const debtRows = HOUSEHOLD_DEBTS.map((d) => `<tr>
    <td><strong>${d.name}</strong></td>
    <td class="right">${fmtUsd(d.balance)}</td>
    <td class="right">${d.apr.toFixed(1)}%</td>
    <td class="right">${fmtUsd(d.minPayment)}/mo</td>
  </tr>`).join('');

  return `
    <section class="hero-head">
      <div>
        <h1>Sinking Funds &amp; Debt Avalanche Simulator</h1>
        <p>Track dedicated savings reserves and model how extra principal payments shorten debt payoff.</p>
      </div>
    </section>

    <section class="half-grid">
      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Dedicated Sinking &amp; Reserve Funds</h2>
            <p class="card-sub">Total earmarked household reserves: <strong>$33,170</strong></p>
          </div>
        </div>
        <div class="envelope-list">${sinkingHtml}</div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Debt Avalanche Payoff Accelerator</h2>
            <p class="card-sub">Combined balance: <strong>$24,220</strong> (prioritizing highest APR first)</p>
          </div>
        </div>
        <div class="rule-box">
          <label for="extra-debt"><strong>Extra Monthly Principal Payment: ${fmtUsd(state.extraDebtPayment)}/mo</strong></label>
          <input id="extra-debt" type="range" min="0" max="1000" step="50" value="${state.extraDebtPayment}" data-input="extra-debt">
          <div class="callout" style="margin-top:8px;">
            Debt-free in <strong>${payoff.fastMonths} months</strong> (vs ${payoff.baseMonths} months on minimums) — saves <strong>${payoff.monthsSaved} months</strong> and <strong>${fmtUsd(payoff.interestSaved)}</strong> in interest.
          </div>
        </div>
        <div class="table-wrap">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>Loan Account</th>
                <th class="right">Balance</th>
                <th class="right">APR</th>
                <th class="right">Minimum</th>
              </tr>
            </thead>
            <tbody>${debtRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function renderBillsView(state) {
  const paidSum = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const dueSum = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);

  const billRows = state.bills.map((b) => `<tr>
    <td>Nov ${String(b.dueDay).padStart(2, '0')}</td>
    <td><strong>${b.name}</strong></td>
    <td>${b.category}</td>
    <td>${b.autopay ? '<span class="badge badge-good">Autopay</span>' : '<span class="badge badge-warn">Manual</span>'}</td>
    <td class="right">${fmtUsd(b.amount)}</td>
    <td class="right">
      <button class="btn btn-small ${b.paid ? '' : 'btn-solid'}" data-action="toggle-bill" data-id="${b.id}">
        ${b.paid ? 'Paid ✓ (Undo)' : 'Mark Paid'}
      </button>
    </td>
  </tr>`).join('');

  return `
    <section class="hero-head">
      <div>
        <h1>Recurring Monthly Bills Checklist</h1>
        <p>Cleared so far: <strong>${fmtUsd(paidSum)}</strong> • Remaining due before Nov 30: <strong>${fmtUsd(dueSum)}</strong></p>
      </div>
    </section>

    <section class="card">
      <div class="table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Biller / Obligation</th>
              <th>Category</th>
              <th>Method</th>
              <th class="right">Amount</th>
              <th class="right">Status</th>
            </tr>
          </thead>
          <tbody>${billRows}</tbody>
        </table>
      </div>
    </section>
  `;
}
