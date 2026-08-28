import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../utils/slqfPresets';
import { getRescheduleSuggestion } from '../utils/slqfAlgorithm';
import { Calendar, Download, Printer, Filter, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, XCircle, Trophy, RefreshCw, ChevronRight, BarChart2 } from 'lucide-react';
import { exportToICalendar, printSchedule } from '../utils/exportUtils';
import confetti from 'canvas-confetti';
import { getScopedStorage } from '../utils/authStore';

export default function ScheduleView({ planResult, freeTimeByDay, currentUser, onPrevStep, onNextStep }) {
  const [activeWeek, setActiveWeek] = useState(null); 
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');

  // Per-user scoped storage helper
  const [isLoaded, setIsLoaded] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [incompleteTaskIds, setIncompleteTaskIds] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      try {
        const savedC = localStorage.getItem('slqf_completed_tasks');
        const savedI = localStorage.getItem('slqf_incomplete_tasks');
        if (savedC) setCompletedTaskIds(JSON.parse(savedC));
        if (savedI) setIncompleteTaskIds(JSON.parse(savedI));
      } catch {}
      setIsLoaded(true);
      return;
    }

    const store = getScopedStorage(currentUser.username);
    Promise.all([
      Promise.resolve(store.get('completed_tasks', [])),
      Promise.resolve(store.get('incomplete_tasks', [])),
    ]).then(([completed, incomplete]) => {
      setCompletedTaskIds(Array.isArray(completed) ? completed : []);
      setIncompleteTaskIds(Array.isArray(incomplete) ? incomplete : []);
      setIsLoaded(true);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      getScopedStorage(currentUser.username).set('completed_tasks', completedTaskIds);
    } else {
      localStorage.setItem('slqf_completed_tasks', JSON.stringify(completedTaskIds));
    }
  }, [completedTaskIds, isLoaded, currentUser]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      getScopedStorage(currentUser.username).set('incomplete_tasks', incompleteTaskIds);
    } else {
      localStorage.setItem('slqf_incomplete_tasks', JSON.stringify(incompleteTaskIds));
    }
  }, [incompleteTaskIds, isLoaded, currentUser]);

  if (!planResult || !planResult.schedule) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <AlertTriangle size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
        <h3>No Study Schedule Generated Yet</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please complete your modules and free time entries to generate your monthly study plan.
        </p>
        <button onClick={onPrevStep} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const { schedule, moduleAnalytics } = planResult;

  const handleSetStatus = (taskId, status) => {
    if (status === 'completed') {
      setCompletedTaskIds((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]));
      setIncompleteTaskIds((prev) => prev.filter((id) => id !== taskId));
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } else if (status === 'incomplete') {
      setIncompleteTaskIds((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]));
      setCompletedTaskIds((prev) => prev.filter((id) => id !== taskId));
    } else {
      setCompletedTaskIds((prev) => prev.filter((id) => id !== taskId));
      setIncompleteTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  // Filter schedule by active week, day, and module
  const filteredSchedule = schedule.filter((item) => {
    const matchesWeek = activeWeek === 'ALL' || item.week === activeWeek;
    const matchesDay = selectedDay === 'ALL' || item.day === selectedDay;
    const matchesModule = selectedModuleFilter === 'ALL' || item.moduleId === selectedModuleFilter;
    return matchesWeek && matchesDay && matchesModule;
  });

  // Calculate Progress Stats per week
  const weekStats = [1, 2, 3, 4].map((wk) => {
    const wkTasks = schedule.filter((s) => s.week === wk);
    const wkDone = wkTasks.filter((s) => completedTaskIds.includes(s.id)).length;
    const wkIncomplete = wkTasks.filter((s) => incompleteTaskIds.includes(s.id)).length;
    const wkPct = wkTasks.length > 0 ? Math.round((wkDone / wkTasks.length) * 100) : 0;
    const wkHours = Math.round(wkTasks.reduce((acc, s) => acc + s.sessionLength / 60, 0) * 10) / 10;
    const wkCompletedHours = Math.round(
      wkTasks.filter((s) => completedTaskIds.includes(s.id)).reduce((acc, s) => acc + s.sessionLength / 60, 0) * 10
    ) / 10;

    return { week: wk, total: wkTasks.length, done: wkDone, incomplete: wkIncomplete, pct: wkPct, totalHours: wkHours, doneHours: wkCompletedHours };
  });

  // Overall Monthly Stats
  const monthTotalCount = schedule.length;
  const monthCompletedCount = schedule.filter((s) => completedTaskIds.includes(s.id)).length;
  const monthProgressPercent = monthTotalCount > 0 ? Math.round((monthCompletedCount / monthTotalCount) * 100) : 0;
  const monthTotalHours = Math.round(schedule.reduce((acc, s) => acc + s.sessionLength / 60, 0) * 10) / 10;
  const monthCompletedHours = Math.round(
    schedule.filter((s) => completedTaskIds.includes(s.id)).reduce((acc, s) => acc + s.sessionLength / 60, 0) * 10
  ) / 10;

  // Active week stats
  const activeWeekStat = weekStats.find((w) => w.week === activeWeek) || { done: 0, total: 0, pct: 0 };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Monthly Study Plan & Timetable</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          {activeWeek ? `Showing Timetable for Week ${activeWeek}` : 'Select a Week to view its 7-day study timetable.'}
        </p>
      </div>

      {/* OVERVIEW / WEEK SELECTION SCREEN (If activeWeek is null) */}
      {activeWeek === null ? (
        <div>
          {/* Week-by-Week Individual Progress Breakdown Grid */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} color="var(--accent-primary)" /> Week-by-Week Progress Breakdown
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}>
              {weekStats.map((st) => (
                <div
                  key={st.week}
                  onClick={() => setActiveWeek(st.week)}
                  className="glass-card"
                  style={{
                    padding: '1.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.85rem' }}>
                      📅 Week {st.week}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {st.pct}% Done
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {st.done} of {st.total} Sessions ({st.doneHours} / {st.totalHours} hrs)
                  </div>

                  {/* Individual Week Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: `${st.pct}%`,
                      height: '100%',
                      background: 'var(--gradient-emerald)',
                      borderRadius: '4px'
                    }} />
                  </div>

                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem' }}>
                    View Week {st.week} Timetable <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL OVERALL MONTHLY PROGRESS SUMMARY CARD */}
          <div className="glass-card" style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            border: '2px solid var(--border-glow)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--gradient-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <Trophy size={30} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Final Overall Monthly Progress Summary</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                    Total Monthly Performance across all 4 weeks
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>
                  {monthProgressPercent}%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {monthCompletedCount} / {monthTotalCount} Total Sessions Completed
                </div>
              </div>
            </div>

            {/* Overall Monthly Progress Bar */}
            <div style={{
              width: '100%',
              height: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '7px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: `${monthProgressPercent}%`,
                height: '100%',
                background: 'var(--gradient-emerald)',
                borderRadius: '7px',
                transition: 'width 0.6s ease-in-out'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>⏱️ Total Monthly Hours Studied: <strong style={{ color: 'var(--text-primary)' }}>{monthCompletedHours} / {monthTotalHours} Hours</strong></span>
              <span>🔥 Monthly Pace Rating: <strong style={{ color: 'var(--accent-emerald)' }}>{monthProgressPercent >= 75 ? 'Excellent' : monthProgressPercent >= 50 ? 'Steady Progress' : 'Needs Focus'}</strong></span>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="glass-card" style={{
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderColor: 'var(--border-glow)'
          }}>
            <button onClick={onPrevStep} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
              <ArrowLeft size={18} /> Previous
            </button>

            <button onClick={onNextStep} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Next <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* TIMETABLE VIEW (When a Week is Selected) */
        <div>
          {/* Top Week Switcher & Back Button */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => setActiveWeek(null)}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
            >
              <ArrowLeft size={16} /> ← Back to All Weeks Overview
            </button>

            {/* Week Switcher Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map((wk) => (
                <button
                  key={wk}
                  onClick={() => setActiveWeek(wk)}
                  className={`btn ${activeWeek === wk ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '12px' }}
                >
                  Week {wk}
                </button>
              ))}
            </div>
          </div>

          {/* Active Week Progress Bar Card */}
          <div className="glass-card" style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            borderLeft: '5px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--accent-primary)" />
                Week {activeWeek} Timetable Schedule
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                Week {activeWeek} Progress: {activeWeekStat.done} of {activeWeekStat.total} Sessions Completed ({activeWeekStat.pct}%)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
              <button
                onClick={() => exportToICalendar(filteredSchedule, `Week ${activeWeek} Plan`)}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                <Download size={15} /> Export iCal (.ics)
              </button>
              <button
                onClick={printSchedule}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                <Printer size={15} /> Print
              </button>
            </div>
          </div>

          {/* Filter Controls (Day & Subject) */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Day Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              <button
                onClick={() => setSelectedDay('ALL')}
                className={`btn ${selectedDay === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '20px' }}
              >
                All 7 Days
              </button>
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '20px' }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Module Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={selectedModuleFilter}
                onChange={(e) => setSelectedModuleFilter(e.target.value)}
                className="input-field"
                style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
              >
                <option value="ALL">All Subjects</option>
                {moduleAnalytics.map((m) => (
                  <option key={m.id || m.code} value={m.id || m.code || m.name}>
                    {m.code} - {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7-Day Timetable Grid View */}
          {selectedDay === 'ALL' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              {DAYS_OF_WEEK.map((day) => {
                const daySessions = filteredSchedule.filter((s) => s.day === day);
                const dayCompletedCount = daySessions.filter((s) => completedTaskIds.includes(s.id)).length;

                return (
                  <div key={day} className="glass-card" style={{ padding: '1.25rem' }}>
                    {/* Day Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{day}</h3>
                      <span className={`badge ${dayCompletedCount === daySessions.length && daySessions.length > 0 ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
                        {dayCompletedCount}/{daySessions.length} Completed
                      </span>
                    </div>

                    {/* Session Cards for the Day */}
                    {daySessions.length === 0 ? (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>
                        ☕ Free Rest Day (No scheduled self-study blocks)
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {daySessions.map((session) => {
                          const isCompleted = completedTaskIds.includes(session.id);
                          const isIncomplete = incompleteTaskIds.includes(session.id);
                          
                          // Calculate unique missed index for non-overlapping reschedule suggestion!
                          const missedIdx = Math.max(0, incompleteTaskIds.indexOf(session.id));
                          const rescheduleSuggestion = isIncomplete ? getRescheduleSuggestion(session, missedIdx) : null;

                          return (
                            <div
                              key={session.id}
                              style={{
                                background: isCompleted
                                  ? 'rgba(16, 185, 129, 0.12)'
                                  : isIncomplete
                                  ? 'rgba(244, 63, 94, 0.12)'
                                  : 'rgba(255, 255, 255, 0.03)',
                                borderLeft: `4px solid ${
                                  isCompleted ? '#10b981' : isIncomplete ? '#f43f5e' : session.color || 'var(--accent-primary)'
                                }`,
                                borderRadius: '8px',
                                padding: '0.85rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.45rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: isCompleted ? 'var(--accent-emerald)' : isIncomplete ? 'var(--accent-rose)' : session.color,
                                  textDecoration: isCompleted ? 'line-through' : 'none'
                                }}>
                                  {session.moduleCode}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  ⏰ {session.startTime} - {session.endTime}
                                </span>
                              </div>

                              <div style={{
                                fontSize: '0.92rem',
                                fontWeight: 600,
                                textDecoration: isCompleted ? 'line-through' : 'none'
                              }}>
                                {session.moduleName}
                              </div>

                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ⏱️ {session.sessionLength} min focus work
                              </div>

                              {/* Task Action Controls (Completed / Incomplete / Pending) */}
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                                <button
                                  onClick={() => handleSetStatus(session.id, 'completed')}
                                  className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', flex: 1 }}
                                >
                                  <CheckCircle2 size={13} /> Done
                                </button>

                                <button
                                  onClick={() => handleSetStatus(session.id, 'incomplete')}
                                  className={`btn ${isIncomplete ? 'btn-danger' : 'btn-secondary'}`}
                                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', flex: 1 }}
                                >
                                  <XCircle size={13} /> Missed
                                </button>
                              </div>

                              {/* Reschedule Suggestion for Incomplete Tasks */}
                              {isIncomplete && (
                                <div style={{
                                  marginTop: '0.35rem',
                                  padding: '0.45rem 0.65rem',
                                  background: 'rgba(244, 63, 94, 0.18)',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(244, 63, 94, 0.3)',
                                  fontSize: '0.73rem',
                                  color: '#ffffff'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#fda4af' }}>
                                    <RefreshCw size={12} /> Reschedule Suggestion:
                                  </div>
                                  <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                                    💡 {rescheduleSuggestion}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single Day View */
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--accent-primary)" /> {selectedDay} (Week {activeWeek})
              </h3>

              {filteredSchedule.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No study blocks scheduled for this day.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredSchedule.map((session, idx) => {
                    const isCompleted = completedTaskIds.includes(session.id);
                    const isIncomplete = incompleteTaskIds.includes(session.id);
                    
                    const missedIdx = Math.max(0, incompleteTaskIds.indexOf(session.id));
                    const rescheduleSuggestion = isIncomplete ? getRescheduleSuggestion(session, missedIdx) : null;

                    return (
                      <div
                        key={session.id}
                        style={{
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.12)'
                            : isIncomplete
                            ? 'rgba(244, 63, 94, 0.12)'
                            : 'rgba(255, 255, 255, 0.04)',
                          borderLeft: `5px solid ${
                            isCompleted ? '#10b981' : isIncomplete ? '#f43f5e' : session.color || 'var(--accent-primary)'
                          }`,
                          borderRadius: '12px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="badge" style={{ background: `${session.color}22`, color: session.color }}>
                              {session.moduleCode} • {session.credits} Credits
                            </span>
                            <h4 style={{
                              fontSize: '1.1rem',
                              marginTop: '0.25rem',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}>
                              {session.moduleName}
                            </h4>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                              {session.startTime}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              to {session.endTime}
                            </div>
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => handleSetStatus(session.id, 'completed')}
                            className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', flex: 1 }}
                          >
                            <CheckCircle2 size={16} /> Mark Completed
                          </button>

                          <button
                            onClick={() => handleSetStatus(session.id, 'incomplete')}
                            className={`btn ${isIncomplete ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', flex: 1 }}
                          >
                            <XCircle size={16} /> Mark Incomplete
                          </button>
                        </div>

                        {/* Reschedule Suggestion Box */}
                        {isIncomplete && (
                          <div style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(244, 63, 94, 0.18)',
                            borderRadius: '8px',
                            border: '1px solid rgba(244, 63, 94, 0.3)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#fda4af' }}>
                              <RefreshCw size={15} /> Suggested Reschedule Slot:
                            </div>
                            <div style={{ fontSize: '0.88rem', marginTop: '3px', fontWeight: 600 }}>
                              💡 {rescheduleSuggestion}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Navigation Footer */}
          <div className="glass-card" style={{
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderColor: 'var(--border-glow)'
          }}>
            <button onClick={() => setActiveWeek(null)} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
              <ArrowLeft size={18} /> ← Back to Overview
            </button>

            <button onClick={onNextStep} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Next <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
