import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, 
    CheckCheck, 
    Trash2, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    Sparkles, 
    X, 
    Calendar,
    ChevronRight,
    BookOpen,
    ExternalLink
} from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { DEFAULT_TIMETABLE_ITEMS } from '../data/timetableData';

export const NotificationDropdown = ({ user }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'reminders'
    const dropdownRef = useRef(null);

    const isTimetableOwner = user?.email?.toLowerCase() === 'tthhaannnnhhaann@gmail.com';

    // Initial default notifications template
    const getInitialNotifications = () => {
        const userName = user?.name || 'bạn';
        return [
            {
                id: 'welcome-1',
                type: 'system',
                title: 'Chào mừng bạn đến với TaskNote! 🎉',
                message: `Xin chào ${userName}, chúc bạn có một ngày làm việc hiệu quả và tràn đầy năng lượng!`,
                time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
                isRead: false,
                priority: 'normal',
                link: '/profile',
                actionLabel: 'Xem hồ sơ'
            },
            {
                id: 'reminder-1',
                type: 'reminder',
                title: 'Nhắc nhở: Lên kế hoạch tuần mới 📅',
                message: 'Hãy kiểm tra danh sách nhiệm vụ và thời khóa biểu để sẵn sàng cho các mục tiêu sắp tới.',
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
                isRead: false,
                priority: 'high',
                link: isTimetableOwner ? '/timetable' : '/dashboard?view=week',
                actionLabel: isTimetableOwner ? 'Xem thời khóa biểu' : 'Xem lịch tuần'
            },
            {
                id: 'tip-1',
                type: 'tip',
                title: 'Mẹo năng suất: Kỹ thuật Pomodoro ⏱️',
                message: 'Thử tập trung làm việc trong 25 phút và nghỉ ngơi 5 phút để duy trì hiệu suất cao nhất.',
                time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                isRead: true,
                priority: 'normal',
                link: '/dashboard',
                actionLabel: 'Xem công việc'
            }
        ];
    };

    const storageKey = `tasknote_notifications_${user?._id || user?.id || user?.email || 'default'}`;

    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading notifications from localStorage:', e);
        }
        return getInitialNotifications();
    });

    // Save to localStorage whenever notifications change
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(notifications));
        } catch (e) {
            console.error('Error saving notifications:', e);
        }
    }, [notifications, storageKey]);

    // Check for urgent / today's tasks & timetable to add real-time dynamic notifications
    useEffect(() => {
        const checkUrgentTasks = async () => {
            try {
                const res = await taskApi.getTasks({ limit: 50 });
                const tasks = res?.data || (Array.isArray(res) ? res : []);

                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];

                const dynamicNotifications = [];

                // 1. Check tasks
                if (tasks && tasks.length > 0) {
                    tasks.forEach(task => {
                        if (task.status === 'COMPLETED' || task.status === 'DONE') return;

                        if (task.dueDate) {
                            const dueDateStr = new Date(task.dueDate).toISOString().split('T')[0];
                            const isOverdue = new Date(task.dueDate) < today && dueDateStr !== todayStr;
                            const isToday = dueDateStr === todayStr;

                            const notifId = `task-${task._id || task.id}-${dueDateStr}`;

                            if (isOverdue) {
                                dynamicNotifications.push({
                                    id: notifId,
                                    type: 'alert',
                                    title: `⚠️ Công việc quá hạn: "${task.title}"`,
                                    message: `Hạn chót là ngày ${new Date(task.dueDate).toLocaleDateString('vi-VN')}. Bấm vào để xem và xử lý!`,
                                    time: new Date().toISOString(),
                                    isRead: false,
                                    priority: 'high',
                                    taskId: task._id || task.id,
                                    link: `/dashboard?taskId=${task._id || task.id}`,
                                    actionLabel: 'Mở công việc'
                                });
                            } else if (isToday) {
                                dynamicNotifications.push({
                                    id: notifId,
                                    type: 'reminder',
                                    title: `⏰ Hạn chót hôm nay: "${task.title}"`,
                                    message: 'Nhiệm vụ này cần được hoàn thành trong hôm nay. Bấm vào để xem!',
                                    time: new Date().toISOString(),
                                    isRead: false,
                                    priority: 'high',
                                    taskId: task._id || task.id,
                                    link: `/dashboard?taskId=${task._id || task.id}`,
                                    actionLabel: 'Mở công việc'
                                });
                            }
                        }
                    });
                }

                // 2. Check timetable classes today (for timetable manager)
                if (isTimetableOwner) {
                    const daysMap = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                    const currentDayName = daysMap[today.getDay()];
                    
                    let timetableList = DEFAULT_TIMETABLE_ITEMS;
                    try {
                        const savedTt = localStorage.getItem('task_manager_timetable_items_v4');
                        if (savedTt) timetableList = JSON.parse(savedTt);
                    } catch (e) {
                        // ignore
                    }

                    const todayClasses = timetableList.filter(item => item.dayOfWeek === currentDayName);
                    if (todayClasses.length > 0) {
                        const ttNotifId = `timetable-today-${todayStr}`;
                        const classSummary = todayClasses.map(c => c.className).slice(0, 2).join(', ') + (todayClasses.length > 2 ? ` và ${todayClasses.length - 2} ca khác` : '');
                        dynamicNotifications.push({
                            id: ttNotifId,
                            type: 'timetable',
                            title: `📚 Lịch dạy hôm nay (${currentDayName})`,
                            message: `Bạn có ${todayClasses.length} ca dạy: ${classSummary}. Bấm để xem chi tiết thời khóa biểu.`,
                            time: new Date().toISOString(),
                            isRead: false,
                            priority: 'normal',
                            link: '/timetable',
                            actionLabel: 'Xem thời khóa biểu'
                        });
                    }
                }

                if (dynamicNotifications.length > 0) {
                    setNotifications(prev => {
                        const existingIds = new Set(prev.map(n => n.id));
                        const newOnes = dynamicNotifications.filter(n => !existingIds.has(n.id));
                        if (newOnes.length > 0) {
                            return [...newOnes, ...prev];
                        }
                        return prev;
                    });
                }
            } catch (err) {
                // Ignore silent task fetching errors in notifications
            }
        };

        checkUrgentTasks();
    }, [user, isTimetableOwner]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Handle clicking a notification item -> navigate to the target
    const handleNotificationClick = (item) => {
        markAsRead(item.id);
        setIsOpen(false);

        // Determine destination
        if (item.link) {
            navigate(item.link);
        } else if (item.taskId) {
            navigate(`/dashboard?taskId=${item.taskId}`);
        } else if (item.type === 'reminder') {
            navigate('/dashboard?view=week');
        } else if (item.type === 'timetable') {
            navigate('/timetable');
        } else if (item.type === 'system') {
            navigate('/profile');
        } else {
            navigate('/dashboard');
        }
    };

    // Format relative time helper
    const formatTimeAgo = (isoString) => {
        try {
            const date = new Date(isoString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'Vừa xong';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
            if (diffInSeconds < 172800) return 'Hôm qua';
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        } catch {
            return 'Gần đây';
        }
    };

    // Filter notifications
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'reminders') return n.type === 'reminder' || n.type === 'alert' || n.type === 'timetable';
        return true;
    });

    const renderTypeIcon = (type) => {
        switch (type) {
            case 'alert':
                return (
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                );
            case 'reminder':
                return (
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <Clock className="w-4 h-4" />
                    </div>
                );
            case 'timetable':
                return (
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                        <BookOpen className="w-4 h-4" />
                    </div>
                );
            case 'completed':
                return (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                );
            case 'tip':
                return (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                );
            case 'system':
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
                        <Bell className="w-4 h-4" />
                    </div>
                );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={toggleOpen}
                className={`relative hover:bg-pink-100 rounded-full p-2 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center ${
                    isOpen ? 'bg-pink-100 text-pink-600 ring-2 ring-pink-200' : 'text-gray-500'
                }`}
                title="Thông báo"
                aria-label="Thông báo"
                aria-expanded={isOpen}
            >
                <Bell className={`w-5 h-5 text-pink-400 transition-transform duration-200 ${isOpen ? 'scale-110' : 'hover:scale-105'}`} />

                {/* Unread Badge Counter */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover Dropdown */}
            {isOpen && (
                <div 
                    className="absolute right-0 sm:right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-pink-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right"
                    style={{ right: 'min(0px, calc(100vw - 100% - 16px))' }}
                >
                    {/* Header */}
                    <div className="px-4 py-3.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Thông báo</h3>
                            {unreadCount > 0 ? (
                                <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} mới
                                </span>
                            ) : (
                                <span className="bg-white/20 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                                    Tất cả đã đọc
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Đánh dấu tất cả là đã đọc"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Đã đọc</span>
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1.5 bg-pink-50/50 border-b border-pink-100 text-xs font-bold text-gray-600">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                                filter === 'all' 
                                    ? 'bg-white text-pink-600 shadow-xs' 
                                    : 'hover:text-pink-600 hover:bg-white/40'
                            }`}
                        >
                            Tất cả ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('unread')}
                            className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                                filter === 'unread' 
                                    ? 'bg-white text-pink-600 shadow-xs' 
                                    : 'hover:text-pink-600 hover:bg-white/40'
                            }`}
                        >
                            Chưa đọc ({unreadCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('reminders')}
                            className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                                filter === 'reminders' 
                                    ? 'bg-white text-pink-600 shadow-xs' 
                                    : 'hover:text-pink-600 hover:bg-white/40'
                            }`}
                        >
                            Nhắc việc
                        </button>
                    </div>

                    {/* Notification Items List */}
                    <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50 overscroll-contain">
                        {filteredNotifications.length === 0 ? (
                            <div className="py-10 px-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-400 mx-auto flex items-center justify-center mb-3">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-gray-700">Không có thông báo nào</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {filter === 'unread' 
                                        ? 'Bạn đã đọc hết mọi thông báo rồi!' 
                                        : 'Mọi hoạt động mới sẽ xuất hiện tại đây.'}
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group relative hover:bg-pink-50/60 ${
                                        !item.isRead 
                                            ? 'bg-pink-50/30' 
                                            : 'bg-white'
                                    }`}
                                    title="Bấm để chuyển hướng đến trang tương ứng"
                                >
                                    {/* Icon */}
                                    {renderTypeIcon(item.type)}

                                    {/* Body */}
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <h4 className={`text-xs sm:text-sm truncate group-hover:text-pink-600 transition-colors ${
                                                !item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                            }`}>
                                                {item.title}
                                            </h4>
                                            {!item.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 shadow-xs" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {formatTimeAgo(item.time)}
                                            </span>
                                            <span className="text-[10px] text-pink-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                                {item.actionLabel || 'Xem ngay'}
                                                <ChevronRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete Button (Visible on Hover) */}
                                    <button
                                        type="button"
                                        onClick={(e) => deleteNotification(item.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all absolute top-3 right-2 cursor-pointer z-10"
                                        title="Xóa thông báo"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-2.5 bg-gray-50/80 border-t border-pink-100 flex items-center justify-between text-xs">
                            <span className="text-gray-400 text-[11px] px-2 font-medium">
                                TaskNote Notifications
                            </span>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-gray-500 hover:text-rose-600 font-bold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
