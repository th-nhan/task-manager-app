import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { taskApi } from '../api/taskApi';
import { Bell, CircleArrowLeft, CircleArrowRight, Dot, Plus, LogOut, Clock, Circle, CheckCircle2, Trash2, AlertCircle, LayoutGrid, LayoutList } from 'lucide-react';
import CreateTaskModal from '../components/CreateTaskModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isGridLayout, setIsGridLayout] = useState(true);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await taskApi.getTasks({ limit: 100 });
            const taskList = res?.data || (Array.isArray(res) ? res : []);
            setTasks(taskList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Không thể tải danh sách công việc!');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleOpenCreateModal = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleOpenTaskDetail = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = async (taskData) => {
        if (selectedTask) {
            await taskApi.updateTask(selectedTask.id, taskData);
            toast.success('Cập nhật công việc thành công!');
        } else {
            await taskApi.createTask(taskData);
            toast.success('Tạo công việc mới thành công!');
        }
        fetchTasks();
    };

    const handleToggleStatus = async (task) => {
        const nextStatus =
            task.status === 'TODO'
                ? 'IN_PROGRESS'
                : task.status === 'IN_PROGRESS'
                    ? 'DONE'
                    : 'TODO';

        try {
            await taskApi.updateTask(task.id, { status: nextStatus });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
            toast.info(`Trạng thái: ${nextStatus === 'DONE' ? 'Hoàn thành' : nextStatus === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Cần làm'}`);
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
        try {
            await taskApi.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            if (selectedTask && selectedTask.id === id) {
                handleCloseModal();
            }
            toast.success('Đã xóa công việc thành công!');
        } catch (err) {
            toast.error('Không thể xóa công việc!');
        }
    };

    const filteredTasks = useMemo(() => {
        const target = new Date(selectedDate);
        target.setHours(0, 0, 0, 0);

        return tasks
            .filter(task => {
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
    }, [tasks, selectedDate]);

    const weekDays = useMemo(() => {
        const curr = new Date(currentDate);
        const dayOfWeek = (curr.getDay() + 6) % 7;

        const monday = new Date(curr);
        monday.setDate(curr.getDate() - dayOfWeek);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();

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

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() - 7);
            return next;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 7);
            return next;
        });
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const weekRangeText = useMemo(() => {
        if (!weekDays.length) return '';
        const start = weekDays[0].date;
        const end = weekDays[6].date;
        const monthName = start.toLocaleDateString('en-US', { month: 'long' });
        const year = start.getFullYear();
        return `${start.getDate()} - ${end.getDate()}, ${monthName}, ${year}`;
    }, [weekDays]);



    return (
        <div className='bg-pink-100 min-h-screen flex flex-col gap-6'>
            {/* Header */}
            <div className="sticky top-0 bg-white p-2 flex justify-between shadow-sm z-10">
                <div className="flex items-center ml-8">
                    <h1 className='text-xl font-semibold'>Task</h1>
                    <h1 className='text-pink-500 text-xl font-bold'>Note</h1>
                </div>
                <div className='space-x-1 flex items-center mr-2'>
                    <div className="">
                        <button className='hover:bg-pink-100 rounded-full p-2 text-gray-500 transition-colors'><Bell className='text-pink-400' /></button>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 hover:bg-pink-100 rounded-full p-2 cursor-pointer transition-colors">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-pink-300 flex items-center justify-center font-bold text-xs text-white">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <span className='text-sm font-medium text-pink-400'>{user?.name}</span>
                    </div>
                    <button
                        onClick={logout}
                        title="Đăng xuất"
                        className='hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full p-2 transition-colors'
                    >
                        <LogOut className='w-5 h-5 text-pink-400' />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl mx-16 p-4 gap-4 shadow-sm">
                <div className='text-pink-500 font-bold'>
                    <h2 className='font-semibold text-xl uppercase'>Task Schedule</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 font-medium text-gray-700">{weekRangeText}</div>
                    <div className="flex items-center gap-3 bg-pink-50 text-pink-400 hover:bg-pink-100 rounded-full px-3 py-1.5 transition-colors">
                        <button onClick={handlePrevWeek} title="Tuần trước" className='hover:text-pink-600 transition-colors'>
                            <CircleArrowLeft className="w-5 h-5" />
                        </button>
                        <button onClick={handleToday} className='font-bold text-pink-400 text-sm hover:text-pink-600 transition-colors'>
                            Today
                        </button>
                        <button onClick={handleNextWeek} title="Tuần tiếp theo" className='hover:text-pink-600 transition-colors'>
                            <CircleArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex mx-16 mt-2">
                <div className="w-full">
                    <div className="flex items-center space-x-6 text-gray-600 font-medium text-sm justify-between mb-6">
                        <div className="flex gap-2">
                            <span className='flex items-center'><Dot className="text-red-500" size={36} strokeWidth={4} /> High</span>
                            <span className='flex items-center'><Dot className="text-yellow-500" size={36} strokeWidth={4} /> Medium</span>
                            <span className='flex items-center'><Dot className="text-green-500" size={36} strokeWidth={4} /> Low</span>
                        </div>
                        <div className='flex gap-3 mr-2'>
                            <button
                                onClick={handleOpenCreateModal}
                                className='bg-pink-400 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-pink-500 transition-colors shadow-sm cursor-pointer'>
                                <Plus className='w-5 h-5 mr-1.5' /> New Task
                            </button>
                            <button
                                onClick={() => setIsGridLayout(prev => !prev)}
                                title={isGridLayout ? "Chuyển sang layout khác" : "Chuyển về layout theo tuần"}
                                className='p-2 rounded-lg hover:bg-pink-50 text-pink-400 hover:text-pink-500 transition-colors cursor-pointer'
                            >
                                {isGridLayout ? <LayoutGrid className='w-5 h-5' /> : <LayoutList className='w-5 h-5' />}
                            </button>
                            <CreateTaskModal
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onSubmit={handleSaveTask}
                                defaultDate={selectedDate}
                                task={selectedTask}
                                onDelete={handleDeleteTask}
                            />
                        </div>
                    </div>
                    {isGridLayout ? (
                        <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
                            {/* Thứ và Ngày trong tuần */}
                            <div className="grid grid-cols-7 gap-2 min-w-[750px] pb-3 border-b border-gray-100">
                                {weekDays.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`py-2.5 px-3 rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                                            item.isSelected
                                                ? 'bg-pink-500 text-white shadow-sm border-pink-500 font-semibold'
                                                : item.isToday
                                                    ? 'bg-pink-50 text-pink-600 border-pink-200 font-semibold'
                                                    : 'border-transparent text-gray-700 hover:bg-pink-50/60 font-medium'
                                        }`}
                                    >
                                        <span className={`text-xs font-semibold uppercase ${
                                            item.isSelected
                                                ? 'text-pink-100'
                                                : item.isWeekend
                                                ? 'text-pink-500'
                                                : 'text-gray-400'
                                        }`}>
                                            {item.dayName}
                                        </span>
                                        <span className="text-base font-bold leading-none">
                                            {item.dayNumber}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2 min-w-[750px] mt-4 items-start">
                                {weekDays.map((item, colIndex) => {
                                    const dayTasks = getTasksForDate(item.date)

                                    return (
                                        <div
                                            
                                            key={colIndex}
                                            className={`flex flex-col gap-2.5 min-h-[420px] rounded-xl p-1 border transition-colors ${
                                                item.isToday ? 'bg-pink-50/40 border-pink-200' : 'bg-gray-50/40 border-gray-100'
                                            }`}
                                        >
                                            {loading ? (
                                                <span className='text-xs text-gray-300 text-center py-4'>Loading...</span>
                                            ) : dayTasks.length === 0 ? (
                                                <span className='text-[11px] text-gray-300 text-center py-6'>No tasks</span>
                                            ) : (
                                                dayTasks.map((task) => {
                                                    const isDone = task.status === 'DONE';
                                                    const isMissing = !isDone && Boolean(task.dueDate && new Date(task.dueDate) < new Date());
                                                    const isProgress = !isMissing && task.status === 'IN_PROGRESS';

                                                    const leftBorderClass = task.priority === 'HIGH' 
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

                                                    const badgeClass = isMissing
                                                        ? 'bg-red-100 text-red-700'
                                                        : isDone
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : isProgress
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-gray-100 text-gray-600';

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            onClick={() => handleOpenTaskDetail(task)}
                                                            className={`p-3 rounded-xl border border-gray-100 border-l-[6px] ${leftBorderClass} ${cardContainerClass} transition-all cursor-pointer flex flex-col gap-2 group relative`}
                                                        >
                                                            <div className="flex items-start justify-between gap-1">
                                                                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                                                    <h4
                                                                        className={`text-xs font-semibold leading-tight line-clamp-2 ${
                                                                            isDone ? 'line-through text-gray-400' : isMissing ? 'text-gray-700' : 'text-gray-800'
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
                                                                        handleDeleteTask(task.id);
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

                                                            {/* Start / Due Time Badge */}
                                                            {(task.startDate || task.dueDate) && (
                                                                <div className={`flex items-center gap-1 text-[10px] font-medium mt-1.5 px-1.5 py-0.5 rounded w-fit ${
                                                                    isMissing
                                                                        ? 'text-red-600 bg-red-50 border border-red-200/60'
                                                                        : 'text-pink-500 bg-pink-50/80'
                                                                }`}>
                                                                    <Clock className={`w-3 h-3 flex-shrink-0 ${isMissing ? 'text-red-500' : 'text-pink-400'}`} />
                                                                    <span>
                                                                        {task.startDate && (
                                                                            new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                                                        )}
                                                                        {task.startDate && task.dueDate && ' - '}
                                                                        {task.dueDate && (
                                                                            new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Footer card: Trạng thái & Ngày */}
                                                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStatus(task);
                                                                }}
                                                                className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                                                                    isMissing ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-pink-600'
                                                                }`}
                                                                title="Bấm để đổi trạng thái"
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
                                                                <span className="text-[9px] text-gray-400" title={`Start: ${new Date(task.startDate).toLocaleString('vi-VN')}`}>
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
                    ) : (
                        /* Layout mới để bạn tự thiết kế */
                        <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[500px]">
                            <div className="flex flex-col items-center justify-center py-24 text-gray-400 border-2 border-dashed border-pink-100 rounded-xl">
                                <p className="text-base font-semibold text-gray-600">Layout Mới</p>
                                <p className="text-xs text-gray-400 mt-1">Chỗ này bạn có thể tự thiết kế layout theo ý muốn</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;