import React from 'react';
import { Bell, LogOut, CheckSquare, CalendarDays } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const DashboardHeader = ({ user, logout }) => {
    const location = useLocation();
    const isTimetable = location.pathname.includes('/timetable');
    const isDashboard = location.pathname.includes('/dashboard') || (!isTimetable && location.pathname === '/');
    const isTimetableOwner = user?.email?.toLowerCase() === 'tthhaannnnhhaann@gmail.com';

    return (
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 md:px-8 py-2.5 flex items-center justify-between shadow-xs border-b border-pink-100 z-30 transition-all">
            {/* Brand Logo & Navigation Links */}
            <div className="flex items-center gap-6 md:gap-8">
                <Link to="/dashboard" className="flex items-center group cursor-pointer">
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight group-hover:text-pink-600 transition-colors">
                        Task
                    </h1>
                    <h1 className="text-pink-500 text-xl font-extrabold tracking-tight">
                        Note
                    </h1>
                </Link>

                {/* Main Navigation Tabs */}
                <nav className="flex items-center gap-1.5 bg-pink-50/80 p-1 rounded-2xl border border-pink-100/80">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                            isDashboard
                                ? 'bg-white text-pink-600 shadow-xs'
                                : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
                        }`}
                    >
                        <CheckSquare className="w-4 h-4" />
                        <span>Công việc</span>
                    </Link>

                    {isTimetableOwner && (
                        <Link
                            to="/timetable"
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer relative ${
                                isTimetable
                                    ? 'bg-white text-pink-600 shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
                            }`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            <span>Thời khóa biểu</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-pink-500 text-white shadow-xs">
                                18 ca
                            </span>
                        </Link>
                    )}
                </nav>
            </div>

            {/* Right User Actions */}
            <div className="space-x-1.5 flex items-center">
                <button 
                    className="hover:bg-pink-100 rounded-full p-2 text-gray-500 transition-colors cursor-pointer"
                    title="Thông báo"
                >
                    <Bell className="w-5 h-5 text-pink-400" />
                </button>

                <div className="flex items-center space-x-2 text-gray-600 hover:bg-pink-50 rounded-2xl px-2.5 py-1.5 cursor-pointer transition-colors border border-transparent hover:border-pink-100">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-pink-200" />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <span className="text-sm font-bold text-gray-800 hidden sm:inline">{user?.name}</span>
                </div>

                <button
                    onClick={logout}
                    title="Đăng xuất"
                    className="hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-full p-2 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5 text-pink-400 hover:text-rose-500" />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
