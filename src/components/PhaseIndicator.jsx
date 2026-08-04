import React from 'react';
import { Check, GraduationCap, BookOpen, Clock, Calendar, BarChart3 } from 'lucide-react';

const PHASES = [
  { id: 1, name: 'Degree Stream', icon: GraduationCap },
  { id: 2, name: 'Modules & Credits', icon: BookOpen },
  { id: 3, name: 'Daily Free Time', icon: Clock },
  { id: 4, name: 'Weekly Timetable', icon: Calendar },
  { id: 5, name: 'Analytics & Focus', icon: BarChart3 }
];

export default function PhaseIndicator({ currentPhase, setCurrentPhase, maxReachedPhase }) {
  return (
    <div style={{ marginBottom: '2.5rem' }} className="no-print">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {/* Background Connecting Line */}
        <div style={{
          position: 'absolute',
          top: '22px',
          left: '50px',
          right: '50px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          zIndex: 1
        }} />

        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '22px',
          left: '50px',
          width: `${((currentPhase - 1) / (PHASES.length - 1)) * 100}%`,
          height: '4px',
          background: 'var(--gradient-main)',
          transition: 'width 0.4s ease-in-out',
          zIndex: 2
        }} />

        {/* Step Nodes */}
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const isCompleted = phase.id < currentPhase;
          const isActive = phase.id === currentPhase;
          const isClickable = phase.id <= maxReachedPhase;

          return (
            <div
              key={phase.id}
              onClick={() => isClickable && setCurrentPhase(phase.id)}
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isClickable ? 'pointer' : 'not-allowed',
                opacity: isClickable ? 1 : 0.45
              }}
            >
              {/* Circle Node */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isActive
                  ? 'var(--gradient-main)'
                  : isCompleted
                  ? 'var(--accent-emerald)'
                  : 'var(--bg-main)',
                border: isActive
                  ? '3px solid #ffffff'
                  : isCompleted
                  ? 'none'
                  : '2px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>

              {/* Label */}
              <div style={{
                marginTop: '0.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent-secondary)' : isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8 }}>Phase {phase.id}</span>
                {phase.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
