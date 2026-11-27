import { ENVELOPE_PLANS, INITIAL_TRANSACTIONS, RECURRING_BILLS } from './household-data.js';
import { toCsvText } from './budget-math.js';
import {
  renderBillsView,
  renderDashboardView,
  renderGoalsAndDebtView,
  renderLedgerView,
  renderPlannerView,
} from './budget-views.js';

const STORAGE_KEY = 'hearthledger_v1_state';

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStateSnapshot(state) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transactions: state.transactions,
        bills: state.bills,
        plannerIncome: state.plannerIncome,
        ruleSplit: state.ruleSplit,
        rulePreset: state.rulePreset,
        extraDebtPayment: state.extraDebtPayment,
      }),
    );
  } catch {
    // Storage unavailable in restricted sandboxes; in-memory state remains active.
  }
}

const persisted = loadSavedState();
const state = {
  transactions: persisted?.transactions ?? INITIAL_TRANSACTIONS.map((t) => ({ ...t })),
  bills: persisted?.bills ?? RECURRING_BILLS.map((b) => ({ ...b })),
  plannerIncome: persisted?.plannerIncome ?? 7850,
  ruleSplit: persisted?.ruleSplit ?? { needs: 50, wants: 30, savings: 20 },
  rulePreset: persisted?.rulePreset ?? '50-30-20',
  extraDebtPayment: persisted?.extraDebtPayment ?? 250,
  ledgerBucket: 'ALL',
  ledgerSearch: '',
};

function activeRoute() {
  const h = window.location.hash || '#/';
  if (h.startsWith('#/ledger')) return 'ledger';
  if (h.startsWith('#/planner')) return 'planner';
  if (h.startsWith('#/goals')) return 'goals';
  if (h.startsWith('#/bills')) return 'bills';
  return 'dashboard';
}

function downloadCsv(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function render() {
  const route = activeRoute();
  const root = document.getElementById('budget-root');
  if (!root) return;

  for (const link of document.querySelectorAll('.nav-link')) {
    link.classList.toggle('active', link.getAttribute('data-route') === route);
  }

  if (route === 'ledger') root.innerHTML = renderLedgerView(state);
  else if (route === 'planner') root.innerHTML = renderPlannerView(state);
  else if (route === 'goals') root.innerHTML = renderGoalsAndDebtView(state);
  else if (route === 'bills') root.innerHTML = renderBillsView(state);
  else root.innerHTML = renderDashboardView(state);
}

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'add-tx-form') return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const payee = String(data.get('payee') || '').trim();
  const category = String(data.get('category') || '');
  const amount = Math.max(1, Number(data.get('amount')) || 0);
  const date = String(data.get('date') || '2026-11-26');
  if (!payee) return;

  const isIncome = category === 'Income';
  const matchedPlan = ENVELOPE_PLANS.find((p) => p.name === category);
  const bucket = isIncome ? 'Income' : matchedPlan?.bucket || 'Wants';

  state.transactions.unshift({
    id: `tx-${Date.now()}`,
    date,
    payee,
    category,
    bucket,
    amount,
    type: isIncome ? 'income' : 'expense',
  });
  saveStateSnapshot(state);
  render();
});

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');

  if (action === 'delete-tx') {
    const id = btn.getAttribute('data-id');
    state.transactions = state.transactions.filter((t) => t.id !== id);
    saveStateSnapshot(state);
    render();
  } else if (action === 'set-rule') {
    state.ruleSplit = {
      needs: Number(btn.getAttribute('data-needs')),
      wants: Number(btn.getAttribute('data-wants')),
      savings: Number(btn.getAttribute('data-savings')),
    };
    state.rulePreset = btn.getAttribute('data-preset') || 'custom';
    saveStateSnapshot(state);
    render();
  } else if (action === 'toggle-bill') {
    const id = btn.getAttribute('data-id');
    const bill = state.bills.find((b) => b.id === id);
    if (bill) bill.paid = !bill.paid;
    saveStateSnapshot(state);
    render();
  } else if (action === 'reset-demo-data') {
    state.transactions = INITIAL_TRANSACTIONS.map((t) => ({ ...t }));
    state.bills = RECURRING_BILLS.map((b) => ({ ...b }));
    state.plannerIncome = 7850;
    state.ruleSplit = { needs: 50, wants: 30, savings: 20 };
    state.rulePreset = '50-30-20';
    state.extraDebtPayment = 250;
    saveStateSnapshot(state);
    render();
  } else if (action === 'export-ledger-csv') {
    const rows = state.transactions.map((t) => [t.date, t.payee, t.category, t.bucket, t.type, t.amount]);
    downloadCsv('hearthledger-november-2026.csv', toCsvText(['Date', 'Payee', 'Category', 'Bucket', 'Type', 'Amount_USD'], rows));
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  const key = el.getAttribute('data-input');
  if (!key) return;

  if (key === 'extra-debt') {
    state.extraDebtPayment = Number(el.value) || 0;
    saveStateSnapshot(state);
    render();
  } else if (key === 'planner-income') {
    state.plannerIncome = Number(el.value) || 0;
    saveStateSnapshot(state);
    render();
  } else if (key === 'ledger-search') {
    state.ledgerSearch = el.value;
    const caret = el.selectionStart ?? el.value.length;
    render();
    const next = document.querySelector('[data-input="ledger-search"]');
    if (next) {
      next.focus();
      next.setSelectionRange(caret, caret);
    }
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.getAttribute('data-input') === 'ledger-bucket') {
    state.ledgerBucket = el.value;
    render();
  }
});

window.addEventListener('hashchange', render);
render();
