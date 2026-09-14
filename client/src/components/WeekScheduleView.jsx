import React, { useMemo } from 'react';
import { Plus, Clock, Circle, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';

export const WeekScheduleView = ({
    currentDate,
    selectedDate,
    onSelectDate,
    tasks = [],
    filterPriority = 'ALL',
    onFilterPriorityChange,
    priorityFilterOptions = [],
    loading = false,
    onOpenCreateModal,
    onOpenTaskDetail,
    onToggleStatus,
    onDeleteTask,
}) => {
    const weekDays = useMemo(() => {
        const curr = new Date(currentDate);
        const dayOfWeek = (curr.getDay() + 6) % 7;

        const monday = new Date(curr);
        monday.setDate(curr.getDate() - dayOfWeek);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate && new Date(selectedDate).toDateString() === date.toDateString();

            return {
                date,
                dayNumber: date.getDate(),
                dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                dayNameVi: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'][i],
                isToday,
                isSelected,
                isWeekend: i === 5 || i === 6,
            };
        });
    }, [currentDate, selectedDate]);

    const getTasksForDate = (colDate) => {
        const target = new Date(colDate);
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
                if (dueA !== dueB) return dueA - dueB;

                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Weekly Schedule</span>
                    <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        7 days
                    </span>
                </div>                <div className="w-44">
                    <CustomSelect
                        value={filterPriority}
                        onChange={onFilterPriorityChange}
                        options={priorityFilterOptions}
                    />
                </div>
            </div>

            {/* Thứ và Ngày trong tuần */}
            <div className="grid grid-cols-7 gap-2 min-w-[750px] pb-3 border-b border-gray-100">
                {weekDays.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectDate(item.date)}
                        className={`py-2.5 px-3 rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer ${item.isSelected
                                ? 'bg-pink-500 text-white shadow-sm border-pink-500 font-semibold'
                                : item.isToday
                                    ? 'bg-pink-50 text-pink-600 border-pink-200 font-semibold'
                                    : 'border-transparent text-gray-700 hover:bg-pink-50/60 font-medium'
                            }`}
                    >
                        <span
                            className={`text-xs font-semibold uppercase ${item.isSelected
                                    ? 'text-pink-100'
                                    : item.isWeekend
                                        ? 'text-pink-500'
                                        : 'text-gray-400'
                                }`}
                        >
                            {item.dayName}
                        </span>
                        <span className="text-base font-bold leading-none">
                            {item.dayNumber}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 min-w-[750px] mt-2 items-stretch">
                {weekDays.map((item, colIndex) => {
                    const dayTasks = getTasksForDate(item.date);

                    return (
                        <div
                            key={colIndex}
                            className={`flex flex-col gap-2.5 h-full min-h-[420px] rounded-xl p-1.5 border transition-colors ${item.isToday ? 'bg-pink-50/40 border-pink-200' : 'bg-gray-50/40 border-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-between px-1.5 py-1">
                                <span className="text-xs font-bold text-gray-600">{item.dayNameVi}</span>
                                <button
                                    onClick={() => onOpenCreateModal(item.date)}
                                    title={`Thêm task cho ${item.dayNameVi}`}
                                    className="p-1 hover:bg-pink-100 rounded text-pink-500 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {loading ? (
                                <span className="text-xs text-gray-300 text-center py-4">Loading...</span>
                            ) : dayTasks.length === 0 ? (
                                <span className="text-[11px] text-gray-300 text-center py-6">No tasks</span>
                            ) : (
                                dayTasks.map((task) => {
                                    const isDone = task.status === 'DONE';
                                    const isMissing = !isDone && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
                                    const isProgress = !isMissing && task.status === 'IN_PROGRESS';

                                    const leftBorderClass =
                                        task.priority === 'HIGH'
                                            ? 'border-l-red-500'
                                            : task.priority === 'MEDIUM'
                                                ? 'border-l-yellow-500'
                                                : 'border-l-emerald-500';

                                    const cardContainerClass = isMissing
                                        ? 'opacity-85 hover:opacity-100 bg-red-50/30 border-red-200/80 border-dashed hover:border-solid hover:shadow-md'
                                        : isDone
                                            ? 'opacity-70 bg-emerald-50/30 border-emerald-200/60 hover:shadow'
                                            : isProgress
                                                ? 'bg-blue-50/40 border-blue-200/60 hover:shadow'
                                                : 'bg-white hover:shadow-md';

                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => onOpenTaskDetail(task)}
                                            className={`p-3 rounded-xl border border-gray-100 border-l-[6px] ${leftBorderClass} ${cardContainerClass} transition-all cursor-pointer flex flex-col gap-2 group relative`}
                                        >
                                            <div className="flex items-start justify-between gap-1">
                                                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                                    <h4
                                                        className={`text-xs font-semibold leading-tight line-clamp-2 ${isDone ? 'line-through text-gray-400' : isMissing ? 'text-gray-700' : 'text-gray-800'
                                                            }`}
                                                        title={task.title}
                                                    >
                                                        {task.title}
                                                    </h4>
                                                    {isMissing && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-600 rounded-md border border-red-200 uppercase tracking-wider shrink-0 shadow-xs">
                                                            <AlertCircle className="w-2.5 h-2.5 text-red-500" />
                                                            MISSING
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteTask(task.id);
                                                    }}
                                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0 cursor-pointer"
                                                    title="Xóa task"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {task.description && (
                                                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                                    {task.description}
                                                </p>
                                            )}

                                            {(task.startDate || task.dueDate) && (
                                                <div
                                                    className={`flex items-center gap-1 text-[10px] font-medium mt-1.5 px-1.5 py-0.5 rounded w-fit ${isMissing
                                                            ? 'text-red-600 bg-red-50 border border-red-200/60'
                                                            : 'text-pink-500 bg-pink-50/80'
                                                        }`}
                                                >
                                                    <Clock className={`w-3 h-3 flex-shrink-0 ${isMissing ? 'text-red-500' : 'text-pink-400'}`} />
                                                    <span>
                                                        {task.startDate && (
                                                            new Date(task.startDate).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false,
                                                            })
                                                        )}
                                                        {task.startDate && task.dueDate && ' - '}
                                                        {task.dueDate && (
                                                            new Date(task.dueDate).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false,
                                                            })
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleStatus(task);
                                                    }}
                                                    className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${isMissing ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-pink-600'
                                                        }`}
                                                    title="Click to change status"
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    ) : isMissing ? (
                                                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                    ) : isProgress ? (
                                                        <Clock className="w-3.5 h-3.5 text-yellow-500" />
                                                    ) : (
                                                        <Circle className="w-3.5 h-3.5 text-pink-300" />
                                                    )}
                                                    <span className={`text-[10px] uppercase ${isMissing ? 'font-bold' : ''}`}>
                                                        {isDone ? 'Done' : isMissing ? 'Missing' : isProgress ? 'In Progress' : 'Todo'}
                                                    </span>
                                                </button>

                                                {task.dueDate ? (
                                                    <span
                                                        className={`text-[9px] ${isMissing ? 'text-red-500 font-semibold' : 'text-gray-400'}`}
                                                        title={`Deadline: ${new Date(task.dueDate).toLocaleString('vi-VN')}`}
                                                    >
                                                        {isMissing ? 'Quá hạn: ' : 'Deadline '}
                                                        {new Date(task.dueDate).getDate()}/{new Date(task.dueDate).getMonth() + 1}
                                                    </span>
                                                ) : task.startDate ? (
                                                    <span
                                                        className="text-[9px] text-gray-400"
                                                        title={`Start: ${new Date(task.startDate).toLocaleString('vi-VN')}`}
                                                    >
                                                        Start {new Date(task.startDate).getDate()}/{new Date(task.startDate).getMonth() + 1}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekScheduleView;
