const redstone = require('redstone-api');
const axios = require('axios');

async function fetchRedstonePrices(tokens = ['BTC', 'ETH']) {
  try {
    const prices = await redstone.getPrice(tokens);
    return Object.entries(prices).map(([symbol, data]) => ({
      symbol,
      price: data.value,
      timestamp: new Date(data.timestamp),
      provider: data.provider
    }));
  } catch (error) {
    console.error('Redstone fetch error:', error);
    return [];
  }
}

async function fetchOtherPrices(tokens = ['bitcoin', 'ethereum']) {  // CoinGecko uses lowercase
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: tokens.join(','),
        vs_currencies: 'usd',
        include_24hr_change: false
      }
    });
    return Object.entries(response.data).map(([id, data]) => {
      const symbol = id.toUpperCase();  // Map back to BTC/ETH
      return {
        symbol,
        price: data.usd,
        timestamp: new Date()  // CoinGecko doesn't provide exact timestamp; use fetch time
      };
    });
  } catch (error) {
    console.error('Other source fetch error:', error);
    return [];
  }
}

module.exports = { fetchRedstonePrices, fetchOtherPrices };