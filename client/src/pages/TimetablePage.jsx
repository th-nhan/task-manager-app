import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { taskApi } from '../api/taskApi';
import { DashboardHeader } from '../components/DashboardHeader';
import { CreateTaskModal } from '../components/CreateTaskModal';
import {
    DEFAULT_TIMETABLE_ITEMS,
    getLiveScheduleStatus,
    exportTimetableToExcel
} from '../data/timetableData';

import { TimetableStatsCards } from '../components/timetable/TimetableStatsCards';
import { WeeklyGridView } from '../components/timetable/WeeklyGridView';
import { WeekendFocusView } from '../components/timetable/WeekendFocusView';
import { TimetableListView } from '../components/timetable/TimetableListView';
import { GradeGroupView } from '../components/timetable/GradeGroupView';
import { ClassDetailModal } from '../components/timetable/ClassDetailModal';
import { TimetableFormModal } from '../components/timetable/TimetableFormModal';
import { ExcelUploaderModal } from '../components/timetable/ExcelUploaderModal';

import {
    Calendar,
    LayoutGrid,
    Flame,
    ListFilter,
    GraduationCap,
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
const STORAGE_KEY = 'task_manager_timetable_items_v2';

export const TimetablePage = () => {
    const { user, logout } = useAuth();
    const toast = useToast();

    // Verify if the logged-in user is the only authorized email
    const isAuthorized = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // If not authorized, redirect immediately to /dashboard
    if (!isAuthorized) {
        return <Navigate to="/dashboard" replace />;
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

    // View mode: 'grid' | 'weekend' | 'list' | 'grade'
    const [viewMode, setViewMode] = useState('grid');
    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [selectedLocation, setSelectedLocation] = useState('ALL');

    // Modals
    const [selectedClass, setSelectedClass] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Form Modal (Create / Edit)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClassItem, setEditingClassItem] = useState(null);

    // Create task modal for converting class to task
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [taskPrefillData, setTaskPrefillData] = useState(null);

    // Live schedule calculation
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const liveStatus = useMemo(() => {
        return getLiveScheduleStatus(timetableItems, currentTime);
    }, [timetableItems, currentTime]);

    // Save changes to localStorage
    const persistTimetable = (newItems) => {
        setTimetableItems(newItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    };

    const handleUpdateTimetableFromExcel = (newItems) => {
        persistTimetable(newItems);
        toast.success(`Đã cập nhật ${newItems.length} ca học từ file Excel!`);
    };

    const handleResetDefault = () => {
        persistTimetable(DEFAULT_TIMETABLE_ITEMS);
        toast.info('Đã khôi phục dữ liệu thời khóa biểu gốc mặc định.');
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
    const handleSaveClass = (classData) => {
        if (editingClassItem) {
            // Update existing
            const updated = timetableItems.map(item =>
                item.id === editingClassItem.id ? { ...item, ...classData } : item
            );
            persistTimetable(updated);
            toast.success(`Đã cập nhật ca học "${classData.className}" thành công!`);
        } else {
            // Add new
            const updated = [...timetableItems, classData];
            persistTimetable(updated);
            toast.success(`Đã thêm ca học "${classData.className}" vào Thời Khóa Biểu!`);
        }
    };

    // Delete Class
    const handleDeleteClass = (classId) => {
        const itemToDelete = timetableItems.find(i => i.id === classId);
        const updated = timetableItems.filter(item => item.id !== classId);
        persistTimetable(updated);
        toast.success(`Đã xóa ca học "${itemToDelete?.className || ''}" thành công!`);
        if (selectedClass && selectedClass.id === classId) {
            setIsDetailModalOpen(false);
            setSelectedClass(null);
        }
    };

    const handleOpenClassDetail = (classItem) => {
        setSelectedClass(classItem);
        setIsDetailModalOpen(true);
    };

    // Convert class to task
    const handleConvertToTask = (classItem) => {
        const now = new Date();
        const currentDayIndex = now.getDay();
        let daysToAdd = (classItem.dayIndex - currentDayIndex + 7) % 7;
        if (daysToAdd === 0 && classItem.startTime < `${now.getHours()}:${now.getMinutes()}`) {
            daysToAdd = 7;
        }

        const taskDate = new Date();
        taskDate.setDate(now.getDate() + daysToAdd);

        const [startH, startM] = classItem.startTime.split(':').map(Number);
        const [endH, endM] = classItem.endTime.split(':').map(Number);

        const startDate = new Date(taskDate);
        startDate.setHours(startH, startM, 0, 0);

        const dueDate = new Date(taskDate);
        dueDate.setHours(endH, endM, 0, 0);

        setTaskPrefillData({
            title: `Dạy lớp: ${classItem.className} (${classItem.originalCode})`,
            description: `Khung giờ: ${classItem.timeRange}\nCơ sở: ${classItem.location}\nKhối: ${classItem.grade} - Trình độ: ${classItem.level}`,
            priority: 'HIGH',
            status: 'TODO',
            startDate: startDate.toISOString(),
            dueDate: dueDate.toISOString()
        });
        setIsCreateTaskModalOpen(true);
    };

    const handleSaveTaskFromModal = async (taskData) => {
        try {
            await taskApi.createTask(taskData);
            toast.success('Đã tạo công việc thành công trong Lịch/Dashboard!');
            setIsCreateTaskModalOpen(false);
            setTaskPrefillData(null);
        } catch (err) {
            console.error('Error creating task:', err);
            toast.error('Không thể tạo công việc từ TKB!');
        }
    };

    const handleExport = () => {
        if (timetableItems.length === 0) {
            toast.warning('Thời khóa biểu hiện đang trống, không có dữ liệu để xuất!');
            return;
        }
        exportTimetableToExcel(timetableItems);
        toast.success('Đã tải xuống file Excel Thời Khóa Biểu!');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-pink-100 min-h-screen flex flex-col gap-6 pb-12">
            {/* Navigation Header */}
            <DashboardHeader user={user} logout={logout} activePage="timetable" />

            {/* Main Timetable Content */}
            <div className="flex flex-col gap-6 mx-4 md:mx-16">
                {/* Live Status Banner */}
                {(liveStatus.activeClass || liveStatus.nextClass) && (
                    <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-pink-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                                liveStatus.activeClass 
                                    ? 'bg-emerald-500 text-white animate-pulse' 
                                    : 'bg-pink-100 text-pink-600'
                            }`}>
                                <Radio className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                                        {liveStatus.activeClass ? '🔴 Đang trong giờ dạy' : '⏰ Ca học tiếp theo'}
                                    </span>
                                    {liveStatus.activeClass ? (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                            Còn ~{liveStatus.activeClass.minutesRemaining} phút
                                        </span>
                                    ) : liveStatus.nextClass?.isToday ? (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                            Sau {Math.floor(liveStatus.nextClass.minutesUntil / 60)}h{liveStatus.nextClass.minutesUntil % 60}p
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {liveStatus.nextClass?.dayOfWeek}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                    {liveStatus.activeClass
                                        ? `${liveStatus.activeClass.className} (${liveStatus.activeClass.timeRange})`
                                        : `${liveStatus.nextClass.dayOfWeek}: ${liveStatus.nextClass.className} (${liveStatus.nextClass.timeRange})`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOpenClassDetail(liveStatus.activeClass || liveStatus.nextClass)}
                                className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold text-xs transition-colors cursor-pointer"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                )}

                {/* Timetable Statistics */}
                <TimetableStatsCards timetableItems={timetableItems} />

                {/* Toolbar & View Switcher */}
                <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-pink-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* View Switch Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-pink-50/80 rounded-2xl border border-pink-100">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Lưới TKB Tuần</span>
                        </button>

                        <button
                            onClick={() => setViewMode('weekend')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                viewMode === 'weekend'
                                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <Flame className="w-4 h-4 text-amber-300" />
                            <span>Trọng Tâm T7 & CN</span>
                        </button>

                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                viewMode === 'list'
                                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <ListFilter className="w-4 h-4" />
                            <span>Danh Sách ({timetableItems.length} Ca)</span>
                        </button>

                        <button
                            onClick={() => setViewMode('grade')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                viewMode === 'grade'
                                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Theo Khối Lớp</span>
                        </button>
                    </div>

                    {/* Filter & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                        {/* Add Class Button */}
                        <button
                            onClick={handleOpenAddModal}
                            title="Thêm ca học mới"
                            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-md shadow-pink-200 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Thêm Ca Học</span>
                        </button>

                        {viewMode === 'grid' && (
                            <>
                                <select
                                    value={selectedGrade}
                                    onChange={e => setSelectedGrade(e.target.value)}
                                    className="text-xs px-3 py-2 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="ALL">Tất cả Khối</option>
                                    <option value="10">Khối 10</option>
                                    <option value="11">Khối 11</option>
                                    <option value="12">Khối 12</option>
                                </select>

                                <select
                                    value={selectedLocation}
                                    onChange={e => setSelectedLocation(e.target.value)}
                                    className="text-xs px-3 py-2 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="ALL">Tất cả Cơ sở</option>
                                    <option value="Long Thượng">Long Thượng</option>
                                    <option value="Mỹ Lộc">Mỹ Lộc</option>
                                </select>
                            </>
                        )}

                        {/* Import Button */}
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            title="Tải lên file Excel mới"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <Upload className="w-3.5 h-3.5 text-pink-500" />
                            <span>Nhập Excel</span>
                        </button>

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            title="Xuất file Excel"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Xuất Excel</span>
                        </button>

                        {/* Print Button */}
                        <button
                            onClick={handlePrint}
                            title="In thời khóa biểu"
                            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Active View Container */}
                <div className="w-full">
                    {viewMode === 'grid' && (
                        <WeeklyGridView
                            timetableItems={timetableItems}
                            selectedGrade={selectedGrade}
                            selectedLocation={selectedLocation}
                            onSelectClass={handleOpenClassDetail}
                        />
                    )}

                    {viewMode === 'weekend' && (
                        <WeekendFocusView
                            timetableItems={timetableItems}
                            onSelectClass={handleOpenClassDetail}
                            onConvertToTask={handleConvertToTask}
                        />
                    )}

                    {viewMode === 'list' && (
                        <TimetableListView
                            timetableItems={timetableItems}
                            onSelectClass={handleOpenClassDetail}
                            onConvertToTask={handleConvertToTask}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteClass}
                        />
                    )}

                    {viewMode === 'grade' && (
                        <GradeGroupView
                            timetableItems={timetableItems}
                            onSelectClass={handleOpenClassDetail}
                            onConvertToTask={handleConvertToTask}
                        />
                    )}
                </div>
            </div>

            {/* Class Detail Modal */}
            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classItem={selectedClass}
                onConvertToTask={handleConvertToTask}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteClass}
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

            {/* Create Task Modal (when converting from timetable) */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => {
                    setIsCreateTaskModalOpen(false);
                    setTaskPrefillData(null);
                }}
                onSubmit={handleSaveTaskFromModal}
                task={taskPrefillData}
            />
        </div>
    );
};

export default TimetablePage;
