import React, { useState, useEffect } from 'react';
import { X, User, Mail, GraduationCap, Hash, Edit3, Save, LogOut, Trash2, Download, Shield, BookOpen, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { updateUserProfile, deleteAccount, getScopedStorage, logoutUser } from '../utils/authStore';

// ── Small Section Heading ─────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
      {children}
    </p>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: accent || 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color="var(--accent-primary)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{label}</p>
        <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Not provided</span>}
        </p>
      </div>
    </div>
  );
}

// ── Edit Input ────────────────────────────────────────────────────────────────
function EditField({ id, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}

// ── Main ProfileModal ─────────────────────────────────────────────────────────
export default function ProfileModal({ currentUser, onUpdateUser, onLogout, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'data'

  const [fullName, setFullName] = useState(currentUser.profile?.fullName || '');
  const [email, setEmail] = useState(currentUser.profile?.email || '');
  const [degree, setDegree] = useState(currentUser.profile?.degree || '');
  const [semester, setSemester] = useState(currentUser.profile?.semester || '');

  const [allData, setAllData] = useState({});

  useEffect(() => {
    if (currentUser) {
      const store = getScopedStorage(currentUser.username);
      Promise.resolve(store.getAll()).then((data) => {
        setAllData(data || {});
      });
    }
  }, [currentUser]);

  const moduleCount = (() => {
    const m = allData['modules'];
    return Array.isArray(m) ? m.length : 0;
  })();
  const completedCount = (() => {
    const c = allData['completed_tasks'];
    return Array.isArray(c) ? c.length : 0;
  })();
  const incompleteCount = (() => {
    const ic = allData['incomplete_tasks'];
    return Array.isArray(ic) ? ic.length : 0;
  })();

  const handleSaveProfile = () => {
    const result = updateUserProfile(currentUser.username, { fullName, email, degree, semester });
    if (result.success) {
      onUpdateUser(result.user);
      setEditMode(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      account: { username: currentUser.username, profile: currentUser.profile, exportedAt: new Date().toISOString() },
      data: allData,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-planner-${currentUser.username}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (confirmDelete) {
      deleteAccount(currentUser.username);
      logoutUser();
      onLogout();
    } else {
      setConfirmDelete(true);
    }
  };

  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown';

  const avatarInitials = (currentUser.profile?.fullName || currentUser.username || 'U')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 300 }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 400,
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-main)',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: '-12px 0 48px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.08) 100%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'var(--gradient-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
            }}>
              <User size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>My Profile</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Account & Data Settings</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} id="profile-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Avatar + Name */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem', textAlign: 'center',
          background: 'rgba(99,102,241,0.04)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem',
            fontSize: '1.5rem', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}>
            {avatarInitials}
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            {currentUser.profile?.fullName || currentUser.username}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>@{currentUser.username}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {currentUser.profile?.degree && (
              <span className="badge badge-indigo">{currentUser.profile.degree}</span>
            )}
            {currentUser.profile?.semester && (
              <span className="badge badge-emerald">{currentUser.profile.semester}</span>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: 'flex', gap: '0', borderBottom: '1px solid var(--border-color)', flexShrink: 0,
        }}>
          {[{ key: 'profile', label: '👤 Profile' }, { key: 'data', label: '💾 My Data' }].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              flex: 1, padding: '0.8rem', border: 'none', background: 'transparent',
              color: activeTab === key ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
              borderBottom: activeTab === key ? '2px solid var(--accent-primary)' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '0 1.5rem 1.5rem', overflowY: 'auto' }}>

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <>
              <SectionLabel>Personal Information</SectionLabel>

              {!editMode ? (
                <>
                  <InfoRow icon={User} label="Full Name" value={currentUser.profile?.fullName} />
                  <InfoRow icon={Mail} label="Email Address" value={currentUser.profile?.email} />
                  <InfoRow icon={GraduationCap} label="Degree / Programme" value={currentUser.profile?.degree} />
                  <InfoRow icon={Hash} label="Current Semester" value={currentUser.profile?.semester} />
                  <InfoRow icon={Shield} label="Member Since" value={memberSince} />

                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-secondary"
                    id="edit-profile-btn"
                    style={{ width: '100%', marginTop: '1.25rem' }}
                  >
                    <Edit3 size={15} /> Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <EditField id="edit-fullname" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                  <EditField id="edit-email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                  <EditField id="edit-degree" label="Degree / Programme" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. BSc Computer Science" />
                  <EditField id="edit-semester" label="Current Semester" value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="e.g. Semester 3" />

                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <button onClick={handleSaveProfile} className="btn btn-primary" id="save-profile-btn" style={{ flex: 1 }}>
                      <Save size={15} /> Save Changes
                    </button>
                    <button onClick={() => setEditMode(false)} className="btn btn-secondary" id="cancel-edit-btn" style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </>
              )}

              <SectionLabel>Account Actions</SectionLabel>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                id="logout-btn"
                style={{ width: '100%', marginBottom: '0.6rem' }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </>
          )}

          {/* ── Data Tab ── */}
          {activeTab === 'data' && (
            <>
              <SectionLabel>Stored Data Summary</SectionLabel>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
                {[
                  { label: 'Modules', value: moduleCount, icon: BookOpen, color: 'rgba(99,102,241,0.15)' },
                  { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'rgba(16,185,129,0.15)' },
                  { label: 'Incomplete', value: incompleteCount, icon: Clock, color: 'rgba(245,158,11,0.15)' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                      <Icon size={15} color="var(--accent-primary)" />
                    </div>
                    <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{value}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Data keys list */}
              <div style={{ background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Stored Keys</p>
                {Object.keys(allData).length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No data stored yet.</p>
                ) : (
                  Object.keys(allData).map((k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{k}</span>
                      <ChevronRight size={12} color="var(--text-muted)" />
                    </div>
                  ))
                )}
              </div>

              <SectionLabel>Backup & Export</SectionLabel>

              <button
                onClick={handleExport}
                className="btn btn-secondary"
                id="export-data-btn"
                style={{ width: '100%', marginBottom: '0.6rem' }}
              >
                <Download size={15} /> Export My Data (JSON)
              </button>

              <SectionLabel>Danger Zone</SectionLabel>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn btn-danger"
                  id="delete-account-btn"
                  style={{ width: '100%' }}
                >
                  <Trash2 size={15} /> Delete My Account & Data
                </button>
              ) : (
                <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#f87171', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    ⚠️ This will permanently delete your account, all modules, and all progress data from this device. This cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleDeleteAccount} className="btn btn-danger" id="confirm-delete-btn" style={{ flex: 1, fontSize: '0.85rem' }}>
                      <Trash2 size={14} /> Yes, Delete Everything
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="btn btn-secondary" id="cancel-delete-btn" style={{ flex: 1, fontSize: '0.85rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
