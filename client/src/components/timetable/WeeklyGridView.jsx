import React from 'react';
import { DAYS_OF_WEEK, TIME_SLOTS_MATRIX, GRADE_CONFIG, LOCATION_CONFIG, isSessionPassed } from '../../data/timetableData';
import { Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const WeeklyGridView = ({
    timetableItems = [],
    selectedGrade = 'ALL',
    selectedLocation = 'ALL',
    onSelectClass
}) => {
    const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...

    // Filter items based on props
    const filteredItems = timetableItems.filter(item => {
        if (selectedGrade !== 'ALL' && item.grade !== Number(selectedGrade)) return false;
        if (selectedLocation !== 'ALL' && item.location !== selectedLocation) return false;
        return true;
    });

    // Helper to find classes for a given day and time slot
    const getClassesForSlotAndDay = (slotItem, dayKey) => {
        return filteredItems.filter(item => {
            if (item.dayOfWeek !== dayKey) return false;

            if (slotItem.startTimes && Array.isArray(slotItem.startTimes)) {
                return slotItem.startTimes.includes(item.startTime);
            }
            return item.timeRange === slotItem.slot;
        });
    };

    return (
        <div className="bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl shadow-sm border border-[var(--border-color)] overflow-hidden min-w-0">
            {/* Header / Caption */}
            <div className="p-4 sm:p-6 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2 flex-wrap">
                        <span>📅 Weekly Timetable Matrix</span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border-color)]">
                            Updated Sat & Sun
                        </span>
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Teaching schedule from Monday to Sunday by time slots
                    </p>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Grade 10
                    </span>
                    <span className="flex items-center gap-1 font-medium text-indigo-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Grade 11
                    </span>
                    <span className="flex items-center gap-1 font-medium text-rose-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Grade 12
                    </span>
                </div>
            </div>

            {/* Mobile swipe hint */}
            <div className="md:hidden flex items-center justify-between text-[11px] text-[var(--accent)] bg-[var(--bg-subtle)] px-4 py-1.5 border-b border-[var(--border-color)]">
                <span>👈 Swipe table horizontally to view all days 👉</span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto pb-2">
                <table className="w-full border-collapse text-left min-w-[850px] lg:min-w-[900px]">
                    <thead>
                        <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
                            <th className="p-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider w-32 sm:w-36 text-center">
                                Time Slot
                            </th>
                            {DAYS_OF_WEEK.map(day => {
                                const isToday = day.index === todayIndex;
                                return (
                                    <th 
                                        key={day.key} 
                                        className={`p-3 text-xs font-bold uppercase tracking-wider text-center border-l border-[var(--border-color)] transition-colors ${
                                            isToday 
                                                ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-extrabold' 
                                                : day.isWeekend 
                                                    ? 'text-[var(--accent)]' 
                                                    : 'text-[var(--text-main)]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-1.5">
                                            <span>{day.labelEn || day.label}</span>
                                            {isToday && (
                                                <span className="flex items-center text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--accent)] text-white font-normal">
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {TIME_SLOTS_MATRIX.map((slotItem, slotIdx) => {
                            return (
                                <tr 
                                    key={slotItem.slot} 
                                    className={`hover:bg-[var(--accent-subtle)] transition-colors ${
                                        slotIdx % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-subtle)]/30'
                                    }`}
                                >
                                    {/* Time Column */}
                                    <td className="p-2.5 sm:p-3 text-center border-r border-[var(--border-color)] bg-[var(--bg-subtle)]/40">
                                        <div className="font-bold text-xs text-[var(--text-main)]">{slotItem.label}</div>
                                        <div className="text-[10px] text-[var(--accent)] font-medium mt-0.5">{slotItem.periodEn || slotItem.period}</div>
                                    </td>

                                    {/* Days Columns */}
                                    {DAYS_OF_WEEK.map(day => {
                                        const classes = getClassesForSlotAndDay(slotItem, day.key);
                                        const isToday = day.index === todayIndex;

                                        return (
                                            <td 
                                                key={day.key}
                                                className={`p-1.5 sm:p-2 border-l border-[var(--border-color)] align-top transition-colors ${
                                                    isToday ? 'bg-[var(--accent-subtle)]/20' : ''
                                                }`}
                                            >
                                                {classes.length === 0 ? (
                                                    <div className="h-12 flex items-center justify-center text-[var(--text-muted)] opacity-40 text-xs">
                                                        -
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        {classes.map(cls => {
                                                            const gradeStyle = GRADE_CONFIG[cls.grade] || GRADE_CONFIG[10];

                                                                            const savedStatus = typeof window !== 'undefined' ? localStorage.getItem(`tt_status_${cls.id}`) : null;
                                                                            const hasPassedToday = isToday && isSessionPassed(new Date(), cls.endTime, cls.startTime);
                                                                            const isTaught = savedStatus === 'COMPLETED' || hasPassedToday;

                                                                            return (
                                                                                <button
                                                                                    key={cls.id}
                                                                                    onClick={() => onSelectClass && onSelectClass(cls)}
                                                                                    className={`w-full text-left p-2 rounded-2xl bg-gradient-to-br ${gradeStyle.cardBg} border ${isTaught ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/40' : 'border-[var(--border-color)]'} shadow-xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden`}
                                                                                >
                                                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradeStyle.pillColor}`} />

                                                                                    <div className="pl-1 flex flex-col gap-1">
                                                                                        <div className="flex items-center justify-between gap-1">
                                                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                                                                                                G{cls.grade}
                                                                                            </span>
                                                                                            <div className="flex items-center gap-1">
                                                                                                {isTaught && (
                                                                                                    <span className="text-[8px] font-extrabold text-[var(--accent)] bg-[var(--bg-card)] px-1.5 py-0.2 rounded-full border border-[var(--accent)] inline-flex items-center gap-0.5 shadow-2xs">
                                                                                                        <CheckCircle2 className="w-2.5 h-2.5 text-[var(--accent)] shrink-0" />
                                                                                                        <span>Taught</span>
                                                                                                    </span>
                                                                                                )}
                                                                                                <span className="text-[9px] font-bold text-[var(--text-main)] bg-[var(--bg-card)]/80 px-1 rounded border border-[var(--border-color)]">
                                                                                                    {cls.location === 'Long Thượng' ? 'LT' : 'ML'}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="font-bold text-xs text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
                                                                                            {cls.originalCode || cls.className}
                                                                                        </div>

                                                                                        <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
                                                                                            <Clock className="w-2.5 h-2.5 text-[var(--accent)]" />
                                                                                            <span>{cls.startTime} - {cls.endTime}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer convention notes */}
            <div className="p-3.5 sm:p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-semibold text-[var(--text-main)]">Abbreviations:</span>
                    <span>CB: Basic</span>
                    <span>•</span>
                    <span>NC: Advanced</span>
                    <span>•</span>
                    <span>LT: Long Thượng</span>
                    <span>•</span>
                    <span>ML: Mỹ Lộc</span>
                </div>
                <div className="text-[var(--text-muted)] text-[11px]">
                    Click a class slot to view details
                </div>
            </div>
        </div>
    );
};

export default WeeklyGridView;
