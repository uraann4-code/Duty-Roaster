import { OfficialItem, UserSettings } from './types';

const STORAGE_KEY = 'official_duty_items_v1';
const SETTINGS_KEY = 'official_duty_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  officeName: 'Executive Office & Secretariat',
  departmentName: 'Administration & Coordination Directorate',
  officerName: 'Mubashir Qayyum',
  officerTitle: 'Personal Assistant / Executive Coordinator',
  superiorTitle: 'Director General / Worthy Sir',
  showUrgentAlerts: true,
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTimeDisplay = (timeStr: string): string => {
  if (!timeStr) return 'End of Day';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

export const isOverdue = (item: OfficialItem): boolean => {
  if (item.status === 'completed') return false;
  const today = getTodayDateString();
  if (item.dueDate < today) return true;
  if (item.dueDate === today && item.dueTime) {
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const [dueH, dueM] = item.dueTime.split(':').map(Number);
    if (currentH > dueH || (currentH === dueH && currentM > dueM)) {
      return true;
    }
  }
  return false;
};

export const isDueToday = (item: OfficialItem): boolean => {
  return item.dueDate === getTodayDateString();
};

export const getSampleInitialItems = (): OfficialItem[] => {
  const today = getTodayDateString();
  const [year, month, day] = today.split('-').map(Number);
  
  // Helper to format offset dates
  const getDateWithOffset = (offsetDays: number): string => {
    const d = new Date(year, month - 1, day + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  return [
    {
      id: 'task-101',
      title: "Draft Briefing Note on Revised Annual Budget Allocation for Sir's Sign-off",
      type: 'directive',
      referenceNo: 'DIR/BUD-2026/089',
      assignedBy: 'Director General (Sir)',
      assignee: 'Executive Assistant (Self)',
      department: 'Finance & Planning Secretariat',
      dueDate: today,
      dueTime: '11:30',
      priority: 'urgent',
      status: 'pending',
      description: 'Sir explicitly ordered this morning to prepare a concise 2-page brief highlighting department-wise budget utilization and pending sanctions for the upcoming Ministry coordination meeting.',
      actionRequired: 'Put up file with comparative summary sheet before 11:30 AM.',
      checklist: [
        { id: 'c1', text: 'Collect latest expenditure sheet from Accounts Officer', completed: true },
        { id: 'c2', text: 'Draft 2-page executive summary in official format', completed: false },
        { id: 'c3', text: 'Flag relevant Annexures A & B for Sir signature', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 2).toISOString(),
      tags: ['Budget', 'Sir Directive', 'Immediate'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-102',
      title: 'High-Level Coordination & Monthly Progress Review Meeting',
      type: 'meeting',
      referenceNo: 'MTG/HQ/2026-AUG/14',
      assignedBy: 'Worthy Sir / DG',
      assignee: 'All Section Heads & PA',
      department: 'Executive Secretariat',
      dueDate: today,
      dueTime: '14:00',
      priority: 'high',
      status: 'pending',
      locationOrVenue: 'Main Committee Room (Floor 3) & Video Link',
      description: 'Monthly review meeting chaired by Worthy Sir. Need to ensure all file presentations, agenda notes, and working papers are placed on the table 15 minutes prior to start.',
      actionRequired: 'Ensure conference room AV setup, arrange file dockets, record official minutes of meeting.',
      checklist: [
        { id: 'm1', text: 'Circulate final agenda to all Branch In-charges', completed: true },
        { id: 'm2', text: 'Prepare attendee attendance sheet and recorder notepad', completed: false },
        { id: 'm3', text: 'Brief Sir 10 minutes prior on key discussion points', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 6).toISOString(),
      tags: ['Meeting', 'Chaired by Sir', 'Minutes Required'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-103',
      title: 'Official Inward Dak: Ministry Letter regarding National Public Grievance Portal Compliance',
      type: 'correspondence',
      referenceNo: 'DAK/INW/9842-F',
      assignedBy: 'Directorate Receipt & Dispatch',
      assignee: 'PA / Executive Desk',
      department: 'Public Affairs & Grievances',
      dueDate: today,
      dueTime: '16:00',
      priority: 'urgent',
      status: 'pending',
      correspondenceSource: 'Ministry of Federal Coordination (Letter No. 3-8/2026-Coord)',
      description: 'Incoming urgent letter received via registered courier. Compliance report on 7 pending citizen complaints required before close of business today.',
      actionRequired: 'Endorse to Section Officer (Admn), get compliance verified, put up draft reply for Sir approval.',
      checklist: [
        { id: 'd1', text: 'Diary the inward letter in register & scan copy', completed: true },
        { id: 'd2', text: 'Obtain status notes from concerned branches', completed: false },
        { id: 'd3', text: 'Prepare draft reply letter with endorsement stamp', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      tags: ['Dak', 'Ministry Letter', 'Compliance'],
      isHighlightedAsSirDirective: false,
    },
    {
      id: 'task-104',
      title: 'Submit Scrutiny Note & File on Office IT Equipment Procurement',
      type: 'report',
      referenceNo: 'FILE/PROC/IT-2026/45',
      assignedBy: 'Director (Operations)',
      assignee: 'Executive Assistant',
      department: 'Procurement Wing',
      dueDate: getDateWithOffset(1),
      dueTime: '12:00',
      priority: 'normal',
      status: 'in_progress',
      description: 'Tender evaluation committee minutes are signed. Need to compile financial comparative statement and submit file for Sir final sanction.',
      actionRequired: 'Compile tender evaluation files and verify sanction limits.',
      checklist: [
        { id: 'r1', text: 'Attach technical evaluation matrix', completed: true },
        { id: 'r2', text: 'Verify budget allocation availability with Accounts', completed: true },
        { id: 'r3', text: 'Draft sanction order for Sir signature', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 24).toISOString(),
      tags: ['Procurement', 'File Movement'],
      isHighlightedAsSirDirective: false,
    },
    {
      id: 'task-105',
      title: 'Telephone Follow-up with Regional Directors regarding Quarterly Inspection Reports',
      type: 'followup',
      referenceNo: 'TEL/REG/2026-Q3',
      assignedBy: 'Sir (Verbal Instruction)',
      assignee: 'Executive Assistant',
      department: 'Field Operations',
      dueDate: today,
      dueTime: '17:30',
      priority: 'high',
      status: 'pending',
      description: 'Sir instructed during morning tea to call all 4 regional directors and remind them to dispatch their Q3 inspection reports without further delay.',
      actionRequired: 'Call Regional Offices (Lahore, Karachi, Islamabad, Peshawar) and log dispatch tracking numbers.',
      checklist: [
        { id: 'f1', text: 'Call North Region Office', completed: true },
        { id: 'f2', text: 'Call South Region Office', completed: false },
        { id: 'f3', text: 'Call Central Region Office', completed: false },
        { id: 'f4', text: 'Submit telephonic briefing note to Sir', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 5).toISOString(),
      tags: ['Sir Directive', 'Follow-up', 'Regional'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-106',
      title: 'Signed Official Notification on Revised Office Timings Circulated',
      type: 'correspondence',
      referenceNo: 'NOTIF/ESTB/2026-19',
      assignedBy: 'Director General',
      assignee: 'Executive Desk',
      department: 'Establishment Branch',
      dueDate: getDateWithOffset(-1),
      dueTime: '15:00',
      priority: 'normal',
      status: 'completed',
      description: 'Notification signed by Sir yesterday evening regarding revised summer working hours.',
      actionRequired: 'Dispatched and uploaded on official intranet portal.',
      checklist: [
        { id: 'n1', text: 'Obtain Sir signature on original master sheet', completed: true },
        { id: 'n2', text: 'Dispatch copies to all branches & notice board', completed: true },
      ],
      createdDate: new Date(Date.now() - 3600000 * 30).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      completionNotes: 'All branches acknowledged receipt via email and dispatch peon book.',
      tags: ['Notification', 'Dispatched'],
      isHighlightedAsSirDirective: true,
    },
  ];
};

export const loadItemsFromStorage = (): OfficialItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = getSampleInitialItems();
      saveItemsToStorage(initial);
      return initial;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading items from localStorage:', err);
    return getSampleInitialItems();
  }
};

export const saveItemsToStorage = (items: OfficialItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving items to localStorage:', err);
  }
};

export const loadSettingsFromStorage = (): UserSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (err) {
    console.error('Error loading settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettingsToStorage = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
};
