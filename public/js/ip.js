import { IPSTACK_KEY } from './config.js';

export async function getLocalCurrency() {
  try {
    const res = await fetch(`https://api.ipstack.com/check?access_key=${IPSTACK_KEY}`);
    const data = await res.json();
    return data.currency?.code || 'USD';
  } catch (e) {
    return 'USD';
  }
}
