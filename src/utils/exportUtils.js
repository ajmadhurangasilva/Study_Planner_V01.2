// Export Utilities for Timetable Schedule (iCal, Print, JSON)

export function exportToICalendar(schedule, semesterName = 'SLQF Study Plan') {
  if (!schedule || schedule.length === 0) return;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sri Lanka Study Planner//SLQF Standard//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${semesterName}`
  ];

  const dayMap = {
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
    Sunday: 'SU'
  };

  schedule.forEach((item) => {
    const byDay = dayMap[item.day] || 'MO';
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:study-plan-${item.id}@slqf-planner`);
    icsContent.push(`DTSTAMP:${now}`);
    icsContent.push(`SUMMARY:📚 Study: ${item.moduleCode} - ${item.moduleName}`);
    icsContent.push(`DESCRIPTION:SLQF Study Session (${item.sessionLength} min study + ${item.breakLength} min break)`);
    icsContent.push(`RRULE:FREQ=WEEKLY;BYDAY=${byDay}`);
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${semesterName.toLowerCase().replace(/\s+/g, '_')}_schedule.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printSchedule() {
  window.print();
}

export function exportPlanJSON(data) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `slqf_study_plan_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
