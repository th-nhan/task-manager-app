import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { taskApi } from '../api/taskApi';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { MonthCalendarView } from '../components/MonthCalendarView';
import { WeekScheduleView } from '../components/WeekScheduleView';
import { KanbanBoardView } from '../components/KanbanBoardView';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardToolbar } from '../components/DashboardToolbar';

const PRIORITY_FILTER_OPTIONS = [
    { value: 'ALL', label: 'All Priority' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
];

const Dashboard = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'kanban'
    const [filterPriority, setFilterPriority] = useState('ALL');

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await taskApi.getTasks({ limit: 100 });
            const taskList = res?.data || (Array.isArray(res) ? res : []);
            setTasks(taskList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Không thể tải danh sách công việc!');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleOpenCreateModal = (date = null) => {
        if (date) {
            setSelectedDate(new Date(date));
        }
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleOpenTaskDetail = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = async (taskData) => {
        if (selectedTask) {
            await taskApi.updateTask(selectedTask.id, taskData);
            toast.success('Cập nhật công việc thành công!');
        } else {
            await taskApi.createTask(taskData);
            toast.success('Tạo công việc mới thành công!');
        }
        fetchTasks();
    };

    const handleToggleStatus = async (task) => {
        const nextStatus =
            task.status === 'TODO'
                ? 'IN_PROGRESS'
                : task.status === 'IN_PROGRESS'
                    ? 'DONE'
                    : 'TODO';

        try {
            await taskApi.updateTask(task.id, { status: nextStatus });
            setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: nextStatus, updatedAt: new Date().toISOString() } : t)));
            toast.info(
                `Trạng thái: ${
                    nextStatus === 'DONE'
                        ? 'Hoàn thành'
                        : nextStatus === 'IN_PROGRESS'
                            ? 'Đang thực hiện'
                            : 'Cần làm'
                }`
            );
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
        try {
            await taskApi.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            if (selectedTask && selectedTask.id === id) {
                handleCloseModal();
            }
            toast.success('Đã xóa công việc thành công!');
        } catch (err) {
            toast.error('Không thể xóa công việc!');
        }
    };

    const handleRescheduleTask = async (task, targetDate) => {
        try {
            const target = new Date(targetDate);
            let newStartDate = null;
            let newDueDate = null;

            if (task.startDate) {
                const oldStart = new Date(task.startDate);
                newStartDate = new Date(target);
                newStartDate.setHours(oldStart.getHours(), oldStart.getMinutes(), oldStart.getSeconds(), 0);
            } else {
                newStartDate = new Date(target);
                newStartDate.setHours(9, 0, 0, 0);
            }

            if (task.dueDate) {
                const oldDue = new Date(task.dueDate);
                if (task.startDate) {
                    const oldStart = new Date(task.startDate);
                    const diffMs = oldDue.getTime() - oldStart.getTime();
                    newDueDate = new Date(newStartDate.getTime() + Math.max(0, diffMs));
                } else {
                    newDueDate = new Date(target);
                    newDueDate.setHours(oldDue.getHours(), oldDue.getMinutes(), oldDue.getSeconds(), 0);
                }
            }

            const updatePayload = {
                startDate: newStartDate.toISOString(),
                ...(newDueDate ? { dueDate: newDueDate.toISOString() } : {})
            };

            setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, ...updatePayload } : t)));
            await taskApi.updateTask(task.id, updatePayload);
            toast.success(`Đã dời sang ngày ${target.getDate()}/${target.getMonth() + 1}!`);
        } catch (err) {
            console.error('Reschedule error:', err);
            toast.error('Không thể cập nhật ngày công việc!');
            fetchTasks();
        }
    };

    const handleDropTaskKanban = async (sourceTaskId, targetColumnKey) => {
        const task = tasks.find(t => t.id === sourceTaskId);
        if (!task) return;

        let updateData = {};
        if (targetColumnKey === 'DONE') {
            if (task.status === 'DONE') return;
            updateData = { status: 'DONE' };
        } else if (targetColumnKey === 'IN_PROGRESS') {
            const isCurrentlyMissing = task.status !== 'DONE' && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
            if (task.status === 'IN_PROGRESS' && !isCurrentlyMissing) return;
            updateData = { status: 'IN_PROGRESS' };
            if (isCurrentlyMissing) {
                updateData.dueDate = null;
            }
        } else if (targetColumnKey === 'TODO') {
            const isCurrentlyMissing = task.status !== 'DONE' && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
            if (task.status === 'TODO' && !isCurrentlyMissing) return;
            updateData = { status: 'TODO' };
            if (isCurrentlyMissing) {
                updateData.dueDate = null;
            }
        } else if (targetColumnKey === 'MISSING') {
            const isCurrentlyMissing = task.status !== 'DONE' && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
            if (isCurrentlyMissing) return;
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            updateData = {
                status: task.status === 'DONE' ? 'TODO' : task.status,
                dueDate: yesterday.toISOString()
            };
        }

        try {
            setTasks(prev => prev.map(t => (t.id === sourceTaskId ? { ...t, ...updateData, updatedAt: new Date().toISOString() } : t)));
            await taskApi.updateTask(sourceTaskId, updateData);
            toast.success(
                `Chuyển sang "${
                    targetColumnKey === 'TODO'
                        ? 'To Do'
                        : targetColumnKey === 'IN_PROGRESS'
                            ? 'In Progress'
                            : targetColumnKey === 'DONE'
                                ? 'Done'
                                : 'Missing'
                }"`
            );
        } catch (err) {
            console.error(err);
            toast.error('Không thể cập nhật trạng thái công việc!');
            fetchTasks();
        }
    };

    const handlePrev = () => {
        if (viewMode === 'month') {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        } else {
            setCurrentDate(prev => {
                const next = new Date(prev);
                next.setDate(next.getDate() - 7);
                return next;
            });
        }
    };

    const handleNext = () => {
        if (viewMode === 'month') {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        } else {
            setCurrentDate(prev => {
                const next = new Date(prev);
                next.setDate(next.getDate() + 7);
                return next;
            });
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const dateRangeTitle = useMemo(() => {
        if (viewMode === 'month' || viewMode === 'kanban') {
            const monthNameEn = currentDate.toLocaleDateString('en-US', { month: 'long' });
            return `${monthNameEn}, ${currentDate.getFullYear()}`;
        }
        if (viewMode === 'week') {
            const curr = new Date(currentDate);
            const dayOfWeek = (curr.getDay() + 6) % 7;
            const monday = new Date(curr);
            monday.setDate(curr.getDate() - dayOfWeek);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const monthName = monday.toLocaleDateString('en-US', { month: 'long' });
            const year = monday.getFullYear();
            return `${monday.getDate()} - ${sunday.getDate()}, ${monthName}, ${year}`;
        }
        return `${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;
    }, [viewMode, currentDate]);

    return (
        <div className="bg-pink-100 min-h-screen flex flex-col gap-6 pb-12">
            {/* Header */}
            <DashboardHeader user={user} logout={logout} />

            {/* Toolbar & View Navigation */}
            <DashboardToolbar
                dateRangeTitle={dateRangeTitle}
                onPrev={handlePrev}
                onNext={handleNext}
                onToday={handleToday}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenCreateModal={() => handleOpenCreateModal(selectedDate)}
            />

            {/* Views Content Body */}
            <div className="flex mx-6 md:mx-16">
                <div className="w-full">
                    {/* View 1: Month Calendar View */}
                    {viewMode === 'month' && (
                        <MonthCalendarView
                            currentDate={currentDate}
                            tasks={tasks}
                            filterPriority={filterPriority}
                            onFilterPriorityChange={setFilterPriority}
                            priorityFilterOptions={PRIORITY_FILTER_OPTIONS}
                            loading={loading}
                            onOpenCreateModal={handleOpenCreateModal}
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onToggleStatus={handleToggleStatus}
                            onDeleteTask={handleDeleteTask}
                            onRescheduleTask={handleRescheduleTask}
                        />
                    )}

                    {/* View 2: Week Schedule View */}
                    {viewMode === 'week' && (
                        <WeekScheduleView
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            tasks={tasks}
                            filterPriority={filterPriority}
                            onFilterPriorityChange={setFilterPriority}
                            priorityFilterOptions={PRIORITY_FILTER_OPTIONS}
                            loading={loading}
                            onOpenCreateModal={handleOpenCreateModal}
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onToggleStatus={handleToggleStatus}
                            onDeleteTask={handleDeleteTask}
                        />
                    )}

                    {/* View 3: Kanban Board View */}
                    {viewMode === 'kanban' && (
                        <KanbanBoardView
                            tasks={tasks}
                            filterPriority={filterPriority}
                            onFilterPriorityChange={setFilterPriority}
                            priorityFilterOptions={PRIORITY_FILTER_OPTIONS}
                            loading={loading}
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onToggleStatus={handleToggleStatus}
                            onDeleteTask={handleDeleteTask}
                            onDropTask={handleDropTaskKanban}
                        />
                    )}
                </div>
            </div>

            {/* Create / Edit Task Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveTask}
                defaultDate={selectedDate}
                task={selectedTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};

export default Dashboard;