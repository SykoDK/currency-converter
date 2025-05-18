import express from 'express';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { timestamp, from, to, amount } = req.body;

  const { error } = await supabase
    .from('conversions')
    .insert({ timestamp, from, to, amount });

  if (error) return res.status(500).json({ error });
  res.status(201).json({ ok: true });
});

router.get('/popular', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const { data, error } = await supabase
    .from('conversions')
    .select('from, to');

  if (error) return res.status(500).json({ error });

  const tally = {};
  data.forEach(({ from, to }) => {
    const key = `${from}-${to}`;
    tally[key] = (tally[key] || 0) + 1;
  });

  const popular = Object
    .entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [from, to] = key.split('-');
      return { from, to, count };
    });

  res.json(popular);
});

export default router;
