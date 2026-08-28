import React from 'react';
import { DIFFICULTY_FACTORS, TARGET_GRADE_FACTORS } from '../utils/slqfPresets';
import { Plus, Trash2, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';

export default function ModuleInputStep({
  modules,
  setModules,
  slqfMultiplier,
  onPrevStep,
  onNextStep
}) {
  const handleAddModule = () => {
    const newId = Date.now().toString();
    setModules([
      ...modules,
      {
        id: newId,
        name: `Module ${modules.length + 1}`,
        code: `MOD${100 + modules.length + 1}`,
        credits: 3,
        difficulty: 'medium',
        targetGrade: 'A',
        color: getRandomColor()
      }
    ]);
  };

  const handleRemoveModule = (id) => {
    if (modules.length <= 1) {
      alert('You must have at least 1 module!');
      return;
    }
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleChangeModule = (id, field, value) => {
    setModules(
      modules.map((m) => {
        if (m.id === id) {
          return { ...m, [field]: value };
        }
        return m;
      })
    );
  };

  const totalCredits = modules.reduce((sum, m) => sum + (parseFloat(m.credits) || 0), 0);
  const estimatedWeeklySelfStudy = Math.round(totalCredits * slqfMultiplier * 10) / 10;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Modules & Credit Values</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Specify your semester subjects, credit values, difficulty levels, and target grades.
        </p>
      </div>

      {/* Module Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--accent-primary)" />
          Semester Subjects List
        </h3>

        <button onClick={handleAddModule} className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}>
          <Plus size={16} /> Add New Module
        </button>
      </div>

      {/* Module List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '2.5rem' }}>
        {modules.map((mod, index) => (
          <div
            key={mod.id || index}
            className="glass-card"
            style={{
              padding: '1.35rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 45px',
              gap: '1.2rem',
              alignItems: 'center'
            }}
          >
            {/* Module Name & Code */}
            <div>
              <label className="sky-label">Module Name & Code</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={mod.name}
                  onChange={(e) => handleChangeModule(mod.id, 'name', e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="input-field"
                  style={{ fontWeight: 600 }}
                />
                <input
                  type="text"
                  value={mod.code}
                  onChange={(e) => handleChangeModule(mod.id, 'code', e.target.value)}
                  placeholder="IT2010"
                  className="input-field"
                  style={{ width: '90px', textTransform: 'uppercase', textAlign: 'center', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Credit Count */}
            <div>
              <label className="sky-label">Credit Value</label>
              <select
                value={mod.credits}
                onChange={(e) => handleChangeModule(mod.id, 'credits', parseFloat(e.target.value))}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                <option value={1}>1 Credit (50h total)</option>
                <option value={2}>2 Credits (100h total)</option>
                <option value={3}>3 Credits (150h total)</option>
                <option value={4}>4 Credits (200h total)</option>
                <option value={6}>6 Credits (Project/Thesis)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="sky-label">Difficulty Rating</label>
              <select
                value={mod.difficulty}
                onChange={(e) => handleChangeModule(mod.id, 'difficulty', e.target.value)}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                {Object.entries(DIFFICULTY_FACTORS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Target Grade */}
            <div>
              <label className="sky-label">Target Grade</label>
              <select
                value={mod.targetGrade || 'A'}
                onChange={(e) => handleChangeModule(mod.id, 'targetGrade', e.target.value)}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                {Object.entries(TARGET_GRADE_FACTORS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Delete Action */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handleRemoveModule(mod.id)}
                className="btn btn-danger"
                style={{ padding: '0.65rem', borderRadius: '12px' }}
                title="Remove Module"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Navigation Footer */}
      <div className="glass-card" style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Left: Previous Button */}
        <button onClick={onPrevStep} className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem' }}>
          <ArrowLeft size={18} /> Previous
        </button>

        {/* Center: Stats Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Semester Credits</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
              {totalCredits} Credits
            </div>
          </div>
          <div style={{ height: '35px', width: '1px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Recommended Self-Study</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              ~{estimatedWeeklySelfStudy} Hours/Wk
            </div>
          </div>
        </div>

        {/* Right: Next Button */}
        <button onClick={onNextStep} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          Next <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function getRandomColor(seed = '') {
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash += seed.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}
