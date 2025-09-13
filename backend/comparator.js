const Log = require('./models/log');
const nodemailer = require('nodemailer');  // Or use Slack webhook

const CONFIG = require('../config');  // e.g., { staleThreshold: 5*60*1000, discrepancyThreshold: 1, alertEmail: '...' }

async function compareAndLog(redstoneData, otherData) {
  const logs = [];
  for (const rs of redstoneData) {
    const other = otherData.find(o => o.symbol === rs.symbol);
    if (!other) continue;

    const now = new Date();
    const age = now - rs.timestamp;
    const isStale = age > CONFIG.staleThreshold;
    const fetchDelay = Date.now() - now;  // Simple latency
    const isDelayed = fetchDelay > CONFIG.delayThreshold || (now - other.timestamp) > CONFIG.updateInterval;
    const priceDiff = Math.abs((rs.price - other.price) / other.price * 100);
    const isDiscrepant = priceDiff > CONFIG.discrepancyThreshold;

    const log = new Log({
      timestamp: now,
      token: rs.symbol,
      redstonePrice: rs.price,
      redstoneTimestamp: rs.timestamp,
      otherPrice: other.price,
      otherTimestamp: other.timestamp,
      isStale,
      isDelayed,
      discrepancy: priceDiff,
      alertSent: false
    });
    logs.push(log.save());

    if (isStale || isDelayed || isDiscrepant) {
      await sendAlert(rs.symbol, { isStale, isDelayed, isDiscrepant, priceDiff });
      log.alertSent = true;
      log.save();
    }
  }
  return logs;
}

async function sendAlert(token, issues) {
  // Email example (commented out for now - requires email configuration)
  // let transporter = nodemailer.createTransporter({
  //   service: 'gmail',
  //   auth: { user: CONFIG.email.user, pass: CONFIG.email.pass }
  // });
  // await transporter.sendMail({
  //   to: CONFIG.alertEmail,
  //   subject: `Redstone Alert: ${token} Issue`,
  //   text: `Issues: ${JSON.stringify(issues)}`
  // });
  console.log(`Alert: ${token} - ${JSON.stringify(issues)}`);
  // Alternative: Slack webhook
  // await axios.post(CONFIG.slackWebhook, { text: `Alert: ${token} - ${issues}` });
}

module.exports = { compareAndLog };