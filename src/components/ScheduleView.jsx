import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../utils/slqfPresets';
import { getRescheduleSuggestion } from '../utils/slqfAlgorithm';
import { Calendar, Download, Printer, Filter, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, XCircle, Trophy, RefreshCw, ChevronRight, BarChart2, Plus, Users, BookOpen } from 'lucide-react';
import { exportToICalendar, printSchedule } from '../utils/exportUtils';
import confetti from 'canvas-confetti';
import { getScopedStorage } from '../utils/authStore';
import CreateTaskModal from './CreateTaskModal';

export default function ScheduleView({ planResult, freeTimeByDay, currentUser, onPrevStep, onNextStep }) {
  const [activeWeek, setActiveWeek] = useState(null); 
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);

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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>No Study Schedule Generated Yet</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please complete your modules and free time entries to generate your monthly study plan.
        </p>
        <button onClick={onPrevStep} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const { schedule, moduleAnalytics } = planResult;

  const combinedSchedule = [...customTasks, ...schedule];

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
  const filteredSchedule = combinedSchedule.filter((item) => {
    const matchesWeek = activeWeek === 'ALL' || item.week === activeWeek || item.isCustom;
    const matchesDay = selectedDay === 'ALL' || item.day === selectedDay;
    const matchesModule = selectedModuleFilter === 'ALL' || item.moduleId === selectedModuleFilter || item.code === selectedModuleFilter || item.category === selectedModuleFilter;
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
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Monthly Study Plan & Timetable</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          {activeWeek ? `Showing Timetable for Week ${activeWeek}` : 'Select a Week to view its 7-day study timetable.'}
        </p>
      </div>

      {/* OVERVIEW / WEEK SELECTION SCREEN (If activeWeek is null) */}
      {activeWeek === null ? (
        <div>
          {/* Week-by-Week Individual Progress Breakdown Grid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      📅 Week {st.week}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {st.pct}% Done
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontWeight: 500 }}>
                    {st.done} of {st.total} Sessions ({st.doneHours} / {st.totalHours} hrs)
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--bg-input)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '1.1rem'
                  }}>
                    <div style={{
                      width: `${st.pct}%`,
                      height: '100%',
                      background: 'var(--gradient-emerald)',
                      borderRadius: '4px'
                    }} />
                  </div>

                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)' }}>
                    View Week {st.week} Timetable <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL OVERALL MONTHLY PROGRESS SUMMARY CARD */}
          <div className="glass-card" style={{
            padding: '2.2rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #edf5ff 100%)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)'
                }}>
                  <Trophy size={28} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800 }}>Overall Monthly Progress Summary</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontWeight: 500 }}>
                    Total Monthly Performance across all 4 weeks
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>
                  {monthProgressPercent}%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                  {monthCompletedCount} / {monthTotalCount} Total Sessions Completed
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div style={{
              width: '100%',
              height: '12px',
              background: 'var(--bg-input)',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '1.1rem'
            }}>
              <div style={{
                width: `${monthProgressPercent}%`,
                height: '100%',
                background: 'var(--gradient-emerald)',
                borderRadius: '6px',
                transition: 'width 0.6s ease-in-out'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
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
            gap: '1rem'
          }}>
            <button onClick={onPrevStep} className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem' }}>
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
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}
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
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Week {wk}
                </button>
              ))}
            </div>
          </div>

          {/* Active Week Progress Bar Card */}
          <div className="glass-card" style={{
            padding: '1.35rem 1.6rem',
            marginBottom: '1.5rem',
            borderLeft: '5px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--accent-primary)" />
                Week {activeWeek} Timetable Schedule
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontWeight: 500 }}>
                Week {activeWeek} Progress: {activeWeekStat.done} of {activeWeekStat.total} Sessions Completed ({activeWeekStat.pct}%)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }} className="no-print">
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
              >
                <Plus size={18} /> Create Task
              </button>
              <button
                onClick={() => exportToICalendar(filteredSchedule, `Week ${activeWeek} Plan`)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
              >
                <Download size={15} /> Export iCal (.ics)
              </button>
              <button
                onClick={printSchedule}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
              >
                <Printer size={15} /> Print
              </button>
            </div>
          </div>

          {/* Filter Controls: Horizontal Date Selector Capsule Bar & Subject Dropdown */}
          <div className="no-print glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.2rem',
            marginBottom: '2rem',
            padding: '1.1rem 1.35rem'
          }}>
            {/* Horizontal Date Selector Capsule Bar (Exact Reference Design Concept) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.15rem' }}>
              <button
                onClick={() => setSelectedDay('ALL')}
                className={`date-pill ${selectedDay === 'ALL' ? 'date-pill-active' : ''}`}
                style={{ width: '68px' }}
              >
                <span className="date-pill-num" style={{ fontSize: '0.9rem' }}>ALL</span>
                <span className="date-pill-day">Days</span>
              </button>

              {[
                { day: 'Monday', num: '01', letter: 'M' },
                { day: 'Tuesday', num: '02', letter: 'T' },
                { day: 'Wednesday', num: '03', letter: 'W' },
                { day: 'Thursday', num: '04', letter: 'T' },
                { day: 'Friday', num: '05', letter: 'F' },
                { day: 'Saturday', num: '06', letter: 'S' },
                { day: 'Sunday', num: '07', letter: 'S' },
              ].map(({ day, num, letter }) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`date-pill ${selectedDay === day ? 'date-pill-active' : ''}`}
                  title={day}
                >
                  <span className="date-pill-num">{num}</span>
                  <span className="date-pill-day">{letter}</span>
                </button>
              ))}
            </div>

            {/* Module Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Filter size={16} color="var(--accent-primary)" />
              <select
                value={selectedModuleFilter}
                onChange={(e) => setSelectedModuleFilter(e.target.value)}
                className="input-field"
                style={{ width: '220px', padding: '0.5rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}
              >
                <option value="ALL">All Categories & Subjects</option>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.35rem',
              marginBottom: '2.5rem'
            }}>
              {DAYS_OF_WEEK.map((day) => {
                const daySessions = filteredSchedule.filter((s) => s.day === day);
                const dayCompletedCount = daySessions.filter((s) => completedTaskIds.includes(s.id)).length;

                return (
                  <div key={day} className="glass-card" style={{ padding: '1.35rem' }}>
                    {/* Day Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.1rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{day}</h3>
                      <span className={`badge ${dayCompletedCount === daySessions.length && daySessions.length > 0 ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.78rem' }}>
                        {dayCompletedCount}/{daySessions.length} Completed
                      </span>
                    </div>

                    {/* Session Cards for the Day */}
                    {daySessions.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '1.25rem 0', textAlign: 'center' }}>
                        ☕ Rest Day (No scheduled self-study blocks)
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                        {daySessions.map((session) => {
                          const isCompleted = completedTaskIds.includes(session.id);
                          const isIncomplete = incompleteTaskIds.includes(session.id);
                          
                          const missedIdx = Math.max(0, incompleteTaskIds.indexOf(session.id));
                          const rescheduleSuggestion = isIncomplete ? getRescheduleSuggestion(session, missedIdx) : null;

                          return (
                            <div
                              key={session.id}
                              style={{
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                                border: '1.5px solid var(--border-color)',
                                padding: '1.15rem 1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                boxShadow: 'var(--shadow-card)',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                              }}
                            >
                              {/* Top Bar: Icon + Title + Category Pill + Dark Time Badge (Reference Inspired) */}
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                  <div style={{
                                    width: '40px', height: '40px', borderRadius: '14px',
                                    background: isCompleted ? 'rgba(16, 185, 129, 0.12)' : isIncomplete ? 'rgba(244, 63, 94, 0.12)' : 'var(--accent-light-blue)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                  }}>
                                    {session.isCustom ? <Users size={18} color="var(--accent-primary)" /> : <BookOpen size={18} color={session.color || 'var(--accent-primary)'} />}
                                  </div>
                                  <div>
                                    <div style={{ display: 'inline-block', marginBottom: '0.2rem' }}>
                                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem' }}>
                                        {session.category || session.moduleCode || 'Study'}
                                      </span>
                                    </div>
                                    <h4 style={{
                                      fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0,
                                      textDecoration: isCompleted ? 'line-through' : 'none',
                                      lineHeight: 1.3
                                    }}>
                                      {session.title || session.moduleName}
                                    </h4>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', fontWeight: 500 }}>
                                      {session.description || `${session.moduleCode || 'SLQF'} • ${session.sessionLength || 50}m focus`}
                                    </p>
                                  </div>
                                </div>

                                <div className="time-badge-dark" style={{ flexShrink: 0 }}>
                                  {session.startTime || session.timeDisplay || '10:00 AM'}
                                </div>
                              </div>

                              {/* Action Controls */}
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                                <button
                                  onClick={() => handleSetStatus(session.id, 'completed')}
                                  className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', flex: 1, borderRadius: 'var(--radius-pill)' }}
                                >
                                  <CheckCircle2 size={13} /> {isCompleted ? 'Done' : 'Mark Done'}
                                </button>
                                <button
                                  onClick={() => handleSetStatus(session.id, 'incomplete')}
                                  className={`btn ${isIncomplete ? 'btn-danger' : 'btn-secondary'}`}
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', flex: 1, borderRadius: 'var(--radius-pill)' }}
                                >
                                  <XCircle size={13} /> {isIncomplete ? 'Missed' : 'Missed'}
                                </button>
                              </div>

                              {/* Reschedule Suggestion for Incomplete Tasks */}
                              {isIncomplete && (
                                <div style={{
                                  marginTop: '0.35rem',
                                  padding: '0.55rem 0.75rem',
                                  background: 'rgba(244, 63, 94, 0.08)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(244, 63, 94, 0.25)',
                                  fontSize: '0.76rem',
                                  color: 'var(--text-primary)'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                                    <RefreshCw size={13} /> Reschedule Suggestion:
                                  </div>
                                  <div style={{ fontSize: '0.74rem', marginTop: '2px', fontWeight: 600 }}>
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
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--accent-primary)" /> {selectedDay} (Week {activeWeek})
              </h3>

              {filteredSchedule.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
                  No study blocks scheduled for this day.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {filteredSchedule.map((session) => {
                    const isCompleted = completedTaskIds.includes(session.id);
                    const isIncomplete = incompleteTaskIds.includes(session.id);
                    
                    const missedIdx = Math.max(0, incompleteTaskIds.indexOf(session.id));
                    const rescheduleSuggestion = isIncomplete ? getRescheduleSuggestion(session, missedIdx) : null;

                    return (
                      <div
                        key={session.id}
                        className="glass-card"
                        style={{
                          padding: '1.35rem 1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          borderLeft: `5px solid ${
                            isCompleted ? 'var(--accent-emerald)' : isIncomplete ? 'var(--accent-rose)' : session.color || 'var(--accent-primary)'
                          }`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-indigo">
                              {session.category || session.moduleCode} • {session.credits || 3} Credits
                            </span>
                            <h4 style={{
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              marginTop: '0.4rem',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}>
                              {session.title || session.moduleName}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                              {session.description || `${session.moduleCode} Focus Session`}
                            </p>
                          </div>

                          <div className="time-badge-dark">
                            {session.startTime || session.timeDisplay || '10:00 AM'}
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => handleSetStatus(session.id, 'completed')}
                            className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', flex: 1 }}
                          >
                            <CheckCircle2 size={16} /> Mark Completed
                          </button>

                          <button
                            onClick={() => handleSetStatus(session.id, 'incomplete')}
                            className={`btn ${isIncomplete ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', flex: 1 }}
                          >
                            <XCircle size={16} /> Mark Incomplete
                          </button>
                        </div>

                        {/* Reschedule Suggestion Box */}
                        {isIncomplete && (
                          <div style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(244, 63, 94, 0.08)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(244, 63, 94, 0.25)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                              <RefreshCw size={15} /> Suggested Reschedule Slot:
                            </div>
                            <div style={{ fontSize: '0.85rem', marginTop: '3px', fontWeight: 600 }}>
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
            gap: '1rem'
          }}>
            <button onClick={() => setActiveWeek(null)} className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem' }}>
              <ArrowLeft size={18} /> ← Back to Overview
            </button>

            <button onClick={onNextStep} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Next <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Create New Task Modal */}
      {showCreateTaskModal && (
        <CreateTaskModal
          onAddTask={(task) => setCustomTasks((prev) => [task, ...prev])}
          onClose={() => setShowCreateTaskModal(false)}
        />
      )}
    </div>
  );
}
