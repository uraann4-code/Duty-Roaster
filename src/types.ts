export type TaskType = 'directive' | 'meeting' | 'correspondence' | 'report' | 'followup';

export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface OfficialItem {
  id: string;
  title: string;
  type: TaskType;
  referenceNo: string;
  assignedBy: string;
  assignee: string;
  department: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm (24h)
  priority: PriorityLevel;
  status: TaskStatus;
  description: string;
  locationOrVenue?: string;
  checklist: ChecklistItem[];
  correspondenceSource?: string;
  actionRequired?: string;
  createdDate: string;
  completedAt?: string;
  completionNotes?: string;
  tags: string[];
  isHighlightedAsSirDirective: boolean;
}

export interface UserSettings {
  officeName: string;
  departmentName: string;
  officerName: string;
  officerTitle: string;
  superiorTitle: string;
  showUrgentAlerts: boolean;
}

export interface RosterSummary {
  totalCount: number;
  pendingCount: number;
  urgentCount: number;
  meetingsCount: number;
  correspondenceCount: number;
  completedCount: number;
}
