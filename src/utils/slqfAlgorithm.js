import { DIFFICULTY_FACTORS, TARGET_GRADE_FACTORS, DAYS_OF_WEEK } from './slqfPresets';

/**
 * Helper to convert 'HH:MM' string to decimal hours (e.g. '17:30' -> 17.5)
 */
export function timeStringToDecimal(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) + (m || 0) / 60;
}

/**
 * Helper to calculate duration in hours between start '17:00' and end '21:00'
 */
export function calculateSlotDuration(startStr, endStr) {
  const start = timeStringToDecimal(startStr);
  let end = timeStringToDecimal(endStr);
  if (end <= start) end += 24; // Handle overnight slots
  return Math.max(0, end - start);
}

/**
 * Helper to convert decimal hours to formatted string '5:00 PM'
 */
export function formatDecimalTime(decimalHour) {
  const hour = Math.floor(decimalHour) % 24;
  const minutes = Math.round((decimalHour - Math.floor(decimalHour)) * 60);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHour}:${displayMinutes} ${period}`;
}

/**
 * Calculates total free hours for a day given time slots or numeric hours
 */
export function getDailyTotalFreeHours(daySlotData) {
  if (typeof daySlotData === 'number') return daySlotData;
  if (!Array.isArray(daySlotData)) return 0;
  return daySlotData.reduce((sum, slot) => sum + calculateSlotDuration(slot.start, slot.end), 0);
}

/**
 * Generates a 4-Week Monthly Study Plan
 */
export function generateMonthlyStudyPlan(modules, freeTimeByDay, slqfMultiplier = 2.5, sessionLength = 50) {
  if (!modules || modules.length === 0) {
    return { error: 'No modules provided' };
  }

  // 1. Calculate raw and weighted study hours per module
  let totalCredits = 0;
  let totalWeightedUnits = 0;

  const calculatedModules = modules.map((mod) => {
    const credits = parseFloat(mod.credits) || 1;
    totalCredits += credits;

    const diffFactor = DIFFICULTY_FACTORS[mod.difficulty]?.weight || 1.0;
    const gradeFactor = TARGET_GRADE_FACTORS[mod.targetGrade]?.weight || 1.0;

    const baseWeeklyHours = credits * slqfMultiplier;
    const weightedWeeklyHours = baseWeeklyHours * diffFactor * gradeFactor;

    totalWeightedUnits += weightedWeeklyHours;

    return {
      ...mod,
      credits,
      baseWeeklyHours,
      weightedWeeklyHours,
      color: mod.color || getRandomColor(mod.code || mod.name)
    };
  });

  // 2. Calculate Total Available Free Time across 1 week
  let totalAvailableWeeklyHours = 0;
  DAYS_OF_WEEK.forEach((day) => {
    totalAvailableWeeklyHours += getDailyTotalFreeHours(freeTimeByDay[day]);
  });

  const totalAvailableMonthlyHours = totalAvailableWeeklyHours * 4;
  const totalRequiredMonthlyHours = totalWeightedUnits * 4;

  // 3. Proportional Scaling
  const scalingRatio = totalAvailableWeeklyHours > 0 && totalWeightedUnits > 0
    ? Math.min(1.0, totalAvailableWeeklyHours / totalWeightedUnits)
    : 1.0;

  let totalAllocatedWeeklyHours = 0;
  const moduleAnalytics = calculatedModules.map((mod) => {
    const allocatedWeeklyHours = mod.weightedWeeklyHours * scalingRatio;
    const percentage = totalAvailableWeeklyHours > 0 ? (allocatedWeeklyHours / totalAvailableWeeklyHours) * 100 : 0;
    totalAllocatedWeeklyHours += allocatedWeeklyHours;

    return {
      ...mod,
      allocatedWeeklyHours: Math.round(allocatedWeeklyHours * 10) / 10,
      allocatedMonthlyHours: Math.round(allocatedWeeklyHours * 4 * 10) / 10,
      percentage: Math.round(percentage)
    };
  });

  // 4. Generate 4-Week Timetable
  const schedule = [];
  const breakLength = sessionLength === 25 ? 5 : 10;
  const blockDurationHours = (sessionLength + breakLength) / 60;

  for (let weekNum = 1; weekNum <= 4; weekNum++) {
    const remainingModuleHours = {};
    moduleAnalytics.forEach(m => {
      remainingModuleHours[m.id || m.code || m.name] = m.allocatedWeeklyHours;
    });

    DAYS_OF_WEEK.forEach((day) => {
      const dayData = freeTimeByDay[day];
      const slots = Array.isArray(dayData)
        ? dayData
        : [{ start: '17:00', end: formatEndHour('17:00', parseFloat(dayData) || 0) }];

      let blockIndex = 1;

      slots.forEach((slot) => {
        let currentDecimalTime = timeStringToDecimal(slot.start);
        const slotEndDecimalTime = timeStringToDecimal(slot.end);

        while (currentDecimalTime + blockDurationHours <= slotEndDecimalTime + 0.05) {
          let bestModule = null;
          let maxRemaining = -1;

          moduleAnalytics.forEach((m) => {
            const key = m.id || m.code || m.name;
            if (remainingModuleHours[key] > maxRemaining) {
              maxRemaining = remainingModuleHours[key];
              bestModule = m;
            }
          });

          if (!bestModule || maxRemaining <= 0) {
            bestModule = moduleAnalytics[(blockIndex - 1) % moduleAnalytics.length];
          }

          const key = bestModule.id || bestModule.code || bestModule.name;
          const blockStudyHours = sessionLength / 60;
          remainingModuleHours[key] = Math.max(0, remainingModuleHours[key] - blockStudyHours);

          const startTimeStr = formatDecimalTime(currentDecimalTime);
          const endTimeStr = formatDecimalTime(currentDecimalTime + blockDurationHours);

          schedule.push({
            id: `W${weekNum}-${day}-${blockIndex}-${bestModule.code}`,
            week: weekNum,
            day,
            blockIndex,
            startTime: startTimeStr,
            endTime: endTimeStr,
            rawStart: currentDecimalTime,
            rawEnd: currentDecimalTime + blockDurationHours,
            moduleId: bestModule.id || bestModule.code || bestModule.name,
            moduleName: bestModule.name,
            moduleCode: bestModule.code,
            credits: bestModule.credits,
            color: bestModule.color,
            sessionLength,
            breakLength
          });

          currentDecimalTime += blockDurationHours;
          blockIndex++;
        }
      });
    });
  }

  // Workload Status
  let workloadStatus = 'balanced';
  let statusMessage = '';
  let tips = [];

  if (totalAvailableWeeklyHours < totalCredits * 1.5) {
    workloadStatus = 'deficit';
    statusMessage = 'Time Deficit Alert';
    tips = [
      'Your free time is lower than the recommended self-study guidelines.',
      'Prioritize High-Credit and Hard subjects first.',
      'Consider adding extra weekend morning study slots.'
    ];
  } else {
    workloadStatus = 'balanced';
    statusMessage = 'Well-Balanced Monthly Plan';
    tips = [
      'Your available free time matches your credit load comfortably.',
      'Track your week-by-week progress to stay consistent across the month.',
      'Use open weekend slots for assignment prep and revision.'
    ];
  }

  return {
    totalCredits,
    totalSLQFRequiredHours: Math.round(totalWeightedUnits * 10) / 10,
    totalRequiredMonthlyHours: Math.round(totalRequiredMonthlyHours * 10) / 10,
    totalAvailableHours: Math.round(totalAvailableWeeklyHours * 10) / 10,
    totalAvailableMonthlyHours: Math.round(totalAvailableMonthlyHours * 10) / 10,
    totalAllocatedHours: Math.round(totalAllocatedWeeklyHours * 10) / 10,
    scalingRatio,
    workloadStatus,
    statusMessage,
    tips,
    moduleAnalytics,
    schedule
  };
}

/**
 * Available Buffer Catch-up Slots Pool
 */
const CATCHUP_SLOTS_POOL = [
  { day: 'Saturday', start: '09:00 AM', end: '10:00 AM', label: 'Saturday Morning Catch-Up Slot 1' },
  { day: 'Saturday', start: '10:00 AM', end: '11:00 AM', label: 'Saturday Morning Catch-Up Slot 2' },
  { day: 'Saturday', start: '11:00 AM', end: '12:00 PM', label: 'Saturday Midday Catch-Up Slot 3' },
  { day: 'Saturday', start: '03:00 PM', end: '04:00 PM', label: 'Saturday Afternoon Catch-Up Slot 4' },
  { day: 'Saturday', start: '04:00 PM', end: '05:00 PM', label: 'Saturday Evening Catch-Up Slot 5' },
  { day: 'Sunday', start: '09:00 AM', end: '10:00 AM', label: 'Sunday Morning Catch-Up Slot 1' },
  { day: 'Sunday', start: '10:00 AM', end: '11:00 AM', label: 'Sunday Morning Catch-Up Slot 2' },
  { day: 'Sunday', start: '02:00 PM', end: '03:00 PM', label: 'Sunday Afternoon Catch-Up Slot 3' },
  { day: 'Sunday', start: '03:00 PM', end: '04:00 PM', label: 'Sunday Afternoon Catch-Up Slot 4' },
  { day: 'Sunday', start: '05:00 PM', end: '06:00 PM', label: 'Sunday Evening Buffer Slot 5' }
];

/**
 * Dynamic, Non-Overlapping Catch-Up Reschedule Suggestion
 * @param {Object} task The missed task
 * @param {Number} missedIndex Index of this task among all missed tasks
 */
export function getRescheduleSuggestion(task, missedIndex = 0) {
  const poolIndex = missedIndex % CATCHUP_SLOTS_POOL.length;
  const slot = CATCHUP_SLOTS_POOL[poolIndex];
  return `${slot.day} ${slot.start} – ${slot.end} (${slot.label})`;
}

/**
 * Generates End-of-Month Personalized Recommendations based on task completion
 */
export function generateMonthlyRecommendations(schedule, completedTaskIds, incompleteTaskIds, moduleAnalytics) {
  const totalTasks = schedule.length;
  const completedCount = completedTaskIds.length;
  const incompleteCount = incompleteTaskIds.length;

  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const moduleStats = moduleAnalytics.map((mod) => {
    const modTasks = schedule.filter((s) => s.moduleId === (mod.id || mod.code || mod.name));
    const modCompleted = modTasks.filter((s) => completedTaskIds.includes(s.id)).length;
    const modIncomplete = modTasks.filter((s) => incompleteTaskIds.includes(s.id)).length;
    const modTotal = modTasks.length;
    const rate = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;

    return {
      name: mod.name,
      code: mod.code,
      completed: modCompleted,
      incomplete: modIncomplete,
      total: modTotal,
      rate
    };
  });

  const lowestMod = [...moduleStats].sort((a, b) => a.rate - b.rate)[0];

  const recommendations = [];

  if (completionRate >= 80) {
    recommendations.push('🌟 **Outstanding Monthly Performance!** You maintained a high completion rate above 80%.');
    recommendations.push('💡 Use next month to focus on advanced past paper questions and exam preparation.');
  } else if (completionRate >= 50) {
    recommendations.push('👍 **Good Steady Progress.** You completed over half of your planned study sessions.');
    if (lowestMod && lowestMod.rate < 50) {
      recommendations.push(`⚠️ **Subject Focus Required**: Add 1 extra weekly slot for **${lowestMod.code} - ${lowestMod.name}** (${lowestMod.rate}% completed).`);
    }
  } else {
    recommendations.push('⚡ **Workload Adjustment Advised.** Your monthly completion rate is below 50%.');
    recommendations.push('💡 Try reducing session lengths to 25-minute Pomodoros or increasing weekend buffer hours.');
  }

  if (incompleteCount > 0) {
    recommendations.push(`🔄 You have **${incompleteCount} incomplete sessions**. Use weekend buffer slots to catch up before exams.`);
  }

  return {
    completionRate,
    completedCount,
    incompleteCount,
    totalTasks,
    moduleStats,
    recommendations
  };
}

function formatEndHour(startStr, durationHours) {
  const startDecimal = timeStringToDecimal(startStr);
  const endDecimal = startDecimal + durationHours;
  const h = Math.floor(endDecimal) % 24;
  const m = Math.round((endDecimal - Math.floor(endDecimal)) * 60);
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

function getRandomColor(str = '') {
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}
