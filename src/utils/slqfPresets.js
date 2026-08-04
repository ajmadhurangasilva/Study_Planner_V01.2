// SLQF (Sri Lanka Qualifications Framework) Presets and Academic Workload Multipliers

export const DEGREE_STREAMS = [
  {
    id: 'it_computing',
    name: 'IT & Software Engineering',
    institution: 'SLIIT / UCSC / UOM / NSBM / IIT / KDU',
    icon: '💻',
    slqfMultiplier: 2.5, // 2.5 self-study hours per week per credit
    description: 'Includes programming lab prep, code assignments, and project work.',
    recommendedModules: [
      { name: 'Data Structures & Algorithms', code: 'IT2010', credits: 4, difficulty: 'hard', priority: 'A' },
      { name: 'Object Oriented Programming', code: 'IT2020', credits: 3, difficulty: 'medium', priority: 'A' },
      { name: 'Database Management Systems', code: 'IT2030', credits: 3, difficulty: 'medium', priority: 'B' },
      { name: 'Software Engineering Principles', code: 'IT2040', credits: 3, difficulty: 'medium', priority: 'B' },
      { name: 'Mathematics for Computing', code: 'IT2050', credits: 3, difficulty: 'hard', priority: 'A' },
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    institution: 'UOM / UOP / KDU / SLIIT / FOE',
    icon: '⚙️',
    slqfMultiplier: 3.0, // 3.0 self-study hours per week per credit
    description: 'Intensive mathematical modeling, design tutorials, and lab reports.',
    recommendedModules: [
      { name: 'Fluid Mechanics', code: 'CE201', credits: 3, difficulty: 'hard', priority: 'A' },
      { name: 'Engineering Mathematics II', code: 'MA202', credits: 4, difficulty: 'very_hard', priority: 'A' },
      { name: 'Thermodynamics & Heat Transfer', code: 'ME203', credits: 3, difficulty: 'hard', priority: 'B' },
      { name: 'Circuit Theory & Electronics', code: 'EE204', credits: 4, difficulty: 'medium', priority: 'B' },
      { name: 'Mechanics of Materials', code: 'CE205', credits: 3, difficulty: 'medium', priority: 'B' },
    ]
  },
  {
    id: 'management',
    name: 'Business & Management',
    institution: 'UOP / USJ / UOC / NSBM / SLIIT / APIIT',
    icon: '📊',
    slqfMultiplier: 2.0, // 2.0 self-study hours per week per credit
    description: 'Case studies, financial report analysis, and group presentations.',
    recommendedModules: [
      { name: 'Financial Accounting', code: 'ACC101', credits: 3, difficulty: 'medium', priority: 'A' },
      { name: 'Principles of Marketing', code: 'MKT102', credits: 3, difficulty: 'easy', priority: 'B' },
      { name: 'Business Statistics', code: 'BCA103', credits: 3, difficulty: 'hard', priority: 'A' },
      { name: 'Organizational Behavior', code: 'MGT104', credits: 3, difficulty: 'medium', priority: 'C' },
      { name: 'Macroeconomics', code: 'ECN105', credits: 4, difficulty: 'medium', priority: 'B' },
    ]
  },
  {
    id: 'science',
    name: 'Physical & Biological Sciences',
    institution: 'UOC / USJ / UOK / UOP / Ruhuna',
    icon: '🧬',
    slqfMultiplier: 2.5, // 2.5 self-study hours per week per credit
    description: 'Practical lab write-ups, theoretical derivations, and research reading.',
    recommendedModules: [
      { name: 'Organic Chemistry II', code: 'CHE201', credits: 4, difficulty: 'hard', priority: 'A' },
      { name: 'Genetics & Molecular Biology', code: 'BIO202', credits: 3, difficulty: 'medium', priority: 'A' },
      { name: 'Classical Mechanics & Waves', code: 'PHY203', credits: 3, difficulty: 'hard', priority: 'B' },
      { name: 'Biostatistics', code: 'STA204', credits: 3, difficulty: 'medium', priority: 'B' },
    ]
  },
  {
    id: 'custom',
    name: 'Custom / General Degree',
    institution: 'All Sri Lankan Universities',
    icon: '🎓',
    slqfMultiplier: 2.5,
    description: 'Custom self-study hours configuration based on your specific requirements.',
    recommendedModules: [
      { name: 'Core Module 01', code: 'MOD101', credits: 3, difficulty: 'medium', priority: 'A' },
      { name: 'Core Module 02', code: 'MOD102', credits: 3, difficulty: 'medium', priority: 'B' },
      { name: 'Elective Subject', code: 'MOD103', credits: 2, difficulty: 'easy', priority: 'C' },
    ]
  }
];

export const DIFFICULTY_FACTORS = {
  easy: { label: 'Easy (0.8x)', weight: 0.8, color: '#10b981' },
  medium: { label: 'Moderate (1.0x)', weight: 1.0, color: '#06b6d4' },
  hard: { label: 'Hard (1.25x)', weight: 1.25, color: '#f59e0b' },
  very_hard: { label: 'Very Hard (1.5x)', weight: 1.5, color: '#ef4444' }
};

export const TARGET_GRADE_FACTORS = {
  A_PLUS: { label: 'A+ / Distinction (1.2x)', weight: 1.2 },
  A: { label: 'A / Target High GPA (1.1x)', weight: 1.1 },
  B: { label: 'B / Pass Comfortably (1.0x)', weight: 1.0 },
  C: { label: 'C / Minimum Pass (0.85x)', weight: 0.85 }
};

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
