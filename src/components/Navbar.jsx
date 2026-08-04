import React, { useState } from 'react';
import { BookOpen, Home, Calendar, Clock, BarChart3, Sun, Moon, Download, RotateCcw } from 'lucide-react';
import { exportToICalendar, printSchedule, exportPlanJSON } from '../utils/exportUtils';

export default function Navbar({ currentStep, setCurrentStep, theme, setTheme, onResetData, planResult }) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-main)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(16px)',
      padding: '0.85rem 1.5rem'
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
        {/* Logo & Title (Clicking Logo goes Home) */}
        <div
          onClick={() => setCurrentStep(0)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <BookOpen size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Study Planner</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Study Time Allocation System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentStep(0)}
            className={`btn ${currentStep === 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Home size={15} /> Home
          </button>

          <button
            onClick={() => setCurrentStep(1)}
            className={`btn ${currentStep === 1 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <BookOpen size={15} /> 1. Modules
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`btn ${currentStep === 2 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Clock size={15} /> 2. Free Time
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`btn ${currentStep === 3 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Calendar size={15} /> 3. Monthly Plan
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`btn ${currentStep === 4 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <BarChart3 size={15} /> 4. Analytics
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
            title="Toggle Light/Dark Theme"
            style={{ padding: '0.6rem', borderRadius: '10px' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Export Menu Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
            >
              <Download size={16} /> Export <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>

            {showExportMenu && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '210px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200
              }}>
                <button
                  onClick={() => {
                    exportToICalendar(planResult?.schedule, 'Monthly Study Plan');
                    setShowExportMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.8rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  📅 Google / iCal (.ics)
                </button>

                <button
                  onClick={() => {
                    printSchedule();
                    setShowExportMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.8rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  🖨️ Print / Save PDF
                </button>

                <button
                  onClick={() => {
                    exportPlanJSON(planResult);
                    setShowExportMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.8rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  💾 Export JSON Backup
                </button>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={onResetData}
            className="btn btn-secondary"
            title="Reset All Data"
            style={{ padding: '0.6rem', borderRadius: '10px' }}
          >
            <RotateCcw size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>
    </header>
  );
}
