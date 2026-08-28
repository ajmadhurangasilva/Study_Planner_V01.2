import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, XCircle, Users, BookOpen, Clock, ArrowRight, Sparkles, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getScopedStorage } from '../utils/authStore';
import CreateTaskModal from './CreateTaskModal';
import { getRescheduleSuggestion } from '../utils/slqfAlgorithm';

export default function HomePage({ planResult, currentUser, onStartPlanner, onGoToStep }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()] || 'Monday';
  });

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);

  // Per-user scoped storage
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

  const schedule = planResult?.schedule || [];

  // Default demo tasks if no plan generated yet to showcase exact reference UI
  const defaultDemoTasks = [
    {
      id: 'demo-task-1',
      title: 'Team Meeting',
      category: 'Development',
      moduleCode: 'CS201',
      description: 'Discuss all questions about new projects',
      startTime: '10:00 AM',
      day: selectedDay,
      color: '#2563eb'
    },
    {
      id: 'demo-task-2',
      title: 'Call the stylist',
      category: 'Research',
      moduleCode: 'CS202',
      description: 'Agree on an evening look and study setup',
      startTime: '11:00 AM',
      day: selectedDay,
      color: '#0284c7'
    },
    {
      id: 'demo-task-3',
      title: 'Check mail & Submit Assignment',
      category: 'Design',
      moduleCode: 'CS203',
      description: 'Write to the course manager and review feedback',
      startTime: '02:00 PM',
      day: selectedDay,
      color: '#10b981'
    }
  ];

  const allTasks = [...customTasks, ...(schedule.length > 0 ? schedule : defaultDemoTasks)];
  const dayTasks = allTasks.filter((t) => t.day === selectedDay || t.isCustom);

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* ── TOP HEADER SECTION (Direct Match to Reference "My Task" Screen) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            My Task
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Today</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{currentDateStr}</span>
          </div>
        </div>

        {/* Quick Add Task Floating Action Button (+) */}
        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="fab-btn"
          title="Create New Task"
          id="create-task-btn"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── HORIZONTAL DATE SELECTOR CAPSULE BAR (Direct Match to Reference) ── */}
      <div className="glass-card" style={{
        padding: '1.1rem 1.35rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: '0.65rem'
      }}>
        {[
          { day: 'Monday', num: '01', letter: 'M' },
          { day: 'Tuesday', num: '02', letter: 'T' },
          { day: 'Wednesday', num: '03', letter: 'W' },
          { day: 'Thursday', num: '04', letter: 'T' },
          { day: 'Friday', num: '05', letter: 'F' },
          { day: 'Saturday', num: '06', letter: 'S' },
          { day: 'Sunday', num: '07', letter: 'S' },
        ].map(({ day, num, letter }) => {
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`date-pill ${isActive ? 'date-pill-active' : ''}`}
              title={day}
            >
              <span className="date-pill-num">{num}</span>
              <span className="date-pill-day">{letter}</span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN FLOATING BLUE/WHITE CONTAINER FOR TASKS (Exact Reference Design Concept) ── */}
      <div className="glass-card" style={{
        padding: '2.2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #edf5ff 100%)',
        border: '1.5px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {selectedDay}'s Study Tasks
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontWeight: 500 }}>
              {dayTasks.length} session{dayTasks.length === 1 ? '' : 's'} scheduled for {selectedDay}
            </p>
          </div>

          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)' }}
          >
            <Plus size={15} /> Add Task
          </button>
        </div>

        {/* Task Cards List */}
        {dayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              ☕ No tasks scheduled for {selectedDay}. Enjoy your break or create a new task!
            </p>
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="btn btn-primary"
              style={{ marginTop: '1.25rem', padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
            >
              <Plus size={16} /> Create Task Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {dayTasks.map((task) => {
              const isCompleted = completedTaskIds.includes(task.id);
              const isIncomplete = incompleteTaskIds.includes(task.id);

              const missedIdx = Math.max(0, incompleteTaskIds.indexOf(task.id));
              const rescheduleSuggestion = isIncomplete ? getRescheduleSuggestion(task, missedIdx) : null;

              return (
                <div
                  key={task.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '1.35rem 1.6rem',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    transition: 'all 0.25s ease',
                    position: 'relative'
                  }}
                >
                  {/* Top Row: Icon + Details + Dark Time Badge (Reference Inspired) */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      {/* Left Icon Circle / Avatar */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '16px',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.12)' : isIncomplete ? 'rgba(244, 63, 94, 0.12)' : 'var(--accent-light-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {task.isCustom ? <Users size={22} color="var(--accent-primary)" /> : <BookOpen size={22} color={task.color || 'var(--accent-primary)'} />}
                      </div>

                      <div>
                        {/* Category Pill Tag */}
                        <div style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                          <span className="badge badge-indigo" style={{ fontSize: '0.74rem', padding: '0.2rem 0.7rem' }}>
                            {task.category || task.code || task.moduleCode || 'Development'}
                          </span>
                        </div>

                        {/* Task Title */}
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          margin: 0,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          lineHeight: 1.3
                        }}>
                          {task.title || task.moduleName}
                        </h3>

                        {/* Task Description */}
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontWeight: 500 }}>
                          {task.description || `${task.moduleCode || 'SLQF'} • ${task.sessionLength || 50}m focus session`}
                        </p>
                      </div>
                    </div>

                    {/* Dark High-Contrast Time Badge Pill (Direct Match to Reference) */}
                    <div className="time-badge-dark" style={{ flexShrink: 0 }}>
                      {task.startTime || task.timeDisplay || '10:00 AM'}
                    </div>
                  </div>

                  {/* Status Toggle Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => handleSetStatus(task.id, 'completed')}
                      className={`btn ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.95rem', fontSize: '0.82rem', flex: 1, borderRadius: 'var(--radius-pill)' }}
                    >
                      <CheckCircle2 size={14} /> {isCompleted ? 'Completed' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => handleSetStatus(task.id, 'incomplete')}
                      className={`btn ${isIncomplete ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.95rem', fontSize: '0.82rem', flex: 1, borderRadius: 'var(--radius-pill)' }}
                    >
                      <XCircle size={14} /> {isIncomplete ? 'Missed' : 'Missed'}
                    </button>
                  </div>

                  {/* Reschedule Suggestion for Missed Tasks */}
                  {isIncomplete && (
                    <div style={{
                      marginTop: '0.35rem',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(244, 63, 94, 0.08)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      fontSize: '0.78rem',
                      color: 'var(--text-primary)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                        <RefreshCw size={13} /> Reschedule Suggestion:
                      </div>
                      <div style={{ fontSize: '0.76rem', marginTop: '3px', fontWeight: 600 }}>
                        💡 {rescheduleSuggestion || 'Suggested weekend buffer catch-up slot available'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── QUICK SETUP & NAVIGATION BAR ── */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-primary)" /> Semester Allocation Workflow
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontWeight: 500 }}>
            Configure your subject credits, daily free time, or view full 4-week timetable & analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={() => onGoToStep(1)} className="btn btn-secondary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}>
            <BookOpen size={15} /> 1. Modules
          </button>
          <button onClick={() => onGoToStep(2)} className="btn btn-secondary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}>
            <Clock size={15} /> 2. Free Time
          </button>
          <button onClick={() => onGoToStep(3)} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            <Calendar size={15} /> Full 4-Week Plan <ArrowRight size={15} />
          </button>
        </div>
      </div>

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
