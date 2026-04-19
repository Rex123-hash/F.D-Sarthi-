import { FD_RATES, ratesUpdatedAt } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ rates: FD_RATES, updatedAt: ratesUpdatedAt });
}
