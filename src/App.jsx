import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ModuleInputStep from './components/ModuleInputStep';
import FreeTimeInputStep from './components/FreeTimeInputStep';
import ScheduleView from './components/ScheduleView';
import AnalyticsView from './components/AnalyticsView';
import { generateMonthlyStudyPlan } from './utils/slqfAlgorithm';

const INITIAL_MODULES = [
  { id: 'm-1', name: 'Data Structures & Algorithms', code: 'CS201', credits: 4, difficulty: 'hard', targetGrade: 'A_PLUS', color: '#6366f1' },
  { id: 'm-2', name: 'Database Management Systems', code: 'CS202', credits: 3, difficulty: 'medium', targetGrade: 'A', color: '#06b6d4' },
  { id: 'm-3', name: 'Object Oriented Programming', code: 'CS203', credits: 3, difficulty: 'medium', targetGrade: 'A', color: '#10b981' },
  { id: 'm-4', name: 'Mathematics for Computing', code: 'MA204', credits: 3, difficulty: 'hard', targetGrade: 'B', color: '#f59e0b' }
];

const INITIAL_FREE_TIME = {
  Monday: [{ start: '17:00', end: '21:00' }],
  Tuesday: [{ start: '17:00', end: '21:00' }],
  Wednesday: [{ start: '17:00', end: '21:00' }],
  Thursday: [{ start: '17:00', end: '21:00' }],
  Friday: [{ start: '17:00', end: '21:00' }],
  Saturday: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '19:00' }],
  Sunday: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '19:00' }]
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Home Page
  const [theme, setTheme] = useState(() => localStorage.getItem('slqf_theme') || 'dark');
  const [slqfMultiplier, setSlqfMultiplier] = useState(2.5);

  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('slqf_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [freeTimeByDay, setFreeTimeByDay] = useState(() => {
    const saved = localStorage.getItem('slqf_free_time');
    return saved ? JSON.parse(saved) : INITIAL_FREE_TIME;
  });

  const [sessionLength, setSessionLength] = useState(50);
  const [planResult, setPlanResult] = useState(null);

  // Sync Theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('slqf_theme', theme);
  }, [theme]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('slqf_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('slqf_free_time', JSON.stringify(freeTimeByDay));
  }, [freeTimeByDay]);

  // Generate / Update Monthly Study Plan
  useEffect(() => {
    if (modules && modules.length > 0) {
      const result = generateMonthlyStudyPlan(modules, freeTimeByDay, slqfMultiplier, sessionLength);
      setPlanResult(result);
    }
  }, [modules, freeTimeByDay, slqfMultiplier, sessionLength]);

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all modules and free time entries?')) {
      localStorage.clear();
      setSlqfMultiplier(2.5);
      setModules(INITIAL_MODULES);
      setFreeTimeByDay(INITIAL_FREE_TIME);
      setCurrentStep(0);
    }
  };

  const totalSLQFHours = planResult ? planResult.totalSLQFRequiredHours : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        setCurrentStep={goToStep}
        theme={theme}
        setTheme={setTheme}
        onResetData={handleResetData}
        planResult={planResult}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Step 0: Home Page */}
        {currentStep === 0 && (
          <HomePage onStartPlanner={() => goToStep(1)} />
        )}

        {/* Step 1: Modules & Credit Values */}
        {currentStep === 1 && (
          <ModuleInputStep
            modules={modules}
            setModules={setModules}
            slqfMultiplier={slqfMultiplier}
            onPrevStep={() => goToStep(0)}
            onNextStep={() => goToStep(2)}
          />
        )}

        {/* Step 2: Day-by-Day Available Free Time */}
        {currentStep === 2 && (
          <FreeTimeInputStep
            freeTimeByDay={freeTimeByDay}
            setFreeTimeByDay={setFreeTimeByDay}
            sessionLength={sessionLength}
            setSessionLength={setSessionLength}
            totalSLQFHours={totalSLQFHours}
            onPrevStep={() => goToStep(1)}
            onGeneratePlan={() => goToStep(3)}
          />
        )}

        {/* Step 3: Generated Monthly Study Timetable Plan */}
        {currentStep === 3 && (
          <ScheduleView
            planResult={planResult}
            freeTimeByDay={freeTimeByDay}
            onPrevStep={() => goToStep(2)}
            onNextStep={() => goToStep(4)}
          />
        )}

        {/* Step 4: Workload Analytics & End-of-Month Recommendations */}
        {currentStep === 4 && (
          <AnalyticsView
            planResult={planResult}
            onPrevStep={() => goToStep(3)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-main)'
      }}>
        🇱🇰 Study Time Allocation System • Built for Student Success
      </footer>
    </div>
  );
}
