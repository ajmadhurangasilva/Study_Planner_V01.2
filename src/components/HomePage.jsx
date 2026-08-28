import React from 'react';
import { BookOpen, Clock, Calendar, Trophy, ArrowRight, Sparkles, CheckCircle2, RefreshCw, BarChart2, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage({ onStartPlanner }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '1150px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* HERO BANNER SECTION */}
      <div className="glass-card" style={{
        padding: '3.5rem 2.2rem',
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1.5px solid var(--border-color)',
        background: 'linear-gradient(135deg, rgba(237, 245, 255, 0.9) 0%, rgba(224, 242, 254, 0.9) 100%)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25, letterSpacing: '-1px', color: 'var(--text-primary)' }}>
          Master Your Semester with <span style={{ color: 'var(--accent-primary)' }}>Smart Study Time Allocation</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.25rem', lineHeight: 1.6, fontWeight: 500 }}>
          Input your module credit load and daily available free time. Our smart allocation engine generates a custom 4-week study plan, tracks your week-by-week progress, and suggests instant catch-up slots for missed tasks.
        </p>

        {/* Call to Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onStartPlanner}
            className="btn btn-primary"
            style={{ padding: '0.95rem 2.5rem', fontSize: '1.1rem', borderRadius: '9999px' }}
          >
            Create Your Study Plan <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* KEY FEATURES GRID */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BookOpen size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Module & Credit Rules</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Add your semester subjects, credit values, difficulty levels, and target grades. Time is allocated proportionally according to module credit weights.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Clock size={24} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Daily Free Time Period Input</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Specify your exact free time windows (Start Time to End Time) for each day of the week. Study blocks are scheduled precisely within your availability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Calendar size={24} color="var(--accent-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4-Week Monthly Timetable</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Generates a full 4-week monthly study timetable. Switch between Week 1, Week 2, Week 3, and Week 4 views seamlessly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <RefreshCw size={24} color="var(--accent-rose)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Reschedule Suggestions</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Missed a study session? Mark it as Incomplete and receive instant, non-overlapping catch-up time slot suggestions for weekend buffer windows.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BarChart2 size={24} color="var(--accent-amber)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Weekly & Monthly Analytics</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Monitor week-by-week progress breakdown bars, overall monthly completion rates, and personalized end-of-month recommendations.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} color="#8b5cf6" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Export & Offline Save</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Export your study timetable to Google Calendar / Apple Calendar (.ics), print PDF schedules, and automatically save progress in local storage.
            </p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS STEP WIZARD WALKTHROUGH */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>How It Works in 4 Simple Steps</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gradient-main)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>1</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Add Modules & Credits</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Input your subjects, credit counts, and target grades.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gradient-main)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>2</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Set Daily Free Time</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Specify start and end time windows for Monday – Sunday.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gradient-main)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>3</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>View 4-Week Schedule</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Browse Week 1 - Week 4 timetables & mark task statuses.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gradient-main)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
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
          style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '30px' }}
        >
          Start Planning Now <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
