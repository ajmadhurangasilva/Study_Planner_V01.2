import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, CheckCircle2, RefreshCw, BarChart2, ShieldCheck, Plus, Sparkles, UserCheck } from 'lucide-react';

export default function HomePage({ onStartPlanner }) {
  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1150px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* GREETING & HERO BANNER SECTION (Reference Inspired Layout) */}
      <div className="glass-card" style={{
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #edf5ff 100%)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-pill)', background: 'var(--accent-light-blue)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Sparkles size={16} /> Intelligent Semester Time Management
            </div>
            
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.85rem', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Master Your Semester with <span style={{ color: 'var(--accent-primary)' }}>Smart Study Allocation</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 0 2rem', lineHeight: 1.6, fontWeight: 500 }}>
              Input your module credit load and daily available free time. Our allocation engine computes a balanced 4-week timetable, tracks your weekly progress, and suggests catch-up slots for missed tasks.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onStartPlanner}
                className="btn btn-primary"
                style={{ padding: '0.95rem 2.2rem', fontSize: '1.05rem' }}
              >
                Create Study Plan <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Compact Today Date Capsule Widget (Reference Inspired) */}
          <div className="glass-card" style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            minWidth: '220px',
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span className="sky-label" style={{ marginBottom: '0.2rem' }}>Today</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {currentDateStr}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
              <UserCheck size={14} /> Active Session Ready
            </div>
          </div>
        </div>
      </div>

      {/* KEY FEATURES GRID */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Everything You Need for Academic Success</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Designed to balance heavy module workloads with your actual daily availability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Feature 1 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--accent-light-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BookOpen size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Module & Credit Rules</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Add your semester subjects, credit values, difficulty levels, and target grades. Time is allocated proportionally according to module credit weights.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--accent-light-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Clock size={24} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Daily Free Time Period Input</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Specify your exact free time windows (Start Time to End Time) for each day of the week. Study blocks are scheduled precisely within your availability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Calendar size={24} color="var(--accent-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4-Week Monthly Timetable</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Generates a full 4-week monthly study timetable. Switch between Week 1, Week 2, Week 3, and Week 4 views seamlessly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(244, 63, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <RefreshCw size={24} color="var(--accent-rose)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Reschedule Suggestions</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Missed a study session? Mark it as Incomplete and receive instant, non-overlapping catch-up time slot suggestions for weekend buffer windows.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BarChart2 size={24} color="var(--accent-amber)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Weekly & Monthly Analytics</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Monitor week-by-week progress breakdown bars, overall monthly completion rates, and personalized end-of-month recommendations.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Export & Offline Save</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Export your study timetable to Google Calendar / Apple Calendar (.ics), print PDF schedules, and automatically save progress in local storage.
            </p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS STEP WIZARD WALKTHROUGH */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2.25rem' }}>How It Works in 4 Simple Steps</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>1</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Add Modules & Credits</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Input your subjects, credit counts, and target grades.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>2</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Set Daily Free Time</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Specify start and end time windows for Monday – Sunday.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>3</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>View 4-Week Schedule</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Browse Week 1 - Week 4 timetables & mark task statuses.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>4</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Analytics & Recommendations</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Review final monthly progress & smart recommendations.</p>
          </div>
        </div>
      </div>

      {/* FINAL BOTTOM CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onStartPlanner}
          className="btn btn-primary"
          style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
        >
          Start Planning Now <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
