import { useState, useRef, useEffect } from "react";
import { X, Calendar, Clock, ChevronDown, Trash2 } from 'lucide-react';
import { Alert } from './Notification';

const CustomSelect = ({ label, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    return (
        <div className="w-full relative" ref={dropdownRef}>
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-pink-500 flex items-center justify-between border bg-white rounded-lg px-3 py-2 text-left outline-none transition-all duration-150 cursor-pointer ${isOpen ? "ring-2 ring-pink-300 border-pink-300" : "border-gray-200 hover:border-pink-300"
                    }`}
            >
                <span className="text-pink-400 text-sm font-medium">{selectedOption?.label}</span>
                <ChevronDown className={`w-4 h-4 text-pink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-pink-100 rounded-xl shadow-lg shadow-pink-100/50 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors duration-150 ${isSelected
                                        ? "bg-pink-100 text-pink-600 font-semibold"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                                    }`}
                            >
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

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
            setError('Hạn chót không được trước ngày & giờ bắt đầu!');
        } else {
            setError('');
        }
        setFormData(prev => ({ ...prev, dueDate: newDueDate }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (formData.startDate && formData.dueDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
            setError('Hạn chót không được trước ngày & giờ bắt đầu!');
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
            console.error('Lỗi khi lưu task:', e);
            setError(e?.response?.data?.message || (task ? 'Không thể cập nhật công việc. Vui lòng thử lại.' : 'Không thể tạo công việc. Vui lòng thử lại.'));
        } finally {
            setLoading(false);
        }
    };

    const isEditMode = Boolean(task);

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-xl relative max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-pink-300 py-5 px-6 relative flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">
                        {isEditMode ? 'Task Details' : 'Create Task'}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-pink-100 transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 bg-pink-50/70 text-pink-400 overflow-y-auto">
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                            className="mb-4"
                        />
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium mb-2">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                placeholder="Nhập tên công việc..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-700"
                            />
                        </div>

                        {/* Ngày & Giờ Bắt Đầu + Hạn Chót */}
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="w-full">
                                <label htmlFor="startDate" className="block text-sm font-medium mb-2">Start Date & Time</label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={startDateInputRef}
                                        type="datetime-local"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleStartDateChange}
                                        className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 outline-none focus:ring-2 focus:ring-pink-300 [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer bg-white text-gray-700 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => startDateInputRef.current?.showPicker()}
                                        className="absolute right-3 text-pink-400 hover:text-pink-500 cursor-pointer"
                                        title="Chọn thời gian bắt đầu"
                                    >
                                        <Clock className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-full">
                                <label htmlFor="dueDate" className="block text-sm font-medium mb-2">Due Date & Time</label>
                                <div className="relative flex items-center">
                                    <input
                                        ref={dueDateInputRef}
                                        type="datetime-local"
                                        id="dueDate"
                                        name="dueDate"
                                        min={formData.startDate || undefined}
                                        value={formData.dueDate}
                                        onChange={handleDueDateChange}
                                        className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 outline-none focus:ring-2 focus:ring-pink-300 [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer bg-white text-gray-700 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => dueDateInputRef.current?.showPicker()}
                                        className="absolute right-3 text-pink-400 hover:text-pink-500 cursor-pointer"
                                        title="Chọn hạn chót"
                                    >
                                        <Calendar className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div className="mb-4">
                            <CustomSelect
                                label="Status"
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Mô tả chi tiết công việc..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 resize-none h-24 outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-700 text-sm"
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                {isEditMode && onDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(task.id)}
                                        className="px-3.5 py-2 text-red-500 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 text-sm font-medium"
                                        title="Xóa công việc này"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-4 py-2 border border-pink-200 text-pink-400 rounded-lg hover:bg-pink-100 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="px-5 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 cursor-pointer transition-colors shadow-sm disabled:opacity-50 font-medium"
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
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