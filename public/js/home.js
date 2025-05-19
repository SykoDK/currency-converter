import { EXR_API_KEY } from './config.js';
import { getLocalCurrency } from './ip.js';

let chart;
let currentBase;
let currentRange = '1Y';

const RANGE_MAP = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365};

document.addEventListener('DOMContentLoaded', async () => {
  const convertBtn = document.getElementById('convert-btn');
  const scaleRow = document.getElementById('scale-controls');
  const tbody = document.getElementById('quote-body');

  const LOCAL = await getLocalCurrency();
  const PAIRS = [LOCAL, 'EUR', 'JPY', 'GBP', 'CHF', 'CNY', 'AUD'];

  const headers = { apikey: EXR_API_KEY };
  const today = await fetch(
    'https://api.apilayer.com/exchangerates_data/latest?base=USD',
    { headers }
  ).then(r => r.json());

  const yDate = new Date();
  yDate.setDate(yDate.getDate() - 1);
  const yURL = `https://api.apilayer.com/exchangerates_data/${yDate
    .toISOString().slice(0, 10)}?base=USD`;

  const yest = await fetch(yURL, { headers }).then(r => r.json());

  PAIRS.forEach(code => {
    if (code === 'USD') return;
    const last = 1 / today.rates[code];
    const prev = 1 / yest.rates[code];
    const change = last - prev;
    const pct = (change / prev) * 100;

    const tr = tbody.insertRow();
    tr.dataset.base = code;
    tr.innerHTML = `
      <td>${code}/USD</td>
      <td>${last.toFixed(4)}</td>
      <td class="${change >= 0 ? 'up' : 'down'}">${change.toFixed(4)}</td>
      <td class="${change >= 0 ? 'up' : 'down'}">${pct.toFixed(2)}%</td>`;
  });

  const firstRow = tbody.querySelector('tr');
  currentBase = firstRow.dataset.base;
  firstRow.classList.add('selected');
  updateConvertLink(convertBtn);
  await drawChart(currentBase, currentRange);

  tbody.addEventListener('click', async e => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
    tr.classList.add('selected');

    currentBase = tr.dataset.base;
    updateConvertLink(convertBtn);
    await drawChart(currentBase, currentRange);
  });

  scaleRow.addEventListener('click', e => {
    const btn = e.target.closest('button[data-range]');
    if (!btn) return;
    scaleRow.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRange = btn.dataset.range;
    drawChart(currentBase, currentRange);
  });

  convertBtn.addEventListener('click', () => {
    if (convertBtn.dataset.url) location.href = convertBtn.dataset.url;
  });
});

async function drawChart(baseCode, rangeKey) {
  const days = RANGE_MAP[rangeKey];
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const url = `https://api.apilayer.com/exchangerates_data/timeseries` +
    `?start_date=${start.toISOString().slice(0, 10)}` +
    `&end_date=${end.toISOString().slice(0, 10)}` +
    `&base=${baseCode}&symbols=USD`;

  const { rates } = await fetch(url, { headers: { apikey: EXR_API_KEY } })
    .then(r => r.json());

  if (!rates) {
    console.error('Timeseries API error');
    return;
  }

  const labels = Object.keys(rates).sort();
  const values = labels.map(d => rates[d].USD);

  const ctx = document.getElementById('pairChart').getContext('2d');
  chart?.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: `${baseCode}/USD`, data: values, tension: .25 }]
    },
    options: {
      maintainAspectRatio: false,
      aspectRatio: 2.4,
      scales: { x: { ticks: { maxTicksLimit: 12 } } }
    }
  });

  const latestISO = labels[labels.length - 1];              
  const latestFmt = dayjs(latestISO).format('MMM D, YYYY');

  document.getElementById('pair-label').textContent =
    `${baseCode}/USD — last ${rangeKey} (through ${latestFmt})`;
}

function updateConvertLink(btn) {
  const url = `converter.html?from=${currentBase}&to=USD`;
  btn.dataset.url = url;
  btn.textContent = `Convert ${currentBase} → USD`;
}
