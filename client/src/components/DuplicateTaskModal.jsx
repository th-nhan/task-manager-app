import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Calendar, Clock, Sparkles } from 'lucide-react';
import { Alert } from './Notification';

const toLocalISOString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const pad = (num) => String(num).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getCategoryBadge = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
        case 'work':
            return 'bg-pink-100 text-pink-700 border-pink-200';
        case 'personal':
            return 'bg-pink-100 text-pink-700 border-pink-200';
        case 'learning':
            return 'bg-pink-50 text-pink-600 border-pink-200';
        default:
            return 'bg-pink-50 text-pink-600 border-pink-200';
    }
};

const getPriorityBadge = (priority) => {
    switch (priority) {
        case 'HIGH':
            return { label: 'High', color: 'bg-red-50 text-red-600 border-red-200' };
        case 'MEDIUM':
            return { label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-200' };
        default:
            return { label: 'Low', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    }
};

export const DuplicateTaskModal = ({
    isOpen,
    onClose,
    task,
    onDuplicateSubmit,
}) => {
    const startDateInputRef = useRef(null);
    const dueDateInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('TODO');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Track original duration (in ms) to preserve task length when shifting dates
    const [durationMs, setDurationMs] = useState(0);

    useEffect(() => {
        if (isOpen && task) {
            setError('');
            setTitle(task.title || '');
            setStatus('TODO'); // Default to TODO for a newly duplicated task

            const originalStart = task.startDate ? new Date(task.startDate) : null;
            const originalDue = task.dueDate ? new Date(task.dueDate) : null;

            let dur = 0;
            if (originalStart && originalDue && !isNaN(originalStart.getTime()) && !isNaN(originalDue.getTime())) {
                dur = Math.max(0, originalDue.getTime() - originalStart.getTime());
            }
            setDurationMs(dur);

            // Default: Date is today (creation date), time is preserved from original task
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const day = today.getDate();

            let initialStart = null;
            let initialDue = null;

            if (originalStart && !isNaN(originalStart.getTime())) {
                initialStart = new Date(year, month, day, originalStart.getHours(), originalStart.getMinutes(), 0, 0);

                if (dur > 0) {
                    initialDue = new Date(initialStart.getTime() + dur);
                } else if (originalDue && !isNaN(originalDue.getTime())) {
                    initialDue = new Date(year, month, day, originalDue.getHours(), originalDue.getMinutes(), 0, 0);
                }
            } else if (originalDue && !isNaN(originalDue.getTime())) {
                initialDue = new Date(year, month, day, originalDue.getHours(), originalDue.getMinutes(), 0, 0);
            } else {
                initialStart = new Date(year, month, day, 8, 0, 0, 0);
            }

            setStartDate(toLocalISOString(initialStart));
            setDueDate(toLocalISOString(initialDue));
        }
    }, [isOpen, task]);

    if (!isOpen || !task) return null;

    // Quick shift helper: Shifts start and due dates while keeping original hours & duration
    const applyQuickShift = (mode) => {
        setError('');
        const today = new Date();

        const originalStart = task.startDate ? new Date(task.startDate) : null;
        const currentStartObj = startDate ? new Date(startDate) : originalStart;
        const startHours = originalStart ? originalStart.getHours() : (currentStartObj ? currentStartObj.getHours() : 8);
        const startMinutes = originalStart ? originalStart.getMinutes() : (currentStartObj ? currentStartObj.getMinutes() : 0);

        let newStart = new Date();

        if (mode === 'today') {
            newStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes, 0, 0);
        } else if (mode === 'tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            newStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), startHours, startMinutes, 0, 0);
        } else if (mode === 'next_week') {
            const baseDate = currentStartObj ? new Date(currentStartObj) : new Date(today);
            baseDate.setDate(baseDate.getDate() + 7);
            newStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHours, startMinutes, 0, 0);
        } else if (mode === 'next_month') {
            const baseDate = currentStartObj ? new Date(currentStartObj) : new Date(today);
            baseDate.setMonth(baseDate.getMonth() + 1);
            newStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHours, startMinutes, 0, 0);
        }

        let newDue = null;
        if (durationMs > 0) {
            newDue = new Date(newStart.getTime() + durationMs);
        } else if (dueDate) {
            const currentDueObj = new Date(dueDate);
            if (!isNaN(currentDueObj.getTime()) && currentStartObj) {
                const diff = currentDueObj.getTime() - currentStartObj.getTime();
                newDue = new Date(newStart.getTime() + Math.max(0, diff));
            }
        }

        setStartDate(toLocalISOString(newStart));
        if (newDue) {
            setDueDate(toLocalISOString(newDue));
        }
    };

    const handleStartDateChange = (e) => {
        const val = e.target.value;
        setStartDate(val);
        setError('');

        if (val && durationMs > 0) {
            const newStart = new Date(val);
            if (!isNaN(newStart.getTime())) {
                const newDue = new Date(newStart.getTime() + durationMs);
                setDueDate(toLocalISOString(newDue));
            }
        } else if (val && dueDate && new Date(dueDate) < new Date(val)) {
            setDueDate('');
        }
    };

    const handleDueDateChange = (e) => {
        const val = e.target.value;
        if (startDate && val && new Date(val) < new Date(startDate)) {
            setError('Due date cannot be earlier than start date & time!');
        } else {
            setError('');
        }
        setDueDate(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Task title cannot be empty!');
            return;
        }

        if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
            setError('Due date cannot be earlier than start date & time!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const newTaskPayload = {
                title: title.trim(),
                description: task.description || '',
                priority: task.priority || 'MEDIUM',
                status: status,
                categoryId: task.categoryId || task.category?.id || null,
                category: task.category?.name || task.category || 'Work',
                startDate: startDate ? new Date(startDate).toISOString() : null,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            };

            await onDuplicateSubmit(newTaskPayload);
            onClose();
        } catch (err) {
            console.error('Error duplicating task:', err);
            setError(err?.response?.data?.message || 'Failed to duplicate task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const categoryName = task.category?.name || task.category || 'Work';
    const priorityInfo = getPriorityBadge(task.priority);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[95vw] sm:max-w-lg relative max-h-[92dvh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white border border-pink-200 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-pink-500 py-4 sm:py-5 px-4 sm:px-6 relative flex items-center justify-between text-white shrink-0 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs shadow-inner">
                            <Copy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold leading-tight">
                                Duplicate Task
                            </h2>
                            <p className="text-xs text-pink-100 mt-0.5">
                                Keep task details & original time, choose a new date
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 bg-pink-50/30 overflow-y-auto flex-1 space-y-4">
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                        />
                    )}

                    {/* Original Task Summary Card */}
                    <div className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-pink-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                                Copied Properties
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${getCategoryBadge(categoryName)}`}>
                                    {categoryName}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${priorityInfo.color}`}>
                                    {priorityInfo.label} Priority
                                </span>
                            </div>
                        </div>

                        {task.description && (
                            <p className="text-xs text-gray-500 italic line-clamp-2 bg-pink-50/50 p-2 rounded-xl border border-pink-100/70">
                                "{task.description}"
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Task Title */}
                        <div>
                            <label htmlFor="dup-title" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                Task Title <span className="text-pink-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="dup-title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title..."
                                className="w-full border border-pink-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white text-gray-800 text-sm font-medium shadow-2xs"
                            />
                        </div>

                        {/* Quick Date Shifters */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                                    Quick Date Shift (keeps original time):
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyQuickShift('today')}
                                    className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-pink-300 bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                                >
                                    <span>Today</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickShift('tomorrow')}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <span>Tomorrow</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickShift('next_week')}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-pink-200 bg-white hover:bg-pink-50 text-pink-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <span>+7 Days</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickShift('next_month')}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-pink-200 bg-white hover:bg-pink-50 text-pink-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <span>+1 Month</span>
                                </button>
                            </div>
                        </div>

                        {/* Start Date & Due Date Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <label htmlFor="dup-startDate" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                    Start Date & Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={startDateInputRef}
                                        type="datetime-local"
                                        id="dup-startDate"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        className="w-full border border-pink-200 rounded-xl pl-3 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white text-gray-800 text-xs sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => startDateInputRef.current?.showPicker?.()}
                                        className="absolute right-2.5 text-pink-400 hover:text-pink-600 cursor-pointer p-1"
                                        title="Select start date & time"
                                    >
                                        <Clock className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="dup-dueDate" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                    Due Date & Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={dueDateInputRef}
                                        type="datetime-local"
                                        id="dup-dueDate"
                                        min={startDate || undefined}
                                        value={dueDate}
                                        onChange={handleDueDateChange}
                                        className="w-full border border-pink-200 rounded-xl pl-3 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white text-gray-800 text-xs sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => dueDateInputRef.current?.showPicker?.()}
                                        className="absolute right-2.5 text-pink-400 hover:text-pink-600 cursor-pointer p-1"
                                        title="Select due date & time"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status for New Duplicated Task */}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                Status
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'TODO', label: 'To Do' },
                                    { value: 'IN_PROGRESS', label: 'In Progress' },
                                    { value: 'DONE', label: 'Done' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setStatus(opt.value)}
                                        className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                                            status === opt.value
                                                ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-200 hover:bg-pink-600'
                                                : 'bg-white text-gray-600 border-pink-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-pink-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 border border-pink-200 text-gray-600 rounded-xl hover:bg-pink-50 hover:text-pink-600 cursor-pointer transition-colors text-sm font-medium min-h-[42px]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white rounded-xl cursor-pointer transition-colors shadow-md shadow-pink-200 disabled:opacity-50 font-bold text-sm min-h-[42px] flex items-center justify-center gap-1.5"
                            >
                                <Copy className="w-4 h-4" />
                                <span>{loading ? 'Duplicating...' : 'Duplicate Task'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DuplicateTaskModal;
