import React, { useState, useMemo, useCallback } from 'react';
import {
    Circle,
    Clock,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Plus,
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export const KanbanBoardView = ({
    tasks = [],
    filterPriority = 'ALL',
    onFilterPriorityChange,
    priorityFilterOptions = [],
    loading = false,
    onOpenTaskDetail,
    onToggleStatus,
    onDeleteTask,
    onDropTask,
}) => {
    const [draggingTaskId, setDraggingTaskId] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [mobileActiveColumn, setMobileActiveColumn] = useState('ALL'); // 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'MISSING'

    const kanbanColumns = useMemo(() => [
        {
            key: 'TODO',
            title: 'To Do',
            icon: Circle,
            iconColor: 'text-slate-500',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
            headerBg: 'bg-slate-50 border-slate-200/80 text-slate-700',
            columnBg: 'bg-slate-50/40 border-slate-200/70',
            activeDropBg: 'bg-slate-100/90 border-slate-400 ring-4 ring-slate-300/60 shadow-lg scale-[1.01]',
            dropIndicatorBorder: 'border-slate-400 bg-slate-100/80 text-slate-700',
        },
        {
            key: 'IN_PROGRESS',
            title: 'In Progress',
            icon: Clock,
            iconColor: 'text-amber-500',
            badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
            headerBg: 'bg-amber-50 border-amber-200/80 text-amber-800',
            columnBg: 'bg-amber-50/30 border-amber-200/60',
            activeDropBg: 'bg-amber-100/90 border-amber-400 ring-4 ring-amber-300/60 shadow-lg scale-[1.01]',
            dropIndicatorBorder: 'border-amber-400 bg-amber-100/80 text-amber-700',
        },
        {
            key: 'DONE',
            title: 'Done',
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
            badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            headerBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-800',
            columnBg: 'bg-emerald-50/30 border-emerald-200/60',
            activeDropBg: 'bg-emerald-100/90 border-emerald-400 ring-4 ring-emerald-300/60 shadow-lg scale-[1.01]',
            dropIndicatorBorder: 'border-emerald-400 bg-emerald-100/80 text-emerald-700',
        },
        {
            key: 'MISSING',
            title: 'Missing',
            icon: AlertCircle,
            iconColor: 'text-rose-500',
            badgeBg: 'bg-rose-100 text-rose-700 border-rose-200',
            headerBg: 'bg-rose-50 border-rose-200/80 text-rose-800',
            columnBg: 'bg-rose-50/30 border-rose-200/60',
            activeDropBg: 'bg-rose-100/90 border-rose-400 ring-4 ring-rose-300/60 shadow-lg scale-[1.01]',
            dropIndicatorBorder: 'border-rose-400 bg-rose-100/80 text-rose-700',
        },
    ], []);

    const getColumnTasks = useCallback((columnKey) => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return tasks
            .filter(task => {
                if (filterPriority !== 'ALL' && task.priority !== filterPriority) {
                    return false;
                }

                const isDone = task.status === 'DONE';
                const isMissing = !isDone && Boolean(task.dueDate && new Date(task.dueDate) < new Date());

                if (columnKey === 'MISSING') {
                    return isMissing;
                }
                if (columnKey === 'DONE') {
                    if (!isDone) return false;
                    const doneDate = new Date(task.updatedAt || task.dueDate || task.createdAt);
                    return doneDate >= oneWeekAgo;
                }
                if (columnKey === 'IN_PROGRESS') {
                    return !isMissing && task.status === 'IN_PROGRESS';
                }
                if (columnKey === 'TODO') {
                    return !isMissing && task.status === 'TODO';
                }
                return false;
            })
            .sort((a, b) => {
                const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                if (dueA !== dueB) return dueA - dueB;

                const timeA = new Date(a.startDate || a.createdAt).getTime();
                const timeB = new Date(b.startDate || b.createdAt).getTime();
                return timeA - timeB;
            });
    }, [tasks, filterPriority]);

    const handleInternalDrop = (targetColumnKey) => {
        if (!draggingTaskId) return;
        const currentTaskId = draggingTaskId;
        setDragOverColumn(null);
        setDraggingTaskId(null);

        if (onDropTask) {
            onDropTask(currentTaskId, targetColumnKey);
        }
    };

    const visibleColumns = mobileActiveColumn === 'ALL'
        ? kanbanColumns
        : kanbanColumns.filter(c => c.key === mobileActiveColumn);

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm min-h-[500px] border border-pink-100/60 min-w-0">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <span className="text-sm font-bold text-gray-800">Kanban Board</span>

                <div className="w-full sm:w-44">
                    <CustomSelect
                        value={filterPriority}
                        onChange={onFilterPriorityChange}
                        options={priorityFilterOptions}
                    />
                </div>
            </div>

            {/* Mobile Column Tabs */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-gray-100">
                <button
                    onClick={() => setMobileActiveColumn('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
                        mobileActiveColumn === 'ALL'
                            ? 'bg-pink-500 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    All ({tasks.length})
                </button>
                {kanbanColumns.map(col => {
                    const count = getColumnTasks(col.key).length;
                    const isActive = mobileActiveColumn === col.key;
                    return (
                        <button
                            key={col.key}
                            onClick={() => setMobileActiveColumn(col.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
                                isActive
                                    ? 'bg-pink-500 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <span>{col.title}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                {visibleColumns.map((col) => {
                    const colTasks = getColumnTasks(col.key);
                    const isDragOver = dragOverColumn === col.key;
                    const IconComponent = col.icon;

                    return (
                        <div
                            key={col.key}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                if (dragOverColumn !== col.key) {
                                    setDragOverColumn(col.key);
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverColumn !== col.key) {
                                    setDragOverColumn(col.key);
                                }
                            }}
                            onDragLeave={(e) => {
                                if (e.currentTarget.contains(e.relatedTarget)) return;
                                setDragOverColumn(null);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleInternalDrop(col.key);
                            }}
                            className={`flex flex-col h-full min-h-[400px] sm:min-h-[520px] rounded-2xl p-3 border-2 transition-all duration-200 min-w-0 ${
                                isDragOver ? col.activeDropBg : col.columnBg
                            }`}
                        >
                            {/* Column Header */}
                            <div
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 font-semibold text-sm transition-all duration-200 ${
                                    col.headerBg
                                } ${isDragOver ? 'shadow-xs font-bold' : ''}`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <IconComponent
                                        className={`w-4 h-4 shrink-0 ${col.iconColor} ${
                                            isDragOver ? 'scale-110' : ''
                                        } transition-transform`}
                                    />
                                    <span className="truncate">{col.title}</span>
                                    {col.key === 'DONE' && (
                                        <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0" title="Tasks completed in last 7 days">
                                            ≤ 7d
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-bold border transition-all shrink-0 ${
                                        col.badgeBg
                                    } ${isDragOver ? 'scale-105 shadow-xs' : ''}`}
                                >
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Tasks Container */}
                            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                                {loading ? (
                                    <div className="text-xs text-gray-400 text-center py-8">Loading...</div>
                                ) : colTasks.length === 0 ? (
                                    <div
                                        className={`flex flex-col items-center justify-center py-12 px-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
                                            isDragOver
                                                ? `${col.dropIndicatorBorder} scale-[1.02] shadow-sm animate-pulse`
                                                : 'border-gray-200/80 bg-gray-50/40 text-gray-400'
                                        }`}
                                    >
                                        <IconComponent
                                            className={`w-6 h-6 mb-2 transition-transform ${
                                                isDragOver ? 'scale-125 ' + col.iconColor : 'text-gray-300'
                                            }`}
                                        />
                                        <span className="text-xs font-semibold text-center">
                                            {isDragOver
                                                ? `Drop into ${col.title}`
                                                : col.key === 'DONE'
                                                    ? 'No tasks completed in 7 days'
                                                    : 'No tasks'}
                                        </span>
                                        <span className="text-[10px] text-gray-400 mt-0.5 text-center">
                                            {isDragOver ? 'Release to update status' : 'Drag and drop tasks here'}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {colTasks.map((task) => {
                                            const isDone = task.status === 'DONE';
                                            const isMissing = !isDone && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
                                            const isProgress = !isMissing && task.status === 'IN_PROGRESS';
                                            const isDragging = draggingTaskId === task.id;

                                            const leftBorderClass =
                                                task.priority === 'HIGH'
                                                    ? 'border-l-red-500'
                                                    : task.priority === 'MEDIUM'
                                                        ? 'border-l-yellow-500'
                                                        : 'border-l-emerald-500';

                                            const cardContainerClass = isMissing
                                                ? 'hover:opacity-100 hover:shadow-md'
                                                : isDone
                                                    ? 'bg-white hover:shadow'
                                                    : isProgress
                                                        ? 'bg-white hover:shadow'
                                                        : 'bg-white hover:shadow-md';

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
                                                        setDragOverColumn(null);
                                                    }}
                                                    onClick={() => onOpenTaskDetail(task)}
                                                    className={`p-3 rounded-xl border border-gray-100 border-l-[6px] ${leftBorderClass} ${cardContainerClass} transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col gap-2 group relative select-none min-w-0 ${
                                                        isDragging
                                                            ? 'opacity-30 scale-95 border-dashed border-2 border-pink-400 bg-pink-50/40 shadow-inner'
                                                            : 'hover:-translate-y-0.5 hover:shadow-md shadow-xs'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                                            <h4
                                                                className="text-xs font-semibold leading-tight line-clamp-2 text-gray-800"
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
                                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0 cursor-pointer min-w-[20px] min-h-[20px] hidden sm:flex items-center justify-center"
                                                            title="Delete task"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {task.description && (
                                                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    {(task.startDate || task.dueDate) && (
                                                        <div
                                                            className={`flex items-center gap-1 text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded w-fit min-w-0 ${
                                                                isMissing
                                                                    ? 'text-red-600 bg-red-50 border border-red-200/60'
                                                                    : 'text-pink-500 bg-pink-50/80'
                                                            }`}
                                                        >
                                                            <Clock
                                                                className={`w-3 h-3 flex-shrink-0 ${
                                                                    isMissing ? 'text-red-500' : 'text-pink-400'
                                                                }`}
                                                            />
                                                            <span className="truncate">
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

                                                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-100">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleStatus(task);
                                                            }}
                                                            className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer min-h-[28px] ${
                                                                isMissing
                                                                    ? 'text-red-600 hover:text-red-700'
                                                                    : 'text-gray-500 hover:text-pink-600'
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
                                                            <span
                                                                className={`text-[10px] uppercase ${
                                                                    isMissing ? 'font-bold' : ''
                                                                }`}
                                                            >
                                                                {isDone
                                                                    ? 'Done'
                                                                    : isMissing
                                                                        ? 'Missing'
                                                                        : isProgress
                                                                            ? 'In Progress'
                                                                            : 'Todo'}
                                                            </span>
                                                        </button>

                                                        {task.dueDate ? (
                                                            <span
                                                                className={`text-[9px] ${
                                                                    isMissing ? 'text-red-500 font-semibold' : 'text-gray-400'
                                                                }`}
                                                                title={`Deadline: ${new Date(task.dueDate).toLocaleString('en-US')}`}
                                                            >
                                                                {isMissing ? 'Overdue: ' : 'Due '}
                                                                {new Date(task.dueDate).getDate()}/{new Date(task.dueDate).getMonth() + 1}
                                                            </span>
                                                        ) : task.startDate ? (
                                                            <span
                                                                className="text-[9px] text-gray-400"
                                                                title={`Start: ${new Date(task.startDate).toLocaleString('en-US')}`}
                                                            >
                                                                Start {new Date(task.startDate).getDate()}/{new Date(task.startDate).getMonth() + 1}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {isDragOver && (
                                            <div
                                                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-dashed ${col.dropIndicatorBorder} animate-pulse font-medium text-xs shadow-inner pointer-events-none transition-all`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>
                                                    Drop into <b>{col.title}</b>
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoardView;
