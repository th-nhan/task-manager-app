import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, BookOpen, MapPin, FileText } from 'lucide-react';

export const SessionFormModal = ({ isOpen, onClose, onSave, sessionData, initialDate }) => {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '17:00',
        endTime: '18:30',
        className: '',
        grade: 10,
        location: 'Long Thượng',
        shift: 'Afternoon',
        rate: 60000,
        status: 'MAKE_UP',
        note: ''
    });

    useEffect(() => {
        if (sessionData) {
            setFormData({
                date: sessionData.date ? new Date(sessionData.date).toISOString().slice(0, 10) : '',
                startTime: sessionData.startTime || '17:00',
                endTime: sessionData.endTime || '18:30',
                className: sessionData.className || '',
                grade: sessionData.grade || 10,
                location: sessionData.location || 'Long Thượng',
                shift: sessionData.shift || 'Afternoon',
                rate: sessionData.rate || 60000,
                status: sessionData.status || 'MAKE_UP',
                note: sessionData.note || ''
            });
        } else {
            const todayStr = initialDate || new Date().toISOString().slice(0, 10);
            setFormData({
                date: todayStr,
                startTime: '17:00',
                endTime: '18:30',
                className: '',
                grade: 10,
                location: 'Long Thượng',
                shift: 'Afternoon',
                rate: 60000,
                status: 'MAKE_UP',
                note: ''
            });
        }
    }, [sessionData, initialDate, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.className || !formData.startTime || !formData.endTime) {
            alert('Please fill in all required fields');
            return;
        }

        const timeRange = `${formData.startTime} – ${formData.endTime}`;
        onSave({
            ...formData,
            timeRange,
            rate: parseInt(formData.rate) || 60000,
            grade: parseInt(formData.grade) || 10
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-pink-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-pink-100" />
                        <h3 className="text-base sm:text-lg font-bold">
                            {sessionData ? 'Edit Teaching Session' : 'Add Extra / Make-up Slot'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-pink-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Date <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                                />
                                <Calendar className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Status <span className="text-pink-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white font-medium text-gray-700"
                            >
                                <option value="COMPLETED">Taught</option>
                                <option value="MAKE_UP">Make-up</option>
                                <option value="PENDING">Scheduled</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Start Time <span className="text-pink-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                End Time <span className="text-pink-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                            Class Name <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="E.g., 10 Basic Long Thượng 1, 12 Exam Prep..."
                                value={formData.className}
                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                            />
                            <BookOpen className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Grade</label>
                            <select
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white font-medium text-gray-700"
                            >
                                <option value={10}>Grade 10</option>
                                <option value={11}>Grade 11</option>
                                <option value={12}>Grade 12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white font-medium text-gray-700"
                            >
                                <option value="Long Thượng">Long Thượng</option>
                                <option value="Mỹ Lộc">Mỹ Lộc</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Rate (VND)</label>
                            <input
                                type="number"
                                step="5000"
                                value={formData.rate}
                                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none font-bold text-pink-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Remarks / Notes</label>
                        <div className="relative">
                            <textarea
                                rows={2}
                                placeholder="E.g., Make-up session for last Tuesday, student requested..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                            />
                            <FileText className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-pink-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                            {sessionData ? 'Save Changes' : 'Create Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SessionFormModal;
