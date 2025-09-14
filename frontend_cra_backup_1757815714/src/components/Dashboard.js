import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusCard from './StatusCard';
import PriceChart from './PriceChart';
import AlertList from './AlertList';
import LoadingSpinner from './LoadingSpinner';
import Logo from './Logo';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedToken, setSelectedToken] = useState('BTC');

  const tokens = ['BTC', 'ETH', 'USDC', 'USDT', 'BNB', 'ADA', 'SOL', 'MATIC', 'DOT', 'AVAX'];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Fetch logs for all tokens
      const apiBaseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
      const logsResponse = await axios.get(`${apiBaseUrl}/logs`);
      setLogs(logsResponse.data);

      // Fetch status for each token
      const statusPromises = tokens.map(async (token) => {
        try {
          const response = await axios.get(`${apiBaseUrl}/status/${token}`);
          return { token, data: response.data };
        } catch (error) {
          console.error(`Error fetching status for ${token}:`, error);
          return { token, data: null };
        }
      });

      const statusResults = await Promise.all(statusPromises);
      const statusMap = {};
      statusResults.forEach(({ token, data }) => {
        statusMap[token] = data;
      });
      setStatusData(statusMap);

      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data from server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getTokenLogs = (token) => {
    return logs.filter(log => log.token === token);
  };

  if (loading && logs.length === 0) {
    return (
      <div className="dashboard">
        <div className="loading">
          <LoadingSpinner size="large" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <Logo size={50} className="header-logo" />
          <h1>Redstone Price Monitor</h1>
        </div>
        <button 
          onClick={() => fetchData(true)} 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          disabled={refreshing}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="dashboard-content">
        <div className="status-section">
          <h2>Token Status</h2>
          <div className="status-grid">
            {tokens.map(token => (
              <StatusCard
                key={token}
                token={token}
                redstone={statusData[token]?.redstone?.[0]}
                other={statusData[token]?.other?.[0]}
                issues={{
                  isStale: statusData[token]?.issues?.isStale || false,
                  isDelayed: statusData[token]?.issues?.isDelayed || false,
                  isDiscrepant: statusData[token]?.issues?.isDiscrepant || false,
                  discrepancy: statusData[token]?.issues?.discrepancy || 0
                }}
              />
            ))}
          </div>
        </div>

        <div className="chart-section">
          <div className="token-selector">
            <label>Select Token: </label>
            <select 
              value={selectedToken} 
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
          <PriceChart 
            data={getTokenLogs(selectedToken)} 
            token={selectedToken}
          />
        </div>

        <div className="alerts-section">
          <AlertList logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
