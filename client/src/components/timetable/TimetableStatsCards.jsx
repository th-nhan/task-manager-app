import React from 'react';
import { Calendar, Clock, MapPin, GraduationCap, Flame, Sparkles, DollarSign, TrendingUp } from 'lucide-react';

export const TimetableStatsCards = ({ timetableItems = [], weeklyEarnings = null, monthlyEarnings = null }) => {
    const totalSessions = timetableItems.length;
    const totalHours = (totalSessions * 1.5).toFixed(1);

    // Calculate weekly and monthly salary 
    const weekSalary = weeklyEarnings !== null ? weeklyEarnings : totalSessions * 60000;
    const monthSalary = monthlyEarnings !== null ? monthlyEarnings : totalSessions * 4 * 60000;

    const grade10Count = timetableItems.filter(t => t.grade === 10).length;
    const grade11Count = timetableItems.filter(t => t.grade === 11).length;
    const grade12Count = timetableItems.filter(t => t.grade === 12).length;

    const ltCount = timetableItems.filter(t => t.location === 'Long Thượng').length;
    const mlCount = timetableItems.filter(t => t.location === 'Mỹ Lộc').length;

    const weekendCount = timetableItems.filter(t => t.dayIndex === 6 || t.dayIndex === 0).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Weekly Total Salary */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-pink-200 flex flex-col justify-between hover:shadow-md hover:border-pink-300 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Weekly Total Salary</span>
                    <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-2xs shrink-0">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {weekSalary.toLocaleString('en-US')}
                        </span>
                        <span className="text-xs text-pink-600 font-extrabold uppercase">VND</span>
                    </div>
                    
                </div>
            </div>

            {/* Card 2: Monthly Total Salary */}
            <div className="bg-pink-500 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-pink-500 flex flex-col justify-between hover:bg-pink-600 hover:shadow-md hover:scale-[1.01] transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">Monthly Total Salary</span>
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-pink-600 shrink-0 shadow-2xs">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-xs">
                            {monthSalary.toLocaleString('en-US')}
                        </span>
                        <span className="text-xs text-pink-100 font-extrabold uppercase">VND</span>
                    </div>
                    <p className="text-[11px] text-pink-100 mt-1.5 flex items-center gap-1 truncate font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                        <span>Monthly estimate (~4 weeks) • ~{totalSessions * 4} slots</span>
                    </p>
                </div>
            </div>

            {/* Card 3: Total Schedule & Hours */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-pink-200 flex flex-col justify-between hover:shadow-md hover:border-pink-300 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weekly Schedule</span>
                    <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-gray-800">{totalSessions}</span>
                        <span className="text-xs text-gray-500 font-medium">active slots</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-pink-600 font-semibold">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>~{totalHours} teaching hours / week</span>
                    </div>
                </div>
            </div>

            {/* Card 4: Distribution & Weekend Focus */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-pink-200 flex flex-col justify-between hover:shadow-md hover:border-pink-300 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grades & Locations</span>
                    <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-pink-100 text-pink-700">
                            G10: {grade10Count}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-700">
                            G11: {grade11Count}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-pink-100 text-pink-700">
                            G12: {grade12Count}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 truncate">
                        Long Thượng ({ltCount}) • Mỹ Lộc ({mlCount}) • Weekend ({weekendCount})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimetableStatsCards;
