import React from 'react';
import { 
  AlertTriangle, 
  Crown, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { OfficialItem } from '../types';
import { formatTimeDisplay, isOverdue, isDueToday } from '../storage';

interface PendingAlertBannerProps {
  items: OfficialItem[];
  onSelectFilter: (filterKey: string) => void;
  onOpenTask: (item: OfficialItem) => void;
}

export const PendingAlertBanner: React.FC<PendingAlertBannerProps> = ({
  items,
  onSelectFilter,
  onOpenTask,
}) => {
  const pendingItems = items.filter((i) => i.status === 'pending' || i.status === 'in_progress');
  const urgentPending = pendingItems.filter((i) => i.priority === 'urgent');
  const sirDirectivesPending = pendingItems.filter(
    (i) => i.isHighlightedAsSirDirective || i.type === 'directive'
  );
  const overdueItems = pendingItems.filter(isOverdue);
  const dueTodayItems = pendingItems.filter(isDueToday);

  if (pendingItems.length === 0) {
    return (
      <div className="no-print bg-white border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              All Official Directives & Correspondence are Disposed!
            </h3>
            <p className="text-xs text-slate-500">
              No pending tasks, urgent meetings, or unattended letters on your executive desk right now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print mb-6 space-y-4">
      {/* Top Urgent Alert Bar if any urgent item is pending */}
      {urgentPending.length > 0 && (
        <div 
          id="banner-urgent-pending"
          className="bg-amber-50/80 border border-amber-300 border-l-4 border-l-amber-500 text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl shrink-0">
                <Flame className="w-5 h-5 text-amber-600 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide">
                    ATTENTION REQUIRED
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {urgentPending.length} Immediate Work Items Pending Disposal
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Boss direct orders and high priority official correspondence awaiting action.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectFilter('urgent')}
              id="btn-filter-urgent-banner"
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>View {urgentPending.length} Urgent Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Urgent Items List Preview */}
          <div className="mt-3.5 pt-3 border-t border-amber-200/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {urgentPending.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenTask(item)}
                className="text-left bg-white hover:bg-amber-100/40 border border-amber-200/90 rounded-xl p-2.5 transition-colors flex items-start justify-between gap-2 cursor-pointer shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    {item.referenceNo} • {item.assignedBy}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {item.title}
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-amber-200">
                  {formatTimeDisplay(item.dueTime)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Pending */}
        <div 
          onClick={() => onSelectFilter('pending')}
          className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Ledger</span>
            <Clock className="w-4 h-4 text-indigo-600 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pendingItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Unfinished correspondence
          </p>
        </div>

        {/* Directives from Sir */}
        <div 
          onClick={() => onSelectFilter('sir_directives')}
          className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Boss Directives</span>
            <Crown className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600">
            {sirDirectivesPending.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Orders from Sir pending
          </p>
        </div>

        {/* Due Today */}
        <div 
          onClick={() => onSelectFilter('due_today')}
          className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Today's Roster</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {dueTodayItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Scheduled for today
          </p>
        </div>

        {/* Overdue / Delayed */}
        <div 
          onClick={() => onSelectFilter('overdue')}
          className={`bg-white border rounded-2xl p-4 transition-all cursor-pointer group shadow-xs ${
            overdueItems.length > 0 
              ? 'border-red-300 bg-red-50/50' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`flex items-center justify-between mb-1.5 ${
            overdueItems.length > 0 ? 'text-red-600 font-bold' : 'text-slate-500'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider">Overdue</span>
            <AlertTriangle className={`w-4 h-4 ${overdueItems.length > 0 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${overdueItems.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {overdueItems.length}
          </div>
          <p className={`text-[11px] mt-1 ${overdueItems.length > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
            {overdueItems.length > 0 ? 'Exceeded target deadline' : 'Zero overdue items'}
          </p>
        </div>
      </div>
    </div>
  );
};
