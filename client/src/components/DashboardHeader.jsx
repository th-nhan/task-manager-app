import React, { useState, useEffect } from 'react';
import { LogOut, CheckSquare, CalendarDays, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';
import { ThemeSwitcher } from './ThemeSwitcher';

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
            <header className="sticky top-0 bg-[var(--bg-card)]/95 backdrop-blur-md px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between shadow-xs border-b border-[var(--border-color)] z-30 transition-all">
                {/* Brand Logo & Desktop Navigation */}
                <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 -ml-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)] rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="w-5 h-5 text-[var(--accent)]" />
                    </button>

                    <Link to="/dashboard" className="flex items-center group cursor-pointer select-none">
                        <span className="text-xl font-extrabold text-[var(--text-main)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                            Task
                        </span>
                        <span className="text-[var(--accent)] text-xl font-extrabold tracking-tight">
                            Note
                        </span>
                    </Link>

                    {/* Main Navigation Tabs (Desktop & Tablet) */}
                    <nav className="hidden md:flex items-center gap-1.5 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-color)]">
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                isDashboard
                                    ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-xs'
                                    : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)]/60'
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
                                        ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)]/60'
                                    }`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                <span>Timetable</span>
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[var(--accent)] text-white shadow-xs">
                                    19 Slots
                                </span>
                            </Link>
                        )}

                        <Link
                            to="/profile"
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                isProfile
                                    ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-xs'
                                    : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)]/60'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                    </nav>
                </div>

                {/* Right User Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Theme Switcher Dropdown */}
                    <ThemeSwitcher variant="dropdown" />

                    {/* Notification Dropdown */}
                    <NotificationDropdown user={user} />

                    <Link
                        to="/profile"
                        title="View Profile"
                        className={`flex items-center gap-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-2xl px-2 sm:px-2.5 py-1.5 cursor-pointer transition-colors border ${
                            isProfile ? 'bg-[var(--bg-subtle)] border-[var(--accent)] text-[var(--accent)]' : 'border-transparent hover:border-[var(--border-color)]'
                        }`}
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-[var(--border-color)]" />
                        ) : (
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <span className="text-sm font-bold text-[var(--text-main)] hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
                    </Link>

                    <button
                        onClick={logout}
                        title="Log Out"
                        aria-label="Log Out"
                        className="hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 rounded-full p-2 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                    >
                        <LogOut className="w-5 h-5 text-[var(--text-muted)] hover:text-rose-500" />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-4/5 max-w-xs bg-[var(--bg-card)] h-full shadow-2xl z-10 flex flex-col justify-between p-5 animate-in slide-in-from-left duration-250 border-r border-[var(--border-color)] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
                                <div className="flex items-center">
                                    <span className="text-2xl font-extrabold text-[var(--text-main)]">Task</span>
                                    <span className="text-[var(--accent)] text-2xl font-extrabold">Note</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Profile Card (Clickable to Profile) */}
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 bg-[var(--bg-subtle)] hover:bg-[var(--accent-subtle)] rounded-2xl border border-[var(--border-color)] transition-colors"
                            >
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border-color)]" />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm"
                                        style={{ backgroundColor: 'var(--accent)' }}
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-[var(--text-main)] truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                                </div>
                            </Link>

                            {/* Theme Selection in Mobile Drawer */}
                            <div className="p-3 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-color)]">
                                <ThemeSwitcher variant="inline" />
                            </div>

                            {/* Navigation Links */}
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">Navigation</p>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all min-h-[44px] ${
                                        isDashboard
                                            ? 'bg-[var(--accent)] text-white shadow-md'
                                            : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent)]'
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
                                                ? 'bg-[var(--accent)] text-white shadow-md'
                                                : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="w-5 h-5" />
                                            <span>Timetable Schedule</span>
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                            isTimetable ? 'bg-white text-[var(--accent)]' : 'bg-[var(--bg-card)] text-[var(--accent)]'
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
                                            ? 'bg-[var(--accent)] text-white shadow-md'
                                            : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent)]'
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
                        <div className="pt-4 border-t border-[var(--border-color)]">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer min-h-[44px]"
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
