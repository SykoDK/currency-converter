import express from 'express';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const base = req.query.base?.toUpperCase() || 'USD';
  const { data, error } = await supabase
    .from('rates_cache')
    .select('*')
    .eq('base', base)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data?.rates || {});
});

router.post('/', async (req, res) => {
  const { base, rates } = req.body;
  const { error } = await supabase.from('rates_cache').insert({
    base,
    rates,
    fetched_at: new Date().toISOString()
  });
  if (error) return res.status(500).json({ error });
  res.status(201).json({ ok: true });
});

export default router;
