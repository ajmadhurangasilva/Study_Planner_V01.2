import React, { useState } from 'react';
import { ChevronLeft, ClipboardList, Calendar, Clock } from 'lucide-react';

const CATEGORIES = [
  'Development',
  'Research',
  'Design',
  'Backend',
  'Core CS',
  'Math'
];

export default function CreateTaskModal({ onAddTask, onClose }) {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Development');
  const [dateStr, setDateStr] = useState('Monday, 1 June');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [description, setDescription] = useState('Discuss all questions about new projects');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: `custom-task-${Date.now()}`,
      title: taskName,
      code: category,
      category,
      day,
      dateStr,
      startTime,
      endTime,
      timeDisplay: `${startTime} - ${endTime}`,
      description,
      isCustom: true,
      week: 1,
      color: '#2563eb'
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          zIndex: 300
        }}
      />

      {/* Form Container Modal (Direct Match to Reference Design) */}
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 400,
          padding: '2.2rem 2.4rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Top Header matching reference */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '0.2rem'
            }}
          >
            <ChevronLeft size={26} />
          </button>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Create New Task
          </h2>

          <div style={{
            width: '42px', height: '42px', borderRadius: '14px',
            background: 'var(--accent-light-blue)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <ClipboardList size={22} color="var(--accent-primary)" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div style={{ marginBottom: '1.6rem' }}>
            <label className="sky-label">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Team Meeting"
              style={{
                width: '100%',
                fontSize: '1.1rem',
                fontWeight: 700,
                border: 'none',
                borderBottom: '2px solid var(--border-color)',
                borderRadius: 0,
                padding: '0.5rem 0',
                background: 'transparent',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              required
              autoFocus
            />
          </div>

          {/* Select Category */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="sky-label" style={{ margin: 0 }}>Select Category</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>See all</span>
            </div>
            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cat-pill ${category === cat ? 'cat-pill-active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={{ marginBottom: '1.6rem' }}>
            <label className="sky-label">Date</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  padding: 0
                }}
              />
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--accent-light-blue)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Calendar size={18} color="var(--accent-primary)" />
              </div>
            </div>
          </div>

          {/* Start Time & End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div>
              <label className="sky-label">Start time</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    padding: 0
                  }}
                />
                <Clock size={16} color="var(--text-muted)" />
              </div>
            </div>

            <div>
              <label className="sky-label">End time</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    padding: 0
                  }}
                />
                <Clock size={16} color="var(--text-muted)" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.25rem' }}>
            <label className="sky-label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Discuss all questions about new projects"
              style={{
                width: '100%',
                fontSize: '0.95rem',
                fontWeight: 500,
                border: 'none',
                borderBottom: '2px solid var(--border-color)',
                borderRadius: 0,
                padding: '0.5rem 0',
                background: 'transparent',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Button (Reference Pill CTA Button) */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.05rem',
              fontWeight: 800
            }}
          >
            Create Task
          </button>
        </form>
      </div>
    </>
  );
}
