import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, GraduationCap, BookOpen, PlusCircle, Check, FileText, Edit, Trash2 } from 'lucide-react';
import { GRADE_CONFIG, LOCATION_CONFIG, LEVEL_CONFIG } from '../../data/timetableData';

export const ClassDetailModal = ({
    isOpen,
    onClose,
    classItem,
    onConvertToTask,
    onEdit,
    onDelete
}) => {
    const [note, setNote] = useState('');
    const [savedNotice, setSavedNotice] = useState(false);

    useEffect(() => {
        if (classItem) {
            const saved = localStorage.getItem(`tt_note_${classItem.id}`);
            setNote(saved || '');
        }
    }, [classItem]);

    if (!isOpen || !classItem) return null;

    const gradeStyle = GRADE_CONFIG[classItem.grade] || GRADE_CONFIG[10];

    const handleSaveNote = () => {
        localStorage.setItem(`tt_note_${classItem.id}`, note);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2000);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete class session "${classItem.className}" (${classItem.dayOfWeek})?`)) {
            onDelete(classItem.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-pink-100 animate-scale-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Banner with Grade Accent */}
                <div className={`p-6 bg-gradient-to-r ${gradeStyle.cardBg} border-b border-gray-100 flex items-start justify-between relative`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${gradeStyle.pillColor} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
                            K{classItem.grade}
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {classItem.dayOfWeek} • {classItem.shift}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                                {classItem.className}
                            </h3>
                            <span className="inline-block mt-1 font-mono text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                                Original Code: {classItem.originalCode}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {onEdit && (
                            <button
                                onClick={() => {
                                    onEdit(classItem);
                                    onClose();
                                }}
                                title="Edit class slot"
                                className="text-gray-400 hover:text-pink-600 p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                title="Delete class slot"
                                className="text-gray-400 hover:text-rose-600 p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Key Specs Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-400 font-medium">Time Slot</div>
                                <div className="text-sm font-bold text-gray-800">{classItem.timeRange}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-400 font-medium">Branch / Location</div>
                                <div className="text-sm font-bold text-gray-800">{classItem.location}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-400 font-medium">Academic Level</div>
                                <div className="text-sm font-bold text-gray-800">{classItem.level}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-400 font-medium">Grade Level</div>
                                <div className="text-sm font-bold text-gray-800">Grade {classItem.grade} ({classItem.group || 'Main'})</div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Notes / Classroom Note */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-pink-500" />
                                Session Notes / Classroom
                            </label>
                            {savedNotice && (
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> Saved
                                </span>
                            )}
                        </div>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="E.g., Room A102, chapter 3 exercises, prepare quiz paper..."
                            className="w-full text-sm p-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent min-h-[80px] bg-pink-50/30 resize-none"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveNote}
                                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            >
                                Save Personal Note
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                onClick={() => {
                                    onEdit(classItem);
                                    onClose();
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
                            >
                                <Edit className="w-3.5 h-3.5 text-pink-500" />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        )}
                    </div>
                    {onConvertToTask && (
                        <button
                            onClick={() => {
                                onConvertToTask(classItem);
                                onClose();
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-md shadow-pink-200 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Task from this Slot
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
