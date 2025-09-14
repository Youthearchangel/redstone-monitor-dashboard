import React from 'react';

const AlertList = ({ logs }) => {
  const getAlertType = (log) => {
    if (log.isStale) return 'stale';
    if (log.isDelayed) return 'delayed';
    if (log.discrepancy > 1) return 'discrepancy';
    return 'normal';
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'stale': return '⚠️';
      case 'delayed': return '⏰';
      case 'discrepancy': return '📊';
      default: return '✅';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="alert-list">
        <h3>Recent Activity</h3>
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="alert-list">
      <h3>Recent Activity</h3>
      <div className="alert-items">
        {logs.slice(0, 10).map((log, index) => {
          const alertType = getAlertType(log);
          return (
            <div key={index} className={`alert-item alert-${alertType}`}>
              <div className="alert-header">
                <span className="alert-icon">{getAlertIcon(alertType)}</span>
                <span className="alert-token">{log.token}</span>
                <span className="alert-time">{formatTime(log.timestamp)}</span>
              </div>
              <div className="alert-details">
                <span>Redstone: ${log.redstonePrice?.toFixed(2)}</span>
                <span>CoinGecko: ${log.otherPrice?.toFixed(2)}</span>
                {log.discrepancy > 0 && (
                  <span className="discrepancy">Diff: {log.discrepancy.toFixed(2)}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertList;
