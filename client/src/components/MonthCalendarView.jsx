import React, { useMemo, useState, useEffect } from 'react';
import {
    Plus,
    Clock,
    Circle,
    CheckCircle2,
    Trash2,
    AlertCircle,
    Zap,
    Heart,
    SportShoe,
    Flame,
    Star,
    Coffee,
    Smile,
    Trophy,
    Sparkles
} from 'lucide-react';
import CustomSelect from './CustomSelect';

const WEEK_DAYS_HEADER = [
    { vi: 'Thứ 2', en: 'Mon', isWeekend: false },
    { vi: 'Thứ 3', en: 'Tue', isWeekend: false },
    { vi: 'Thứ 4', en: 'Wed', isWeekend: false },
    { vi: 'Thứ 5', en: 'Thu', isWeekend: false },
    { vi: 'Thứ 6', en: 'Fri', isWeekend: false },
    { vi: 'Thứ 7', en: 'Sat', isWeekend: true },
    { vi: 'Chủ Nhật', en: 'Sun', isWeekend: true },
];

export const CALENDAR_STICKERS = [
    {
        id: 'zap',
        label: 'Energetic',
        icon: Zap,
        bg: 'bg-amber-100 text-amber-600 border-amber-300 hover:bg-amber-200',
    },
    {
        id: 'heart',
        label: 'Love day',
        icon: Heart,
        bg: 'bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-200',
    },
    {
        id: 'shoe',
        label: 'Sport',
        icon: SportShoe,
        bg: 'bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-200',
    },
    {
        id: 'flame',
        label: 'Explosive ',
        icon: Flame,
        bg: 'bg-orange-100 text-orange-600 border-orange-300 hover:bg-orange-200',
    },
    {
        id: 'star',
        label: 'Important',
        icon: Star,
        bg: 'bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200',
    },
    {
        id: 'coffee',
        label: 'Chill',
        icon: Coffee,
        bg: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
    },
    {
        id: 'smile',
        label: 'Nice day',
        icon: Smile,
        bg: 'bg-sky-100 text-sky-600 border-sky-300 hover:bg-sky-200',
    },
    {
        id: 'trophy',
        label: 'Achievement ',
        icon: Trophy,
        bg: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
    },
];

export const MonthCalendarView = ({
    currentDate,
    tasks = [],
    filterPriority = 'ALL',
    onFilterPriorityChange,
    priorityFilterOptions = [],
    loading = false,
    onOpenCreateModal,
    onOpenTaskDetail,
    onToggleStatus,
    onDeleteTask,
    onRescheduleTask,
}) => {
    const [draggingTaskId, setDraggingTaskId] = useState(null);
    const [draggingStickerId, setDraggingStickerId] = useState(null);
    const [dragOverDateStr, setDragOverDateStr] = useState(null);
    const [expandedDayKey, setExpandedDayKey] = useState(null);

    // Stored stickers by dateKey: { "2026-09-10": ["zap", "heart"] }
    const [dayStickers, setDayStickers] = useState(() => {
        try {
            const saved = localStorage.getItem('task_manager_month_stickers');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('task_manager_month_stickers', JSON.stringify(dayStickers));
        } catch (e) {
            console.error('Failed to save day stickers:', e);
        }
    }, [dayStickers]);

    const handleAddSticker = (dateKey, stickerId) => {
        setDayStickers(prev => {
            const current = prev[dateKey] || [];
            if (current.length >= 6) return prev; // max 6 stickers per day
            return {
                ...prev,
                [dateKey]: [...current, stickerId]
            };
        });
    };

    const handleRemoveSticker = (dateKey, indexToRemove) => {
        setDayStickers(prev => {
            const current = prev[dateKey] || [];
            const updated = current.filter((_, idx) => idx !== indexToRemove);
            if (updated.length === 0) {
                const copy = { ...prev };
                delete copy[dateKey];
                return copy;
            }
            return {
                ...prev,
                [dateKey]: updated
            };
        });
    };

    // Calculate all days in month grid (Monday start, 35 or 42 cells)
    const monthDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Monday is day 0 in our index
        const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
        const startDate = new Date(year, month, 1 - firstDayOfWeek);

        const totalDaysNeeded = firstDayOfWeek + lastDayOfMonth.getDate();
        const totalGridDays = totalDaysNeeded > 35 ? 42 : 35;

        const days = [];
        for (let i = 0; i < totalGridDays; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);

            const isCurrentMonth = d.getMonth() === month;
            const isToday = new Date().toDateString() === d.toDateString();
            const dayOfWeek = (d.getDay() + 6) % 7;
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

            days.push({
                date: d,
                dayNumber: d.getDate(),
                isCurrentMonth,
                isToday,
                isWeekend,
                dateKey: d.toISOString().split('T')[0],
            });
        }

        return days;
    }, [currentDate]);

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        return tasks
            .filter(task => {
                if (filterPriority !== 'ALL' && task.priority !== filterPriority) {
                    return false;
                }

                const start = new Date(task.startDate || task.createdAt);
                start.setHours(0, 0, 0, 0);

                const end = task.dueDate ? new Date(task.dueDate) : new Date(task.startDate || task.createdAt);
                end.setHours(23, 59, 59, 999);

                return target >= start && target <= end;
            })
            .sort((a, b) => {
                const timeA = new Date(a.startDate || a.createdAt).getTime();
                const timeB = new Date(b.startDate || b.createdAt).getTime();
                if (timeA !== timeB) return timeA - timeB;

                const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                return dueA - dueB;
            });
    };

    const handleDropOnDate = (e, targetDate, dateKey) => {
        e.preventDefault();
        setDragOverDateStr(null);
        setDraggingTaskId(null);
        setDraggingStickerId(null);

        // Check if dropping a sticker icon
        try {
            const jsonData = e.dataTransfer.getData('application/json');
            if (jsonData) {
                const parsed = JSON.parse(jsonData);
                if (parsed.type === 'STICKER' && parsed.stickerId) {
                    handleAddSticker(dateKey, parsed.stickerId);
                    return;
                }
            }
        } catch {
            // ignore JSON parse errors and continue
        }

        // Check if dragging a task
        const rawTaskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
        if (rawTaskId) {
            const task = tasks.find(t => t.id === rawTaskId);
            if (task && onRescheduleTask) {
                onRescheduleTask(task, targetDate);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            {/* Filter & Icon Stickers Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Month Schedule</span>
                    <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        {monthDays.filter(d => d.isCurrentMonth).length} days
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Draggable Icon Cards container */}
                    <div className="flex items-center gap-1.5 bg-pink-50/80 border border-pink-200/80 text-pink-700 font-bold px-2.5 py-1 rounded-full shadow-2xs">
                        <span className="text-[11px] text-pink-600 font-medium mr-1 select-none flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                            <span className="hidden sm:inline">Drag icon:</span>
                        </span>

                        {CALENDAR_STICKERS.map((stk) => {
                            const IconComp = stk.icon;
                            const isBeingDragged = draggingStickerId === stk.id;

                            return (
                                <div
                                    key={stk.id}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'STICKER', stickerId: stk.id }));
                                        e.dataTransfer.effectAllowed = 'copy';
                                        setDraggingStickerId(stk.id);
                                    }}
                                    onDragEnd={() => {
                                        setDraggingStickerId(null);
                                        setDragOverDateStr(null);
                                    }}
                                    title={`Drag icon "${stk.label}" to any day in the calendar`}
                                    className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all cursor-grab active:cursor-grabbing hover:scale-125 hover:shadow-xs select-none ${
                                        stk.bg
                                    } ${isBeingDragged ? 'scale-110 ring-2 ring-pink-400 opacity-60' : ''}`}
                                >
                                    <IconComp className="w-3.5 h-3.5 pointer-events-none shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="w-44">
                        <CustomSelect
                            value={filterPriority}
                            onChange={onFilterPriorityChange}
                            options={priorityFilterOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Header Columns (Mon -> Sun) */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {WEEK_DAYS_HEADER.map((col, index) => (
                            <div
                                key={index}
                                className={`py-2 px-3 text-center rounded-xl border ${col.isWeekend
                                        ? 'bg-pink-50/60 border-pink-200/70 text-pink-600'
                                        : 'bg-slate-50 border-slate-200/60 text-slate-700'
                                    }`}
                            >
                                <div className="text-xs font-bold uppercase tracking-wider">{col.en}</div>
                            </div>
                        ))}
                    </div>

                    {/* Month Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {monthDays.map((item) => {
                            const dayTasks = getTasksForDate(item.date);
                            const isDragOver = dragOverDateStr === item.dateKey;
                            const isExpanded = expandedDayKey === item.dateKey;
                            const maxVisibleTasks = 3;
                            const visibleTasks = isExpanded ? dayTasks : dayTasks.slice(0, maxVisibleTasks);
                            const hiddenCount = dayTasks.length - maxVisibleTasks;
                            const stickers = dayStickers[item.dateKey] || [];

                            return (
                                <div
                                    key={item.dateKey}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        if (dragOverDateStr !== item.dateKey) {
                                            setDragOverDateStr(item.dateKey);
                                        }
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = draggingStickerId ? 'copy' : 'move';
                                        if (dragOverDateStr !== item.dateKey) {
                                            setDragOverDateStr(item.dateKey);
                                        }
                                    }}
                                    onDragLeave={(e) => {
                                        if (e.currentTarget.contains(e.relatedTarget)) return;
                                        setDragOverDateStr(null);
                                    }}
                                    onDrop={(e) => {
                                        handleDropOnDate(e, item.date, item.dateKey);
                                    }}
                                    className={`min-h-[145px] rounded-xl p-2 border transition-all flex flex-col justify-between group relative ${item.isToday
                                            ? 'bg-pink-50/30 border-pink-400 ring-2 ring-pink-300/50 shadow-xs'
                                            : item.isCurrentMonth
                                                ? 'bg-white border-gray-200/80 hover:border-pink-300 hover:shadow-sm'
                                                : 'bg-gray-50/60 border-gray-100 text-gray-400 opacity-60'
                                        } ${isDragOver ? 'bg-pink-100/80 border-pink-500 ring-4 ring-pink-300 shadow-md scale-[1.02] z-10' : ''}`}
                                >
                                    <div>
                                        {/* Day Header with Date number, count and Stickers right next to it */}
                                        <div className="flex items-center justify-between gap-1 mb-1.5 min-h-[26px]">
                                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                                <span
                                                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors shrink-0 ${item.isToday
                                                            ? 'bg-pink-500 text-white shadow-xs'
                                                            : item.isCurrentMonth
                                                                ? item.isWeekend ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:bg-gray-100'
                                                                : 'text-gray-400'
                                                        }`}
                                                >
                                                    {item.dayNumber}
                                                </span>
                                                {dayTasks.length > 0 && (
                                                    <span
                                                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${item.isToday
                                                                ? 'bg-pink-200/70 text-pink-800'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        {dayTasks.length}
                                                    </span>
                                                )}

                                                {/* Day Stickers / Activity Icons placed right next to the date */}
                                                {stickers.map((stkId, sIdx) => {
                                                    const stkDef = CALENDAR_STICKERS.find(s => s.id === stkId) || {
                                                        id: stkId,
                                                        label: stkId,
                                                        icon: Zap,
                                                        bg: 'bg-pink-100 text-pink-600 border-pink-200',
                                                    };
                                                    const StkIcon = stkDef.icon;

                                                    return (
                                                        <div
                                                            key={`${item.dateKey}-${stkId}-${sIdx}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveSticker(item.dateKey, sIdx);
                                                            }}
                                                            title={`${stkDef.label} (Click to remove)`}
                                                            className={`group/stk relative flex items-center justify-center w-5 h-5 rounded-full border text-[10px] cursor-pointer hover:scale-115 hover:opacity-85 transition-all shrink-0 ${stkDef.bg}`}
                                                        >
                                                            <StkIcon className="w-2.5 h-2.5 pointer-events-none" />
                                                            <span className="hidden group-hover/stk:flex absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-2.5 h-2.5 items-center justify-center text-[8px] font-bold shadow-xs">
                                                                ×
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Quick Add Button */}
                                            <button
                                                onClick={() => onOpenCreateModal(item.date)}
                                                title={`Thêm công việc cho ngày ${item.dayNumber}/${item.date.getMonth() + 1}`}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-pink-500 hover:bg-pink-100 rounded-md cursor-pointer shrink-0"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Drop Hint when Dragging Over */}
                                        {isDragOver && (
                                            <div className="mb-1 text-[10px] font-medium text-pink-700 bg-pink-200/80 border border-dashed border-pink-400 rounded-md py-1 text-center animate-pulse">
                                                {draggingStickerId ? '✨ Thả icon vào ngày này' : '📍 Đổi ngày công việc'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Task Chips Container */}
                                    <div className="flex flex-col gap-1.5 flex-1 min-h-[70px]">
                                        {loading ? (
                                            <div className="text-[10px] text-gray-300 text-center py-3">...</div>
                                        ) : visibleTasks.map((task) => {
                                            const isDone = task.status === 'DONE';
                                            const isMissing = !isDone && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
                                            const isProgress = !isMissing && task.status === 'IN_PROGRESS';
                                            const isDragging = draggingTaskId === task.id;

                                            const priorityBorder = task.priority === 'HIGH'
                                                ? 'border-l-red-500'
                                                : task.priority === 'MEDIUM'
                                                    ? 'border-l-amber-500'
                                                    : 'border-l-emerald-500';

                                            const chipBg = isMissing
                                                ? 'bg-red-50/90 text-red-900 border-red-200/80'
                                                : isDone
                                                    ? 'bg-emerald-50/60 text-gray-500 border-emerald-200/50 line-through opacity-75'
                                                    : isProgress
                                                        ? 'bg-blue-50/80 text-blue-950 border-blue-200/60'
                                                        : 'bg-gray-50/90 text-gray-800 border-gray-200/70 hover:bg-pink-50/50';

                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('text/plain', task.id);
                                                        e.dataTransfer.effectAllowed = 'move';
                                                        setDraggingTaskId(task.id);
                                                    }}
                                                    onDragEnd={() => {
                                                        setDraggingTaskId(null);
                                                        setDragOverDateStr(null);
                                                    }}
                                                    onClick={() => onOpenTaskDetail(task)}
                                                    className={`px-2 py-1.5 rounded-lg border border-l-[3.5px] ${priorityBorder} ${chipBg} transition-all cursor-pointer shadow-2xs group/chip relative text-left select-none ${isDragging ? 'opacity-30 scale-95 border-dashed border-pink-400' : 'hover:shadow-xs hover:scale-[1.01]'
                                                        }`}
                                                    title={`${task.title}${task.dueDate ? ` (Deadline: ${new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : ''}`}
                                                >
                                                    <div className="flex items-center justify-between gap-1">
                                                        <div className="flex items-center gap-1 min-w-0 flex-1">
                                                            <span className="text-[11px] font-semibold truncate leading-tight">
                                                                {task.title}
                                                            </span>
                                                        </div>

                                                        {/* Status toggle icon */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleStatus(task);
                                                            }}
                                                            title="Đổi trạng thái"
                                                            className="text-gray-400 hover:text-pink-600 transition-colors shrink-0 p-0.5 cursor-pointer"
                                                        >
                                                            {isDone ? (
                                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            ) : isMissing ? (
                                                                <AlertCircle className="w-3 h-3 text-red-500" />
                                                            ) : isProgress ? (
                                                                <Clock className="w-3 h-3 text-amber-500" />
                                                            ) : (
                                                                <Circle className="w-3 h-3 text-gray-400 group-hover/chip:text-pink-400" />
                                                            )}
                                                        </button>

                                                        {/* Quick delete button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteTask(task.id);
                                                            }}
                                                            title="Xóa công việc"
                                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover/chip:opacity-100 transition-opacity p-0.5 shrink-0 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Time snippet if any */}
                                                    {(task.startDate || task.dueDate) && (
                                                        <div className="flex items-center gap-1 text-[9px] text-gray-500 mt-0.5">
                                                            <Clock className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                                            <span className="truncate">
                                                                {task.startDate && new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                                {task.startDate && task.dueDate && ' - '}
                                                                {task.dueDate && new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* "+X more" expand / collapse button */}
                                        {hiddenCount > 0 && !isExpanded && (
                                            <button
                                                onClick={() => setExpandedDayKey(item.dateKey)}
                                                className="text-[10px] text-pink-600 font-semibold bg-pink-50 hover:bg-pink-100 rounded-md py-0.5 px-1.5 text-center transition-colors cursor-pointer"
                                            >
                                                +{hiddenCount} việc khác
                                            </button>
                                        )}

                                        {isExpanded && hiddenCount > 0 && (
                                            <button
                                                onClick={() => setExpandedDayKey(null)}
                                                className="text-[10px] text-gray-500 font-semibold bg-gray-100 hover:bg-gray-200 rounded-md py-0.5 px-1.5 text-center transition-colors cursor-pointer mt-1"
                                            >
                                                Thu gọn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthCalendarView;

