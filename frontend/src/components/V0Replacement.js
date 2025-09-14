import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const TOKENS = ['BTC', 'ETH', 'USDC', 'USDT', 'BNB', 'ADA', 'SOL', 'MATIC', 'DOT', 'AVAX'];

export default function V0Replacement() {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = useMemo(() => (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'), []);

  async function fetchAll(isRefresh) {
    try {
      setError('');
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [logsRes, statusRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/logs`),
        axios.get(`${apiBaseUrl}/status/${selectedToken}`)
      ]);
      setLogs(logsRes.data || []);
      setStatus(statusRes.data || null);
    } catch (err) {
      setError('Failed to fetch from backend');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <CardHeader>
          <CardTitle>Redstone Monitor</CardTitle>
          <CardDescription>Live token status and recent logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <label htmlFor="token" style={{ fontWeight: 600 }}>Token</label>
            <select id="token" value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
              {TOKENS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Button onClick={() => fetchAll(true)} disabled={refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div>Loading…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Current Status: {selectedToken}</CardTitle>
                  <CardDescription>Redstone vs Other Source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                      <strong>Redstone</strong>: {status?.redstone?.[0]?.price ?? '—'} at {status?.redstone?.[0]?.timestamp ? new Date(status.redstone[0].timestamp).toLocaleTimeString() : '—'}
                    </div>
                    <div>
                      <strong>Other</strong>: {status?.other?.[0]?.price ?? '—'} at {status?.other?.[0]?.timestamp ? new Date(status.other[0].timestamp).toLocaleTimeString() : '—'}
                    </div>
                    <div>
                      <strong>Issues</strong>:
                      <ul style={{ margin: '6px 0 0 18px' }}>
                        <li>Stale: {String(status?.issues?.isStale ?? false)}</li>
                        <li>Delayed: {String(status?.issues?.isDelayed ?? false)}</li>
                        <li>Discrepant: {String(status?.issues?.isDiscrepant ?? false)}</li>
                        <li>Discrepancy %: {status?.issues?.discrepancy ?? 0}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                  <CardDescription>Last 100 entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ maxHeight: 360, overflow: 'auto' }}>
                    {(logs || []).filter((l) => l.token === selectedToken).slice(0, 20).map((l, idx) => (
                      <div key={idx} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <strong>{new Date(l.timestamp).toLocaleString()}</strong>
                          <span>RS: {l.redstonePrice}</span>
                          <span>OT: {l.otherPrice}</span>
                          <span>Δ%: {l.discrepancy?.toFixed?.(2) ?? l.discrepancy}</span>
                          {(l.isStale || l.isDelayed || (l.discrepancy ?? 0) > 0) && (
                            <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: 600 }}>Issue</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!logs || logs.length === 0) && (
                      <div>No logs yet. Please wait a minute for polling…</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

