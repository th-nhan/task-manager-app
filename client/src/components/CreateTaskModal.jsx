import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, Trash2 } from 'lucide-react';
import { Alert } from './Notification';
import CustomSelect from './CustomSelect';

const categoryOptions = [
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Learning', label: 'Learning' },
];

const priorityOptions = [
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
];

const statusOptions = [
    { value: 'TODO', label: 'TODO' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
];

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

const CreateTaskModal = ({ isOpen, onClose, onSubmit, defaultDate, task = null, onDelete = null }) => {
    const startDateInputRef = useRef(null);
    const dueDateInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        priority: 'MEDIUM',
        category: 'Work',
        status: 'TODO',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setError('');
            if (task) {
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    startDate: toLocalISOString(task.startDate),
                    dueDate: toLocalISOString(task.dueDate),
                    priority: task.priority || 'MEDIUM',
                    category: task.category?.name || task.category || 'Work',
                    status: task.status || 'TODO',
                });
            } else {
                const start = defaultDate ? new Date(defaultDate) : new Date();
                const isToday = new Date().toDateString() === start.toDateString();
                if (!isToday) {
                    start.setHours(8, 0, 0, 0);
                }
                setFormData({
                    title: '',
                    description: '',
                    startDate: toLocalISOString(start),
                    dueDate: '',
                    priority: 'MEDIUM',
                    category: 'Work',
                    status: 'TODO',
                });
            }
        }
    }, [isOpen, task, defaultDate]);

    if (!isOpen) return null;

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setFormData(prev => {
            const updated = { ...prev, startDate: newStartDate };
            if (updated.dueDate && newStartDate && new Date(updated.dueDate) < new Date(newStartDate)) {
                updated.dueDate = '';
            }
            return updated;
        });
        setError('');
    };

    const handleDueDateChange = (e) => {
        const newDueDate = e.target.value;
        if (formData.startDate && newDueDate && new Date(newDueDate) < new Date(formData.startDate)) {
            setError('Due date cannot be earlier than start date & time!');
        } else {
            setError('');
        }
        setFormData(prev => ({ ...prev, dueDate: newDueDate }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (formData.startDate && formData.dueDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
            setError('Due date cannot be earlier than start date & time!');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await onSubmit({
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            });
            onClose();
        } catch (e) {
            console.error('Error saving task:', e);
            setError(e?.response?.data?.message || (task ? 'Failed to update task. Please try again.' : 'Failed to create task. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const isEditMode = Boolean(task);

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-[95vw] sm:max-w-xl relative max-h-[90dvh] sm:max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white border border-pink-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-pink-400 to-rose-400 py-4 sm:py-5 px-4 sm:px-6 relative flex items-center justify-between text-white shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {isEditMode ? 'Task Details' : 'Create Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 bg-pink-50/40 text-pink-500 overflow-y-auto flex-1">
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                            className="mb-4"
                        />
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                placeholder="Enter task title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 text-sm"
                            />
                        </div>

                        {/* Start Date & Time + Due Date (1 col on mobile, 2 cols on tablet/desktop) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="w-full">
                                <label htmlFor="startDate" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                    Start Date & Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={startDateInputRef}
                                        type="datetime-local"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleStartDateChange}
                                        className="w-full border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => startDateInputRef.current?.showPicker?.()}
                                        className="absolute right-3 text-pink-400 hover:text-pink-600 cursor-pointer p-1"
                                        title="Select start date & time"
                                        aria-label="Select start date & time"
                                    >
                                        <Clock className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-full">
                                <label htmlFor="dueDate" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                    Due Date & Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={dueDateInputRef}
                                        type="datetime-local"
                                        id="dueDate"
                                        name="dueDate"
                                        min={formData.startDate || undefined}
                                        value={formData.dueDate}
                                        onChange={handleDueDateChange}
                                        className="w-full border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => dueDateInputRef.current?.showPicker?.()}
                                        className="absolute right-3 text-pink-400 hover:text-pink-600 cursor-pointer p-1"
                                        title="Select due date & time"
                                        aria-label="Select due date & time"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category & Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <CustomSelect
                                label="Category"
                                value={formData.category}
                                onChange={(val) => setFormData({ ...formData, category: val })}
                                options={categoryOptions}
                            />
                            <CustomSelect
                                label="Priority"
                                value={formData.priority}
                                onChange={(val) => setFormData({ ...formData, priority: val })}
                                options={priorityOptions}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <CustomSelect
                                label="Status"
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter task description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 resize-none h-24 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 text-sm"
                            ></textarea>
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-200/60">
                            <div>
                                {isEditMode && onDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(task.id)}
                                        className="w-full sm:w-auto px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-sm font-semibold min-h-[42px]"
                                        title="Delete this task"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Task</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="flex-1 sm:flex-none px-4 py-2.5 border border-pink-200 text-gray-600 rounded-xl hover:bg-pink-100/60 cursor-pointer transition-colors text-sm font-medium min-h-[42px]"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="flex-1 sm:flex-none px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 cursor-pointer transition-colors shadow-md shadow-pink-200 disabled:opacity-50 font-bold text-sm min-h-[42px]"
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
export { CustomSelect, CreateTaskModal };