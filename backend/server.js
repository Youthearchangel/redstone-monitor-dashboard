const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const { fetchRedstonePrices, fetchOtherPrices } = require('./fetcher');
const { compareAndLog } = require('./comparator');
const Log = require('./models/log');

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

async function startServer() {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/redstone-monitor';

  if (process.env.USE_IN_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri('redstone-monitor');
    console.log('Using in-memory MongoDB instance');
  }

  await mongoose.connect(mongoUri);

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

  // Poll every 1 minute
  cron.schedule('*/1 * * * *', async () => {
    console.log('Polling...');
    const redstoneTokens = Object.keys(TOKEN_MAPPING);
    const coinGeckoIds = Object.values(TOKEN_MAPPING);
    
    const rs = await fetchRedstonePrices(redstoneTokens);
    const other = await fetchOtherPrices(coinGeckoIds);
    await compareAndLog(rs, other);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});