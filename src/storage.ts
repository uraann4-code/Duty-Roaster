import { OfficialItem, UserSettings } from './types';

const STORAGE_KEY = 'official_duty_items_v1';
const SETTINGS_KEY = 'official_duty_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  officeName: 'Office of the Head of Examination (HOE)',
  departmentName: 'Examination & Assessment Directorate',
  officerName: 'Mubashir Qayyum',
  officerTitle: 'Personal Assistant / Assistant to HOE',
  superiorTitle: 'Head of Examination (HOE)',
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
      title: "Draft Briefing Note on Exam Center Allocation & Supervisory Staff for HOE Sign-off",
      type: 'directive',
      referenceNo: 'DIR/HOE-2026/089',
      assignedBy: 'Head of Examination (HOE)',
      assignee: 'Personal Assistant (Mubashir)',
      department: 'Examination & Assessment Directorate',
      dueDate: today,
      dueTime: '11:30',
      priority: 'urgent',
      status: 'pending',
      description: 'HOE (Sir) ordered this morning to prepare a concise briefing note on final exam centers, supervisory staff allocation, and CCTV monitoring arrangements for the upcoming annual examination.',
      actionRequired: 'Put up file with center-wise roster sheet to HOE before 11:30 AM.',
      checklist: [
        { id: 'c1', text: 'Collect center verification list from Secrecy / Conduct Branch', completed: true },
        { id: 'c2', text: 'Draft 2-page briefing note for HOE perusal', completed: false },
        { id: 'c3', text: 'Flag relevant Annexures A & B for HOE signature', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 2).toISOString(),
      tags: ['Examination', 'HOE Directive', 'Immediate'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-102',
      title: 'Examination Steering & Result Scrutiny Committee Meeting chaired by HOE',
      type: 'meeting',
      referenceNo: 'MTG/EXAM/2026-AUG/14',
      assignedBy: 'Head of Examination (HOE)',
      assignee: 'Assistant to HOE & Section Heads',
      department: 'Office of the Head of Examination',
      dueDate: today,
      dueTime: '14:00',
      priority: 'high',
      status: 'pending',
      locationOrVenue: 'HOE Conference Room (Exam Wing) & Video Link',
      description: 'Critical examination coordination & paper review meeting chaired by Worthy Head of Examination (HOE). Need to ensure all committee files, moderation files, and working sheets are placed on table 15 minutes prior.',
      actionRequired: 'Ensure conference room AV setup, arrange confidential file folders, record official meeting minutes.',
      checklist: [
        { id: 'm1', text: 'Circulate final agenda to Subject Conveners and Superintendents', completed: true },
        { id: 'm2', text: 'Prepare attendee attendance sheet and recorder notepad', completed: false },
        { id: 'm3', text: 'Brief HOE 10 minutes prior on key agenda points', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 6).toISOString(),
      tags: ['Meeting', 'Chaired by HOE', 'Minutes Required'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-103',
      title: 'Official Inward Dak: Board / Ministry Letter regarding Examination Security & Paper Printing Protocols',
      type: 'correspondence',
      referenceNo: 'DAK/EXAM/9842-F',
      assignedBy: 'Examination Receipt & Dispatch',
      assignee: 'PA to HOE Desk',
      department: 'Secrecy & Conduct Wing',
      dueDate: today,
      dueTime: '16:00',
      priority: 'urgent',
      status: 'pending',
      correspondenceSource: 'Ministry / Higher Education Board (Confidential Letter)',
      description: 'Incoming confidential letter regarding standard operating procedures for question paper transport, vault storage, and flying squad protocols. Compliance report required for HOE approval.',
      actionRequired: 'Endorse to Controller / Superintendent Secrecy, get compliance verified, put up draft reply for HOE approval.',
      checklist: [
        { id: 'd1', text: 'Diary the inward letter in Confidential Dak Register', completed: true },
        { id: 'd2', text: 'Obtain status notes from Secrecy section', completed: false },
        { id: 'd3', text: 'Prepare draft reply letter with endorsement stamp', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      tags: ['Dak', 'Confidential Letter', 'Compliance'],
      isHighlightedAsSirDirective: false,
    },
    {
      id: 'task-104',
      title: 'Submit Scrutiny Note & File on Examination Hall IT Equipment & Biometric Verification',
      type: 'report',
      referenceNo: 'FILE/EXAM-IT/2026/45',
      assignedBy: 'Deputy Controller (Exams)',
      assignee: 'Assistant to HOE',
      department: 'IT & Examination Logistics',
      dueDate: getDateWithOffset(1),
      dueTime: '12:00',
      priority: 'normal',
      status: 'in_progress',
      description: 'Evaluation committee minutes on biometric attendance machines for exam halls are ready. Need to compile comparative statement and submit file for HOE final approval.',
      actionRequired: 'Compile evaluation files and put up for HOE approval.',
      checklist: [
        { id: 'r1', text: 'Attach technical evaluation matrix for biometric devices', completed: true },
        { id: 'r2', text: 'Verify budget allocation availability with Accounts', completed: true },
        { id: 'r3', text: 'Draft sanction order for HOE signature', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 24).toISOString(),
      tags: ['Procurement', 'File Movement'],
      isHighlightedAsSirDirective: false,
    },
    {
      id: 'task-105',
      title: 'Telephone Follow-up with Chief Superintendents regarding Exam Center Inspection Preparedness',
      type: 'followup',
      referenceNo: 'TEL/HOE/2026-EXAM',
      assignedBy: 'HOE (Sir Verbal Instruction)',
      assignee: 'PA to HOE',
      department: 'Examination Vigilance',
      dueDate: today,
      dueTime: '17:30',
      priority: 'high',
      status: 'pending',
      description: 'HOE instructed to call all regional center superintendents and verify that question paper lockers, surveillance cameras, and admit card verification desks are ready.',
      actionRequired: 'Call Center In-charges (North, South, Central) and submit telephonic briefing note to HOE.',
      checklist: [
        { id: 'f1', text: 'Call North Center Chief Superintendent', completed: true },
        { id: 'f2', text: 'Call South Center Chief Superintendent', completed: false },
        { id: 'f3', text: 'Call Central Exam Complex Superintendent', completed: false },
        { id: 'f4', text: 'Submit telephonic briefing note to HOE (Sir)', completed: false },
      ],
      createdDate: new Date(Date.now() - 3600000 * 5).toISOString(),
      tags: ['HOE Directive', 'Follow-up', 'Exam Centers'],
      isHighlightedAsSirDirective: true,
    },
    {
      id: 'task-106',
      title: 'Signed Official Notification on Examination Date Sheet & Roll Number Slip Issuance',
      type: 'correspondence',
      referenceNo: 'NOTIF/HOE/2026-19',
      assignedBy: 'Head of Examination (HOE)',
      assignee: 'Executive Desk',
      department: 'Examination Conduct Branch',
      dueDate: getDateWithOffset(-1),
      dueTime: '15:00',
      priority: 'normal',
      status: 'completed',
      description: 'Official date sheet and roll number slip notification approved and signed by HOE (Sir) yesterday.',
      actionRequired: 'Dispatched to all institutions, affiliated colleges, and published on examination portal.',
      checklist: [
        { id: 'n1', text: 'Obtain HOE signature on original master notification', completed: true },
        { id: 'n2', text: 'Dispatch copies to all institutions and publish online', completed: true },
      ],
      createdDate: new Date(Date.now() - 3600000 * 30).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      completionNotes: 'Acknowledged by all centers and uploaded on portal.',
      tags: ['Notification', 'Dispatched'],
      isHighlightedAsSirDirective: true,
    },
  ];
};

export const loadItemsFromStorage = (): OfficialItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const parsed: OfficialItem[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading items from localStorage:', err);
    return [];
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
    const parsed = JSON.parse(data);
    const settings: UserSettings = { ...DEFAULT_SETTINGS, ...parsed };
    // Automatically update if previously contained Director General / DG
    if (!settings.superiorTitle || settings.superiorTitle.includes('Director General') || settings.superiorTitle.includes('DG')) {
      settings.superiorTitle = 'Head of Examination (HOE)';
    }
    if (settings.officeName.includes('Director General') || settings.officeName === 'Executive Office & Secretariat') {
      settings.officeName = 'Office of the Head of Examination (HOE)';
    }
    if (settings.officerTitle.includes('DG') || settings.officerTitle.includes('Executive Coordinator')) {
      settings.officerTitle = 'Personal Assistant to HOE';
    }
    return settings;
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
