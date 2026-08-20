import React, { useState } from 'react';
import { 
  Printer, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  FileText, 
  Eye, 
  LayoutList, 
  Crown, 
  Users, 
  Mail, 
  Clock,
  Sparkles
} from 'lucide-react';
import { OfficialItem, UserSettings, TaskStatus } from '../types';
import { formatDateDisplay, getTodayDateString } from '../storage';
import { PrintRosterSheet } from './PrintRosterSheet';
import { TaskCard } from './TaskCard';

interface DutyRosterViewProps {
  items: OfficialItem[];
  settings: UserSettings;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenNewTaskForDate: (date: string) => void;
  onEditTask: (item: OfficialItem) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus, completionNote?: string) => void;
  onToggleChecklist: (itemId: string, checkId: string) => void;
}

export const DutyRosterView: React.FC<DutyRosterViewProps> = ({
  items,
  settings,
  selectedDate,
  setSelectedDate,
  onOpenNewTaskForDate,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onToggleChecklist,
}) => {
  const [viewMode, setViewMode] = useState<'sheet' | 'cards'>('sheet');
  const [filterType, setFilterType] = useState<string>('all');

  const today = getTodayDateString();

  // Filter items for the selected date
  const dateItems = items.filter((item) => item.dueDate === selectedDate);
  const filteredItems = dateItems.filter((item) => {
    if (filterType === 'pending') return item.status !== 'completed';
    if (filterType === 'completed') return item.status === 'completed';
    if (filterType === 'directive') return item.type === 'directive';
    if (filterType === 'meeting') return item.type === 'meeting';
    if (filterType === 'correspondence') return item.type === 'correspondence';
    return true;
  });

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d - 1);
    const yStr = prev.getFullYear();
    const mStr = String(prev.getMonth() + 1).padStart(2, '0');
    const dStr = String(prev.getDate()).padStart(2, '0');
    setSelectedDate(`${yStr}-${mStr}-${dStr}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    const yStr = next.getFullYear();
    const mStr = String(next.getMonth() + 1).padStart(2, '0');
    const dStr = String(next.getDate()).padStart(2, '0');
    setSelectedDate(`${yStr}-${mStr}-${dStr}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const pendingCount = dateItems.filter((i) => i.status !== 'completed').length;
  const urgentCount = dateItems.filter((i) => i.priority === 'urgent' && i.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Date Navigation & Actions Toolbar (Hidden during print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(today)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedDate === today
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today
            </button>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Native Date Input */}
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              id="input-roster-date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <span className="text-xs font-bold text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            {formatDateDisplay(selectedDate)}
          </span>
        </div>

        {/* Action Buttons: View Toggle, Add Task, Print PDF */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'sheet'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Preview</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-blue-400" />
              <span>Card Grid</span>
            </button>
          </div>

          {/* Quick Add for this Date */}
          <button
            onClick={() => onOpenNewTaskForDate(selectedDate)}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add to {selectedDate === today ? 'Today' : 'Date'}</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            id="btn-print-duty-roster"
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Duty Roster (PDF)</span>
          </button>
        </div>
      </div>

      {/* Roster Sheet Preview or Cards View */}
      {viewMode === 'sheet' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
          {/* Printable Official Sheet */}
          <PrintRosterSheet
            date={selectedDate}
            items={dateItems}
            settings={settings}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Date Summary bar in Card View */}
          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Duty & Agenda for {formatDateDisplay(selectedDate)}</span>
                {urgentCount > 0 && (
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {urgentCount} URGENT
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {dateItems.length} total assignments • {pendingCount} pending action
              </p>
            </div>

            {/* Quick Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All ({dateItems.length})
              </button>
              <button
                onClick={() => setFilterType('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'pending' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilterType('directive')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'directive' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Directives
              </button>
              <button
                onClick={() => setFilterType('meeting')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'meeting' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Meetings
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
              <p className="text-slate-400 text-sm font-medium">
                No items matching filter for {formatDateDisplay(selectedDate)}.
              </p>
              <button
                onClick={() => onOpenNewTaskForDate(selectedDate)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add First Directive / Dak for this Date</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <TaskCard
                  key={item.id}
                  item={item}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                  onToggleChecklist={onToggleChecklist}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
