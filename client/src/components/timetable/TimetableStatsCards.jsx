import React from 'react';
import { Calendar, Clock, MapPin, GraduationCap, Flame, Sparkles } from 'lucide-react';

export const TimetableStatsCards = ({ timetableItems = [] }) => {
    const totalSessions = timetableItems.length;
    const totalHours = (totalSessions * 1.5).toFixed(1); // Mỗi ca 1.5 giờ (90 phút)

    const grade10Count = timetableItems.filter(t => t.grade === 10).length;
    const grade11Count = timetableItems.filter(t => t.grade === 11).length;
    const grade12Count = timetableItems.filter(t => t.grade === 12).length;

    const ltCount = timetableItems.filter(t => t.location === 'Long Thượng').length;
    const mlCount = timetableItems.filter(t => t.location === 'Mỹ Lộc').length;

    const weekendCount = timetableItems.filter(t => t.dayIndex === 6 || t.dayIndex === 0).length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Total slots & hours */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Schedule</span>
                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-800">{totalSessions}</span>
                        <span className="text-xs text-gray-500 font-medium">slots / week</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-pink-600 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{totalHours} teaching hours</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Grade distribution */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade Distribution</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800" title="Grade 10">
                        G10: {grade10Count}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800" title="Grade 11">
                        G11: {grade11Count}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800" title="Grade 12">
                        G12: {grade12Count}
                    </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Focus on Grade 12 ({grade12Count} slots)</p>
            </div>

            {/* Card 3: Location distribution */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teaching Locations</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                        <MapPin className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        LT: {ltCount} slots
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ML: {mlCount} slots
                    </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Long Thượng ({ltCount}) • Mỹ Lộc ({mlCount})</p>
            </div>

            {/* Card 4: Weekend focus */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-100 uppercase tracking-wider">Weekend (Sat - Sun)</span>
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <Flame className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">{weekendCount}</span>
                        <span className="text-xs text-pink-100 font-medium">key slots</span>
                    </div>
                    <p className="text-[11px] text-pink-100 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        Sun: 7 consecutive slots | Sat: 1 slot
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimetableStatsCards;
