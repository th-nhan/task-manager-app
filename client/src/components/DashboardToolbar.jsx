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
        <div className="flex flex-col gap-4">
            {/* Toolbar Top Bar: Title & Date Navigator */}
            <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl mx-6 md:mx-16 p-4 gap-4 shadow-sm">
                <div className="text-pink-500 font-bold">
                    <h2 className="font-semibold text-xl uppercase">Task Schedule</h2>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center gap-2">
                    <div className="p-2 font-semibold text-pink-400 text-sm italic">{dateRangeTitle}</div>
                    <div className="flex items-center gap-3 bg-pink-50 text-pink-400 hover:bg-pink-100 rounded-full px-3 py-1.5 transition-colors">
                        <button onClick={onPrev} title="Trước" className="hover:text-pink-600 transition-colors cursor-pointer">
                            <CircleArrowLeft className="w-5 h-5" />
                        </button>
                        <button onClick={onToday} className="font-bold text-pink-400 text-sm hover:text-pink-600 transition-colors cursor-pointer">
                            Today
                        </button>
                        <button onClick={onNext} title="Tiếp theo" className="hover:text-pink-600 transition-colors cursor-pointer">
                            <CircleArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar: Priority Legend, View Mode Switcher & New Task Button */}
            <div className="flex flex-wrap items-center space-x-6 text-gray-600 font-medium text-sm justify-between mx-6 md:mx-16 gap-3">
                <div className="flex gap-2 items-center flex-wrap">
                    <span className="flex items-center text-xs font-medium text-gray-600">
                        <Dot className="text-red-500" size={32} strokeWidth={4} /> High
                    </span>
                    <span className="flex items-center text-xs font-medium text-gray-600">
                        <Dot className="text-yellow-500" size={32} strokeWidth={4} /> Medium
                    </span>
                    <span className="flex items-center text-xs font-medium text-gray-600">
                        <Dot className="text-green-500" size={32} strokeWidth={4} /> Low
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Switcher */}
                    <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/80">
                        <button
                            onClick={() => onViewModeChange('month')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                viewMode === 'month'
                                    ? 'bg-pink-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Month</span>
                        </button>

                        <button
                            onClick={() => onViewModeChange('week')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                viewMode === 'week'
                                    ? 'bg-pink-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            <span>Week</span>
                        </button>

                        <button
                            onClick={() => onViewModeChange('kanban')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                viewMode === 'kanban'
                                    ? 'bg-pink-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <Kanban className="w-4 h-4" />
                            <span>Kanban</span>
                        </button>
                    </div>

                    <button
                        onClick={onOpenCreateModal}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-colors shadow-sm cursor-pointer text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> New Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardToolbar;
