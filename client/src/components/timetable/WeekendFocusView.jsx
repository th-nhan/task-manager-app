import React from 'react';
import { GRADE_CONFIG, LOCATION_CONFIG } from '../../data/timetableData';
import { Sun, Sunset, Moon, Clock, MapPin, Sparkles, PlusCircle, Calendar } from 'lucide-react';

export const WeekendFocusView = ({ timetableItems = [], onSelectClass, onConvertToTask }) => {
    // Filter weekend items: Saturday (6) and Sunday (0)
    const saturdayItems = timetableItems
        .filter(item => item.dayIndex === 6)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const sundayItems = timetableItems
        .filter(item => item.dayIndex === 0)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Sunday shifts
    const sundayMorning = sundayItems.filter(i => i.shift === 'Sáng');
    const sundayAfternoon = sundayItems.filter(i => i.shift === 'Chiều');
    const sundayEvening = sundayItems.filter(i => i.shift === 'Tối');

    return (
        <div className="space-y-6">
            {/* Top Banner Alert */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        RESCHEDULED TEACHING TIMETABLE
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">
                        Weekend Focus: Saturday & Sunday
                    </h2>
                    <p className="text-pink-100 text-xs md:text-sm">
                        Total 8 peak weekend slots (1 Saturday evening slot & 7 consecutive Sunday slots)
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                    <div className="text-center px-2">
                        <div className="text-xs text-pink-100 font-medium">Saturday</div>
                        <div className="text-xl font-bold">{saturdayItems.length} Slots</div>
                    </div>
                    <div className="h-8 w-[1px] bg-white/20" />
                    <div className="text-center px-2">
                        <div className="text-xs text-pink-100 font-medium">Sunday</div>
                        <div className="text-xl font-bold">{sundayItems.length} Slots</div>
                    </div>
                </div>
            </div>

            {/* Grid 2 Columns: Saturday vs Sunday */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column 1: Saturday (Thứ 7 - 4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-base">
                                Sat
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">Saturday Schedule</h3>
                                <p className="text-xs text-gray-500">1 evening session</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            1 Slot
                        </span>
                    </div>

                    <div className="space-y-3">
                        {saturdayItems.map((item, idx) => {
                            const gradeStyle = GRADE_CONFIG[item.grade] || GRADE_CONFIG[12];
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onSelectClass && onSelectClass(item)}
                                    className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 hover:shadow-md hover:border-pink-300 transition-all cursor-pointer relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 left-0 bottom-0 w-2 ${gradeStyle.pillColor}`} />

                                    <div className="pl-2 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                <Moon className="w-3.5 h-3.5" /> Evening
                                            </span>
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                                                Grade {item.grade}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors text-base">
                                                {item.className}
                                            </h4>
                                            <div className="font-mono text-xs font-semibold text-pink-500 mt-0.5">
                                                Code: {item.originalCode}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Clock className="w-3.5 h-3.5 text-pink-400" />
                                                <span className="font-bold">{item.timeRange}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{item.location}</span>
                                            </div>
                                        </div>

                                        {onConvertToTask && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onConvertToTask(item);
                                                }}
                                                className="w-full mt-2 py-2 text-xs font-semibold text-pink-600 hover:text-white bg-pink-50 hover:bg-pink-500 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <PlusCircle className="w-3.5 h-3.5" /> Add to Tasks
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column 2: Sunday (Chủ Nhật - 8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-base">
                                Sun
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">Sunday Schedule (Full Day)</h3>
                                <p className="text-xs text-gray-500">7 consecutive sessions from 07:00 AM to 08:00 PM</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            7 Key Slots
                        </span>
                    </div>

                    {/* Sunday Shifts Subsections */}
                    <div className="space-y-4">
                        {/* 1. Morning */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-1 text-xs font-bold text-amber-700 uppercase tracking-wide">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>Morning Sessions (07:00 – 11:30 • 3 Slots)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {sundayMorning.map((item, idx) => renderSundayCard(item, idx + 1, onSelectClass, onConvertToTask))}
                            </div>
                        </div>

                        {/* 2. Afternoon */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 px-1 text-xs font-bold text-orange-700 uppercase tracking-wide">
                                <Sunset className="w-4 h-4 text-orange-500" />
                                <span>Afternoon Sessions (14:00 – 18:30 • 3 Slots)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {sundayAfternoon.map((item, idx) => renderSundayCard(item, idx + 4, onSelectClass, onConvertToTask))}
                            </div>
                        </div>

                        {/* 3. Evening */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 px-1 text-xs font-bold text-indigo-700 uppercase tracking-wide">
                                <Moon className="w-4 h-4 text-indigo-500" />
                                <span>Evening Session (18:30 – 20:00 • 1 Slot)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {sundayEvening.map((item, idx) => renderSundayCard(item, idx + 7, onSelectClass, onConvertToTask))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-function to render each Sunday card
function renderSundayCard(item, stepNum, onSelectClass, onConvertToTask) {
    const gradeStyle = GRADE_CONFIG[item.grade] || GRADE_CONFIG[10];

    return (
        <div
            key={item.id}
            onClick={() => onSelectClass && onSelectClass(item)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md hover:border-pink-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${gradeStyle.pillColor}`} />

            <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-600 flex items-center justify-center">
                        #{stepNum}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                        K{item.grade}
                    </span>
                </div>

                <div>
                    <h4 className="font-bold text-xs text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {item.className}
                    </h4>
                    <p className="font-mono text-[11px] font-semibold text-pink-500 mt-0.5">
                        {item.originalCode}
                    </p>
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <div className="flex items-center gap-1 font-semibold text-gray-700">
                    <Clock className="w-3 h-3 text-pink-400" />
                    <span>{item.timeRange}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>{item.location}</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                        {item.level}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default WeekendFocusView;
