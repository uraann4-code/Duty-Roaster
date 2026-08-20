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
    <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 shadow-xs">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, Sir's instructions, Ref/Diary No., Ministry, or Assignee..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
            className="px-2.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
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
            className="px-2.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="urgency">Sort: Urgency</option>
            <option value="due_asc">Sort: Due Time</option>
            <option value="recent">Sort: Recently Added</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              title="Clear all filters"
              className="px-2.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Priority Filters */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">
            Category:
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            All Work
          </button>

          <button
            onClick={() => setSelectedCategory('directive')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'directive'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Boss Directives</span>
          </button>

          <button
            onClick={() => setSelectedCategory('meeting')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'meeting'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Official Meetings</span>
          </button>

          <button
            onClick={() => setSelectedCategory('correspondence')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              selectedCategory === 'correspondence'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Dak / Inward Letters</span>
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            Priority:
          </span>
          <button
            onClick={() => setSelectedPriority(selectedPriority === 'urgent' ? 'all' : 'urgent')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              selectedPriority === 'urgent'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
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
          Showing <strong className="text-slate-800">{filteredCount}</strong> of <strong className="text-slate-800">{totalCount}</strong> official records
        </span>
        {hasActiveFilters && (
          <span className="text-emerald-600 font-bold">Filters active</span>
        )}
      </div>
    </div>
  );
};
