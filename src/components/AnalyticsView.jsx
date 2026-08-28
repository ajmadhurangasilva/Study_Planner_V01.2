import React, { useState, useEffect } from 'react';
import { generateMonthlyRecommendations } from '../utils/slqfAlgorithm';
import { PieChart, ShieldAlert, CheckCircle, Zap, BookOpen, AlertCircle, ArrowLeft, Trophy, Sparkles, TrendingUp, BarChart2, XCircle } from 'lucide-react';
import { getScopedStorage } from '../utils/authStore';

export default function AnalyticsView({ planResult, currentUser, onPrevStep }) {
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [incompleteTaskIds, setIncompleteTaskIds] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const store = getScopedStorage(currentUser.username);
      Promise.all([
        Promise.resolve(store.get('completed_tasks', [])),
        Promise.resolve(store.get('incomplete_tasks', [])),
      ]).then(([completed, incomplete]) => {
        setCompletedTaskIds(Array.isArray(completed) ? completed : []);
        setIncompleteTaskIds(Array.isArray(incomplete) ? incomplete : []);
      });
    } else {
      try {
        setCompletedTaskIds(JSON.parse(localStorage.getItem('slqf_completed_tasks') || '[]'));
        setIncompleteTaskIds(JSON.parse(localStorage.getItem('slqf_incomplete_tasks') || '[]'));
      } catch {}
    }
  }, [currentUser]);

  if (!planResult || !planResult.moduleAnalytics) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <AlertCircle size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Analytics Available After Plan Generation</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Generate your study plan first to view detailed monthly workload analytics.</p>
        <button onClick={onPrevStep} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const {
    totalCredits,
    totalRequiredMonthlyHours,
    totalAvailableMonthlyHours,
    workloadStatus,
    statusMessage,
    moduleAnalytics,
    schedule
  } = planResult;

  const monthlyRecs = generateMonthlyRecommendations(
    schedule,
    completedTaskIds,
    incompleteTaskIds,
    moduleAnalytics
  );

  // Week-by-Week Breakdown calculation
  const weekStats = [1, 2, 3, 4].map((wk) => {
    const wkTasks = schedule.filter((s) => s.week === wk);
    const wkDone = wkTasks.filter((s) => completedTaskIds.includes(s.id)).length;
    const wkMissed = wkTasks.filter((s) => incompleteTaskIds.includes(s.id)).length;
    const wkPct = wkTasks.length > 0 ? Math.round((wkDone / wkTasks.length) * 100) : 0;
    return { week: wk, total: wkTasks.length, done: wkDone, missed: wkMissed, pct: wkPct };
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Monthly Progress Analytics & Recommendations</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Review week-by-week completion rates, subject task breakdown, and final recommendations.
        </p>
      </div>

      {/* 1. Week-by-Week Individual Progress Rates */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={20} color="var(--accent-primary)" /> Week-by-Week Individual Progress Rates
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {weekStats.map((st) => (
            <div key={st.week} style={{ background: 'var(--bg-input)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                <span>Week {st.week}</span>
                <span style={{ color: 'var(--accent-emerald)' }}>{st.pct}% Done</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', gap: '0.65rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-emerald)' }}>✅ {st.done} Done</span>
                <span style={{ color: 'var(--accent-rose)' }}>❌ {st.missed} Missed</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${st.pct}%`, height: '100%', background: 'var(--gradient-emerald)', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Overall Monthly Progress Overview Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Metric 1 */}
        <div className="glass-card" style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Final Monthly Progress</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="var(--accent-emerald)" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {monthlyRecs.completionRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600 }}>
            ✅ {monthlyRecs.completedCount} Done • ❌ {monthlyRecs.incompleteCount} Missed
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Semester Credits</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--accent-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>{totalCredits} Credits</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600 }}>
            Total Course Load
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Monthly Free Time</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--accent-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="var(--accent-secondary)" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
            {totalAvailableMonthlyHours} Hours
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600 }}>
            Available Across 4 Weeks
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card" style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Workload Balance</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: workloadStatus === 'deficit' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} color={workloadStatus === 'deficit' ? 'var(--accent-rose)' : 'var(--accent-emerald)'} />
            </div>
          </div>
          <div style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: workloadStatus === 'deficit' ? 'var(--accent-rose)' : 'var(--accent-emerald)'
          }}>
            {statusMessage}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600 }}>
            Target: {totalRequiredMonthlyHours} hrs/mo
          </div>
        </div>
      </div>

      {/* 3. Final End-of-Month Personalized Recommendations */}
      <div className="glass-card" style={{
        padding: '2.2rem',
        marginBottom: '2rem',
        borderLeft: '6px solid var(--accent-primary)',
        background: 'linear-gradient(135deg, #ffffff 0%, #edf5ff 100%)'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} color="var(--accent-primary)" /> Final Personalized Recommendations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {monthlyRecs.recommendations.map((rec, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <TrendingUp size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.55, fontWeight: 500 }}
                   dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Subject Status Rates */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={20} color="var(--accent-primary)" /> Subject Task Status Breakdown (Completed & Incompleted)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {monthlyRecs.moduleStats.map((mod) => {
            const completedPct = mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
            const missedPct = mod.total > 0 ? Math.round((mod.incomplete / mod.total) * 100) : 0;
            const pendingCount = Math.max(0, mod.total - mod.completed - mod.incomplete);

            return (
              <div key={mod.code} style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {/* Header Title & Counters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>{mod.code} - {mod.name}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                      <CheckCircle size={13} /> {mod.completed} / {mod.total} Done ({completedPct}%)
                    </span>

                    <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.25)', fontSize: '0.78rem' }}>
                      <XCircle size={13} /> {mod.incomplete} Missed ({missedPct}%)
                    </span>

                    {pendingCount > 0 && (
                      <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
                        ⏳ {pendingCount} Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Stacked Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: 'var(--border-color)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex'
                }}>
                  {/* Completed Green Portion */}
                  <div
                    style={{
                      width: `${completedPct}%`,
                      height: '100%',
                      background: 'var(--gradient-emerald)',
                      transition: 'width 0.6s ease-in-out'
                    }}
                    title={`Completed: ${mod.completed} sessions (${completedPct}%)`}
                  />

                  {/* Incompleted Red Portion */}
                  <div
                    style={{
                      width: `${missedPct}%`,
                      height: '100%',
                      background: 'var(--accent-rose)',
                      transition: 'width 0.6s ease-in-out'
                    }}
                    title={`Missed: ${mod.incomplete} sessions (${missedPct}%)`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="glass-card" style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button onClick={onPrevStep} className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem' }}>
          <ArrowLeft size={18} /> Previous
        </button>

        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          ✅ Final Monthly Progress & Recommendations Complete!
        </span>
      </div>
    </div>
  );
}
