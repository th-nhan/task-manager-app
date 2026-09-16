import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, GraduationCap, BookOpen, Tag, Save, AlertCircle } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../data/timetableData';

const COMMON_TIME_PRESETS = [
    { label: '07:00 – 08:30 (Morning)', start: '07:00', end: '08:30', shift: 'Sáng' },
    { label: '08:30 – 10:00 (Morning)', start: '08:30', end: '10:00', shift: 'Sáng' },
    { label: '10:00 – 11:30 (Morning)', start: '10:00', end: '11:30', shift: 'Sáng' },
    { label: '14:00 – 15:30 (Afternoon)', start: '14:00', end: '15:30', shift: 'Chiều' },
    { label: '15:30 – 17:00 (Afternoon)', start: '15:30', end: '17:00', shift: 'Chiều' },
    { label: '16:45 – 18:15 (Afternoon)', start: '16:45', end: '18:15', shift: 'Chiều' },
    { label: '17:00 – 18:30 (Afternoon)', start: '17:00', end: '18:30', shift: 'Chiều' },
    { label: '18:30 – 20:00 (Evening)', start: '18:30', end: '20:00', shift: 'Tối' },
    { label: '18:45 – 20:15 (Evening)', start: '18:45', end: '20:15', shift: 'Tối' },
    { label: '19:30 – 21:00 (Evening)', start: '19:30', end: '21:00', shift: 'Tối' },
];

export const TimetableFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingClass = null
}) => {
    const isEdit = Boolean(editingClass);

    const [className, setClassName] = useState('');
    const [originalCode, setOriginalCode] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('Thứ 2');
    const [startTime, setStartTime] = useState('17:00');
    const [endTime, setEndTime] = useState('18:30');
    const [grade, setGrade] = useState(10);
    const [location, setLocation] = useState('Long Thượng');
    const [level, setLevel] = useState('Cơ bản');
    const [shift, setShift] = useState('Chiều');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingClass) {
            setClassName(editingClass.className || '');
            setOriginalCode(editingClass.originalCode || '');
            setDayOfWeek(editingClass.dayOfWeek || 'Thứ 2');
            setStartTime(editingClass.startTime || '17:00');
            setEndTime(editingClass.endTime || '18:30');
            setGrade(editingClass.grade || 10);
            setLocation(editingClass.location || 'Long Thượng');
            setLevel(editingClass.level || 'Cơ bản');
            setShift(editingClass.shift || 'Chiều');
        } else {
            // Reset form for create
            setClassName('');
            setOriginalCode('');
            setDayOfWeek('Thứ 2');
            setStartTime('17:00');
            setEndTime('18:30');
            setGrade(10);
            setLocation('Long Thượng');
            setLevel('Cơ bản');
            setShift('Chiều');
        }
        setError('');
    }, [editingClass, isOpen]);

    if (!isOpen) return null;

    const handleApplyPreset = (preset) => {
        setStartTime(preset.start);
        setEndTime(preset.end);
        setShift(preset.shift);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!className.trim()) {
            setError('Please enter the class name!');
            return;
        }

        if (!startTime || !endTime) {
            setError('Please select time slot!');
            return;
        }

        const dayObj = DAYS_OF_WEEK.find(d => d.key === dayOfWeek);
        const dayIndex = dayObj ? dayObj.index : 1;

        let calculatedShift = shift;
        const startHour = parseInt(startTime.split(':')[0], 10);
        if (startHour < 12) calculatedShift = 'Sáng';
        else if (startHour >= 18) calculatedShift = 'Tối';
        else calculatedShift = 'Chiều';

        const timeRange = `${startTime.replace(':', 'h')} – ${endTime.replace(':', 'h')}`;

        const payload = {
            id: editingClass ? editingClass.id : Date.now(),
            className: className.trim(),
            originalCode: originalCode.trim() || className.trim(),
            dayOfWeek,
            dayIndex,
            startTime,
            endTime,
            timeRange,
            grade: Number(grade),
            location,
            level,
            shift: calculatedShift,
            group: originalCode.trim() || ''
        };

        onSubmit(payload);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-lg max-h-[90dvh] overflow-hidden border border-pink-100 flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-base sm:text-lg">
                                {isEdit ? 'Edit Class Slot' : 'Add New Class Slot'}
                            </h3>
                            <p className="text-xs text-pink-100">
                                {isEdit ? 'Update class slot in Timetable' : 'Add a new teaching session'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/20 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Class Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                            Full Class Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            placeholder="E.g., Grade 10 Basic Long Thuong 1..."
                            className="w-full text-sm px-3.5 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20"
                            required
                        />
                    </div>

                    {/* Original Code */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-pink-500" />
                            Original Code / Abbreviation
                        </label>
                        <input
                            type="text"
                            value={originalCode}
                            onChange={e => setOriginalCode(e.target.value)}
                            placeholder="E.g., 10CB LT 1, 12NC ML..."
                            className="w-full text-sm font-mono px-3.5 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20"
                        />
                    </div>

                    {/* Day & Grade Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Day of week */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                Day of Week
                            </label>
                            <select
                                value={dayOfWeek}
                                onChange={e => setDayOfWeek(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800 min-h-[42px]"
                            >
                                {DAYS_OF_WEEK.map(d => (
                                    <option key={d.key} value={d.key}>
                                        {d.labelEn || d.label} {d.isWeekend ? '(Weekend)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Grade */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-pink-500" />
                                Grade Level
                            </label>
                            <select
                                value={grade}
                                onChange={e => setGrade(Number(e.target.value))}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800 min-h-[42px]"
                            >
                                <option value={10}>Grade 10</option>
                                <option value={11}>Grade 11</option>
                                <option value={12}>Grade 12</option>
                            </select>
                        </div>
                    </div>

                    {/* Time Selection & Presets */}
                    <div className="space-y-2 p-3 sm:p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100">
                        <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-pink-500" />
                                Time Slot (Start - End)
                            </span>
                            <span className="text-[11px] text-pink-600 font-normal">
                                90 mins
                            </span>
                        </label>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5 pb-1">
                            {COMMON_TIME_PRESETS.map((preset, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    onClick={() => handleApplyPreset(preset)}
                                    className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer min-h-[28px] ${
                                        startTime === preset.start && endTime === preset.end
                                            ? 'bg-pink-500 text-white shadow-xs'
                                            : 'bg-white hover:bg-pink-100 text-gray-700 border border-pink-200'
                                    }`}
                                >
                                    {preset.start} - {preset.end}
                                </button>
                            ))}
                        </div>

                        {/* Custom Time inputs */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <span className="text-[10px] text-gray-500 font-medium">Start:</span>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-pink-200 bg-white min-h-[38px]"
                                    required
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 font-medium">End:</span>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-pink-200 bg-white min-h-[38px]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location & Level Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Location */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                                Branch / Location
                            </label>
                            <select
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800 min-h-[42px]"
                            >
                                <option value="Long Thượng">Long Thượng</option>
                                <option value="Mỹ Lộc">Mỹ Lộc</option>
                            </select>
                        </div>

                        {/* Level */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                                Academic Level
                            </label>
                            <select
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800 min-h-[42px]"
                            >
                                <option value="Cơ bản">Basic</option>
                                <option value="Nâng cao">Advanced</option>
                                <option value="Nâng cao & Cơ bản">Advanced & Basic</option>
                            </select>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer min-h-[40px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-md shadow-pink-200 hover:shadow-lg transition-all cursor-pointer min-h-[40px]"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? 'Save Changes' : 'Add Class Slot'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimetableFormModal;
