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
            {/* Card 1: Tổng ca & thời lượng */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng Lịch Dạy</span>
                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-800">{totalSessions}</span>
                        <span className="text-xs text-gray-500 font-medium">ca / tuần</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-pink-600 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{totalHours} giờ giảng dạy</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Phân bố Khối lớp */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân Bổ Khối</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800" title="Khối 10">
                        K10: {grade10Count}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800" title="Khối 11">
                        K11: {grade11Count}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800" title="Khối 12">
                        K12: {grade12Count}
                    </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Trọng tâm Khối 12 ({grade12Count} ca)</p>
            </div>

            {/* Card 3: Phân bố Cơ sở */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cơ Sở Giảng Dạy</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                        <MapPin className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        LT: {ltCount} ca
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ML: {mlCount} ca
                    </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Long Thượng ({ltCount}) • Mỹ Lộc ({mlCount})</p>
            </div>

            {/* Card 4: Trọng tâm Thứ 7 & CN */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-100 uppercase tracking-wider">Cuối Tuần (T7 - CN)</span>
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <Flame className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">{weekendCount}</span>
                        <span className="text-xs text-pink-100 font-medium">ca trọng điểm</span>
                    </div>
                    <p className="text-[11px] text-pink-100 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        CN: 7 ca liên tiếp | T7: 1 ca
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimetableStatsCards;
