import React, { useState } from 'react';
import { BookOpen, Home, Calendar, Clock, BarChart3, Sun, Moon, Download, RotateCcw, User, LogOut, Bell, Check } from 'lucide-react';
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

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-card)',
        borderBottom: '1.5px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        padding: '0.85rem 1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }} className="no-print">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo & Title */}
          <div
            onClick={() => setCurrentStep(0)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'var(--gradient-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35)'
            }}>
              <BookOpen size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Study Planner</h1>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                Time Allocation System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-input)',
            padding: '0.35rem',
            borderRadius: '9999px',
            border: '1.5px solid var(--border-color)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setCurrentStep(0)}
              className={`btn ${currentStep === 0 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              id="nav-home-btn"
            >
              <Home size={15} /> Home
            </button>

            <button
              onClick={() => setCurrentStep(1)}
              className={`btn ${currentStep === 1 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              id="nav-modules-btn"
            >
              <BookOpen size={15} /> 1. Modules
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className={`btn ${currentStep === 2 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              id="nav-freetime-btn"
            >
              <Clock size={15} /> 2. Free Time
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className={`btn ${currentStep === 3 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              id="nav-schedule-btn"
            >
              <Calendar size={15} /> 3. Monthly Plan
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className={`btn ${currentStep === 4 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              id="nav-analytics-btn"
            >
              <BarChart3 size={15} /> 4. Analytics
            </button>
          </nav>

          {/* Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Notification Bell Dropdown (Inspired by Reference Design) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-secondary"
                title="Notifications"
                style={{ padding: '0.65rem', borderRadius: '50%', position: 'relative' }}
              >
                <Bell size={18} color="#2563eb" />
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: '#f43f5e', border: '2px solid #fff'
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '115%', right: 0, width: '280px',
                  background: 'var(--bg-card)', border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '1rem',
                  boxShadow: 'var(--shadow-lg)', zIndex: 200
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Notifications</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Mark read</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(37,99,235,0.06)' }}>
                      📌 <strong>Study Reminder:</strong> CS201 Algorithms block scheduled for today.
                    </div>
                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16,185,129,0.06)' }}>
                      🎉 <strong>SLQF Target:</strong> Monthly workload plan successfully computed.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary"
              title="Toggle Light/Dark Theme"
              id="theme-toggle-btn"
              style={{ padding: '0.65rem', borderRadius: '50%' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#2563eb" />}
            </button>

            {/* Export Menu Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn btn-secondary"
                id="export-menu-btn"
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <Download size={16} /> Export <span style={{ fontSize: '0.7rem' }}>▼</span>
              </button>

              {showExportMenu && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, width: '210px',
                  background: 'var(--bg-main)', border: '1px solid var(--border-color)',
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
                        width: '100%', textAlign: 'left', padding: '0.6rem 0.8rem',
                        background: 'none', border: 'none', color: 'var(--text-primary)',
                        cursor: 'pointer', fontSize: '0.85rem', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={onResetData}
              className="btn btn-secondary"
              title="Reset All Data"
              id="reset-data-btn"
              style={{ padding: '0.6rem', borderRadius: '10px' }}
            >
              <RotateCcw size={16} color="var(--text-muted)" />
            </button>

            {/* User Avatar Pill */}
            {currentUser && (
              <button
                onClick={() => setShowProfile(true)}
                id="user-profile-btn"
                title="My Profile & Settings"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.55rem',
                  padding: '0.4rem 0.85rem 0.4rem 0.4rem',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '9999px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
              >
                {/* Avatar circle */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--gradient-main)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {avatarInitials}
                </div>
                <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--accent-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
              </button>
            )}

            {/* Quick logout button */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="btn btn-secondary"
                title="Log Out"
                id="quick-logout-btn"
                style={{ padding: '0.6rem', borderRadius: '10px' }}
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
