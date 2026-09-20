import React, { useState, useEffect } from 'react';
import { LogOut, CheckSquare, CalendarDays, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';

export const DashboardHeader = ({ user, logout, activePage }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isProfile = location.pathname.includes('/profile') || activePage === 'profile';
    const isTimetable = location.pathname.includes('/timetable') || activePage === 'timetable';
    const isDashboard = (location.pathname.includes('/dashboard') || location.pathname === '/') && !isTimetable && !isProfile;
    const isTimetableOwner = user?.email?.toLowerCase() === 'tthhaannnnhhaann@gmail.com';

    // Close mobile drawer on route change or ESC key
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <header className="sticky top-0 bg-white/95 backdrop-blur-md px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between shadow-xs border-b border-pink-100 z-30 transition-all">
                {/* Brand Logo & Desktop Navigation */}
                <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 -ml-1 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="w-5 h-5 text-pink-500" />
                    </button>

                    <Link to="/dashboard" className="flex items-center group cursor-pointer select-none">
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight group-hover:text-pink-600 transition-colors">
                            Task
                        </span>
                        <span className="text-pink-500 text-xl font-extrabold tracking-tight">
                            Note
                        </span>
                    </Link>

                    {/* Main Navigation Tabs (Desktop & Tablet) */}
                    <nav className="hidden md:flex items-center gap-1.5 bg-pink-50/80 p-1 rounded-2xl border border-pink-100/80">
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                isDashboard
                                    ? 'bg-white text-pink-600 shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
                            }`}
                        >
                            <CheckSquare className="w-4 h-4" />
                            <span>Tasks</span>
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
                                <span>Timetable</span>
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-pink-500 text-white shadow-xs">
                                    19 Slots
                                </span>
                            </Link>
                        )}

                        <Link
                            to="/profile"
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                isProfile
                                    ? 'bg-white text-pink-600 shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                    </nav>
                </div>

                {/* Right User Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Notification Dropdown */}
                    <NotificationDropdown user={user} />

                    <Link
                        to="/profile"
                        title="View Profile"
                        className={`flex items-center gap-2 text-gray-600 hover:bg-pink-50 rounded-2xl px-2 sm:px-2.5 py-1.5 cursor-pointer transition-colors border ${
                            isProfile ? 'bg-pink-50 border-pink-200 text-pink-600' : 'border-transparent hover:border-pink-100'
                        }`}
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-pink-200" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <span className="text-sm font-bold text-gray-800 hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
                    </Link>

                    <button
                        onClick={logout}
                        title="Log Out"
                        aria-label="Log Out"
                        className="hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-full p-2 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                    >
                        <LogOut className="w-5 h-5 text-pink-400 hover:text-rose-500" />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 animate-in slide-in-from-left duration-250 border-r border-pink-100">
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                                <div className="flex items-center">
                                    <span className="text-2xl font-extrabold text-gray-800">Task</span>
                                    <span className="text-pink-500 text-2xl font-extrabold">Note</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Profile Card (Clickable to Profile) */}
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 bg-pink-50/70 hover:bg-pink-100/80 rounded-2xl border border-pink-100 transition-colors"
                            >
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-300" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-gray-800 truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </Link>

                            {/* Navigation Links */}
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Navigation</p>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[44px] ${
                                        isDashboard
                                            ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                                            : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckSquare className="w-5 h-5" />
                                        <span>Tasks Dashboard</span>
                                    </div>
                                </Link>

                                {isTimetableOwner && (
                                    <Link
                                        to="/timetable"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[44px] ${
                                            isTimetable
                                                ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                                                : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="w-5 h-5" />
                                            <span>Timetable Schedule</span>
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                            isTimetable ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-600'
                                        }`}>
                                            18 Slots
                                        </span>
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[44px] ${
                                        isProfile
                                            ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                                            : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5" />
                                        <span>My Profile</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Drawer Bottom Actions */}
                        <div className="pt-4 border-t border-pink-100">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer min-h-[44px]"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardHeader;
