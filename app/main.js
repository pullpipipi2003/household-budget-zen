// Main budget controller and view presenter
import { SCENARIOS } from './data.js';
import { renderCategoryChart } from './charts.js';

let currentScenario = 'family4';
let currentView = 'dashboard';

const profileSelect = document.getElementById('profileSelect');
const navButtons = document.querySelectorAll('.nav-btn');
const summaryGrid = document.getElementById('summaryGrid');
const chartSection = document.getElementById('chartSection');
const ledgerSection = document.getElementById('ledgerSection');

function render() {
  const s = SCENARIOS[currentScenario];
  if (!s) return;

  // 1. Render Summary Metric Cards
  summaryGrid.innerHTML = s.cards.map(c => `
    <div class="card">
      <div class="card-title">${c.title}</div>
      <div class="card-val">${c.value}</div>
      <div class="card-meta"><span>${c.meta}</span></div>
    </div>
  `).join('');

  // 2. Render Views
  if (currentView === 'dashboard' || currentView === 'categories') {
    chartSection.innerHTML = renderCategoryChart(s.categories, s.income);
    ledgerSection.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">Detailed Monthly Budget Allocations</h3>
        <p class="panel-subtitle">Target envelope amounts</p>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>Category</th><th>Class</th><th>Monthly Budget</th><th>Share</th></tr>
        </thead>
        <tbody>
          ${s.categories.map(c => `
            <tr>
              <td><strong>${c.name}</strong></td>
              <td><span class="tag tag-${c.group}">${c.group.toUpperCase()}</span></td>
              <td>$${c.amount.toLocaleString()}</td>
              <td>${Math.round((c.amount / s.income) * 100)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (currentView === 'transactions') {
    chartSection.innerHTML = renderCategoryChart(s.categories, s.income);
    ledgerSection.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">Recent Cash Flow Ledger</h3>
        <p class="panel-subtitle">Audited monthly debit &amp; credit transactions</p>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr>
        </thead>
        <tbody>
          ${s.ledger.map(l => `
            <tr>
              <td>${l.date}</td>
              <td><strong>${l.item}</strong></td>
              <td><span class="tag tag-${l.group}">${l.category}</span></td>
              <td style="font-weight:600; color:${l.amount.startsWith('+') ? '#10b981' : '#f0f4fd'};">${l.amount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (currentView === 'goals') {
    chartSection.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">Emergency Fund &amp; Capital Accumulation</h3>
        <p class="panel-subtitle">Current reserves: $${s.emergencyFund.toLocaleString()} &bull; Burn rate: $${s.monthlyBurn.toLocaleString()}/mo</p>
      </div>
      <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; padding:16px; border-radius:6px; color:#f0f4fd;">
        <h4 style="color:#10b981; margin-bottom:8px;">Financial Runway Status: Healthy (>${s.cards[4].value})</h4>
        <p>At the current net saving rate of $${s.savingsTarget.toLocaleString()}/month, your emergency cash reserves cover over ${s.cards[4].value} of essential baseline obligations with zero debt accumulation.</p>
      </div>
    `;
    ledgerSection.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">Active Wealth Accumulation Vehicles</h3>
        <p class="panel-subtitle">Automated monthly allocations</p>
      </div>
      <table class="data-table">
        <thead><tr><th>Target Goal</th><th>Vehicle</th><th>Monthly Contribution</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Retirement Freedom</td><td>Broad-Market Low-Fee Index Funds</td><td>$1,500.00</td><td><span class="tag tag-savings">ACTIVE</span></td></tr>
          <tr><td>Family Safety Net</td><td>High-Yield Liquid Savings (4.75% APY)</td><td>$700.00</td><td><span class="tag tag-savings">ACTIVE</span></td></tr>
          <tr><td>Major Renovation Fund</td><td>Short-Term Treasury Bills</td><td>$500.00</td><td><span class="tag tag-savings">ACTIVE</span></td></tr>
        </tbody>
      </table>
    `;
  }
}

profileSelect.addEventListener('change', (e) => {
  currentScenario = e.target.value;
  render();
});

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    render();
  });
});

const params = new URLSearchParams(window.location.search);
if (params.get('scenario')) currentScenario = params.get('scenario');
if (params.get('view')) {
  currentView = params.get('view');
  navButtons.forEach(b => {
    if (b.dataset.view === currentView) b.classList.add('active');
    else b.classList.remove('active');
  });
}

render();
window.__shotReady = true;
