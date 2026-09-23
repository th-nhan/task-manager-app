import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();
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
            toast.error('Failed to load tasks!');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handle deep-linking from notifications or URL (e.g. ?taskId=... or ?view=...)
    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam && ['month', 'week', 'kanban'].includes(viewParam)) {
            setViewMode(viewParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const taskIdParam = searchParams.get('taskId');
        if (taskIdParam && tasks.length > 0) {
            const foundTask = tasks.find(t => (t._id || t.id) === taskIdParam);
            if (foundTask) {
                setSelectedTask(foundTask);
                setIsModalOpen(true);
                if (foundTask.dueDate || foundTask.startDate) {
                    const targetDate = new Date(foundTask.dueDate || foundTask.startDate);
                    if (!isNaN(targetDate.getTime())) {
                        setCurrentDate(targetDate);
                        setSelectedDate(targetDate);
                    }
                }
            }
        }
    }, [searchParams, tasks]);

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
        if (searchParams.get('taskId')) {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.delete('taskId');
                return next;
            }, { replace: true });
        }
    };

    const handleSaveTask = async (taskData) => {
        if (selectedTask) {
            await taskApi.updateTask(selectedTask.id, taskData);
            toast.success('Task updated successfully!');
        } else {
            await taskApi.createTask(taskData);
            toast.success('Task created successfully!');
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
                `Status: ${
                    nextStatus === 'DONE'
                        ? 'Done'
                        : nextStatus === 'IN_PROGRESS'
                            ? 'In Progress'
                            : 'To Do'
                }`
            );
        } catch (err) {
            toast.error('Failed to update status!');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskApi.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            if (selectedTask && selectedTask.id === id) {
                handleCloseModal();
            }
            toast.success('Task deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete task!');
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
            toast.success(`Rescheduled to ${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`);
        } catch (err) {
            console.error('Reschedule error:', err);
            toast.error('Failed to reschedule task!');
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
                `Moved to "${
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
            toast.error('Failed to update task status!');
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
        <div className="bg-pink-100 min-h-screen min-h-[100dvh] flex flex-col gap-4 sm:gap-6 pb-24">
            {/* Header */}
            <DashboardHeader user={user} logout={logout} activePage="dashboard" />

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
            <main className="flex mx-3 sm:mx-6 md:mx-10 lg:mx-16 min-w-0">
                <div className="w-full min-w-0">
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
            </main>

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