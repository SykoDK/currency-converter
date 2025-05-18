const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
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

  const popular = Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [from, to] = key.split('-');
      return { from, to, count };
    });

  res.json(popular);
};
