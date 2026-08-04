import React from 'react';
import { DAYS_OF_WEEK } from '../utils/slqfPresets';
import { getDailyTotalFreeHours, calculateSlotDuration } from '../utils/slqfAlgorithm';
import { Clock, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function FreeTimeInputStep({
  freeTimeByDay,
  setFreeTimeByDay,
  sessionLength,
  setSessionLength,
  totalSLQFHours,
  onPrevStep,
  onGeneratePlan
}) {
  // Ensure safe array structure for each day
  const getSafeSlots = (day) => {
    const raw = freeTimeByDay[day];
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'number' && raw > 0) {
      const endH = Math.min(23, 17 + Math.floor(raw));
      const endM = Math.round((raw - Math.floor(raw)) * 60);
      const endMStr = endM < 10 ? `0${endM}` : `${endM}`;
      const endHStr = endH < 10 ? `0${endH}` : `${endH}`;
      return [{ start: '17:00', end: `${endHStr}:${endMStr}` }];
    }
    return day === 'Saturday' || day === 'Sunday'
      ? [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '19:00' }]
      : [{ start: '17:00', end: '20:30' }];
  };

  const handleSlotChange = (day, index, field, value) => {
    const daySlots = [...getSafeSlots(day)];
    daySlots[index] = { ...daySlots[index], [field]: value };
    setFreeTimeByDay({ ...freeTimeByDay, [day]: daySlots });
  };

  const handleAddSlot = (day) => {
    const daySlots = [...getSafeSlots(day)];
    daySlots.push({ start: '18:00', end: '20:00' });
    setFreeTimeByDay({ ...freeTimeByDay, [day]: daySlots });
  };

  const handleRemoveSlot = (day, index) => {
    const daySlots = [...getSafeSlots(day)];
    if (daySlots.length <= 1) {
      alert(`Keep at least 1 slot for ${day}.`);
      return;
    }
    daySlots.splice(index, 1);
    setFreeTimeByDay({ ...freeTimeByDay, [day]: daySlots });
  };

  // Total free hours across all 7 days
  let totalWeeklyFreeHours = 0;
  DAYS_OF_WEEK.forEach((day) => {
    totalWeeklyFreeHours += getDailyTotalFreeHours(getSafeSlots(day));
  });
  totalWeeklyFreeHours = Math.round(totalWeeklyFreeHours * 10) / 10;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Daily Free Time Period Selector
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Specify your available free time periods (Start Time to End Time) for each day of the week.
        </p>
      </div>

      {/* 7-Day Free Time Slots Grid Matching Screenshot Exact Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {DAYS_OF_WEEK.map((day) => {
          const isWeekend = day === 'Saturday' || day === 'Sunday';
          const slots = getSafeSlots(day);
          const dayTotalHours = Math.round(getDailyTotalFreeHours(slots) * 10) / 10;

          return (
            <div
              key={day}
              className="glass-card"
              style={{
                padding: '1.5rem',
                border: isWeekend ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '16px',
                boxShadow: isWeekend ? '0 0 20px rgba(6, 182, 212, 0.15)' : '0 0 20px rgba(99, 102, 241, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Day Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{day}</h3>
                    {isWeekend && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                        (Weekend)
                      </span>
                    )}
                  </div>

                  <span className={isWeekend ? 'badge badge-indigo' : 'badge badge-emerald'} style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.35rem 0.85rem' }}>
                    {dayTotalHours} Hours Free
                  </span>
                </div>

                {/* Time Slot Input Rows matching screenshot design */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  {slots.map((slot, index) => {
                    const slotHrs = Math.round(calculateSlotDuration(slot.start, slot.end) * 10) / 10;

                    return (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(13, 20, 36, 0.75)',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        {/* From Input */}
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                            From
                          </span>
                          <input
                            type="time"
                            value={slot.start || '17:00'}
                            onChange={(e) => handleSlotChange(day, index, 'start', e.target.value)}
                            className="input-field"
                            style={{
                              padding: '0.4rem 0.5rem',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}
                          />
                        </div>

                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>to</span>

                        {/* Until Input */}
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                            Until
                          </span>
                          <input
                            type="time"
                            value={slot.end || '20:30'}
                            onChange={(e) => handleSlotChange(day, index, 'end', e.target.value)}
                            className="input-field"
                            style={{
                              padding: '0.4rem 0.5rem',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}
                          />
                        </div>

                        {/* Duration badge and Trash Icon */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.8rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                            ({slotHrs}h)
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(day, index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#f43f5e',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Delete time slot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Another Free Slot Button */}
              <button
                type="button"
                onClick={() => handleAddSlot(day)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)'
                }}
              >
                + Add Another Free Slot
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary Navigation Footer matching screenshot layout (Buttons on edges, stats centered) */}
      <div className="glass-card" style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderColor: 'var(--border-glow)'
      }}>
        {/* Left: Previous Button */}
        <button onClick={onPrevStep} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
          <ArrowLeft size={18} /> Previous
        </button>

        {/* Center: Stats Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SLQF Rec. Study Target</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {totalSLQFHours} Hours/Wk
            </div>
          </div>
          <div style={{ height: '35px', width: '1px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Free Time Available</div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: totalWeeklyFreeHours < totalSLQFHours * 0.6 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
            }}>
              {totalWeeklyFreeHours} Hours/Wk
            </div>
          </div>
        </div>

        {/* Right: Next / Generate Plan Button */}
        <button onClick={onGeneratePlan} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          Next <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
