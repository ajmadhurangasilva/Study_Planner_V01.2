import React from 'react';
import { DEGREE_STREAMS } from '../utils/slqfPresets';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function Phase1DegreeStream({
  selectedStream,
  onSelectStream,
  onNextStep
}) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Select Your University Degree Program</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
          Choose your university stream to automatically configure SLQF self-study credit rules and module templates.
        </p>
      </div>

      {/* Stream Selection Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {DEGREE_STREAMS.map((stream) => {
          const isSelected = selectedStream.id === stream.id;

          return (
            <div
              key={stream.id}
              onClick={() => onSelectStream(stream)}
              className="glass-card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--gradient-main)',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={12} /> Selected
                </div>
              )}

              <div>
                <div style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>{stream.icon}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{stream.name}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  {stream.institution}
                </p>

                <div className="badge badge-emerald" style={{ fontSize: '0.78rem', marginBottom: '0.85rem' }}>
                  SLQF Rule: 1 Credit = {stream.slqfMultiplier} Self-Study Hrs/Wk
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {stream.description}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Includes templates for {stream.recommendedModules?.length || 4} core modules
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Navigation Bar */}
      <div className="glass-card" style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderColor: 'var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <GraduationCap size={24} color="var(--accent-secondary)" />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected Stream:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedStream.name}
            </div>
          </div>
        </div>

        <button
          onClick={onNextStep}
          className="btn btn-primary"
          style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
