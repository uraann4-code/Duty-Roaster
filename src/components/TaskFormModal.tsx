import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Crown, 
  Users, 
  Mail, 
  FileText, 
  PhoneCall, 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { OfficialItem, TaskType, PriorityLevel, TaskStatus, ChecklistItem, UserSettings } from '../types';
import { getTodayDateString } from '../storage';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: OfficialItem) => void;
  initialItem?: OfficialItem | null;
  settings: UserSettings;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  settings,
}) => {
  const today = getTodayDateString();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('directive');
  const [referenceNo, setReferenceNo] = useState('');
  const [assignedBy, setAssignedBy] = useState(settings.superiorTitle || 'Director General (Sir)');
  const [assignee, setAssignee] = useState(settings.officerName || 'PA to Sir');
  const [department, setDepartment] = useState(settings.departmentName || 'Executive Secretariat');
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState('14:00');
  const [priority, setPriority] = useState<PriorityLevel>('urgent');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [description, setDescription] = useState('');
  const [locationOrVenue, setLocationOrVenue] = useState('');
  const [correspondenceSource, setCorrespondenceSource] = useState('');
  const [actionRequired, setActionRequired] = useState('');
  const [isHighlightedAsSirDirective, setIsHighlightedAsSirDirective] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // When initialItem changes or modal opens
  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setType(initialItem.type || 'directive');
      setReferenceNo(initialItem.referenceNo || '');
      setAssignedBy(initialItem.assignedBy || settings.superiorTitle);
      setAssignee(initialItem.assignee || settings.officerName);
      setDepartment(initialItem.department || settings.departmentName);
      setDueDate(initialItem.dueDate || today);
      setDueTime(initialItem.dueTime || '14:00');
      setPriority(initialItem.priority || 'high');
      setStatus(initialItem.status || 'pending');
      setDescription(initialItem.description || '');
      setLocationOrVenue(initialItem.locationOrVenue || '');
      setCorrespondenceSource(initialItem.correspondenceSource || '');
      setActionRequired(initialItem.actionRequired || '');
      setIsHighlightedAsSirDirective(initialItem.isHighlightedAsSirDirective ?? true);
      setChecklist(initialItem.checklist || []);
    } else {
      // Reset to defaults
      setTitle('');
      setType('directive');
      generateReference('directive');
      setAssignedBy(settings.superiorTitle || 'Director General (Sir)');
      setAssignee(settings.officerName || 'PA to Sir');
      setDepartment(settings.departmentName || 'Executive Secretariat');
      setDueDate(today);
      setDueTime('14:00');
      setPriority('urgent');
      setStatus('pending');
      setDescription('');
      setLocationOrVenue('');
      setCorrespondenceSource('');
      setActionRequired('');
      setIsHighlightedAsSirDirective(true);
      setChecklist([
        { id: 'c-1', text: 'Obtain relevant background papers & past file history', completed: false },
        { id: 'c-2', text: 'Put up draft for signature / submit briefing note', completed: false }
      ]);
    }
  }, [initialItem, isOpen, settings]);

  const generateReference = (selectedType: TaskType) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    if (selectedType === 'directive') {
      setReferenceNo(`DIR/SIR/${year}/${randomNum}`);
    } else if (selectedType === 'meeting') {
      setReferenceNo(`MTG/HQ/${year}/${randomNum}`);
    } else if (selectedType === 'correspondence') {
      setReferenceNo(`DAK/INW/${year}/${randomNum}`);
    } else if (selectedType === 'report') {
      setReferenceNo(`FILE/SUB/${year}/${randomNum}`);
    } else {
      setReferenceNo(`FOL/REM/${year}/${randomNum}`);
    }
  };

  const applyTemplate = (templateType: TaskType) => {
    setType(templateType);
    generateReference(templateType);
    if (templateType === 'directive') {
      setTitle('Sir Directive: ');
      setAssignedBy(settings.superiorTitle || 'Director General (Sir)');
      setPriority('urgent');
      setIsHighlightedAsSirDirective(true);
      setActionRequired('Compliance report / file to be submitted before given time.');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Gather required data / previous approvals', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Draft official note sheet', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Submit to Sir for perusal and sign-off', completed: false }
      ]);
    } else if (templateType === 'meeting') {
      setTitle('Official Meeting: ');
      setAssignedBy('Worthy Sir / Calling Officer');
      setPriority('high');
      setLocationOrVenue('Committee Room A / Video Link');
      setIsHighlightedAsSirDirective(true);
      setActionRequired('Arrange agenda files, working papers, and record official minutes.');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Send reminder notice & agenda to attendees', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Place file dockets on table 15 min prior', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Record and prepare draft minutes of meeting', completed: false }
      ]);
    } else if (templateType === 'correspondence') {
      setTitle('Official Inward Dak: ');
      setAssignedBy('Receipt & Dispatch Section');
      setCorrespondenceSource('Ministry / Department of ...');
      setPriority('urgent');
      setIsHighlightedAsSirDirective(false);
      setActionRequired('Process reply, endorse to concerned section, and seek Sir approval.');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Entry in Inward Diary Register', completed: true },
        { id: `c-${Date.now()}-2`, text: 'Examine previous correspondence references', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Put up draft reply for signature', completed: false }
      ]);
    } else if (templateType === 'report') {
      setTitle('Submission of File & Sanction Note: ');
      setAssignedBy('Section Officer / Self');
      setPriority('normal');
      setIsHighlightedAsSirDirective(false);
      setActionRequired('Put up file with complete noting and financial sanctions.');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Verify budget availability and rules', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Submit file to Competent Authority', completed: false }
      ]);
    } else {
      setTitle('Follow-up / Reminder Call: ');
      setAssignedBy(settings.superiorTitle || 'Sir');
      setPriority('high');
      setIsHighlightedAsSirDirective(true);
      setActionRequired('Call concerned officer, get dispatch tracking, and report back to Sir.');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Contact concerned office / authority', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Brief Sir on outcome of call', completed: false }
      ]);
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: `check-${Date.now()}`, text: newChecklistText.trim(), completed: false },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const itemToSave: OfficialItem = {
      id: initialItem?.id || `task-${Date.now()}`,
      title: title.trim(),
      type,
      referenceNo: referenceNo.trim() || `REF-${Date.now().toString().slice(-4)}`,
      assignedBy: assignedBy.trim() || 'Sir',
      assignee: assignee.trim() || settings.officerName,
      department: department.trim() || settings.departmentName,
      dueDate,
      dueTime,
      priority,
      status,
      description: description.trim(),
      locationOrVenue: type === 'meeting' ? locationOrVenue.trim() : undefined,
      correspondenceSource: type === 'correspondence' ? correspondenceSource.trim() : undefined,
      actionRequired: actionRequired.trim(),
      checklist,
      isHighlightedAsSirDirective,
      createdDate: initialItem?.createdDate || new Date().toISOString(),
      completedAt: status === 'completed' ? (initialItem?.completedAt || new Date().toISOString()) : undefined,
      completionNotes: initialItem?.completionNotes,
      tags: [
        type === 'directive' ? 'Sir Directive' : type === 'meeting' ? 'Meeting' : type === 'correspondence' ? 'Dak' : 'Official',
        priority === 'urgent' ? 'Urgent' : 'Standard',
      ],
    };

    onSave(itemToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-task-form"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
      >
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-600 rounded-xl text-white font-bold">
              {type === 'directive' ? <Crown className="w-5 h-5" /> :
               type === 'meeting' ? <Users className="w-5 h-5" /> :
               type === 'correspondence' ? <Mail className="w-5 h-5" /> :
               type === 'report' ? <FileText className="w-5 h-5" /> :
               <PhoneCall className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {initialItem ? 'Edit Official Record / Directive' : 'Enter Official Work / Boss Directive / Dak'}
              </h2>
              <p className="text-xs text-slate-400">
                Log official instructions, meetings, or correspondence with pending tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets / Templates */}
        {!initialItem && (
          <div className="bg-slate-950/60 px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Quick Templates:
            </span>
            <button
              type="button"
              onClick={() => applyTemplate('directive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'directive' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-xs' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              👑 Boss Directive (Sir ka Hukam)
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('meeting')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'meeting' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🏛️ Official Meeting
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('correspondence')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'correspondence' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              ✉️ Inward Dak / Official Letter
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('report')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'report' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              📁 Note Sheet / File
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Title & Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Subject / Directive Title <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              id="input-task-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare Briefing Note on Revised Budget / Attend Meeting with DG at 2 PM"
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none font-medium text-slate-100 placeholder:text-slate-500"
            />
          </div>

          {/* Grid row 1: Category, Ref No, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category / Nature of Work
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as TaskType;
                  setType(t);
                  generateReference(t);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="directive">Boss Directive (Sir's Task)</option>
                <option value="meeting">Official Meeting / Session</option>
                <option value="correspondence">Official Dak / Letter / Memo</option>
                <option value="report">File Submission / Note Sheet</option>
                <option value="followup">Telephone Follow-up / Reminder</option>
              </select>
            </div>

            {/* Reference / Diary No */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Diary / Ref No.</span>
                <button
                  type="button"
                  onClick={() => generateReference(type)}
                  className="text-[10px] text-indigo-400 hover:underline font-normal cursor-pointer"
                >
                  Auto-Gen
                </button>
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. DIR/BUD-2026/089"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Urgency & Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-bold bg-slate-950 ${
                  priority === 'urgent'
                    ? 'text-orange-400 border-orange-500/40'
                    : priority === 'high'
                    ? 'text-yellow-400 border-yellow-500/40'
                    : 'text-slate-200 border-slate-800'
                }`}
              >
                <option value="urgent">🔥 Immediate / Top Priority</option>
                <option value="high">⚡ High Priority</option>
                <option value="normal">📋 Routine / Normal</option>
                <option value="low">⏳ Deferred / Low</option>
              </select>
            </div>
          </div>

          {/* Grid row 2: Assigned By, Due Date, Due Time, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Assigned By */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Assigned By / Superior
              </label>
              <input
                type="text"
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                placeholder="e.g. Director General (Sir)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Target Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Duty / Due Date</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Scheduled Time</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-bold bg-slate-950 ${
                  status === 'pending'
                    ? 'text-orange-400 border-orange-500/40'
                    : status === 'in_progress'
                    ? 'text-yellow-400 border-yellow-500/40'
                    : 'text-emerald-400 border-emerald-500/40'
                }`}
              >
                <option value="pending">⏳ Pending Action (Active Desk)</option>
                <option value="in_progress">⚙️ In Progress / Under Process</option>
                <option value="completed">✅ Disposed / Completed</option>
                <option value="deferred">⏸️ Deferred / Kept in Abeyance</option>
              </select>
            </div>
          </div>

          {/* Conditional field for Meetings: Venue / Link */}
          {type === 'meeting' && (
            <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/50">
              <label className="block text-xs font-bold text-blue-200 mb-1">
                Meeting Venue / Committee Room / Link
              </label>
              <input
                type="text"
                value={locationOrVenue}
                onChange={(e) => setLocationOrVenue(e.target.value)}
                placeholder="e.g. Conference Hall (Floor 2) / MS Teams Link"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Conditional field for Correspondence: Sender / Ministry */}
          {type === 'correspondence' && (
            <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/50">
              <label className="block text-xs font-bold text-amber-200 mb-1">
                Sender Ministry / Department / Organization Source
              </label>
              <input
                type="text"
                value={correspondenceSource}
                onChange={(e) => setCorrespondenceSource(e.target.value)}
                placeholder="e.g. Ministry of Interior (Section Coord-II) / Regional Directorate"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          {/* Detailed Instructions / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Verbal / Written Instructions given by Sir (Full Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what Sir said or what the file / letter requires in detail..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Action Required / Deliverable */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Specific Output / Action Required (Appears in Duty Roster Sheet)
            </label>
            <input
              type="text"
              value={actionRequired}
              onChange={(e) => setActionRequired(e.target.value)}
              placeholder="e.g. Put up file on table by 11:30 AM / Submit draft reply"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-medium"
            />
          </div>

          {/* Interactive Checklist Builder */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Action Checklist / Sub-tasks ({checklist.filter(c => c.completed).length}/{checklist.length})</span>
            </label>

            {checklist.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className="flex items-center space-x-2 text-left flex-1 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={
                          item.completed
                            ? 'line-through text-slate-500 font-normal'
                            : 'text-slate-200 font-medium'
                        }
                      >
                        {item.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add checklist step (e.g. Call Section Officer)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
          </div>

          {/* Highlight toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="cb-sir-directive"
              checked={isHighlightedAsSirDirective}
              onChange={(e) => setIsHighlightedAsSirDirective(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="cb-sir-directive" className="text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-orange-400" />
              Highlight as Boss Directive on Dashboard & Duty Roster
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            id="btn-save-task"
            className="px-5 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{initialItem ? 'Update Official Record' : 'Save Directive / Dak Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
