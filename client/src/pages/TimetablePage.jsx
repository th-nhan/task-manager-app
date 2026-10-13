import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { timetableApi } from '../api/timetableApi';
import { DashboardHeader } from '../components/DashboardHeader';
import {
    DEFAULT_TIMETABLE_ITEMS,
    getLiveScheduleStatus,
    exportTimetableToExcel,
    getDayLabelEn
} from '../data/timetableData';

import { TimetableStatsCards } from '../components/timetable/TimetableStatsCards';
import { WeeklyGridView } from '../components/timetable/WeeklyGridView';
import { GradeGroupView } from '../components/timetable/GradeGroupView';
import { ClassDetailModal } from '../components/timetable/ClassDetailModal';
import { TimetableFormModal } from '../components/timetable/TimetableFormModal';
import { ExcelUploaderModal } from '../components/timetable/ExcelUploaderModal';
import { SalaryAttendanceView } from '../components/timetable/SalaryAttendanceView';
import Footer from '../components/Footer';

import {
    Calendar,
    LayoutGrid,
    GraduationCap,
    DollarSign,
    Download,
    Upload,
    Printer,
    Radio,
    Clock,
    Sparkles,
    CheckCircle,
    MapPin,
    PlusCircle,
    RotateCcw
} from 'lucide-react';

const ADMIN_EMAIL = 'tthhaannnnhhaann@gmail.com';
const STORAGE_KEY = 'task_manager_timetable_items_v4';

export const TimetablePage = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    // Verify if the user is authenticated
    const isAuthorized = Boolean(user);

    // If not logged in, redirect immediately to /login
    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    // Timetable items state with localStorage persistence for admin
    const [timetableItems, setTimetableItems] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE_ITEMS;
        } catch (e) {
            return DEFAULT_TIMETABLE_ITEMS;
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    // Fetch live timetable from database on mount
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setIsLoading(true);
                const res = await timetableApi.getTimetable();
                if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
                    setTimetableItems(res.data.data);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.data));
                }
            } catch (error) {
                console.error("Failed to fetch timetable from database:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthorized) {
            fetchTimetable();
        }
    }, [isAuthorized]);

    // View mode: 'grid' | 'weekend' | 'list' | 'grade'
    const [viewMode, setViewMode] = useState('grid');
    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [selectedLocation, setSelectedLocation] = useState('ALL');

    // Modals
    const [selectedClass, setSelectedClass] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Handle deep-linking query parameters (e.g. ?view=salary or ?classId=...)
    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam && ['grid', 'grade', 'salary'].includes(viewParam)) {
            setViewMode(viewParam);
        }
        const classIdParam = searchParams.get('classId');
        if (classIdParam && timetableItems.length > 0) {
            const foundClass = timetableItems.find(item => String(item.id) === String(classIdParam));
            if (foundClass) {
                setSelectedClass(foundClass);
                setIsDetailModalOpen(true);
            }
        }
    }, [searchParams, timetableItems]);

    // Form Modal (Create / Edit)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClassItem, setEditingClassItem] = useState(null);

    // Live schedule calculation
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const liveStatus = useMemo(() => {
        return getLiveScheduleStatus(timetableItems, currentTime);
    }, [timetableItems, currentTime]);

    // Save changes to state & localStorage
    const persistTimetable = (newItems) => {
        setTimetableItems(newItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    };

    const handleUpdateTimetableFromExcel = async (newItems) => {
        persistTimetable(newItems);
        try {
            const res = await timetableApi.syncBulk(newItems);
            if (res.data?.data) {
                persistTimetable(res.data.data);
            }
            toast.success(`Synced ${newItems.length} class sessions to Database!`);
        } catch (error) {
            console.error("Error syncing Excel timetable to database:", error);
            toast.warning(`Updated locally (Database sync failed)`);
        }
    };

    const handleResetDefault = async () => {
        persistTimetable(DEFAULT_TIMETABLE_ITEMS);
        try {
            const res = await timetableApi.syncBulk(DEFAULT_TIMETABLE_ITEMS);
            if (res.data?.data) {
                persistTimetable(res.data.data);
            }
            toast.info('Reset and synced timetable to default in Database.');
        } catch (error) {
            console.error("Error resetting default in database:", error);
            toast.info('Reset timetable locally.');
        }
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setEditingClassItem(null);
        setIsFormModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (classItem) => {
        setEditingClassItem(classItem);
        setIsFormModalOpen(true);
    };

    // Save Class (Create or Update)
    const handleSaveClass = async (classData) => {
        try {
            if (editingClassItem) {
                // Update existing in backend
                const res = await timetableApi.updateItem(editingClassItem.id, classData);
                const updatedItem = res.data?.data || { ...editingClassItem, ...classData };
                const updated = timetableItems.map(item =>
                    item.id === editingClassItem.id ? updatedItem : item
                );
                persistTimetable(updated);
                toast.success(`Updated class session "${classData.className}" in Database!`);
            } else {
                // Add new in backend
                const res = await timetableApi.createItem(classData);
                const newItem = res.data?.data || classData;
                const updated = [...timetableItems, newItem];
                persistTimetable(updated);
                toast.success(`Added class session "${classData.className}" to Database!`);
            }
        } catch (error) {
            console.error("Error saving class to database:", error);
            if (editingClassItem) {
                const updated = timetableItems.map(item =>
                    item.id === editingClassItem.id ? { ...item, ...classData } : item
                );
                persistTimetable(updated);
            } else {
                const updated = [...timetableItems, classData];
                persistTimetable(updated);
            }
            toast.warning(`Saved locally (Database sync failed)`);
        }
    };

    // Delete Class
    const handleDeleteClass = async (classId) => {
        const itemToDelete = timetableItems.find(i => i.id === classId);
        const updated = timetableItems.filter(item => item.id !== classId);
        persistTimetable(updated);

        if (selectedClass && selectedClass.id === classId) {
            setIsDetailModalOpen(false);
            setSelectedClass(null);
        }

        try {
            await timetableApi.deleteItem(classId);
            toast.success(`Deleted class session "${itemToDelete?.className || ''}" successfully!`);
        } catch (error) {
            console.error("Error deleting class from database:", error);
            toast.info(`Deleted locally`);
        }
    };

    const handleOpenClassDetail = (classItem) => {
        setSelectedClass(classItem);
        setIsDetailModalOpen(true);
    };

    const handleExport = () => {
        if (timetableItems.length === 0) {
            toast.warning('Timetable is currently empty, no data to export!');
            return;
        }
        exportTimetableToExcel(timetableItems);
        toast.success('Timetable Excel file downloaded!');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-pink-100 min-h-screen min-h-[100dvh] flex flex-col gap-4 sm:gap-6 overflow-x-hidden">
            {/* Navigation Header */}
            <DashboardHeader user={user} logout={logout} activePage="timetable" />

            {/* Main Timetable Content */}
            <main className="flex-1 flex flex-col gap-4 sm:gap-6 mx-3 sm:mx-6 md:mx-10 lg:mx-16 min-w-0">
                {/* Live Status Banner */}
                {(liveStatus.activeClass || liveStatus.nextClass) && (
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-pink-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                liveStatus.activeClass 
                                    ? 'bg-emerald-500 text-white animate-pulse' 
                                    : 'bg-pink-100 text-pink-600'
                            }`}>
                                <Radio className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                                        {liveStatus.activeClass ? '🔴 In Progress' : '⏰ Next Class'}
                                    </span>
                                    {liveStatus.activeClass ? (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                            ~{liveStatus.activeClass.minutesRemaining}m left
                                        </span>
                                    ) : liveStatus.nextClass?.isToday ? (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                            In {Math.floor(liveStatus.nextClass.minutesUntil / 60)}h {liveStatus.nextClass.minutesUntil % 60}m
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {getDayLabelEn(liveStatus.nextClass?.dayOfWeek)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm md:text-base font-bold text-gray-800 mt-0.5 truncate">
                                    {liveStatus.activeClass
                                        ? `${liveStatus.activeClass.className} (${liveStatus.activeClass.timeRange})`
                                        : `${getDayLabelEn(liveStatus.nextClass.dayOfWeek)}: ${liveStatus.nextClass.className} (${liveStatus.nextClass.timeRange})`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <button
                                onClick={() => handleOpenClassDetail(liveStatus.activeClass || liveStatus.nextClass)}
                                className="w-full md:w-auto px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-xs transition-colors cursor-pointer text-center min-h-[36px]"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                )}

                {/* Timetable Statistics */}
                <TimetableStatsCards timetableItems={timetableItems} />

                {/* Toolbar & View Switcher */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs border border-pink-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
                    {/* View Switch Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-pink-50/80 rounded-2xl border border-pink-100/80 overflow-x-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                                viewMode === 'grid'
                                    ? 'bg-pink-500 text-white shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Weekly Grid</span>
                        </button>

                        <button
                            onClick={() => setViewMode('grade')}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                                viewMode === 'grade'
                                    ? 'bg-pink-500 text-white shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>By Grade</span>
                        </button>

                        <button
                            onClick={() => setViewMode('salary')}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                                viewMode === 'salary'
                                    ? 'bg-pink-500 text-white shadow-xs'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <DollarSign className="w-4 h-4" />
                            <span>Salary & Attendance</span>
                        </button>
                    </div>

                    {/* Filter & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                        {/* Add Class Button */}
                        <button
                            onClick={handleOpenAddModal}
                            title="Add new class session"
                            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs md:text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[38px]"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Class Slot</span>
                        </button>

                        {viewMode === 'grid' && (
                            <>
                                <select
                                    value={selectedGrade}
                                    onChange={e => setSelectedGrade(e.target.value)}
                                    className="text-xs px-2.5 sm:px-3 py-2 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 cursor-pointer min-h-[38px]"
                                >
                                    <option value="ALL">All Grades</option>
                                    <option value="10">Grade 10</option>
                                    <option value="11">Grade 11</option>
                                    <option value="12">Grade 12</option>
                                </select>

                                <select
                                    value={selectedLocation}
                                    onChange={e => setSelectedLocation(e.target.value)}
                                    className="text-xs px-2.5 sm:px-3 py-2 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 cursor-pointer min-h-[38px]"
                                >
                                    <option value="ALL">All Locations</option>
                                    <option value="Long Thượng">Long Thượng</option>
                                    <option value="Mỹ Lộc">Mỹ Lộc</option>
                                </select>
                            </>
                        )}

                        {/* Import Button */}
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            title="Upload new Excel file"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer min-h-[38px]"
                        >
                            <Upload className="w-3.5 h-3.5 text-pink-500" />
                            <span className="hidden xs:inline">Import</span>
                        </button>

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            title="Export Excel file"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer min-h-[38px]"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Export</span>
                        </button>

                        {/* Print Button */}
                        <button
                            onClick={handlePrint}
                            title="Print timetable"
                            aria-label="Print timetable"
                            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Active View Container */}
                <div className="w-full min-w-0">
                    {viewMode === 'grid' && (
                        <WeeklyGridView
                            timetableItems={timetableItems}
                            selectedGrade={selectedGrade}
                            selectedLocation={selectedLocation}
                            onSelectClass={handleOpenClassDetail}
                        />
                    )}

                    {viewMode === 'grade' && (
                        <GradeGroupView
                            timetableItems={timetableItems}
                            onSelectClass={handleOpenClassDetail}
                        />
                    )}

                    {viewMode === 'salary' && (
                        <SalaryAttendanceView
                            toast={toast}
                            timetableItems={timetableItems}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer className="mt-auto pb-4" />

            {/* Class Detail Modal */}
            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classItem={selectedClass}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteClass}
                onStatusChange={(cls, st) => {
                    const label = st === 'COMPLETED' ? 'Taught' : st === 'MAKE_UP' ? 'Make-up' : st === 'CANCELLED' ? 'Cancelled' : 'Scheduled';
                    toast.success(`Updated status for "${cls.originalCode || cls.className}" to ${label}!`);
                }}
            />

            {/* Timetable Form Modal (Create / Edit) */}
            <TimetableFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingClassItem(null);
                }}
                onSubmit={handleSaveClass}
                editingClass={editingClassItem}
            />

            {/* Excel Uploader Modal */}
            <ExcelUploaderModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onImportSuccess={handleUpdateTimetableFromExcel}
                onResetDefault={handleResetDefault}
            />
        </div>
    );
};

export default TimetablePage;
