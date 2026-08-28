import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ModuleInputStep from './components/ModuleInputStep';
import FreeTimeInputStep from './components/FreeTimeInputStep';
import ScheduleView from './components/ScheduleView';
import AnalyticsView from './components/AnalyticsView';
import AuthPage from './components/AuthPage';
import { generateMonthlyStudyPlan } from './utils/slqfAlgorithm';
import { getCurrentUser, logoutUser, getScopedStorage, bootstrapSession } from './utils/authStore';

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
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [appReady, setAppReady] = useState(false);

  // ── App state (all guarded by currentUser) ──────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState('light');
  const [slqfMultiplier, setSlqfMultiplier] = useState(2.5);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [freeTimeByDay, setFreeTimeByDay] = useState(INITIAL_FREE_TIME);
  const [sessionLength, setSessionLength] = useState(50);
  const [planResult, setPlanResult] = useState(null);

  // ── Bootstrap session on startup (handles Electron async session) ───────────
  useEffect(() => {
    bootstrapSession().then((user) => {
      setCurrentUser(user || null);
      setAppReady(true);
    });
  }, []);

  // ── Load user-scoped data whenever currentUser changes ──────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const store = getScopedStorage(currentUser.username);

    Promise.all([
      Promise.resolve(store.get('theme', null)),
      Promise.resolve(store.get('modules', null)),
      Promise.resolve(store.get('free_time', null)),
    ]).then(([savedTheme, savedModules, savedFreeTime]) => {
      setTheme(savedTheme || 'light');
      setModules(savedModules || INITIAL_MODULES);
      setFreeTimeByDay(savedFreeTime || INITIAL_FREE_TIME);
      setCurrentStep(0);
    });
  }, [currentUser]);

  // ── Sync theme attribute ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (currentUser) {
      Promise.resolve(getScopedStorage(currentUser.username).set('theme', theme));
    }
  }, [theme, currentUser]);

  // ── Persist modules ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    Promise.resolve(getScopedStorage(currentUser.username).set('modules', modules));
  }, [modules, currentUser]);

  // ── Persist free time ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    Promise.resolve(getScopedStorage(currentUser.username).set('free_time', freeTimeByDay));
  }, [freeTimeByDay, currentUser]);

  // ── Generate / Update Monthly Study Plan ───────────────────────────────────
  useEffect(() => {
    if (modules && modules.length > 0) {
      const result = generateMonthlyStudyPlan(modules, freeTimeByDay, slqfMultiplier, sessionLength);
      setPlanResult(result);
    }
  }, [modules, freeTimeByDay, slqfMultiplier, sessionLength]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Reset (only clears the scoped user data) ──────────────────────────────────
  const handleResetData = () => {
    if (!window.confirm('Are you sure you want to reset all modules and free time entries?')) return;
    if (currentUser) {
      const store = getScopedStorage(currentUser.username);
      Promise.all([
        Promise.resolve(store.remove('modules')),
        Promise.resolve(store.remove('free_time')),
        Promise.resolve(store.remove('completed_tasks')),
        Promise.resolve(store.remove('incomplete_tasks')),
      ]);
    }
    setSlqfMultiplier(2.5);
    setModules(INITIAL_MODULES);
    setFreeTimeByDay(INITIAL_FREE_TIME);
    setCurrentStep(0);
  };

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setModules(INITIAL_MODULES);
    setFreeTimeByDay(INITIAL_FREE_TIME);
    setPlanResult(null);
    setCurrentStep(0);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const totalSLQFHours = planResult ? planResult.totalSLQFRequiredHours : 0;

  // ── Auth Gate ──────────────────────────────────────────────────────────────────
  // Wait for session bootstrap before deciding to show auth or main app
  if (!appReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // ── Main App ────────────────────────────────────────────────────────────────
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
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '2.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        {/* Step 0: Home Page / My Task Dashboard */}
        {currentStep === 0 && (
          <HomePage
            planResult={planResult}
            currentUser={currentUser}
            onStartPlanner={() => goToStep(1)}
            onGoToStep={goToStep}
          />
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
            currentUser={currentUser}
            onPrevStep={() => goToStep(2)}
            onNextStep={() => goToStep(4)}
          />
        )}

        {/* Step 4: Workload Analytics & End-of-Month Recommendations */}
        {currentStep === 4 && (
          <AnalyticsView
            planResult={planResult}
            currentUser={currentUser}
            onPrevStep={() => goToStep(3)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        textAlign: 'center',
        padding: '1.75rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-main)',
        fontWeight: 500
      }}>
        Study Time Allocation System • Built for Student Success
      </footer>
    </div>
  );
}
