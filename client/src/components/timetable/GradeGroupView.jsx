import React from 'react';
import { GRADE_CONFIG } from '../../data/timetableData';
import { GraduationCap, Clock, MapPin, PlusCircle, ArrowRight } from 'lucide-react';

export const GradeGroupView = ({ timetableItems = [], onSelectClass, onConvertToTask }) => {
    const grades = [10, 11, 12];

    return (
        <div className="space-y-4 sm:space-y-6 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {grades.map(grade => {
                    const gradeItems = timetableItems
                        .filter(i => i.grade === grade)
                        .sort((a, b) => {
                            if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
                            return a.startTime.localeCompare(b.startTime);
                        });

                    const gradeStyle = GRADE_CONFIG[grade];
                    const ltCount = gradeItems.filter(i => i.location === 'Long Thượng').length;
                    const mlCount = gradeItems.filter(i => i.location === 'Mỹ Lộc').length;

                    return (
                        <div
                            key={grade}
                            className="bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl shadow-xs border border-[var(--border-color)] overflow-hidden flex flex-col justify-between min-w-0"
                        >
                            {/* Card Header */}
                            <div className={`p-4 sm:p-5 bg-gradient-to-br ${gradeStyle.cardBg} border-b border-[var(--border-color)] space-y-2`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-9 h-9 rounded-2xl ${gradeStyle.pillColor} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}>
                                            K{grade}
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                            {gradeStyle.label}
                                        </h3>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeStyle.badgeBg} ${gradeStyle.badgeText} shrink-0`}>
                                        {gradeItems.length} slots
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                                    <span>~{(gradeItems.length * 1.5).toFixed(1)} hrs/wk</span>
                                    <span>LT: {ltCount} • ML: {mlCount}</span>
                                </div>
                            </div>

                            {/* Class Sessions List */}
                            <div className="p-3 sm:p-4 space-y-2 flex-1 divide-y divide-[var(--border-color)]">
                                {gradeItems.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => onSelectClass && onSelectClass(item)}
                                            className="pt-2.5 first:pt-0 hover:bg-[var(--accent-subtle)] p-2 rounded-2xl transition-all cursor-pointer group min-w-0"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-0.5 min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-[var(--accent)]">
                                                            {item.dayOfWeek}
                                                        </span>
                                                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                                                            ({item.shift})
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors truncate">
                                                        {item.className}
                                                    </div>
                                                    <div className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                                                        {item.originalCode}
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-1 shrink-0">
                                                    <div className="text-xs font-mono font-bold text-[var(--text-main)] flex items-center justify-end gap-1">
                                                        <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
                                                        <span>{item.timeRange}</span>
                                                    </div>
                                                    <span className="inline-block text-[10px] font-semibold text-[var(--text-main)] bg-[var(--bg-subtle)] px-1.5 py-0.2 rounded border border-[var(--border-color)]">
                                                        {item.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Card Footer */}
                            <div className="p-3 bg-[var(--bg-card)] border-t border-[var(--border-color)] text-center">
                                <span className="text-[11px] text-[var(--text-muted)] font-medium">
                                    Full schedule for Grade {grade}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GradeGroupView;
