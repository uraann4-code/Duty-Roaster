import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  Clock, 
  PlusCircle, 
  Printer, 
  Settings, 
  CheckCircle2, 
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';
import { UserSettings } from '../types';
import { formatDateDisplay } from '../storage';

interface NavbarProps {
  activeTab: 'tasks' | 'roster' | 'archive';
  setActiveTab: (tab: 'tasks' | 'roster' | 'archive') => void;
  onOpenNewTask: () => void;
  onOpenSettings: () => void;
  pendingCount: number;
  urgentPendingCount: number;
  settings: UserSettings;
  selectedRosterDate: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTask,
  onOpenSettings,
  pendingCount,
  urgentPendingCount,
  settings,
  selectedRosterDate,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="no-print bg-slate-950 border-b border-slate-800/90 text-slate-100 sticky top-0 z-30 backdrop-blur-md">
      {/* Top Banner / Department bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            {settings.officeName || 'Executive Office'}
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 truncate max-w-[280px] sm:max-w-none">
            {settings.departmentName || 'Secretariat & Correspondence Wing'}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 font-mono-ref">
            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-slate-200 font-medium">{currentTime || '00:00:00'}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today: {formatDateDisplay(todayStr)}</span>
          </div>
          <button
            onClick={onOpenSettings}
            id="btn-nav-settings"
            title="Configure Office Details & Backup Data"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-800/60"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Official Correspondence Ledger</span>
            {urgentPendingCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full animate-urgent-glow">
                <AlertOctagon className="w-3.5 h-3.5" />
                {urgentPendingCount} URGENT
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Tracking and duty roster for {formatDateDisplay(selectedRosterDate || todayStr)} • Officer: <span className="text-slate-300 font-semibold">{settings.officerName}</span> ({settings.officerTitle})
          </p>
        </div>

        {/* Navigation Tabs and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Tab buttons */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-medium">
            <button
              id="tab-active-directives"
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Ledger & Directives</span>
              {pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    urgentPendingCount > 0
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="tab-duty-roster"
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Duty Roster (PDF)</span>
            </button>

            <button
              id="tab-completed-archive"
              onClick={() => setActiveTab('archive')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Archived</span>
            </button>
          </div>

          {/* New Entry Button */}
          <button
            id="btn-quick-new-task"
            onClick={onOpenNewTask}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Correspondence</span>
          </button>
        </div>
      </div>
    </header>
  );
};
