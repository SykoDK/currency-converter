const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { timestamp, from, to, amount } = req.body || {};
  if (!from || !to) {
    return res.status(400).json({ error: 'from and to required' });
  }

  const { error } = await supabase
    .from('conversions')
    .insert({ timestamp, from, to, amount });

  if (error) return res.status(500).json({ error });

  res.status(201).json({ ok: true });
};
