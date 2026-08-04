import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

export default function FocusTimer({ planResult }) {
  const [sessionType, setSessionType] = useState('study'); // 'study' or 'break'
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState('off'); // 'rain', 'ocean', 'off'
  const [completedSessions, setCompletedSessions] = useState(0);

  // Timer Tick Interval
  useEffect(() => {
    let timerId = null;

    if (isRunning) {
      timerId = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    soundSynth.playChime();
    soundSynth.stopSound();
    setActiveSound('off');

    if (sessionType === 'study') {
      setCompletedSessions((prev) => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Switch to break
      setSessionType('break');
      setDurationMinutes(5);
      setTimeLeftSeconds(5 * 60);
    } else {
      setSessionType('study');
      setDurationMinutes(25);
      setTimeLeftSeconds(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    soundSynth.stopSound();
    setActiveSound('off');
    setTimeLeftSeconds(durationMinutes * 60);
  };

  const changeDuration = (mins, type = 'study') => {
    setIsRunning(false);
    soundSynth.stopSound();
    setActiveSound('off');
    setSessionType(type);
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
  };

  const handleSoundChange = (sound) => {
    setActiveSound(sound);
    if (sound === 'rain') {
      soundSynth.playRain(0.3);
    } else if (sound === 'ocean') {
      soundSynth.playOcean(0.3);
    } else {
      soundSynth.stopSound();
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const progressPercent = ((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100;

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '650px', margin: '2rem auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Flame color="var(--accent-amber)" size={24} />
        <h3 style={{ fontSize: '1.25rem' }}>Pomodoro Focus Timer</h3>
        <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
          🔥 Streak: {completedSessions} Sessions Completed
        </span>
      </div>

      {/* Preset Duration Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => changeDuration(25, 'study')}
          className={`btn ${durationMinutes === 25 && sessionType === 'study' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          ⏱️ 25m Focus
        </button>

        <button
          onClick={() => changeDuration(50, 'study')}
          className={`btn ${durationMinutes === 50 && sessionType === 'study' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          🧠 50m Deep Work
        </button>

        <button
          onClick={() => changeDuration(5, 'break')}
          className={`btn ${durationMinutes === 5 && sessionType === 'break' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          ☕ 5m Short Break
        </button>

        <button
          onClick={() => changeDuration(15, 'break')}
          className={`btn ${durationMinutes === 15 && sessionType === 'break' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          🌴 15m Long Break
        </button>
      </div>

      {/* Timer Circular Countdown Display */}
      <div style={{
        position: 'relative',
        width: '230px',
        height: '230px',
        margin: '0 auto 1.5rem',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '6px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isRunning ? 'var(--shadow-glow)' : 'none'
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {sessionType === 'study' ? '🎯 Focus Session' : '☕ Rest Break'}
        </div>

        <div style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-2px' }}>
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isRunning ? 'Session Active' : 'Paused'}
        </div>
      </div>

      {/* Play / Pause / Reset Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={toggleTimer}
          className="btn btn-primary"
          style={{ padding: '0.85rem 2.2rem', fontSize: '1rem', borderRadius: '30px' }}
        >
          {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start Session</>}
        </button>

        <button
          onClick={resetTimer}
          className="btn btn-secondary"
          style={{ padding: '0.85rem', borderRadius: '50%' }}
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Ambient Sound Synthesizer Controls */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          🎧 Ambient Focus Sound (Offline Web Audio Synth)
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => handleSoundChange('off')}
            className={`btn ${activeSound === 'off' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
          >
            🔇 Mute
          </button>
          <button
            onClick={() => handleSoundChange('rain')}
            className={`btn ${activeSound === 'rain' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
          >
            🌧️ Soft Rain
          </button>
          <button
            onClick={() => handleSoundChange('ocean')}
            className={`btn ${activeSound === 'ocean' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
          >
            🌊 Ocean Waves
          </button>
        </div>
      </div>
    </div>
  );
}
