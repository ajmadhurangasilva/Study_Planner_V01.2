import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, User, Lock, Mail, GraduationCap, Hash, ArrowRight, Loader } from 'lucide-react';
import { registerUser, loginUser } from '../utils/authStore';

// ─── Reusable Input Field ────────────────────────────────────────────────────
function AuthInput({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, rightElement }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
          autoComplete="off"
          style={{ paddingLeft: Icon ? '2.5rem' : '1rem', paddingRight: rightElement ? '2.8rem' : '1rem' }}
        />
        {rightElement && (
          <span style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            {rightElement}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Auth Page ──────────────────────────────────────────────────────────
export default function AuthPage({ onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDegree, setRegDegree] = useState('');
  const [regSemester, setRegSemester] = useState('');

  const switchTab = (t) => {
    setTab(t);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser(loginUsername, loginPassword);
    setLoading(false);
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    setLoading(true);
    const result = await registerUser(regUsername, regPassword, {
      fullName: regFullName,
      email: regEmail,
      degree: regDegree,
      semester: regSemester,
    });
    setLoading(false);
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated gradient blobs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        animation: 'blobFloat 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '55vw', height: '55vw', maxWidth: '650px', maxHeight: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
        animation: 'blobFloat 10s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        {/* Logo + App Name */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          }}>
            <BookOpen size={30} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Study Planner</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Time Allocation System
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card" style={{
          padding: '2.2rem',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          borderRadius: 'var(--radius-lg)'
        }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex', gap: '0.3rem',
            background: 'var(--bg-input)', borderRadius: '9999px',
            padding: '0.3rem', marginBottom: '1.8rem',
            border: '1.5px solid var(--border-color)',
          }}>
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, padding: '0.55rem',
                  borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: tab === t ? 'var(--gradient-main)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-secondary)',
                  boxShadow: tab === t ? '0 2px 12px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} id="login-form">
              <AuthInput
                id="login-username"
                label="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="your_username"
                icon={User}
              />
              <AuthInput
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                rightElement={
                  <span onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                }
              />

              {error && (
                <div style={{
                  padding: '0.7rem 0.9rem', borderRadius: '8px', marginBottom: '1rem',
                  background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f87171', fontSize: '0.83rem',
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                id="login-submit-btn"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.25rem' }}
              >
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1.2rem' }}>
                Don't have an account?{' '}
                <span onClick={() => switchTab('register')} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>
                  Create one free
                </span>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} id="register-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <AuthInput
                    id="reg-username"
                    label="Username *"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. alice123"
                    icon={User}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <AuthInput
                    id="reg-fullname"
                    label="Full Name"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Alice Perera"
                    icon={User}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <AuthInput
                    id="reg-email"
                    label="Email Address"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alice@university.lk"
                    icon={Mail}
                  />
                </div>
                <div>
                  <AuthInput
                    id="reg-degree"
                    label="Degree / Programme"
                    value={regDegree}
                    onChange={(e) => setRegDegree(e.target.value)}
                    placeholder="e.g. BSc CS"
                    icon={GraduationCap}
                  />
                </div>
                <div>
                  <AuthInput
                    id="reg-semester"
                    label="Current Semester"
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    placeholder="e.g. Semester 3"
                    icon={Hash}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <AuthInput
                    id="reg-password"
                    label="Password * (min 6 chars)"
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    rightElement={
                      <span onClick={() => setShowPassword((p) => !p)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    }
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <AuthInput
                    id="reg-confirm"
                    label="Confirm Password *"
                    type={showConfirm ? 'text' : 'password'}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    rightElement={
                      <span onClick={() => setShowConfirm((p) => !p)}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    }
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '0.7rem 0.9rem', borderRadius: '8px', marginBottom: '1rem',
                  background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f87171', fontSize: '0.83rem',
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                id="register-submit-btn"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</> : <>Create Account <ArrowRight size={16} /></>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1.2rem' }}>
                Already have an account?{' '}
                <span onClick={() => switchTab('login')} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>

        {/* Privacy note */}
        <p style={{ textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.5 }}>
          🔒 All data stays on this device. Nothing is sent to any server.
        </p>
      </div>

      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
