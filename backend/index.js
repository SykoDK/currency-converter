import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import ratesRouter from './routes/rates.js';
import convertRouter from './routes/convert.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

app.use('/api/rates', ratesRouter);
app.use('/api/convert', convertRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
