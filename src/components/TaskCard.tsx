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

  // Determine card border & background highlight according to Bento theme
  const getCardStyle = () => {
    if (item.status === 'completed') {
      return 'bg-slate-900/60 border border-slate-800 border-l-4 border-l-slate-700 opacity-60';
    }
    if (overdue) {
      return 'bg-slate-900/90 border border-slate-800 border-l-4 border-l-red-500 shadow-md ring-1 ring-red-500/30';
    }
    if (isUrgent && isPending) {
      return 'bg-slate-900/90 border border-slate-800 border-l-4 border-l-orange-500 shadow-md';
    }
    if (item.isHighlightedAsSirDirective && isPending) {
      return 'bg-slate-900/90 border border-slate-800 border-l-4 border-l-orange-400 shadow-sm';
    }
    if (item.status === 'in_progress') {
      return 'bg-slate-900/90 border border-slate-800 border-l-4 border-l-yellow-500 shadow-sm';
    }
    return 'bg-slate-900/80 border border-slate-800 border-l-4 border-l-blue-500 hover:border-slate-700 shadow-xs';
  };

  return (
    <div 
      id={`card-task-${item.id}`}
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 ${getCardStyle()}`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Priority / Type tag */}
          {item.status === 'completed' ? (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">COMPLETED</p>
          ) : isUrgent ? (
            <p className="text-xs text-orange-400 font-bold uppercase tracking-wide">HIGH PRIORITY - PENDING</p>
          ) : item.status === 'in_progress' ? (
            <p className="text-xs text-yellow-400 font-bold uppercase tracking-wide">IN PROGRESS</p>
          ) : (
            <p className="text-xs text-blue-400 font-bold uppercase tracking-wide">ROUTINE - PENDING</p>
          )}

          {/* Reference / Diary Badge */}
          <span className="font-mono-ref text-[11px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-medium">
            {item.referenceNo}
          </span>

          {/* Sir Directive Tag */}
          {item.isHighlightedAsSirDirective && isPending && (
            <span className="bg-orange-500/10 text-orange-300 border border-orange-500/20 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Crown className="w-3 h-3 text-orange-400" />
              SIR DIRECTIVE
            </span>
          )}
        </div>

        {/* Status Indicator Pill */}
        <div className="flex items-center space-x-2">
          {item.status === 'completed' ? (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold border border-slate-700">
              ARCHIVED
            </span>
          ) : overdue ? (
            <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-bold border border-red-500/30 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              OVERDUE
            </span>
          ) : isUrgent ? (
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded text-[10px] font-bold border border-orange-500/20">
              REQUIRED TODAY
            </span>
          ) : item.status === 'in_progress' ? (
            <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded text-[10px] font-bold border border-yellow-500/20">
              IN PROGRESS
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold border border-blue-500/20">
              ACTIVE DESK
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="pt-3 pb-2 space-y-2">
        {/* Title */}
        <h3 className={`text-base font-semibold text-slate-100 leading-snug ${item.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
          {item.title}
        </h3>

        <p className="text-xs text-slate-400">
          Assigned by <span className="text-slate-300 font-medium">{item.assignedBy}</span> ({formatTimeDisplay(item.dueTime)})
        </p>

        {/* Action Required Callout */}
        {item.actionRequired && (
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-orange-400 uppercase text-[10px] block tracking-wide">
              Action Required / Output:
            </span>
            <p className="font-normal text-slate-200 mt-0.5">{item.actionRequired}</p>
          </div>
        )}

        {/* Meeting Venue or Dak Source */}
        {item.locationOrVenue && (
          <div className="flex items-center space-x-1.5 text-xs text-blue-300 bg-blue-950/40 px-2.5 py-1.5 rounded-lg border border-blue-900/50">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-blue-200">Venue:</span>
            <span>{item.locationOrVenue}</span>
          </div>
        )}

        {item.correspondenceSource && (
          <div className="flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-950/30 px-2.5 py-1.5 rounded-lg border border-amber-900/40">
            <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-200">Source / Ministry:</span>
            <span>{item.correspondenceSource}</span>
          </div>
        )}

        {/* Instructions / Description (if expanded or short) */}
        {item.description && (
          <p className={`text-xs text-slate-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
            {item.description}
          </p>
        )}

        {/* Checklist preview or full checklist */}
        {totalCheckCount > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                <span>Checklist:</span>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-1.5 py-0.2 rounded">
                  {completedCheckCount} / {totalCheckCount}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-0.5 text-xs cursor-pointer"
              >
                {isExpanded ? (
                  <><span>Hide Steps</span> <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <><span>View Steps</span> <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-1">
              {(isExpanded ? item.checklist : item.checklist.slice(0, 2)).map((check) => (
                <button
                  key={check.id}
                  type="button"
                  onClick={() => onToggleChecklist(item.id, check.id)}
                  className="w-full flex items-center space-x-2 text-left p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-xs cursor-pointer"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      check.completed
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {check.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span
                    className={
                      check.completed
                        ? 'line-through text-slate-500 font-normal'
                        : 'text-slate-300 font-medium'
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
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 pt-0.5 font-medium block cursor-pointer"
                >
                  + {totalCheckCount - 2} more steps...
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion details if completed */}
        {item.status === 'completed' && item.completionNotes && (
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-2 text-xs text-emerald-300 mt-2">
            <span className="font-bold text-emerald-200">Disposal Remarks:</span> {item.completionNotes}
          </div>
        )}
      </div>

      {/* Footer Details: Assigned By, Due Date/Time, Action Buttons */}
      <div className="pt-3 mt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <div className="flex items-center space-x-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className={dueToday ? 'text-indigo-300 font-bold' : overdue ? 'text-red-400 font-bold' : 'text-slate-300'}>
              {formatDateDisplay(item.dueDate)}
            </span>
            <span className="text-slate-500">at</span>
            <span className="font-bold text-slate-200">
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
                className="px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                In Progress
              </button>
              <button
                onClick={() => setShowCompleteModal(true)}
                title="Mark Completed / Disposed"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Disposed</span>
            </button>
          )}

          {item.status === 'completed' && (
            <button
              onClick={() => onStatusChange(item.id, 'pending')}
              title="Reopen as Pending"
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reopen</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            title="Edit Item"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-800/80"
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
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer border border-slate-800/80"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Completion Modal Prompt */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-800 space-y-4 text-slate-100">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="text-base text-white">Mark Official Record as Disposed</h4>
            </div>
            <p className="text-xs text-slate-300">
              Confirm disposal of: <span className="font-semibold text-white">{item.title}</span>
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Disposal Remarks / Dispatch Reference:
              </label>
              <textarea
                rows={2}
                value={completionNoteInput}
                onChange={(e) => setCompletionNoteInput(e.target.value)}
                placeholder="e.g. File signed by Sir and dispatched to Ministry / Minutes issued."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs"
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
