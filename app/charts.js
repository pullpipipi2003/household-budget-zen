// Zero-dependency SVG visual charts for spending allocation and savings progress
export function renderCategoryChart(categories, totalIncome) {
  const needsTotal = categories.filter(c => c.group === 'needs').reduce((sum, c) => sum + c.amount, 0);
  const wantsTotal = categories.filter(c => c.group === 'wants').reduce((sum, c) => sum + c.amount, 0);
  const savingsTotal = categories.filter(c => c.group === 'savings').reduce((sum, c) => sum + c.amount, 0);

  const needsPct = Math.round((needsTotal / totalIncome) * 100);
  const wantsPct = Math.round((wantsTotal / totalIncome) * 100);
  const savingsPct = Math.round((savingsTotal / totalIncome) * 100);

  return `
    <div class="panel-header">
      <h3 class="panel-title">50 / 30 / 20 Budget Rule Adherence</h3>
      <p class="panel-subtitle">Target: 50% Needs, 30% Wants, 20% Savings</p>
    </div>
    
    <div class="category-bar">
      <div class="cat-segment" style="width: ${needsPct}%; background: #3b82f6;" title="Needs: ${needsPct}%"></div>
      <div class="cat-segment" style="width: ${wantsPct}%; background: #f59e0b;" title="Wants: ${wantsPct}%"></div>
      <div class="cat-segment" style="width: ${savingsPct}%; background: #10b981;" title="Savings: ${savingsPct}%"></div>
    </div>

    <div style="display: flex; justify-content: space-around; font-size: 14px; text-align: center;">
      <div>
        <span style="color: #3b82f6; font-size: 20px; font-weight: 700;">${needsPct}%</span>
        <div style="color: #8c9cb8;">Essential Needs ($${needsTotal.toLocaleString()})</div>
      </div>
      <div>
        <span style="color: #f59e0b; font-size: 20px; font-weight: 700;">${wantsPct}%</span>
        <div style="color: #8c9cb8;">Discretionary Wants ($${wantsTotal.toLocaleString()})</div>
      </div>
      <div>
        <span style="color: #10b981; font-size: 20px; font-weight: 700;">${savingsPct}%</span>
        <div style="color: #8c9cb8;">Wealth &amp; Savings ($${savingsTotal.toLocaleString()})</div>
      </div>
    </div>
  `;
}
