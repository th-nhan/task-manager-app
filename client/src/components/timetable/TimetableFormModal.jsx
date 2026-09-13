import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, GraduationCap, BookOpen, Tag, Save, AlertCircle } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../data/timetableData';

const COMMON_TIME_PRESETS = [
    { label: '07:00 – 08:30 (Sáng)', start: '07:00', end: '08:30', shift: 'Sáng' },
    { label: '08:30 – 10:00 (Sáng)', start: '08:30', end: '10:00', shift: 'Sáng' },
    { label: '10:00 – 11:30 (Sáng)', start: '10:00', end: '11:30', shift: 'Sáng' },
    { label: '14:00 – 15:30 (Chiều)', start: '14:00', end: '15:30', shift: 'Chiều' },
    { label: '15:30 – 17:00 (Chiều)', start: '15:30', end: '17:00', shift: 'Chiều' },
    { label: '16:45 – 18:15 (Chiều)', start: '16:45', end: '18:15', shift: 'Chiều' },
    { label: '17:00 – 18:30 (Chiều)', start: '17:00', end: '18:30', shift: 'Chiều' },
    { label: '18:30 – 20:00 (Tối)', start: '18:30', end: '20:00', shift: 'Tối' },
    { label: '18:45 – 20:15 (Tối)', start: '18:45', end: '20:15', shift: 'Tối' },
    { label: '19:30 – 21:00 (Tối)', start: '19:30', end: '21:00', shift: 'Tối' },
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
            setError('Vui lòng nhập tên lớp học!');
            return;
        }

        if (!startTime || !endTime) {
            setError('Vui lòng chọn khung giờ học!');
            return;
        }

        // Calculate dayIndex
        const dayObj = DAYS_OF_WEEK.find(d => d.key === dayOfWeek);
        const dayIndex = dayObj ? dayObj.index : 1;

        // Auto calculate shift if not manually set
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-pink-100 animate-scale-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg">
                                {isEdit ? 'Chỉnh Sửa Ca Học' : 'Thêm Ca Học Mới'}
                            </h3>
                            <p className="text-xs text-pink-100">
                                {isEdit ? 'Cập nhật thông tin ca học vào Thời Khóa Biểu' : 'Điền thông tin để thêm ca dạy mới vào Thời Khóa Biểu'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                            Tên lớp học đầy đủ <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            placeholder="Ví dụ: 10 Cơ bản Long Thượng 1, 12 Nâng cao Mỹ Lộc..."
                            className="w-full text-sm px-4 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20"
                            required
                        />
                    </div>

                    {/* Original Code */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-pink-500" />
                            Ký hiệu / Mã viết tắt gốc
                        </label>
                        <input
                            type="text"
                            value={originalCode}
                            onChange={e => setOriginalCode(e.target.value)}
                            placeholder="Ví dụ: 10CB LT 1, 12NC ML, ML 12CB..."
                            className="w-full text-sm font-mono px-4 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20"
                        />
                    </div>

                    {/* Day & Grade Row */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Day of week */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                Thứ trong tuần
                            </label>
                            <select
                                value={dayOfWeek}
                                onChange={e => setDayOfWeek(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800"
                            >
                                {DAYS_OF_WEEK.map(d => (
                                    <option key={d.key} value={d.key}>
                                        {d.label} {d.isWeekend ? '(Cuối tuần)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Grade */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-pink-500" />
                                Khối lớp
                            </label>
                            <select
                                value={grade}
                                onChange={e => setGrade(Number(e.target.value))}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800"
                            >
                                <option value={10}>Khối 10</option>
                                <option value={11}>Khối 11</option>
                                <option value={12}>Khối 12</option>
                            </select>
                        </div>
                    </div>

                    {/* Time Selection & Presets */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100">
                        <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-pink-500" />
                                Khung giờ học (Bắt đầu - Kết thúc)
                            </span>
                            <span className="text-[11px] text-pink-600 font-normal">
                                Chuẩn 90 phút
                            </span>
                        </label>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5 pb-1">
                            {COMMON_TIME_PRESETS.map((preset, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    onClick={() => handleApplyPreset(preset)}
                                    className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer ${
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
                                <span className="text-[10px] text-gray-500 font-medium">Bắt đầu:</span>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-pink-200 bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 font-medium">Kết thúc:</span>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-pink-200 bg-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location & Level Row */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Location */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                                Cơ sở / Địa điểm
                            </label>
                            <select
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800"
                            >
                                <option value="Long Thượng">Long Thượng</option>
                                <option value="Mỹ Lộc">Mỹ Lộc</option>
                            </select>
                        </div>

                        {/* Level */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                                Trình độ
                            </label>
                            <select
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white cursor-pointer font-medium text-gray-800"
                            >
                                <option value="Cơ bản">Cơ bản</option>
                                <option value="Nâng cao">Nâng cao</option>
                                <option value="Nâng cao & Cơ bản">Nâng cao & Cơ bản</option>
                            </select>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-md shadow-pink-200 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? 'Lưu Thay Đổi' : 'Thêm Ca Học'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimetableFormModal;
