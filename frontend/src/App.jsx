import React, { useState, useEffect } from 'react';
import './index.css';

// ── API Helpers ───────────────────────────────────────────────────────────────
const API_BASE = '/api';

const apiFetch = async (endpoint, token, options = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API request failed');
  return data;
};

// ── Shared UI Components ──────────────────────────────────────────────────────
const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

// ── Login Component ───────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@zorvyn.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', null, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Zorvyn Portal</h2>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Dashboard Component ───────────────────────────────────────────────────────
const Dashboard = ({ token, user, onLogout }) => {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState({ anomalies: [], message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sumRes, recRes, insRes, anoRes] = await Promise.all([
          apiFetch('/dashboard/summary', token),
          apiFetch('/records?limit=8', token),
          apiFetch('/insights', token),
          apiFetch('/records/anomalies', token)
        ]);
        setSummary(sumRes.data);
        setRecords(recRes.data);
        setInsights(insRes.data.insights);
        setAnomalies(anoRes.data);
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="container" style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
        <h3 className="animate-slide-up" style={{ color: 'var(--text-muted)' }}>Syncing Financial Data...</h3>
      </div>
    );
  }

  return (
    <div className="container animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h1>📊 Zorvyn Finance</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn-secondary">Log Out</button>
        </div>
      </header>

      <main className="grid-cols-12">
        {/* Top Stats */}
        <div className="col-span-12 glass-panel animate-slide-up delay-100" style={{ padding: '2rem' }}>
          <div className="grid-cols-12">
            <div className="col-span-4" style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="text-muted" style={{ marginBottom: '0.5rem', fontSize:'0.9rem' }}>Total Income</div>
              <div className="text-success" style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatMoney(summary?.totalIncome)}</div>
            </div>
            <div className="col-span-4" style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="text-muted" style={{ marginBottom: '0.5rem', fontSize:'0.9rem' }}>Total Expenses</div>
              <div className="text-danger" style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatMoney(summary?.totalExpenses)}</div>
            </div>
            <div className="col-span-4" style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="text-muted" style={{ marginBottom: '0.5rem', fontSize:'0.9rem' }}>Net Balance</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatMoney(summary?.netBalance)}</div>
            </div>
          </div>
        </div>

        {/* Left Column (Records) */}
        <div className="col-span-8 animate-slide-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Recent Transactions</h3>
            {records.length === 0 ? <p className="text-muted">No records found.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {records.map(rec => (
                  <div key={rec._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <h4 style={{ textTransform: 'capitalize', marginBottom: '0.2rem' }}>{rec.category}</h4>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{formatDate(rec.date)} • {rec.notes || 'No description'}</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }} className={rec.type === 'income' ? 'text-success' : 'text-danger'}>
                      {rec.type === 'income' ? '+' : '-'}{formatMoney(rec.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Insights & Anomalies) */}
        <div className="col-span-4 animate-slide-up delay-300" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>AI Insights</h3>
            {insights.length === 0 ? <p className="text-muted">Everything looks stable.</p> : insights.map((msg, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(59,130,246,0.1)', borderLeft: '4px solid var(--accent)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                💡 {msg}
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Anomaly Detection</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{anomalies.message}</p>
            {anomalies.anomalies?.map(ano => (
              <div key={ano._id} style={{ padding: '1rem', background: 'rgba(245,158,11,0.1)', borderLeft: '4px solid var(--warning)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <strong>⚠️ {ano.category.toUpperCase()}</strong> — {formatMoney(ano.amount)}
                <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>Detected on {formatDate(ano.date)}</div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────────
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (jwt, userData) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <>
      <div className="ambient-glow" />
      {!token ? <Login onLogin={handleLogin} /> : <Dashboard token={token} user={user} onLogout={handleLogout} />}
    </>
  );
}

export default App;
