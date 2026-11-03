import React from 'react';
import {
    CircleArrowLeft,
    CircleArrowRight,
    Dot,
    Plus,
    Calendar,
    CalendarDays,
    Kanban
} from 'lucide-react';

export const DashboardToolbar = ({
    dateRangeTitle,
    onPrev,
    onNext,
    onToday,
    viewMode,
    onViewModeChange,
    onOpenCreateModal,
}) => {
    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            {/* Toolbar Top Bar: Title & Date Navigator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[var(--bg-card)] rounded-2xl mx-3 sm:mx-6 md:mx-10 lg:mx-16 p-3.5 sm:p-4 gap-3 sm:gap-4 shadow-xs border border-[var(--border-color)]">
                <div className="text-[var(--accent)] font-bold flex items-center justify-between">
                    <h2 className="font-semibold text-lg sm:text-xl uppercase tracking-wide">Task Schedule</h2>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
                    <div className="py-1 px-2 font-semibold text-[var(--accent)] text-xs sm:text-sm italic truncate">
                        {dateRangeTitle}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 bg-[var(--bg-subtle)] text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 transition-colors border border-[var(--border-color)]">
                        <button
                            onClick={onPrev}
                            title="Previous"
                            aria-label="Previous date range"
                            className="hover:opacity-80 transition-opacity cursor-pointer p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        >
                            <CircleArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onToday}
                            className="font-bold text-[var(--accent)] text-xs sm:text-sm hover:opacity-80 transition-opacity cursor-pointer px-1 min-h-[32px] flex items-center justify-center"
                        >
                            Today
                        </button>
                        <button
                            onClick={onNext}
                            title="Next"
                            aria-label="Next date range"
                            className="hover:opacity-80 transition-opacity cursor-pointer p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        >
                            <CircleArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar: Priority Legend, View Mode Switcher & New Task Button */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center text-[var(--text-muted)] font-medium text-sm justify-between mx-3 sm:mx-6 md:mx-10 lg:mx-16 gap-3">
                {/* Priority Legend */}
                <div className="flex gap-2 sm:gap-4 items-center flex-wrap bg-[var(--bg-card)] md:bg-transparent p-2 md:p-0 rounded-xl border border-[var(--border-color)] md:border-none">
                    <span className="text-xs font-semibold text-[var(--text-muted)] mr-1 hidden xs:inline">Priority:</span>
                    <span className="flex items-center text-xs font-medium text-[var(--text-main)] gap-0.5">
                        <Dot className="text-red-500 shrink-0" size={28} strokeWidth={4} /> High
                    </span>
                    <span className="flex items-center text-xs font-medium text-[var(--text-main)] gap-0.5">
                        <Dot className="text-yellow-500 shrink-0" size={28} strokeWidth={4} /> Medium
                    </span>
                    <span className="flex items-center text-xs font-medium text-[var(--text-main)] gap-0.5">
                        <Dot className="text-green-500 shrink-0" size={28} strokeWidth={4} /> Low
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end flex-wrap sm:flex-nowrap">
                    {/* View Mode Switcher */}
                    <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)] flex-1 sm:flex-none justify-center">
                        <button
                            onClick={() => onViewModeChange('month')}
                            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[34px] flex-1 sm:flex-initial ${
                                viewMode === 'month'
                                    ? 'bg-[var(--accent)] text-white shadow-xs'
                                    : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span>Month</span>
                        </button>

                        <button
                            onClick={() => onViewModeChange('week')}
                            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[34px] flex-1 sm:flex-initial ${
                                viewMode === 'week'
                                    ? 'bg-[var(--accent)] text-white shadow-xs'
                                    : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span>Week</span>
                        </button>

                        <button
                            onClick={() => onViewModeChange('kanban')}
                            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[34px] flex-1 sm:flex-initial ${
                                viewMode === 'kanban'
                                    ? 'bg-[var(--accent)] text-white shadow-xs'
                                    : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <Kanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span>Kanban</span>
                        </button>
                    </div>

                    {/* New Task Button */}
                    <button
                        onClick={onOpenCreateModal}
                        className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3.5 sm:px-4 py-2 rounded-xl font-semibold flex items-center justify-center transition-colors shadow-sm cursor-pointer text-xs sm:text-sm min-h-[38px] shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-1 shrink-0" />
                        <span>New Task</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardToolbar;
