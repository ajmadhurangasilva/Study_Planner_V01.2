import React, { useState } from 'react';
import { BookOpen, Home, Calendar, Clock, BarChart3, Sun, Moon, Download, RotateCcw, User, LogOut, Bell } from 'lucide-react';
import { exportToICalendar, printSchedule, exportPlanJSON } from '../utils/exportUtils';
import ProfileModal from './ProfileModal';

export default function Navbar({ currentStep, setCurrentStep, theme, setTheme, onResetData, planResult, currentUser, onLogout, onUpdateUser }) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const avatarInitials = currentUser
    ? (currentUser.profile?.fullName || currentUser.username || 'U')
        .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  const displayName = currentUser?.profile?.fullName || currentUser?.username || '';

  const navItems = [
    { step: 0, label: 'Home', icon: Home, id: 'nav-home-btn' },
    { step: 1, label: '1. Modules', icon: BookOpen, id: 'nav-modules-btn' },
    { step: 2, label: '2. Free Time', icon: Clock, id: 'nav-freetime-btn' },
    { step: 3, label: '3. Monthly Plan', icon: Calendar, id: 'nav-schedule-btn' },
    { step: 4, label: '4. Analytics', icon: BarChart3, id: 'nav-analytics-btn' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        padding: '0.85rem 2rem',
        boxShadow: 'var(--shadow-sm)'
      }} className="no-print">
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          {/* Brand Logo & Title */}
          <div
            onClick={() => setCurrentStep(0)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)'
            }}>
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                Study Planner
              </h1>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                Smart Time Allocation
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Pill Capsule Group) */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-input)',
            padding: '0.35rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap'
          }}>
            {navItems.map(({ step, label, icon: Icon, id }) => {
              const isActive = currentStep === step;
              return (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  id={id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
                  }}
                >
                  <Icon size={15} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User & Quick Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Notification Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-secondary"
                title="Notifications"
                style={{ padding: '0.65rem', borderRadius: '50%', position: 'relative' }}
              >
                <Bell size={18} color="var(--accent-primary)" />
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: 'var(--accent-rose)', border: '2px solid #fff'
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '115%', right: 0, width: '290px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '1rem',
                  boxShadow: 'var(--shadow-lg)', zIndex: 200
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Notifications</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Mark read</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'var(--accent-light-blue)' }}>
                      📌 <strong>Study Reminder:</strong> Scheduled focus session for today.
                    </div>
                    <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)' }}>
                      🎉 <strong>SLQF Engine:</strong> Monthly schedule target generated.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary"
              title="Toggle Theme"
              id="theme-toggle-btn"
              style={{ padding: '0.65rem', borderRadius: '50%' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--accent-primary)" />}
            </button>

            {/* Export Menu Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn btn-secondary"
                id="export-menu-btn"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', borderRadius: '9999px' }}
              >
                <Download size={15} /> Export <span style={{ fontSize: '0.65rem' }}>▼</span>
              </button>

              {showExportMenu && (
                <div style={{
                  position: 'absolute', top: '115%', right: 0, width: '220px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)', zIndex: 200
                }}>
                  {[
                    { label: '📅 Google / iCal (.ics)', action: () => { exportToICalendar(planResult?.schedule, 'Monthly Study Plan'); setShowExportMenu(false); } },
                    { label: '🖨️ Print / Save PDF', action: () => { printSchedule(); setShowExportMenu(false); } },
                    { label: '💾 Export JSON Backup', action: () => { exportPlanJSON(planResult); setShowExportMenu(false); } },
                  ].map(({ label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        width: '100%', textAlign: 'left', padding: '0.65rem 0.85rem',
                        background: 'none', border: 'none', color: 'var(--text-primary)',
                        cursor: 'pointer', fontSize: '0.85rem', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.15s',
                        fontWeight: 500
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="btn btn-secondary"
              title="Reset Data"
              id="reset-data-btn"
              style={{ padding: '0.65rem', borderRadius: '50%' }}
            >
              <RotateCcw size={16} color="var(--text-muted)" />
            </button>

            {/* User Avatar Pill */}
            {currentUser && (
              <button
                onClick={() => setShowProfile(true)}
                id="user-profile-btn"
                title="Profile & Settings"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.55rem',
                  padding: '0.35rem 0.95rem 0.35rem 0.35rem',
                  background: 'var(--accent-light-blue)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '9999px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.25)'; }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {avatarInitials}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
              </button>
            )}

            {/* Quick Logout Button */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="btn btn-secondary"
                title="Log Out"
                id="quick-logout-btn"
                style={{ padding: '0.65rem', borderRadius: '50%' }}
              >
                <LogOut size={16} color="var(--text-muted)" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          currentUser={currentUser}
          onUpdateUser={(updatedUser) => { onUpdateUser(updatedUser); }}
          onLogout={() => { setShowProfile(false); onLogout(); }}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
