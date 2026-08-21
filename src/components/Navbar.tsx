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
  dbConnected?: boolean;
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
  dbConnected = true,
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
    <header className="no-print bg-white/95 border-b border-slate-200 text-slate-900 sticky top-0 z-30 backdrop-blur-md">
      {/* Top Banner / Department bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800 uppercase tracking-wider">
            {settings.officeName || 'Executive Office'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 truncate max-w-[280px] sm:max-w-none">
            {settings.departmentName || 'Secretariat & Correspondence Wing'}
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-slate-600">
          <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
            dbConnected 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{dbConnected ? 'Database: Live Cloud Synced' : 'Database: Local Mode'}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono-ref">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="text-slate-700 font-medium">{currentTime || '00:00:00'}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-slate-500">
            <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
            <span>Today: {formatDateDisplay(todayStr)}</span>
          </div>
          <button
            onClick={onOpenSettings}
            id="btn-nav-settings"
            title="Configure Office Details & Backup Data"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <span>Official Correspondence Ledger</span>
            {urgentPendingCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <AlertOctagon className="w-3.5 h-3.5 text-orange-600" />
                {urgentPendingCount} URGENT
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tracking and duty roster for {formatDateDisplay(selectedRosterDate || todayStr)} • Officer: <span className="text-slate-800 font-semibold">{settings.officerName}</span> ({settings.officerTitle})
          </p>
        </div>

        {/* Navigation Tabs and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Tab buttons */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-medium">
            <button
              id="tab-active-directives"
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Ledger & Directives</span>
              {pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    urgentPendingCount > 0
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-slate-200 text-slate-800'
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
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Correspondence</span>
          </button>
        </div>
      </div>
    </header>
  );
};
