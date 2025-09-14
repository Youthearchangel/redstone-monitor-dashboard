import React from 'react';

const StatusCard = ({ token, redstone, other, issues }) => {
  const getStatusColor = () => {
    if (issues.isStale || issues.isDelayed || issues.isDiscrepant) {
      return 'status-error';
    }
    return 'status-ok';
  };

  const getStatusText = () => {
    if (issues.isStale) return 'Stale Data';
    if (issues.isDelayed) return 'Delayed Update';
    if (issues.isDiscrepant) return 'Price Discrepancy';
    return 'Healthy';
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`status-card ${getStatusColor()}`}>
      <div className="status-header">
        <h3>{token}</h3>
        <span className="status-badge">{getStatusText()}</span>
      </div>
      
      <div className="price-comparison">
        <div className="price-item">
          <label>Redstone</label>
          <div className="price-value">{formatPrice(redstone?.price)}</div>
          <div className="price-time">{formatTimestamp(redstone?.timestamp)}</div>
        </div>
        
        <div className="price-item">
          <label>CoinGecko</label>
          <div className="price-value">{formatPrice(other?.price)}</div>
          <div className="price-time">{formatTimestamp(other?.timestamp)}</div>
        </div>
      </div>

      {issues.discrepancy && (
        <div className="discrepancy-info">
          <span>Discrepancy: {issues.discrepancy.toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
