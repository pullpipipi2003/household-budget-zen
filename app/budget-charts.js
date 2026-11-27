export function renderCashflowHistoryChart(history) {
  const width = 640;
  const height = 240;
  const padL = 52;
  const padR = 16;
  const padT = 26;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxVal = 9000;

  const yAt = (v) => padT + plotH - (v / maxVal) * plotH;
  let grid = '';
  for (const step of [0, 3000, 6000, 9000]) {
    const y = yAt(step).toFixed(1);
    grid += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e7e0d2" stroke-dasharray="3,3"/>
      <text x="${padL - 8}" y="${Number(y) + 4}" text-anchor="end" font-size="10.5" fill="#556962">$${step / 1000}k</text>`;
  }

  const groupW = plotW / history.length;
  const bars = history
    .map((m, idx) => {
      const gx = padL + idx * groupW + groupW * 0.16;
      const barW = groupW * 0.22;
      const spent = m.needs + m.wants;

      const incH = (m.income / maxVal) * plotH;
      const spH = (spent / maxVal) * plotH;
      const savH = (m.savings / maxVal) * plotH;

      return `<g>
        <rect x="${gx.toFixed(1)}" y="${(padT + plotH - incH).toFixed(1)}" width="${barW.toFixed(1)}" height="${incH.toFixed(1)}" rx="3" fill="#14332b"/>
        <rect x="${(gx + barW + 3).toFixed(1)}" y="${(padT + plotH - spH).toFixed(1)}" width="${barW.toFixed(1)}" height="${spH.toFixed(1)}" rx="3" fill="#c2512d"/>
        <rect x="${(gx + (barW + 3) * 2).toFixed(1)}" y="${(padT + plotH - savH).toFixed(1)}" width="${barW.toFixed(1)}" height="${savH.toFixed(1)}" rx="3" fill="#2d6a4f"/>
        <text x="${(gx + barW * 1.6).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#556962">${m.month}</text>
      </g>`;
    })
    .join('');

  return `<svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="6-month household income, spending and savings">
    ${grid}
    ${bars}
    <g transform="translate(${padL}, 14)">
      <rect x="0" y="-8" width="10" height="8" rx="2" fill="#14332b"/>
      <text x="14" y="-1" font-size="11" font-weight="600" fill="#162a24">Net Income</text>
      <rect x="98" y="-8" width="10" height="8" rx="2" fill="#c2512d"/>
      <text x="112" y="-1" font-size="11" font-weight="600" fill="#162a24">Needs + Wants</text>
      <rect x="216" y="-8" width="10" height="8" rx="2" fill="#2d6a4f"/>
      <text x="230" y="-1" font-size="11" font-weight="600" fill="#162a24">Saved &amp; Debt Principal</text>
    </g>
  </svg>`;
}

export function renderRuleComparisonBars(ruleRows) {
  const width = 580;
  const height = 200;
  const padL = 218;
  const maxVal = Math.max(...ruleRows.flatMap((r) => [r.target, r.actual]), 1000) * 1.18;
  const maxBar = width - padL - 86;

  const rowsSvg = ruleRows
    .map((r, i) => {
      const y = 20 + i * 58;
      const targetW = (r.target / maxVal) * maxBar;
      const actualW = (r.actual / maxVal) * maxBar;
      return `<g transform="translate(0, ${y})">
        <text x="${padL - 10}" y="15" text-anchor="end" font-size="12" font-weight="700" fill="#162a24">${r.bucket} (${r.rulePct}%)</text>
        <rect x="${padL}" y="2" width="${targetW.toFixed(1)}" height="14" rx="3" fill="#dfd8cc"/>
        <text x="${(padL + targetW + 6).toFixed(1)}" y="13" font-size="10.5" fill="#556962">Target $${Math.round(r.target).toLocaleString()}</text>
        <rect x="${padL}" y="20" width="${actualW.toFixed(1)}" height="15" rx="3" fill="${r.color}"/>
        <text x="${(padL + actualW + 6).toFixed(1)}" y="31.5" font-size="11" font-weight="700" fill="${r.color}">Actual $${Math.round(r.actual).toLocaleString()}</text>
      </g>`;
    })
    .join('');

  return `<svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Target versus actual budget split">
    ${rowsSvg}
  </svg>`;
}
