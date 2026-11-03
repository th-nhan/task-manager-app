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
            <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 shadow-xs border border-[var(--border-color)] flex flex-col justify-between hover:shadow-md hover:border-[var(--accent)] transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Weekly Total Salary</span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] shadow-2xs shrink-0">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
                            {weekSalary.toLocaleString('en-US')}
                        </span>
                        <span className="text-xs text-[var(--accent)] font-extrabold uppercase">VND</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Monthly Total Salary */}
            <div className="bg-[var(--accent)] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[var(--accent)] flex flex-col justify-between hover:bg-[var(--accent-hover)] hover:shadow-md hover:scale-[1.01] transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Monthly Total Salary</span>
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[var(--accent)] shrink-0 shadow-2xs">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-xs">
                            {monthSalary.toLocaleString('en-US')}
                        </span>
                        <span className="text-xs text-white/90 font-extrabold uppercase">VND</span>
                    </div>
                    <p className="text-[11px] text-white/90 mt-1.5 flex items-center gap-1 truncate font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                        <span>Monthly estimate (~4 weeks) • ~{totalSessions * 4} slots</span>
                    </p>
                </div>
            </div>

            {/* Card 3: Total Schedule & Hours */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 shadow-xs border border-[var(--border-color)] flex flex-col justify-between hover:shadow-md hover:border-[var(--accent)] transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Weekly Schedule</span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-[var(--text-main)]">{totalSessions}</span>
                        <span className="text-xs text-[var(--text-muted)] font-medium">active slots</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[var(--accent)] font-semibold">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>~{totalHours} teaching hours / week</span>
                    </div>
                </div>
            </div>

            {/* Card 4: Distribution & Weekend Focus */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 shadow-xs border border-[var(--border-color)] flex flex-col justify-between hover:shadow-md hover:border-[var(--accent)] transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Grades & Locations</span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border-color)]">
                            G10: {grade10Count}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border-color)]">
                            G11: {grade11Count}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border-color)]">
                            G12: {grade12Count}
                        </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1.5 truncate">
                        Long Thượng ({ltCount}) • Mỹ Lộc ({mlCount}) • Weekend ({weekendCount})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimetableStatsCards;
