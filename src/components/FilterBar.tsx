import React from 'react';
import { 
  Search, 
  Crown, 
  Users, 
  Mail, 
  FileText, 
  Flame, 
  CheckCircle2, 
  X,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { TaskType, PriorityLevel } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (dateFilter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedDateFilter,
  setSelectedDateFilter,
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedPriority !== 'all' ||
    selectedDateFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedDateFilter('all');
  };

  return (
    <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, Sir's instructions, Ref/Diary No., Ministry, or Assignee..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-100 placeholder:text-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter & Sort options */}
        <div className="flex items-center space-x-2">
          {/* Quick Date Scope */}
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="px-2.5 py-2 text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">📅 All Dates</option>
            <option value="today">Today's Schedule</option>
            <option value="overdue">Overdue / Delayed</option>
            <option value="upcoming">Upcoming Future</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-2 text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="urgency">Sort: Urgency</option>
            <option value="due_asc">Sort: Due Time</option>
            <option value="recent">Sort: Recently Added</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              title="Clear all filters"
              className="px-2.5 py-2 text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Priority Filters */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">
            Category:
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200'
            }`}
          >
            All Work
          </button>

          <button
            onClick={() => setSelectedCategory('directive')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'directive'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-orange-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-orange-400" />
            <span>Boss Directives</span>
          </button>

          <button
            onClick={() => setSelectedCategory('meeting')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'meeting'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-blue-300'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Meetings</span>
          </button>

          <button
            onClick={() => setSelectedCategory('correspondence')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'correspondence'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-amber-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Dak / Inward Letters</span>
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500 font-bold uppercase text-[10px]">
            Priority:
          </span>
          <button
            onClick={() => setSelectedPriority(selectedPriority === 'urgent' ? 'all' : 'urgent')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              selectedPriority === 'urgent'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-orange-400'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Immediate Only</span>
          </button>
        </div>
      </div>

      {/* Result counter */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
        <span>
          Showing <strong className="text-slate-300">{filteredCount}</strong> of <strong className="text-slate-300">{totalCount}</strong> official records
        </span>
        {hasActiveFilters && (
          <span className="text-emerald-400 font-medium">Filters active</span>
        )}
      </div>
    </div>
  );
};
