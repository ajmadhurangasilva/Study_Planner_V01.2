import React from 'react';
import { DEGREE_STREAMS } from '../utils/slqfPresets';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function StreamSelector({ selectedStream, onSelectStream }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <GraduationCap color="var(--accent-secondary)" size={22} />
        <h3 style={{ fontSize: '1.1rem' }}>Select Your University Degree Stream (SLQF Preset)</h3>
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Choosing your stream automatically configures SLQF self-study multipliers and sample module templates.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {DEGREE_STREAMS.map((stream) => {
          const isSelected = selectedStream.id === stream.id;
          return (
            <div
              key={stream.id}
              onClick={() => onSelectStream(stream)}
              className="glass-card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                transform: isSelected ? 'scale(1.02)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'var(--accent-primary)',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Sparkles size={10} /> Active
                </div>
              )}

              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stream.icon}</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{stream.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{stream.institution}</p>
              
              <div className="badge badge-indigo" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                1 Credit = {stream.slqfMultiplier} hrs/wk
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stream.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
