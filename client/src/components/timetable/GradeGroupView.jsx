import React from 'react';
import { GRADE_CONFIG } from '../../data/timetableData';
import { GraduationCap, Clock, MapPin, PlusCircle, ArrowRight } from 'lucide-react';

export const GradeGroupView = ({ timetableItems = [], onSelectClass, onConvertToTask }) => {
    const grades = [10, 11, 12];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden flex flex-col justify-between"
                        >
                            {/* Card Header */}
                            <div className={`p-5 bg-gradient-to-br ${gradeStyle.cardBg} border-b border-gray-100 space-y-2`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-9 h-9 rounded-2xl ${gradeStyle.pillColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                                            K{grade}
                                        </div>
                                        <h3 className="font-bold text-base text-gray-900">
                                            {gradeStyle.label}
                                        </h3>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                                        {gradeItems.length} slots / week
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                                    <span>Duration: ~{(gradeItems.length * 1.5).toFixed(1)} hrs</span>
                                    <span>LT: {ltCount} • ML: {mlCount}</span>
                                </div>
                            </div>

                            {/* Class Sessions List */}
                            <div className="p-4 space-y-2.5 flex-1 divide-y divide-gray-100/70">
                                {gradeItems.map((item, idx) => {
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => onSelectClass && onSelectClass(item)}
                                            className="pt-2.5 first:pt-0 hover:bg-pink-50/40 p-2 rounded-2xl transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-pink-600">
                                                            {item.dayOfWeek}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            ({item.shift})
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-gray-900 group-hover:text-pink-600 transition-colors">
                                                        {item.className}
                                                    </div>
                                                    <div className="font-mono text-[11px] text-gray-500">
                                                        {item.originalCode}
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-1">
                                                    <div className="text-xs font-mono font-bold text-gray-700 flex items-center justify-end gap-1">
                                                        <Clock className="w-3 h-3 text-pink-400" />
                                                        <span>{item.timeRange}</span>
                                                    </div>
                                                    <span className="inline-block text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded">
                                                        {item.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Card Footer */}
                            <div className="p-3 bg-gray-50/60 border-t border-gray-100 text-center">
                                <span className="text-[11px] text-gray-400 font-medium">
                                    Full weekly schedule for Grade {grade}
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
