module.exports = {
    staleThreshold: 5 * 60 * 1000,  // 5 min
    delayThreshold: 1000,  // 1 sec fetch delay
    updateInterval: 5 * 60 * 1000,  // Expected update every 5 min
    discrepancyThreshold: 1,  // 1% price diff
    alertEmail: 'your@email.com',
    // Add Slack webhook if needed
  };