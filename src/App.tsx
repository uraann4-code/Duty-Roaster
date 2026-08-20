import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  Crown, 
  Users, 
  Mail, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  Layers, 
  Filter,
  FileCheck,
  CalendarCheck,
  Search
} from 'lucide-react';
import { OfficialItem, UserSettings, TaskStatus } from './types';
import { 
  loadItemsFromStorage, 
  saveItemsToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  getTodayDateString, 
  getSampleInitialItems,
  isOverdue,
  isDueToday
} from './storage';
import { Navbar } from './components/Navbar';
import { PendingAlertBanner } from './components/PendingAlertBanner';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { DutyRosterView } from './components/DutyRosterView';
import { TaskFormModal } from './components/TaskFormModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [items, setItems] = useState<OfficialItem[]>(() => loadItemsFromStorage());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettingsFromStorage());
  const [activeTab, setActiveTab] = useState<'tasks' | 'roster' | 'archive'>('tasks');
  const [selectedRosterDate, setSelectedRosterDate] = useState<string>(getTodayDateString());

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfficialItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');

  // Persist items
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  // Persist settings
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Handler: Add or Update item
  const handleSaveItem = (savedItem: OfficialItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      }
      return [savedItem, ...prev];
    });
  };

  // Handler: Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Handler: Status Change
  const handleStatusChange = (id: string, newStatus: TaskStatus, completionNote?: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          completionNotes: completionNote !== undefined ? completionNote : item.completionNotes,
        };
      })
    );
  };

  // Handler: Checklist toggle
  const handleToggleChecklist = (itemId: string, checkId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          checklist: item.checklist.map((c) =>
            c.id === checkId ? { ...c, completed: !c.completed } : c
          ),
        };
      })
    );
  };

  // Open Form Modal for a specific date (used by Duty Roster)
  const handleOpenNewTaskForDate = (date: string) => {
    setEditingItem({
      id: `task-${Date.now()}`,
      title: '',
      type: 'directive',
      referenceNo: `DIR/SIR/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      assignedBy: settings.superiorTitle,
      assignee: settings.officerName,
      department: settings.departmentName,
      dueDate: date,
      dueTime: '14:00',
      priority: 'urgent',
      status: 'pending',
      description: '',
      checklist: [
        { id: 'c1', text: 'Check previous papers & examine rules', completed: false },
        { id: 'c2', text: 'Put up file / prepare brief for Sir', completed: false },
      ],
      tags: ['Sir Directive'],
      isHighlightedAsSirDirective: true,
      createdDate: new Date().toISOString(),
    });
    setIsFormModalOpen(true);
  };

  // Filter items based on active tab and filter bar
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab matching
      if (activeTab === 'tasks' && item.status === 'completed') return false;
      if (activeTab === 'archive' && item.status !== 'completed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesRef = item.referenceNo.toLowerCase().includes(q);
        const matchesBy = item.assignedBy.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesSource = (item.correspondenceSource || '').toLowerCase().includes(q);
        const matchesAction = (item.actionRequired || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesRef && !matchesBy && !matchesDesc && !matchesSource && !matchesAction) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'directive' && item.type !== 'directive') return false;
        if (selectedCategory === 'meeting' && item.type !== 'meeting') return false;
        if (selectedCategory === 'correspondence' && item.type !== 'correspondence') return false;
      }

      // Priority filter
      if (selectedPriority !== 'all') {
        if (item.priority !== selectedPriority) return false;
      }

      // Date Filter
      if (selectedDateFilter === 'today') {
        if (!isDueToday(item)) return false;
      } else if (selectedDateFilter === 'overdue') {
        if (!isOverdue(item)) return false;
      } else if (selectedDateFilter === 'upcoming') {
        if (item.dueDate <= getTodayDateString()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'urgency') {
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
        const pDiff = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
        if (pDiff !== 0) return pDiff;
        return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
      }
      if (sortBy === 'due_asc') {
        const dDiff = a.dueDate.localeCompare(b.dueDate);
        if (dDiff !== 0) return dDiff;
        return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
      }
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  }, [items, activeTab, searchQuery, selectedCategory, selectedPriority, selectedDateFilter, sortBy]);

  // Quick statistics
  const pendingItems = items.filter((i) => i.status !== 'completed');
  const pendingCount = pendingItems.length;
  const urgentPendingCount = pendingItems.filter((i) => i.priority === 'urgent').length;
  const completedCount = items.filter((i) => i.status === 'completed').length;

  const handleBannerFilter = (filterKey: string) => {
    setActiveTab('tasks');
    if (filterKey === 'urgent') {
      setSelectedPriority('urgent');
      setSelectedCategory('all');
      setSelectedDateFilter('all');
    } else if (filterKey === 'sir_directives') {
      setSelectedCategory('directive');
      setSelectedPriority('all');
      setSelectedDateFilter('all');
    } else if (filterKey === 'due_today') {
      setSelectedDateFilter('today');
      setSelectedCategory('all');
      setSelectedPriority('all');
    } else if (filterKey === 'overdue') {
      setSelectedDateFilter('overdue');
      setSelectedCategory('all');
      setSelectedPriority('all');
    } else {
      setSelectedCategory('all');
      setSelectedPriority('all');
      setSelectedDateFilter('all');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTask={() => {
          setEditingItem(null);
          setIsFormModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        pendingCount={pendingCount}
        urgentPendingCount={urgentPendingCount}
        settings={settings}
        selectedRosterDate={selectedRosterDate}
      />

      {/* Main Bento Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: All Active Directives & Correspondence */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Prominent Pending Alert Banner */}
            <PendingAlertBanner
              items={items}
              onSelectFilter={handleBannerFilter}
              onOpenTask={(item) => {
                setEditingItem(item);
                setIsFormModalOpen(true);
              }}
            />

            {/* Bento Quick Action Shortcut Bar */}
            <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Quick Log Directives:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsFormModalOpen(true);
                  }}
                  className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>+ Boss Directive</span>
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsFormModalOpen(true);
                  }}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ Official Meeting</span>
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsFormModalOpen(true);
                  }}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>+ Inward Dak / Letter</span>
                </button>
                <button
                  onClick={() => setActiveTab('roster')}
                  className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Today's Roster (PDF)</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={pendingItems.length}
              filteredCount={filteredItems.length}
            />

            {/* Bento Matrix: Active Tasks and Roster Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column (2-Span): Active Directives & Tasks Cards */}
              <div className="lg:col-span-2 space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center shadow-xs space-y-4">
                    <div className="w-14 h-14 bg-slate-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-700">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        No Directives or Dak Found
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                          ? 'No items matched your current search and filters.'
                          : 'All official work is currently clear! Enter a new directive, meeting, or dak.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setIsFormModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Enter New Directive / Dak</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredItems.map((item) => (
                      <TaskCard
                        key={item.id}
                        item={item}
                        onEdit={(it) => {
                          setEditingItem(it);
                          setIsFormModalOpen(true);
                        }}
                        onDelete={handleDeleteItem}
                        onStatusChange={handleStatusChange}
                        onToggleChecklist={handleToggleChecklist}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Bento Widgets Column */}
              <div className="space-y-6">
                {/* Module 1: Daily Productivity Insights */}
                <div className="bg-indigo-600 border border-indigo-500 rounded-2xl p-5 text-white shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-indigo-200">Daily Productivity Insights</span>
                    <span className="text-xs font-bold bg-indigo-500/40 border border-indigo-400/40 px-2 py-0.5 rounded-full">Live Desk</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-3xl font-bold">
                      {items.length > 0 ? Math.round((completedCount / items.length) * 100) : 100}%
                    </div>
                    <span className="text-xs text-indigo-200">Disposal Rate</span>
                  </div>
                  <div className="w-full bg-indigo-950/40 h-2 rounded-full overflow-hidden mb-4">
                    <div 
                      className="bg-white h-full transition-all duration-500" 
                      style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-indigo-500/50 pt-3">
                    <div>
                      <div className="text-indigo-200">Pending Orders</div>
                      <div className="text-base font-bold text-white mt-0.5">{pendingCount} Items</div>
                    </div>
                    <div>
                      <div className="text-indigo-200">Disposed / Closed</div>
                      <div className="text-base font-bold text-white mt-0.5">{completedCount} Files</div>
                    </div>
                  </div>
                </div>

                {/* Module 2: Upcoming Meetings & Official Schedule */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Today's Meeting Schedule</span>
                    </h3>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                      {selectedRosterDate}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {items.filter(i => i.type === 'meeting' && i.dueDate === selectedRosterDate).length === 0 ? (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                        No official meetings scheduled for today.
                      </div>
                    ) : (
                      items
                        .filter(i => i.type === 'meeting' && i.dueDate === selectedRosterDate)
                        .map((meeting) => (
                          <div 
                            key={meeting.id} 
                            onClick={() => {
                              setEditingItem(meeting);
                              setIsFormModalOpen(true);
                            }}
                            className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-200 truncate">{meeting.title}</span>
                              <span className="text-[11px] text-blue-400 font-mono font-semibold">{meeting.dueTime}</span>
                            </div>
                            {meeting.locationOrVenue && (
                              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span>{meeting.locationOrVenue}</span>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Module 3: Daily Planner & Duty Roster Quick Launch */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <span>Daily Duty Roster</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">Ready to Print</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Generate the official Gazette-style daily duty roaster and planner for {selectedRosterDate} with Sir's directives and correspondence logs.
                  </p>
                  <button
                    onClick={() => setActiveTab('roster')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Open & Print Daily Duty Roster</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Daily Duty Roster (Print / PDF Generator) */}
        {activeTab === 'roster' && (
          <DutyRosterView
            items={items}
            settings={settings}
            selectedDate={selectedRosterDate}
            setSelectedDate={setSelectedRosterDate}
            onOpenNewTaskForDate={handleOpenNewTaskForDate}
            onEditTask={(it) => {
              setEditingItem(it);
              setIsFormModalOpen(true);
            }}
            onDeleteTask={handleDeleteItem}
            onStatusChange={handleStatusChange}
            onToggleChecklist={handleToggleChecklist}
          />
        )}

        {/* VIEW 3: Disposed / Completed Archive */}
        {activeTab === 'archive' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    Disposed & Completed Official Archive
                  </h2>
                  <p className="text-xs text-slate-400">
                    {completedCount} official tasks and correspondence completed and closed
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={completedCount}
              filteredCount={filteredItems.length}
            />

            {filteredItems.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center max-w-md mx-auto">
                <p className="text-xs text-slate-400">No completed records found in the archive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <TaskCard
                    key={item.id}
                    item={item}
                    onEdit={(it) => {
                      setEditingItem(it);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onStatusChange={handleStatusChange}
                    onToggleChecklist={handleToggleChecklist}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800 bg-slate-950 py-4 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Official Executive Secretariat & Daily Duty Planner • <span className="font-semibold text-slate-300">{settings.officeName}</span>
          </p>
          <div className="flex items-center space-x-4">
            <span>Logged in as: <strong className="text-slate-200">{settings.officerName}</strong></span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Configure Office
            </button>
          </div>
        </div>
      </footer>

      {/* Task Add / Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
        settings={settings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        items={items}
        onImportItems={setItems}
        onResetSampleData={() => setItems(getSampleInitialItems())}
      />
    </div>
  );
}
