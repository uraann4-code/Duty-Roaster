import React, { useState } from 'react';
import { 
  Crown, 
  Users, 
  Mail, 
  FileText, 
  PhoneCall, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  Check, 
  MapPin, 
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { OfficialItem, TaskStatus } from '../types';
import { formatDateDisplay, formatTimeDisplay, isOverdue, isDueToday } from '../storage';

interface TaskCardProps {
  item: OfficialItem;
  onEdit: (item: OfficialItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus, completionNote?: string) => void;
  onToggleChecklist: (itemId: string, checkId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  item,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleChecklist,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNoteInput, setCompletionNoteInput] = useState('');

  const overdue = isOverdue(item);
  const dueToday = isDueToday(item);
  const isPending = item.status === 'pending' || item.status === 'in_progress';
  const isUrgent = item.priority === 'urgent';
  const completedCheckCount = item.checklist?.filter((c) => c.completed).length || 0;
  const totalCheckCount = item.checklist?.length || 0;

  const getTypeIcon = () => {
    switch (item.type) {
      case 'directive':
        return <Crown className="w-3.5 h-3.5 text-orange-400" />;
      case 'meeting':
        return <Users className="w-3.5 h-3.5 text-blue-400" />;
      case 'correspondence':
        return <Mail className="w-3.5 h-3.5 text-amber-400" />;
      case 'report':
        return <FileText className="w-3.5 h-3.5 text-slate-300" />;
      case 'followup':
        return <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'directive':
        return "Boss Directive";
      case 'meeting':
        return 'Meeting';
      case 'correspondence':
        return 'Inward Dak';
      case 'report':
        return 'Note Sheet';
      case 'followup':
        return 'Follow-up';
    }
  };

  const handleConfirmComplete = () => {
    onStatusChange(item.id, 'completed', completionNoteInput.trim() || 'Disposed off and completed successfully.');
    setShowCompleteModal(false);
    setCompletionNoteInput('');
  };

  // Determine card border & background highlight according to Light Bento theme
  const getCardStyle = () => {
    if (item.status === 'completed') {
      return 'bg-slate-50 border border-slate-200 border-l-4 border-l-slate-400 opacity-80';
    }
    if (overdue) {
      return 'bg-red-50 border border-red-200 border-l-4 border-l-red-500 shadow-xs ring-1 ring-red-300';
    }
    if (isUrgent && isPending) {
      return 'bg-amber-50/90 border border-amber-300 border-l-4 border-l-amber-500 shadow-xs ring-1 ring-amber-200';
    }
    if (item.isHighlightedAsSirDirective && isPending) {
      return 'bg-orange-50/80 border border-orange-200 border-l-4 border-l-orange-500 shadow-xs';
    }
    if (item.status === 'in_progress') {
      return 'bg-yellow-50/80 border border-yellow-200 border-l-4 border-l-yellow-500 shadow-xs';
    }
    return 'bg-white border border-slate-200 border-l-4 border-l-blue-600 hover:border-slate-300 shadow-xs';
  };

  return (
    <div 
      id={`card-task-${item.id}`}
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 ${getCardStyle()}`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Priority / Type tag */}
          {item.status === 'completed' ? (
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">COMPLETED</p>
          ) : isUrgent ? (
            <p className="text-xs text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">HIGH PRIORITY - PENDING</p>
          ) : item.status === 'in_progress' ? (
            <p className="text-xs text-yellow-900 bg-yellow-100/90 border border-yellow-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">IN PROGRESS</p>
          ) : (
            <p className="text-xs text-blue-900 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">ROUTINE - PENDING</p>
          )}

          {/* Reference / Diary Badge */}
          <span className="font-mono-ref text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-bold">
            {item.referenceNo}
          </span>

          {/* Sir Directive Tag */}
          {item.isHighlightedAsSirDirective && isPending && (
            <span className="bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
              <Crown className="w-3 h-3 text-orange-700" />
              SIR DIRECTIVE
            </span>
          )}
        </div>

        {/* Status Indicator Pill */}
        <div className="flex items-center space-x-2">
          {item.status === 'completed' ? (
            <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded text-[10px] font-extrabold border border-slate-300">
              ARCHIVED
            </span>
          ) : overdue ? (
            <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded text-[10px] font-extrabold border border-red-300 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-700" />
              OVERDUE
            </span>
          ) : isUrgent ? (
            <span className="px-2.5 py-1 bg-amber-200 text-amber-950 rounded text-[10px] font-extrabold border border-amber-300">
              REQUIRED TODAY
            </span>
          ) : item.status === 'in_progress' ? (
            <span className="px-2.5 py-1 bg-yellow-200 text-yellow-950 rounded text-[10px] font-extrabold border border-yellow-300">
              IN PROGRESS
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-blue-100 text-blue-900 rounded text-[10px] font-extrabold border border-blue-300">
              ACTIVE DESK
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="pt-3 pb-2 space-y-2.5">
        {/* Title */}
        <h3 className={`text-base sm:text-lg font-bold text-slate-900 leading-snug ${item.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
          {item.title}
        </h3>

        <p className="text-xs text-slate-700 font-medium">
          Assigned by <span className="text-slate-950 font-bold">{item.assignedBy}</span> ({formatTimeDisplay(item.dueTime)})
        </p>

        {/* Action Required Callout */}
        {item.actionRequired && (
          <div className="bg-white border border-amber-300 p-3 rounded-xl text-xs shadow-2xs">
            <span className="font-extrabold text-orange-800 uppercase text-[11px] block tracking-wider">
              ACTION REQUIRED / OUTPUT:
            </span>
            <p className="font-bold text-slate-900 mt-1 text-xs sm:text-sm">{item.actionRequired}</p>
          </div>
        )}

        {/* Meeting Venue or Dak Source */}
        {item.locationOrVenue && (
          <div className="flex items-center space-x-1.5 text-xs text-blue-900 bg-blue-50/90 px-3 py-2 rounded-lg border border-blue-200">
            <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-extrabold text-blue-950">Venue:</span>
            <span className="font-semibold">{item.locationOrVenue}</span>
          </div>
        )}

        {item.correspondenceSource && (
          <div className="flex items-center space-x-1.5 text-xs text-amber-900 bg-amber-50/90 px-3 py-2 rounded-lg border border-amber-200">
            <Building className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-extrabold text-amber-950">Source / Ministry:</span>
            <span className="font-semibold">{item.correspondenceSource}</span>
          </div>
        )}

        {/* Instructions / Description (if expanded or short) */}
        {item.description && (
          <p className={`text-xs sm:text-sm text-slate-800 leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-2'}`}>
            {item.description}
          </p>
        )}

        {/* Checklist preview or full checklist */}
        {totalCheckCount > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-800 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>Checklist:</span>
                <span className="text-[11px] font-extrabold text-indigo-900 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded-full">
                  {completedCheckCount} / {totalCheckCount}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5 text-xs cursor-pointer font-bold"
              >
                {isExpanded ? (
                  <><span>Hide Steps</span> <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <><span>View Steps</span> <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-1.5">
              {(isExpanded ? item.checklist : item.checklist.slice(0, 2)).map((check) => (
                <button
                  key={check.id}
                  type="button"
                  onClick={() => onToggleChecklist(item.id, check.id)}
                  className="w-full flex items-center space-x-2.5 text-left p-2 rounded-lg bg-white/70 hover:bg-white border border-slate-200/80 transition-colors text-xs cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      check.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {check.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={
                      check.completed
                        ? 'line-through text-slate-400 font-medium'
                        : 'text-slate-800 font-semibold'
                    }
                  >
                    {check.text}
                  </span>
                </button>
              ))}
              {!isExpanded && totalCheckCount > 2 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-indigo-700 hover:text-indigo-900 pt-1 font-bold block cursor-pointer"
                >
                  + {totalCheckCount - 2} more steps...
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion details if completed */}
        {item.status === 'completed' && item.completionNotes && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-xs text-emerald-900 mt-2">
            <span className="font-extrabold text-emerald-950">Disposal Remarks:</span> {item.completionNotes}
          </div>
        )}
      </div>

      {/* Footer Details: Assigned By, Due Date/Time, Action Buttons */}
      <div className="pt-3 mt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <div className="flex items-center space-x-1.5 font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className={dueToday ? 'text-indigo-900 font-bold' : overdue ? 'text-red-700 font-bold' : 'text-slate-700'}>
              {formatDateDisplay(item.dueDate)}
            </span>
            <span className="text-slate-400">at</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {formatTimeDisplay(item.dueTime)}
            </span>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center space-x-1.5">
          {/* Quick status transitions */}
          {item.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(item.id, 'in_progress')}
                title="Mark In Progress"
                className="px-2 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
              >
                In Progress
              </button>
              <button
                onClick={() => setShowCompleteModal(true)}
                title="Mark Completed / Disposed"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Dispose</span>
              </button>
            </>
          )}

          {item.status === 'in_progress' && (
            <button
              onClick={() => setShowCompleteModal(true)}
              title="Mark Completed"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Disposed</span>
            </button>
          )}

          {item.status === 'completed' && (
            <button
              onClick={() => onStatusChange(item.id, 'pending')}
              title="Reopen as Pending"
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reopen</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            title="Edit Item"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                onDelete(item.id);
              }
            }}
            title="Delete Item"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Completion Modal Prompt */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="text-base text-slate-900">Mark Official Record as Disposed</h4>
            </div>
            <p className="text-xs text-slate-600">
              Confirm disposal of: <span className="font-semibold text-slate-900">{item.title}</span>
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Disposal Remarks / Dispatch Reference:
              </label>
              <textarea
                rows={2}
                value={completionNoteInput}
                onChange={(e) => setCompletionNoteInput(e.target.value)}
                placeholder="e.g. File signed by Sir and dispatched to Ministry / Minutes issued."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Confirm Disposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
