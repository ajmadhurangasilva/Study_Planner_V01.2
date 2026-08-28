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

      {/* Form Container Modal */}
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 400,
          padding: '2rem 2.2rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '0.2rem'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Create New Task
          </h2>

          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(37, 99, 235, 0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <ClipboardList size={22} color="#2563eb" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label className="sky-label">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Team Meeting"
              className="input-field"
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                border: 'none',
                borderBottom: '2px solid var(--border-color)',
                borderRadius: 0,
                padding: '0.4rem 0',
                background: 'transparent'
              }}
              required
              autoFocus
            />
          </div>

          {/* Select Category */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="sky-label" style={{ margin: 0 }}>Select Category</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>See all</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
          <div style={{ marginBottom: '1.4rem' }}>
            <label className="sky-label">Date</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="input-field"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  padding: 0
                }}
              />
              <Calendar size={20} color="#2563eb" />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="sky-label">Start time</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.95rem', fontWeight: 700, border: 'none', background: 'transparent', padding: 0 }}
                />
                <Clock size={16} color="var(--text-muted)" />
              </div>
            </div>

            <div>
              <label className="sky-label">End time</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.95rem', fontWeight: 700, border: 'none', background: 'transparent', padding: 0 }}
                />
                <Clock size={16} color="var(--text-muted)" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="sky-label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Discuss all questions about new projects"
              className="input-field"
              style={{
                fontSize: '0.92rem',
                fontWeight: 500,
                border: 'none',
                borderBottom: '2px solid var(--border-color)',
                borderRadius: 0,
                padding: '0.4rem 0',
                background: 'transparent'
              }}
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.95rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '9999px'
            }}
          >
            Create Task
          </button>
        </form>
      </div>
    </>
  );
}
