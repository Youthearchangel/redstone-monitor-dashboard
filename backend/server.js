const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const { fetchRedstonePrices, fetchOtherPrices } = require('./fetcher');
const { compareAndLog } = require('./comparator');
const Log = require('./models/log');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/redstone-monitor';
mongoose.connect(mongoUri);

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint for dashboard data
app.get('/api/logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

app.get('/api/status/:token', async (req, res) => {
  // Fetch live data for real-time status
  const token = req.params.token;
  const coinGeckoId = TOKEN_MAPPING[token];
  
  if (!coinGeckoId) {
    return res.status(400).json({ error: 'Unsupported token' });
  }
  
  const redstone = await fetchRedstonePrices([token]);
  const other = await fetchOtherPrices([coinGeckoId]);
  const comparison = await compareAndLog(redstone, other);  // But don't alert on UI fetch
  res.json({ redstone, other, issues: comparison[0] ? comparison[0].toObject() : {} });
});

app.listen(3001, () => console.log('Backend on port 3001'));

// Supported tokens mapping
const TOKEN_MAPPING = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'ADA': 'cardano',
  'SOL': 'solana',
  'MATIC': 'matic-network',
  'DOT': 'polkadot',
  'AVAX': 'avalanche-2'
};

// Poll every 1 minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Polling...');
  const redstoneTokens = Object.keys(TOKEN_MAPPING);
  const coinGeckoIds = Object.values(TOKEN_MAPPING);
  
  const rs = await fetchRedstonePrices(redstoneTokens);
  const other = await fetchOtherPrices(coinGeckoIds);
  await compareAndLog(rs, other);
});