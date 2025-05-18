import { EXR_API_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('convertForm');
  const result = document.getElementById('result');
  const popSection = document.getElementById('popular-box');
  const popGrid = document.getElementById('popular-grid');

  const qs = new URLSearchParams(location.search);
  if (qs.has('from')) form.from.value = qs.get('from').toUpperCase();
  if (qs.has('to')) form.to.value = qs.get('to').toUpperCase();
  if (qs.has('amount')) form.amount.value = qs.get('amount');

  buildPopular();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const { from, to, amount } = Object.fromEntries(new FormData(form));

    const apiURL = EXR_API_KEY
      ? `https://api.apilayer.com/exchangerates_data/convert`
      : `https://api.exchangerate.host/convert`;

    const url = `${apiURL}?from=${from}&to=${to}&amount=${amount}`;
    const headers = EXR_API_KEY ? { apikey: EXR_API_KEY } : {};

    const { result: converted, info } = await fetch(url, { headers })
      .then(r => r.json());

    result.innerHTML =
      `${amount} ${from} x ${info.rate.toFixed(6)} = ` +
      `<strong>${converted.toFixed(2)} ${to}</strong>`;

    fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now(), from, to, amount })
    }).catch(() => {});
  });

  async function buildPopular() {
    if (!popSection || !popGrid) return;

    const popular = await fetch('/api/convert/popular?limit=8')
      .then(r => r.json())
      .catch(() => []);

    if (!popular.length) {
      popSection.style.display = 'none';
      return;
    }

    popular.forEach(({ from, to }) => {
      const btn = document.createElement('button');
      btn.dataset.from = from;
      btn.dataset.to = to;
      btn.innerHTML =
        `<span>1&nbsp;${from}&nbsp;to&nbsp;${to}</span>` +
        `<span class="chevron">></span>`;
      popGrid.appendChild(btn);
    });

    popGrid.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      form.from.value = b.dataset.from;
      form.to.value = b.dataset.to;
      form.amount.value = 1;
      form.requestSubmit();
      window.scrollTo({ top: form.offsetTop - 40, behavior: 'smooth' });
    });
  }
});
