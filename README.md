# Redstone Price Monitor Dashboard

A comprehensive monitoring dashboard for comparing Redstone Protocol price feeds with other data sources (CoinGecko) to detect discrepancies, stale data, and delays.

## Features

- **Real-time Price Monitoring**: Compare Redstone Protocol prices with CoinGecko
- **Multi-token Support**: Monitor BTC, ETH, USDC, USDT, BNB, ADA, SOL, MATIC, DOT, AVAX
- **Visual Dashboard**: Beautiful, responsive React frontend with charts and status cards
- **Alert System**: Automatic detection of stale data, delays, and price discrepancies
- **Docker Support**: Full containerized deployment with Docker Compose
- **MongoDB Integration**: Persistent logging of price comparisons and alerts

## Architecture

### Backend (Node.js/Express)
- **Fetcher**: Retrieves prices from Redstone Protocol and CoinGecko APIs
- **Comparator**: Compares prices and detects issues (stale data, delays, discrepancies)
- **Models**: MongoDB schema for logging price data and alerts
- **Server**: Express API with cron job for automated monitoring

### Frontend (React)
- **Dashboard**: Main monitoring interface
- **Status Cards**: Real-time token status display
- **Price Charts**: Historical price comparison visualization
- **Alert List**: Recent activity and issue tracking

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MongoDB (or use Docker)

### Option 1: Docker Deployment (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd redstone-monitor-dashboard
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the dashboard:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

### Option 2: Local Development

1. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
```

3. Start the backend:
```bash
cd backend
npm start
```

4. Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

## Configuration

### Backend Configuration (`config.js`)
```javascript
module.exports = {
    staleThreshold: 5 * 60 * 1000,  // 5 minutes
    delayThreshold: 1000,           // 1 second
    updateInterval: 5 * 60 * 1000,  // 5 minutes
    discrepancyThreshold: 1,        // 1% price difference
    alertEmail: 'your@email.com',   // Email for alerts
};
```

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost/redstone-monitor)
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### GET /api/logs
Returns recent price comparison logs.

### GET /api/status/:token
Returns real-time status for a specific token.

## Monitoring Features

### Stale Data Detection
Monitors if Redstone price data is older than the configured threshold.

### Delay Detection
Checks if price updates are delayed beyond expected intervals.

### Price Discrepancy Detection
Compares prices between sources and alerts on significant differences.

### Automated Alerts
- Console logging (default)
- Email notifications (configurable)
- Slack webhook support (configurable)

## Development

### Project Structure
```
redstone-monitor-dashboard/
├── backend/
│   ├── server.js          # Express server
│   ├── fetcher.js         # Price data fetching
│   ├── comparator.js      # Price comparison logic
│   ├── models/
│   │   └── log.js        # MongoDB schema
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   └── App.js        # Main app
│   └── Dockerfile
├── docker-compose.yml
└── config.js
```

### Adding New Tokens
1. Update `TOKEN_MAPPING` in `backend/server.js`
2. Add token to `tokens` array in `frontend/src/components/Dashboard.js`
3. Ensure CoinGecko ID is correct

### Customizing Alerts
Modify the `sendAlert` function in `backend/comparator.js` to add:
- Email notifications
- Slack webhooks
- Discord notifications
- SMS alerts

## Deployment

### Production Deployment
1. Set environment variables:
```bash
export MONGODB_URI=mongodb://your-mongodb-host:27017/redstone-monitor
export NODE_ENV=production
```

2. Build and deploy:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Scaling
- Use MongoDB Atlas for database scaling
- Deploy multiple backend instances behind a load balancer
- Use CDN for frontend assets

## Monitoring & Maintenance

### Health Checks
- Backend health check: `GET /api/logs`
- Frontend health: Nginx status page

### Logs
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`
- MongoDB logs: `docker-compose logs mongodb`

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Common Issues

1. **Backend can't connect to MongoDB**
   - Check MongoDB is running
   - Verify connection string in environment variables

2. **Frontend can't reach backend**
   - Check backend is running on port 3001
   - Verify CORS configuration

3. **No price data**
   - Check Redstone API availability
   - Verify CoinGecko API limits
   - Check network connectivity

### Debug Mode
Set `NODE_ENV=development` for detailed logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for error details
