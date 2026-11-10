import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    DollarSign,
    Calendar,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Clock,
    Plus,
    Download,
    Trash2,
    Edit3,
    Filter,
    Layers,
    Sparkles,
    AlertCircle,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MapPin,
    GraduationCap,
    Check,
    LayoutGrid,
    CalendarDays,
    ListFilter,
    X,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Image as ImageIcon
} from 'lucide-react';
import { teachingSessionApi } from '../../api/teachingSessionApi';
import { exportPayrollToExcel, exportSalaryAsImage, TIME_SLOTS_MATRIX, DAYS_OF_WEEK, GRADE_CONFIG, LOCATION_CONFIG, isSessionPassed } from '../../data/timetableData';
import { SessionFormModal } from './SessionFormModal';
import { WEEK_DAYS_HEADER, DAY_NAMES } from '../../data/teachingTemplates';

export const SalaryAttendanceView = ({ toast, timetableItems = [] }) => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const [sessions, setSessions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Layout Mode: 'weekly-grid' (Weekly Matrix - DEFAULT) | 'month' (Monthly Calendar) | 'list' (Detailed Records)
    const [layoutMode, setLayoutMode] = useState('weekly-grid');

    // Selected week index in month for week view (0, 1, 2, 3, 4)
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

    // Filters
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterLocation, setFilterLocation] = useState('ALL');

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [initialModalDate, setInitialModalDate] = useState(null);
    const [initialModalSlot, setInitialModalSlot] = useState(null);

    // Key to persist manual overrides so user adjustments (e.g. Cancelled) are never reverted by auto-time checks
    const STATUS_OVERRIDES_STORAGE_KEY = 'task_salary_status_overrides_v2';
    const [statusOverrides, setStatusOverrides] = useState(() => {
        try {
            const saved = localStorage.getItem('task_salary_status_overrides_v2');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Active status menu popup (to directly choose status without cycling multiple times)
    const [activeStatusMenuId, setActiveStatusMenuId] = useState(null);

    // Day detail popup for monthly calendar view (shows all sessions when clicking "+X more")
    const [dayDetailPopup, setDayDetailPopup] = useState(null); // { dateKey, dateLabel, sessions }

    // Close open status menu on outside click
    useEffect(() => {
        if (!activeStatusMenuId) return;
        const handleOutsideClick = () => {
            setActiveStatusMenuId(null);
        };
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [activeStatusMenuId]);

    // Track auto generation per month so changing months can auto-sync without redundant calls
    const autoSyncedMonthsRef = useRef(new Set());

    // Fetch sessions from API
    const fetchMonthData = async (m = selectedMonth, y = selectedYear, triggerAutoSync = true) => {
        try {
            setIsLoading(true);
            const res = await teachingSessionApi.getSessions(m, y);
            const isSuccess = res?.success || res?.data?.success || res?.sessions || res?.data?.sessions;
            if (isSuccess) {
                const fetchedSessions = res?.data?.sessions || res?.sessions || res?.data?.data?.sessions || [];
                // Check if any fetched sessions are PENDING but passed their time; auto-mark as COMPLETED
                const normalizedSessions = fetchedSessions.map(s => {
                    if (s.status === 'PENDING' && isSessionPassed(s.date, s.endTime, s.startTime)) {
                        return { ...s, status: 'COMPLETED', autoCompleted: true };
                    }
                    return s;
                });

                setSessions(normalizedSessions);
                setSummary(res?.data?.summary || res?.summary || res?.data?.data?.summary || null);

                // Auto-sync from weekly grid if database sessions are empty for this month
                const monthKey = `${y}-${m}`;
                if (fetchedSessions.length === 0 && triggerAutoSync && !autoSyncedMonthsRef.current.has(monthKey)) {
                    autoSyncedMonthsRef.current.add(monthKey);
                    handleAutoGenerateFromTimetable(m, y, false);
                }
            }
        } catch (error) {
            console.error("Failed to load teaching session data:", error);
            toast?.error("Unable to load teaching sessions for this month");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthData(selectedMonth, selectedYear, true);
    }, [selectedMonth, selectedYear]);

    // Helper for formatting local Date to YYYY-MM-DD
    const formatLocalDateKey = (d) => {
        if (!d) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Calendar Days Generator for the selected month (Monday -> Sunday)
    const monthCalendarDays = useMemo(() => {
        const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
        const lastDay = new Date(selectedYear, selectedMonth, 0);
        const daysInMonth = lastDay.getDate();

        // Monday start: 0 = Sun, 1 = Mon ...
        const startDayOfWeek = firstDay.getDay();
        const padBefore = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        const todayStr = formatLocalDateKey(new Date());
        const days = [];
        // Prev month padding
        const prevMonthLastDay = new Date(selectedYear, selectedMonth - 1, 0).getDate();
        for (let i = padBefore - 1; i >= 0; i--) {
            const d = new Date(selectedYear, selectedMonth - 2, prevMonthLastDay - i, 12, 0, 0);
            days.push({
                date: d,
                dayNumber: d.getDate(),
                dateKey: formatLocalDateKey(d),
                dayOfWeekIndex: d.getDay(),
                dayName: DAY_NAMES[d.getDay()],
                isCurrentMonth: false,
                isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(selectedYear, selectedMonth - 1, day, 12, 0, 0);
            const dateKey = formatLocalDateKey(d);
            days.push({
                date: d,
                dayNumber: day,
                dateKey,
                dayOfWeekIndex: d.getDay(),
                dayName: DAY_NAMES[d.getDay()],
                isCurrentMonth: true,
                isToday: dateKey === todayStr,
                isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
        }

        // Next month padding to fill rows of 7
        const remaining = (7 - (days.length % 7)) % 7;
        if (remaining > 0) {
            for (let day = 1; day <= remaining; day++) {
                const d = new Date(selectedYear, selectedMonth, day, 12, 0, 0);
                days.push({
                    date: d,
                    dayNumber: day,
                    dateKey: formatLocalDateKey(d),
                    dayOfWeekIndex: d.getDay(),
                    dayName: DAY_NAMES[d.getDay()],
                    isCurrentMonth: false,
                    isWeekend: d.getDay() === 0 || d.getDay() === 6
                });
            }
        }

        return days;
    }, [selectedMonth, selectedYear]);

    // Weeks array for Weekly View
    const monthWeeks = useMemo(() => {
        const weeks = [];
        for (let i = 0; i < monthCalendarDays.length; i += 7) {
            weeks.push(monthCalendarDays.slice(i, i + 7));
        }
        return weeks;
    }, [monthCalendarDays]);

    // Set initial selectedWeekIndex to the week containing today
    useEffect(() => {
        const todayStr = formatLocalDateKey(new Date());
        const foundWeekIdx = monthWeeks.findIndex(w => w.some(d => d.dateKey === todayStr));
        if (foundWeekIdx >= 0) {
            setSelectedWeekIndex(foundWeekIdx);
        } else {
            setSelectedWeekIndex(0);
        }
    }, [monthWeeks]);

    const currentWeekDays = monthWeeks[selectedWeekIndex] || monthWeeks[0] || [];

    // Filtered sessions from database
    const filteredDbSessions = useMemo(() => {
        return sessions.filter(s => {
            if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
            if (filterLocation !== 'ALL' && s.location !== filterLocation) return false;
            return true;
        });
    }, [sessions, filterStatus, filterLocation]);

    // Sessions map by Date key: { "2026-10-15": [session1, session2] }
    const sessionsByDate = useMemo(() => {
        const map = {};
        filteredDbSessions.forEach(s => {
            let key = '';
            if (typeof s.date === 'string' && s.date.length >= 10) {
                key = s.date.slice(0, 10);
            } else if (s.date instanceof Date) {
                key = formatLocalDateKey(s.date);
            } else if (s.date) {
                key = formatLocalDateKey(new Date(s.date));
            }
            if (key) {
                if (!map[key]) map[key] = [];
                map[key].push(s);
            }
        });
        return map;
    }, [filteredDbSessions]);

    // AUTO-POPULATE & AUTO-UPDATE PAST SESSIONS:
    // Merges schedule from timetableItems with recorded database sessions
    // Automatically marks sessions as COMPLETED when their scheduled time has passed!
    const getSessionsForSlotAndDay = (slotItem, colDay) => {
        if (!colDay || !colDay.dateKey) return [];
        const dateKey = colDay.dateKey;
        const daySessions = sessionsByDate[dateKey] || [];
        const dayOfWeekIndex = colDay.dayOfWeekIndex !== undefined ? colDay.dayOfWeekIndex : colDay.date.getDay();

        // 1. Timetable items for this day of week that belong to this slot
        const timetableDayItems = timetableItems.filter(item => {
            if (item.dayIndex !== dayOfWeekIndex) return false;
            if (slotItem.startTimes && Array.isArray(slotItem.startTimes)) {
                if (slotItem.startTimes.includes(item.startTime)) return true;
            }
            if (item.timeRange === slotItem.slot) return true;
            const slotStart = slotItem.label.split('–')[0].trim();
            return item.startTime === slotStart;
        });

        // 2. Map each timetable item to an existing database session or an auto-synthesized live session
        const mappedSessions = timetableDayItems.map(item => {
            const itemKey = `${dateKey}_${item.id || item.startTime}`;
            const itemCodeKey = `${dateKey}_${item.startTime}_${item.originalCode || item.className}`;

            const existing = daySessions.find(s =>
                (s.timetableItemId && String(s.timetableItemId) === String(item.id)) ||
                (s.startTime === item.startTime && (s.originalCode === item.originalCode || s.className === item.className))
            );

            // Check if user has explicitly set a status (highest priority)
            const overrideStatus = statusOverrides[existing?.id] ||
                                   statusOverrides[itemKey] ||
                                   statusOverrides[itemCodeKey] ||
                                   statusOverrides[`auto_${itemKey}`];

            if (existing) {
                if (overrideStatus) {
                    return { ...existing, status: overrideStatus, autoCompleted: false };
                }
                // If it exists in DB as PENDING but time has passed, auto-reflect as COMPLETED
                if (existing.status === 'PENDING' && isSessionPassed(colDay.date, item.endTime, item.startTime)) {
                    return { ...existing, status: 'COMPLETED', autoCompleted: true };
                }
                return existing;
            }

            // Auto-generated synthesized session
            const passed = isSessionPassed(colDay.date, item.endTime, item.startTime);
            const initialStatus = overrideStatus || (passed ? 'COMPLETED' : 'PENDING');
            return {
                id: `auto_${itemKey}`,
                timetableItemId: String(item.id || ''),
                date: colDay.date,
                dayOfWeek: item.dayOfWeek,
                dayIndex: item.dayIndex,
                startTime: item.startTime,
                endTime: item.endTime,
                timeRange: item.timeRange,
                className: item.className,
                originalCode: item.originalCode,
                grade: item.grade,
                location: item.location,
                shift: item.shift || 'Afternoon',
                rate: 60000,
                status: initialStatus,
                autoCompleted: !overrideStatus && passed,
                isAutoGenerated: true
            };
        });

        // 3. Find any custom sessions on this date in this slot that don't match any timetable item
        const customSessions = daySessions.filter(s => {
            const matchesTimetable = timetableDayItems.some(item =>
                (s.timetableItemId && String(s.timetableItemId) === String(item.id)) ||
                (s.startTime === item.startTime && (s.originalCode === item.originalCode || s.className === item.className))
            );
            if (matchesTimetable) return false;

            if (slotItem.startTimes && Array.isArray(slotItem.startTimes)) {
                if (slotItem.startTimes.includes(s.startTime)) return true;
            }
            if (s.timeRange === slotItem.slot) return true;
            const slotStart = slotItem.label.split('–')[0].trim();
            return s.startTime === slotStart;
        }).map(s => {
            const overrideStatus = statusOverrides[s.id];
            if (overrideStatus) {
                return { ...s, status: overrideStatus, autoCompleted: false };
            }
            return s;
        });

        const combined = [...mappedSessions, ...customSessions];

        // Apply filters
        return combined.filter(s => {
            if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
            if (filterLocation !== 'ALL' && s.location !== filterLocation) return false;
            return true;
        });
    };

    // All sessions in the current week (including auto-populated classes from timetable)
    const weekSlotsSessions = useMemo(() => {
        const list = [];
        currentWeekDays.forEach(colDay => {
            TIME_SLOTS_MATRIX.forEach(slotItem => {
                const slotSessions = getSessionsForSlotAndDay(slotItem, colDay);
                list.push(...slotSessions);
            });
        });
        return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWeekDays, sessionsByDate, timetableItems, filterStatus, filterLocation]);

    // All sessions mapped by dateKey across the entire calendar view (combining DB records + Timetable schedule + overrides)
    const allCalendarSessionsByDate = useMemo(() => {
        const map = {};
        monthCalendarDays.forEach(colDay => {
            const list = [];
            TIME_SLOTS_MATRIX.forEach(slotItem => {
                const slotSessions = getSessionsForSlotAndDay(slotItem, colDay);
                list.push(...slotSessions);
            });
            list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
            map[colDay.dateKey] = list;
        });
        return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthCalendarDays, sessionsByDate, timetableItems, statusOverrides, filterStatus, filterLocation]);

    // All sessions belonging to the current selected month (excluding previous/next month padding days)
    const allCurrentMonthSessions = useMemo(() => {
        const list = [];
        monthCalendarDays.forEach(colDay => {
            if (!colDay.isCurrentMonth) return;
            const dayList = allCalendarSessionsByDate[colDay.dateKey] || [];
            list.push(...dayList);
        });
        return list;
    }, [monthCalendarDays, allCalendarSessionsByDate]);

    // Sessions for detailed list view (falls back to filteredDbSessions if computed list is empty)
    const displayListSessions = useMemo(() => {
        return allCurrentMonthSessions.length > 0 ? allCurrentMonthSessions : filteredDbSessions;
    }, [allCurrentMonthSessions, filteredDbSessions]);

    // Week stats calculation
    const weekStats = useMemo(() => {
        let earned = 0;
        let expected = 0;
        let completed = 0;
        let makeup = 0;
        let cancelled = 0;
        let pending = 0;

        weekSlotsSessions.forEach(s => {
            const rate = s.rate || 60000;
            if (s.status === 'COMPLETED') {
                completed++;
                earned += rate;
                expected += rate;
            } else if (s.status === 'MAKE_UP') {
                makeup++;
                earned += rate;
                expected += rate;
            } else if (s.status === 'CANCELLED') {
                cancelled++;
            } else if (s.status === 'PENDING') {
                pending++;
                expected += rate;
            }
        });

        return {
            total: weekSlotsSessions.length,
            earned,
            expected,
            completed,
            makeup,
            cancelled,
            pending,
            paidCount: completed + makeup
        };
    }, [weekSlotsSessions]);

    // Total month actual earnings calculation
    const monthStats = useMemo(() => {
        let earned = 0;
        let completed = 0;
        let makeup = 0;
        let cancelled = 0;
        let pending = 0;

        // If summary from DB is available, has paid sessions, AND no manual overrides exist, use it
        if (summary && summary.totalEarnings > 0 && Object.keys(statusOverrides).length === 0) {
            return {
                earned: summary.totalEarnings,
                totalEarnings: summary.totalEarnings,
                paidCount: summary.paidSessionsCount || 0,
                completed: summary.completedCount || 0,
                makeup: summary.makeupCount || 0,
                cancelled: summary.cancelledCount || 0,
                pending: summary.pendingCount || 0,
                expected: summary.expectedEarnings || summary.totalEarnings,
                month: selectedMonth,
                year: selectedYear,
                totalCount: summary.totalCount || 0
            };
        }

        // Otherwise compute live from all sessions of the current month
        allCurrentMonthSessions.forEach(s => {
            const rate = s.rate || 60000;
            if (s.status === 'COMPLETED') {
                completed++;
                earned += rate;
            } else if (s.status === 'MAKE_UP') {
                makeup++;
                earned += rate;
            } else if (s.status === 'CANCELLED') {
                cancelled++;
            } else if (s.status === 'PENDING') {
                pending++;
            }
        });

        return {
            earned,
            totalEarnings: earned,
            paidCount: completed + makeup,
            completed,
            makeup,
            cancelled,
            pending,
            expected: earned + (pending * 60000),
            month: selectedMonth,
            year: selectedYear,
            totalCount: allCurrentMonthSessions.length
        };
    }, [summary, allCurrentMonthSessions, statusOverrides, selectedMonth, selectedYear]);

    // Auto-generate / Sync from Timetable
    const handleAutoGenerateFromTimetable = async (m = selectedMonth, y = selectedYear, overwrite = false) => {
        try {
            setIsGenerating(true);
            const res = await teachingSessionApi.generateMonth({
                month: m,
                year: y,
                defaultRate: 60000,
                overwrite,
                timetableItems: timetableItems.length > 0 ? timetableItems : undefined
            });
            if (res?.success || res?.data?.success) {
                if (overwrite) {
                    toast?.success(`⚡ Auto-synced all schedule sessions to Month ${m}/${y}`);
                }
                await fetchMonthData(m, y, false);
            }
        } catch (error) {
            console.error("Error auto-generating schedule:", error);
            if (overwrite) {
                toast?.error(error?.response?.data?.message || error?.message || "Failed to sync schedule from Weekly Grid");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle Month change
    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
        setSelectedWeekIndex(0);
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
        setSelectedWeekIndex(0);
    };

    // Directly set status to target value: 'COMPLETED' | 'PENDING' | 'MAKE_UP' | 'CANCELLED'
    const handleSetStatus = async (session, targetStatus) => {
        setActiveStatusMenuId(null);
        const statusLabels = {
            'COMPLETED': 'Taught',
            'MAKE_UP': 'Make-up',
            'PENDING': 'Scheduled',
            'CANCELLED': 'Cancelled'
        };

        const sessionDate = session.date ? new Date(session.date) : new Date();
        const dateKey = sessionDate.toISOString().slice(0, 10);
        const itemKey = `${dateKey}_${session.timetableItemId || session.startTime}`;
        const itemCodeKey = `${dateKey}_${session.startTime}_${session.originalCode || session.className}`;

        // 1. Instantly store user override in state and localStorage so it is NEVER overridden
        const updatedOverrides = {
            ...statusOverrides,
            [session.id]: targetStatus,
            [itemKey]: targetStatus,
            [itemCodeKey]: targetStatus,
            [`auto_${itemKey}`]: targetStatus
        };
        setStatusOverrides(updatedOverrides);
        try {
            localStorage.setItem(STATUS_OVERRIDES_STORAGE_KEY, JSON.stringify(updatedOverrides));
        } catch (e) {
            console.error("Failed to persist status override:", e);
        }

        // 2. Instantly update in-memory sessions list for immediate UI reactivity
        setSessions(prev => {
            const existingIdx = prev.findIndex(s =>
                s.id === session.id ||
                (s.timetableItemId && String(s.timetableItemId) === String(session.timetableItemId)) ||
                (s.startTime === session.startTime && (s.originalCode === session.originalCode || s.className === session.className))
            );
            if (existingIdx >= 0) {
                const next = [...prev];
                next[existingIdx] = { ...next[existingIdx], status: targetStatus, autoCompleted: false };
                return next;
            }
            return [...prev, { ...session, status: targetStatus, autoCompleted: false }];
        });

        toast?.success(`${session.originalCode || session.className}: ${statusLabels[targetStatus]}`);

        // 3. Persist to server API in background
        if (session.isAutoGenerated) {
            try {
                const payload = {
                    date: sessionDate.toISOString(),
                    dayOfWeek: session.dayOfWeek,
                    dayIndex: session.dayIndex,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    timeRange: session.timeRange,
                    className: session.className,
                    originalCode: session.originalCode,
                    location: session.location,
                    grade: session.grade,
                    shift: session.shift || 'Afternoon',
                    rate: 60000,
                    status: targetStatus,
                    timetableItemId: session.timetableItemId || ''
                };
                const res = await teachingSessionApi.createSession(payload);
                if (res?.success || res?.data?.success) {
                    const created = res?.data || res?.data?.data;
                    if (created) {
                        setSessions(prev => {
                            const filtered = prev.filter(s => s.id !== session.id);
                            return [...filtered, { ...created, status: targetStatus, autoCompleted: false }];
                        });
                    }
                }
            } catch (err) {
                console.warn("Background API sync for new session status:", err);
            }
        } else {
            try {
                await teachingSessionApi.updateSession(session.id, { status: targetStatus });
            } catch (error) {
                console.warn("Background API sync for session status update:", error);
            }
        }
    };

    // Quick Update Single Session Status (Cycles PENDING -> COMPLETED -> CANCELLED -> MAKE_UP -> PENDING)
    const handleCycleStatus = (session) => {
        const nextMap = {
            'PENDING': 'COMPLETED',
            'COMPLETED': 'CANCELLED',
            'CANCELLED': 'MAKE_UP',
            'MAKE_UP': 'PENDING'
        };
        const nextStatus = nextMap[session.status] || 'COMPLETED';
        handleSetStatus(session, nextStatus);
    };

    // Batch mark all sessions in the current week as COMPLETED
    const handleBatchMarkWeekCompleted = async () => {
        const pendingSessions = weekSlotsSessions.filter(s => s.status === 'PENDING');
        if (pendingSessions.length === 0) {
            toast?.info("All sessions in this week are already marked as completed!");
            return;
        }

        try {
            setIsLoading(true);
            const existingPending = pendingSessions.filter(s => !s.isAutoGenerated);
            const autoPending = pendingSessions.filter(s => s.isAutoGenerated);

            // 1. Batch update existing in DB
            if (existingPending.length > 0) {
                await teachingSessionApi.batchUpdateStatus({
                    sessionIds: existingPending.map(s => s.id),
                    status: 'COMPLETED'
                });
            }

            // 2. Persist auto-generated ones as COMPLETED
            for (const s of autoPending) {
                await teachingSessionApi.createSession({
                    date: new Date(s.date).toISOString(),
                    dayOfWeek: s.dayOfWeek,
                    dayIndex: s.dayIndex,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    timeRange: s.timeRange,
                    className: s.className,
                    originalCode: s.originalCode,
                    location: s.location,
                    grade: s.grade,
                    shift: s.shift || 'Afternoon',
                    rate: 60000,
                    status: 'COMPLETED',
                    timetableItemId: s.timetableItemId || ''
                });
            }

            toast?.success(`Marked all ${pendingSessions.length} sessions in week as Taught (+${(pendingSessions.length * 60000).toLocaleString('en-US')} VND)!`);
            await fetchMonthData(selectedMonth, selectedYear, false);
        } catch (err) {
            console.error("Error batch completing week:", err);
            toast?.error("Failed to complete all sessions in week");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete single session
    const handleDeleteSession = async (session) => {
        if (!window.confirm(`Are you sure you want to delete session "${session.originalCode || session.className}"?`)) return;

        if (session.isAutoGenerated) {
            try {
                const res = await teachingSessionApi.createSession({
                    date: new Date(session.date).toISOString(),
                    dayOfWeek: session.dayOfWeek,
                    dayIndex: session.dayIndex,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    timeRange: session.timeRange,
                    className: session.className,
                    originalCode: session.originalCode,
                    location: session.location,
                    grade: session.grade,
                    shift: session.shift || 'Afternoon',
                    rate: 60000,
                    status: 'CANCELLED',
                    timetableItemId: session.timetableItemId || ''
                });
                if (res?.success || res?.data?.success) {
                    toast?.info("Session marked as cancelled (0 VND)");
                    fetchMonthData(selectedMonth, selectedYear, false);
                }
            } catch (err) {
                toast?.error("Unable to delete session");
            }
        } else {
            try {
                const res = await teachingSessionApi.deleteSession(session.id);
                if (res?.success || res?.data?.success) {
                    toast?.success("Session deleted successfully");
                    setSessions(prev => prev.filter(s => s.id !== session.id));
                    fetchMonthData(selectedMonth, selectedYear, false);
                }
            } catch (err) {
                toast?.error("Unable to delete session");
            }
        }
    };

    // Add Session onto (date, slot)
    const handleAddSessionAtSlot = (colDay, slotItem) => {
        setEditingSession(null);
        setInitialModalDate(colDay.dateKey);
        setInitialModalSlot(slotItem);
        setIsFormModalOpen(true);
    };

    // Save from modal (create or update)
    const handleSaveSession = async (formData) => {
        try {
            if (editingSession) {
                const res = await teachingSessionApi.updateSession(editingSession.id, formData);
                if (res?.success || res?.data?.success) {
                    toast?.success("Session updated successfully");
                    setIsFormModalOpen(false);
                    setEditingSession(null);
                    await fetchMonthData(selectedMonth, selectedYear, false);
                } else {
                    toast?.error(res?.message || "Error updating session");
                }
            } else {
                const res = await teachingSessionApi.createSession(formData);
                if (res?.success || res?.data?.success) {
                    toast?.success("Extra session created successfully!");
                    setIsFormModalOpen(false);
                    await fetchMonthData(selectedMonth, selectedYear, false);
                } else {
                    toast?.error(res?.message || "Error creating session");
                }
            }
        } catch (error) {
            console.error("Error saving session:", error);
            toast?.error(error?.message || error?.response?.data?.message || "Error saving session");
        }
    };

    // Export Excel
    const handleExportExcel = () => {
        const exportList = allCurrentMonthSessions.length > 0 ? allCurrentMonthSessions : sessions;
        if (exportList.length === 0 && timetableItems.length === 0) {
            toast?.warning("No session data to export");
            return;
        }
        exportPayrollToExcel(exportList, monthStats || summary);
        toast?.success("Teaching payroll Excel downloaded!");
    };

    // Export Salary Image
    const handleExportSalaryImage = () => {
        const exportList = allCurrentMonthSessions.length > 0 ? allCurrentMonthSessions : sessions;
        if (exportList.length === 0 && timetableItems.length === 0) {
            toast?.warning("No session data to export");
            return;
        }
        exportSalaryAsImage(exportList, monthStats || summary);
        toast?.success("Exported Payroll Image!");
    };

    return (
        <div className="space-y-4 sm:space-y-6 pb-16 min-w-0" onClick={() => activeStatusMenuId && setActiveStatusMenuId(null)}>
            {/* 1. TOTAL EARNINGS & SALARY DASHBOARD (ADAPTS TO CURRENT THEME) */}
            <div className="bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-[var(--border-color)] relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-4">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] shrink-0">
                                <DollarSign className="w-6 h-6" />
                            </span>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--accent)] uppercase">
                                        Teaching Salary & Attendance Tracker
                                    </h2>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    Month {selectedMonth}/{selectedYear} • Auto-synced from Weekly Schedule matrix
                                </p>
                            </div>
                        </div>

                        {/* Month Selector Buttons */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-color)] self-start sm:self-auto">
                            <button
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-xl hover:bg-[var(--accent-subtle)] text-[var(--accent)] transition-colors cursor-pointer"
                                title="Previous Month"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-2 text-xs sm:text-sm font-extrabold text-[var(--text-main)] whitespace-nowrap">
                                Month {selectedMonth} / {selectedYear}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-xl hover:bg-[var(--accent-subtle)] text-[var(--accent)] transition-colors cursor-pointer"
                                title="Next Month"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {(selectedMonth !== (today.getMonth() + 1) || selectedYear !== today.getFullYear()) && (
                                <button
                                    onClick={() => {
                                        setSelectedMonth(today.getMonth() + 1);
                                        setSelectedYear(today.getFullYear());
                                        setSelectedWeekIndex(0);
                                    }}
                                    className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer"
                                    title="Back to current month"
                                >
                                    Current
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Prominent Salary Displays: Box 1 (Week) & Box 2 (Month) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-1 items-stretch">
                        {/* BOX 1: Ô TỔNG TIỀN TRONG TUẦN (WEEKLY TOTAL SALARY) */}
                        <div className="bg-[var(--bg-subtle)]/40 rounded-2xl p-4 sm:p-5 border border-[var(--border-color)] flex flex-col justify-between hover:border-[var(--accent)]/50 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Weekly Total Salary
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                                        Week {selectedWeekIndex + 1}
                                    </span>
                                </div>
                                <div className="text-xs text-[var(--text-muted)] font-semibold mt-1">
                                    {currentWeekDays[0]?.dayNumber}/{currentWeekDays[0]?.date.getMonth() + 1} – {currentWeekDays[6]?.dayNumber}/{currentWeekDays[6]?.date.getMonth() + 1}
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-[var(--accent)] mt-2 tracking-tight">
                                    {weekStats.earned.toLocaleString('en-US')} <span className="text-lg font-bold text-[var(--text-muted)]">VND</span>
                                </div>
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] mt-3 pt-2.5 border-t border-[var(--border-color)] font-medium flex items-center justify-between">
                                <span>Completed slots:</span>
                                <b className="text-[var(--text-main)] font-bold">{weekStats.paidCount} / {weekStats.total} slots ({weekStats.completed} taught + {weekStats.makeup} make-up)</b>
                            </div>
                        </div>

                        {/* BOX 2: Ô TỔNG TIỀN TRONG THÁNG (MONTHLY TOTAL SALARY) */}
                        <div className="bg-[var(--accent)] rounded-2xl p-4 sm:p-5 border border-[var(--accent)] text-white flex flex-col justify-between hover:brightness-105 transition-all shadow-xs">
                            <div>
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5 text-yellow-300" />
                                        Monthly Total Salary
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={handleExportSalaryImage}
                                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white font-bold text-[10px] transition-all cursor-pointer border border-white/30"
                                            title="Export Payroll to Image"
                                        >
                                            <ImageIcon className="w-3 h-3" />
                                            <span>Xuất ảnh</span>
                                        </button>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[var(--accent)]">
                                            Actual
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-white/80 font-medium mt-1">
                                    Full Month {selectedMonth}/{selectedYear} Earnings
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
                                    {monthStats.earned.toLocaleString('en-US')} <span className="text-lg font-bold text-white/80">VND</span>
                                </div>
                            </div>
                            <div className="text-[11px] text-white/90 mt-3 pt-2.5 border-t border-white/30 font-medium flex items-center justify-between">
                                <span>Month billable slots:</span>
                                <b className="text-white font-bold">{monthStats.paidCount} slots ({monthStats.completed} taught + {monthStats.makeup} make-up)</b>
                            </div>
                        </div>

                        {/* BOX 3: Weekly Status Breakdown */}
                        <div className="bg-[var(--bg-subtle)]/40 rounded-2xl p-3.5 sm:p-4 border border-[var(--border-color)] flex flex-col justify-between gap-2 md:col-span-2 lg:col-span-1 shadow-2xs">
                            <div className="flex items-center justify-between text-xs text-[var(--text-main)]">
                                <span className="font-bold">Weekly Slots Breakdown:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 text-xs">
                                <div className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                                    <span className="text-[var(--accent)] font-semibold flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                                        <span>Taught:</span>
                                    </span>
                                    <b className="text-[var(--text-main)] font-bold">{weekStats.completed} slots</b>
                                </div>
                                <div className="px-2.5 py-1.5 rounded-xl bg-purple-50/80 session-card-makeup border border-purple-200 flex items-center justify-between">
                                    <span className="text-purple-700 font-semibold flex items-center gap-1.5">
                                        <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                                        <span>Make-up:</span>
                                    </span>
                                    <b className="font-bold">+{weekStats.makeup} slots</b>
                                </div>
                                <div className="px-2.5 py-1.5 rounded-xl bg-gray-100/80 session-card-cancelled border border-gray-200 flex items-center justify-between">
                                    <span className="text-gray-600 font-semibold flex items-center gap-1.5">
                                        <XCircle className="w-3.5 h-3.5 text-gray-500" />
                                        <span>Cancelled:</span>
                                    </span>
                                    <b className="font-bold">{weekStats.cancelled} slots</b>
                                </div>
                                <div className="px-2.5 py-1.5 rounded-xl bg-amber-50/80 session-card-pending border border-amber-200 flex items-center justify-between">
                                    <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Scheduled:</span>
                                    </span>
                                    <b className="font-bold">{weekStats.pending} slots</b>
                                </div>
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] font-semibold pt-1 border-t border-[var(--border-color)] flex items-center justify-between">
                                <span>Expected this week:</span>
                                <b className="text-[var(--text-main)] font-bold">{weekStats.expected.toLocaleString('en-US')} VND</b>
                            </div>
                        </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Auto Sync from Weekly Grid Button */}
                            <button
                                onClick={() => handleAutoGenerateFromTimetable(selectedMonth, selectedYear, true)}
                                disabled={isGenerating || isLoading}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent)] text-white hover:brightness-110 font-bold text-xs shadow-xs transition-all cursor-pointer min-h-[36px]"
                                title="Sync all scheduled slots from Weekly Grid into Attendance matrix"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isGenerating ? 'Syncing...' : '⚡ Sync from Weekly Grid'}</span>
                            </button>

                            {/* Batch Mark Current Week as Completed */}
                            <button
                                onClick={handleBatchMarkWeekCompleted}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--accent-subtle)] hover:brightness-110 text-[var(--accent)] font-bold text-xs transition-colors cursor-pointer min-h-[36px] border border-[var(--border-color)]"
                                title="Mark all scheduled slots this week as Taught"
                            >
                                <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Mark Week as Completed</span>
                            </button>

                            {/* Add manual session modal */}
                            <button
                                onClick={() => {
                                    setEditingSession(null);
                                    setInitialModalDate(currentWeekDays[0]?.dateKey || new Date().toISOString().slice(0, 10));
                                    setInitialModalSlot(null);
                                    setIsFormModalOpen(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--accent-subtle)] hover:brightness-110 text-[var(--accent)] font-bold text-xs transition-colors cursor-pointer min-h-[36px] border border-[var(--border-color)]"
                            >
                                <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Add Extra / Make-up Slot</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Export Salary Image Button */}
                            <button
                                type="button"
                                onClick={handleExportSalaryImage}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--accent-subtle)] text-[var(--text-main)] font-bold text-xs transition-colors cursor-pointer border border-[var(--border-color)] min-h-[36px]"
                                title="Export Payroll Image"
                            >
                                <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Export Payroll Image</span>
                            </button>

                            {/* Export Excel Button */}
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--accent-subtle)] text-[var(--text-main)] font-bold text-xs transition-colors cursor-pointer border border-[var(--border-color)] min-h-[36px]"
                            >
                                <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Export Payroll Excel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. TOOLBAR: VIEW SWITCHER & WEEK NAVIGATOR */}
            <div className="bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-[var(--border-color)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-color)] overflow-x-auto shrink-0">
                    <button
                        onClick={() => setLayoutMode('weekly-grid')}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                            layoutMode === 'weekly-grid'
                                ? 'bg-[var(--accent)] text-white shadow-xs'
                                : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Weekly Matrix</span>
                    </button>

                    <button
                        onClick={() => setLayoutMode('month')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                            layoutMode === 'month'
                                ? 'bg-[var(--accent)] text-white shadow-xs'
                                : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]'
                        }`}
                    >
                        <CalendarDays className="w-4 h-4" />
                        <span>Monthly Calendar</span>
                    </button>

                    <button
                        onClick={() => setLayoutMode('list')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] shrink-0 ${
                            layoutMode === 'list'
                                ? 'bg-[var(--accent)] text-white shadow-xs'
                                : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]'
                        }`}
                    >
                        <ListFilter className="w-4 h-4" />
                        <span>Detailed Records ({displayListSessions.length})</span>
                    </button>
                </div>

                {/* Week Navigator for Weekly Grid View */}
                {layoutMode === 'weekly-grid' && (
                    <div className="flex items-center justify-between lg:justify-end gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)]">
                            <button
                                disabled={selectedWeekIndex <= 0}
                                onClick={() => setSelectedWeekIndex(prev => Math.max(0, prev - 1))}
                                className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-main)] font-bold text-xs hover:text-[var(--accent)] disabled:opacity-40 cursor-pointer shadow-2xs border border-[var(--border-color)]"
                                title="Previous Week"
                            >
                                ← Prev Week
                            </button>

                            {/* Quick Week Selector */}
                            <select
                                value={selectedWeekIndex}
                                onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                                className="bg-transparent font-bold text-xs text-[var(--text-main)] px-2 py-1 outline-none cursor-pointer"
                            >
                                {monthWeeks.map((week, idx) => {
                                    const first = week[0];
                                    const last = week[6];
                                    return (
                                        <option key={idx} value={idx}>
                                            Week {idx + 1} ({first?.dayNumber}/{first?.date.getMonth() + 1} – {last?.dayNumber}/{last?.date.getMonth() + 1})
                                        </option>
                                    );
                                })}
                            </select>

                            <button
                                disabled={selectedWeekIndex >= monthWeeks.length - 1}
                                onClick={() => setSelectedWeekIndex(prev => Math.min(monthWeeks.length - 1, prev + 1))}
                                className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-main)] font-bold text-xs hover:text-[var(--accent)] disabled:opacity-40 cursor-pointer shadow-2xs border border-[var(--border-color)]"
                                title="Next Week"
                            >
                                Next Week →
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex items-center gap-2 self-start lg:self-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-xs px-2.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] font-medium text-[var(--text-main)] cursor-pointer min-h-[38px]"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="COMPLETED">Taught</option>
                        <option value="PENDING">Scheduled</option>
                        <option value="MAKE_UP">Make-up</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="text-xs px-2.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] font-medium text-[var(--text-main)] cursor-pointer min-h-[38px]"
                    >
                        <option value="ALL">All Locations</option>
                        <option value="Long Thượng">Long Thượng</option>
                        <option value="Mỹ Lộc">Mỹ Lộc</option>
                    </select>
                </div>
            </div>

            {/* 3. MAIN SCHEDULE VIEWS */}
            {isLoading ? (
                <div className="py-24 text-center bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[var(--accent)] border-t-transparent" />
                    <p className="mt-3 text-sm text-[var(--text-muted)] font-bold">Loading and syncing teaching salary schedule...</p>
                </div>
            ) : (
                <>
                    {/* VIEW A: WEEKLY MATRIX (PRIMARY DEFAULT) */}
                    {/* VIEW A: WEEKLY MATRIX (PRIMARY DEFAULT) */}
                    {layoutMode === 'weekly-grid' && (
                        <div className="bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl shadow-sm border border-[var(--border-color)] overflow-hidden min-w-0">
                            {/* Matrix Header Banner */}
                            <div className="p-4 sm:p-5 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2 flex-wrap">
                                        <span>📅 Weekly Attendance & Earnings (Week {selectedWeekIndex + 1})</span>
                                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border-color)]">
                                            {currentWeekDays[0]?.dayNumber}/{currentWeekDays[0]?.date.getMonth() + 1} – {currentWeekDays[6]?.dayNumber}/{currentWeekDays[6]?.date.getMonth() + 1}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                        Auto-updates to "Taught" when time has passed • Click any slot badge to adjust status
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs flex-wrap">
                                    <span className="flex items-center gap-1 font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-md border border-[var(--accent)]/40">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                                        <span>Taught</span>
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 session-btn-makeup px-2 py-0.5 rounded-md border border-purple-300">
                                        <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                                        <span>Make-up</span>
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 session-btn-pending px-2 py-0.5 rounded-md border border-amber-300">
                                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Scheduled</span>
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-gray-600 bg-gray-100 session-btn-cancelled px-2 py-0.5 rounded-md border border-gray-300">
                                        <XCircle className="w-3.5 h-3.5 text-gray-500" />
                                        <span>Cancelled</span>
                                    </span>
                                </div>
                            </div>

                            {/* Mobile swipe hint */}
                            <div className="md:hidden flex items-center justify-between text-[11px] text-[var(--accent)] bg-[var(--bg-subtle)] px-4 py-1.5 border-b border-[var(--border-color)]">
                                <span>👈 Scroll horizontally to view all 7 days 👉</span>
                            </div>

                            {/* Weekly Matrix Table */}
                            <div className="overflow-x-auto pb-2">
                                <table className="w-full border-collapse text-left min-w-[920px] lg:min-w-[980px]">
                                    <thead>
                                        <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
                                            <th className="p-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider w-36 sm:w-40 text-center">
                                                Time Slot
                                            </th>
                                            {currentWeekDays.map((colDay, dayIdx) => {
                                                const daySlotSessions = TIME_SLOTS_MATRIX.flatMap(slot => getSessionsForSlotAndDay(slot, colDay));
                                                const dayEarned = daySlotSessions.reduce((sum, s) => {
                                                    return sum + ((s.status === 'COMPLETED' || s.status === 'MAKE_UP') ? (s.rate || 60000) : 0);
                                                }, 0);
                                                const isToday = colDay.isToday;

                                                return (
                                                    <th
                                                        key={colDay.dateKey}
                                                        className={`p-2.5 sm:p-3 text-center border-l border-[var(--border-color)] transition-colors ${
                                                            isToday
                                                                ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-black'
                                                                : colDay.isWeekend
                                                                    ? 'bg-[var(--bg-subtle)]/70 text-[var(--accent)]'
                                                                    : 'bg-[var(--bg-card)] text-[var(--text-main)]'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center justify-center gap-0.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`text-xs font-extrabold uppercase ${isToday ? 'text-[var(--accent)]' : colDay.isWeekend ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'}`}>
                                                                    {DAYS_OF_WEEK[dayIdx]?.labelEn || DAYS_OF_WEEK[dayIdx]?.label || colDay.dayName}
                                                                </span>
                                                                {isToday && (
                                                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--accent)] text-white font-normal">
                                                                        Today
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs font-black ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'}`}>
                                                                {colDay.dayNumber}/{colDay.date.getMonth() + 1}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--bg-card)] px-1.5 py-0.2 rounded-md shadow-2xs border border-[var(--border-color)] mt-0.5">
                                                                {daySlotSessions.length} slots • {dayEarned.toLocaleString('en-US')} VND
                                                            </span>
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {TIME_SLOTS_MATRIX.map((slotItem, slotIdx) => {
                                            const isRowHasActiveMenu = currentWeekDays.some(colDay => {
                                                const sList = getSessionsForSlotAndDay(slotItem, colDay);
                                                return sList.some(s => s.id === activeStatusMenuId);
                                            });

                                            return (
                                                <tr
                                                    key={slotItem.id || slotItem.slot}
                                                    className={`hover:bg-[var(--accent-subtle)]/30 transition-colors ${
                                                        isRowHasActiveMenu ? 'relative z-50' : 'relative z-0'
                                                    } ${
                                                        slotIdx % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-subtle)]/40'
                                                    }`}
                                                >
                                                    {/* Time Slot Column */}
                                                    <td className="p-2.5 sm:p-3 text-center border-r border-[var(--border-color)] bg-[var(--bg-subtle)]/60 align-middle">
                                                        <div className="font-extrabold text-xs text-[var(--text-main)]">
                                                            {slotItem.label}
                                                        </div>
                                                        <div className="text-[10px] text-[var(--accent)] font-bold mt-0.5">
                                                            {slotItem.periodEn || slotItem.period}
                                                        </div>
                                                    </td>

                                                    {/* 7 Days Columns */}
                                                    {currentWeekDays.map((colDay) => {
                                                        const matchedSessions = getSessionsForSlotAndDay(slotItem, colDay);
                                                        const isToday = colDay.isToday;
                                                        const isCellHasActiveMenu = matchedSessions.some(s => s.id === activeStatusMenuId);

                                                        return (
                                                            <td
                                                                key={`${slotItem.slot}_${colDay.dateKey}`}
                                                                className={`p-1.5 sm:p-2 border-l border-[var(--border-color)] align-top transition-colors min-w-[110px] ${
                                                                    isToday ? 'bg-[var(--accent-subtle)]/15' : ''
                                                                } ${isCellHasActiveMenu ? 'relative z-50 overflow-visible' : 'relative'}`}
                                                            >
                                                                {matchedSessions.length === 0 ? (
                                                                    <div className="h-16 flex flex-col items-center justify-center group/empty">
                                                                        <button
                                                                            onClick={() => handleAddSessionAtSlot(colDay, slotItem)}
                                                                            title={`Add slot on ${colDay.dayName} ${colDay.dayNumber}/${colDay.date.getMonth() + 1} (${slotItem.label})`}
                                                                            className="opacity-0 group-hover/empty:opacity-100 text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-subtle)] hover:brightness-110 px-2 py-1 rounded-lg border border-[var(--border-color)] transition-all cursor-pointer flex items-center gap-1"
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                            <span>+ Add</span>
                                                                        </button>
                                                                        <span className="text-[var(--text-muted)] opacity-30 text-xs group-hover/empty:hidden">
                                                                            -
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-1.5">
                                                                        {matchedSessions.map(session => {
                                                                            const gradeStyle = GRADE_CONFIG[session.grade] || GRADE_CONFIG[10];
                                                                            const isCompleted = session.status === 'COMPLETED';
                                                                            const isMakeup = session.status === 'MAKE_UP';
                                                                            const isCancelled = session.status === 'CANCELLED';
                                                                            const isPending = session.status === 'PENDING';
                                                                            const isMenuOpen = activeStatusMenuId === session.id;

                                                                            const statusCardStyles = isCompleted
                                                                                ? 'bg-[var(--accent-subtle)] border-[var(--accent)]/60 ring-1 ring-[var(--accent)]/40'
                                                                                : isMakeup
                                                                                    ? 'bg-purple-50/90 border-purple-300 ring-1 ring-purple-400 session-card-makeup'
                                                                                    : isCancelled
                                                                                        ? 'bg-gray-100/90 border-gray-300 opacity-75 session-card-cancelled'
                                                                                        : 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400 session-card-pending';

                                                                            const statusPillColor = isCompleted
                                                                                ? 'bg-[var(--accent)]'
                                                                                : isMakeup
                                                                                    ? 'bg-purple-500'
                                                                                    : isCancelled
                                                                                        ? 'bg-gray-400'
                                                                                        : 'bg-amber-400';

                                                                            return (
                                                                                <div
                                                                                    key={session.id}
                                                                                    className={`w-full text-left p-2 rounded-2xl border shadow-xs transition-all relative overflow-visible group/card ${
                                                                                        isMenuOpen ? 'z-50 ring-2 ring-[var(--accent)] shadow-lg' : 'z-10'
                                                                                    } ${statusCardStyles}`}
                                                                                >
                                                                                    {/* Pill Accent (clipped to card's rounded border) */}
                                                                                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusPillColor}`} />
                                                                                    </div>

                                                                                    <div className="pl-1">
                                                                                        {/* Top Badges */}
                                                                                        <div className="flex items-center justify-between gap-1 mb-1">
                                                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                                                                                                G{session.grade}
                                                                                            </span>
                                                                                            <span className="text-[9px] font-bold text-[var(--text-muted)] bg-[var(--bg-card)] px-1 rounded shadow-2xs border border-[var(--border-color)]">
                                                                                                {session.location === 'Long Thượng' ? 'LT' : 'ML'}
                                                                                            </span>
                                                                                        </div>

                                                                                        {/* Class Name */}
                                                                                        <div className={`font-bold text-xs leading-tight line-clamp-2 ${
                                                                                            isCancelled ? 'line-through text-[var(--text-muted)] opacity-60' : 'text-[var(--text-main)]'
                                                                                        }`}>
                                                                                            {session.originalCode || session.className}
                                                                                        </div>

                                                                                        {/* Time */}
                                                                                        <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)] mt-1">
                                                                                            <Clock className="w-2.5 h-2.5 text-[var(--accent)] opacity-80" />
                                                                                            <span>{session.startTime} - {session.endTime}</span>
                                                                                        </div>

                                                                                        {/* Interactive Status Changer with Dropdown */}
                                                                                        <div className="mt-1.5 pt-1.5 border-t border-[var(--border-color)]/60 flex items-center justify-between gap-1 relative">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setActiveStatusMenuId(isMenuOpen ? null : session.id);
                                                                                                }}
                                                                                                title="Click to adjust status: Taught / Make-up / Scheduled / Cancelled"
                                                                                                className={`w-full py-1 px-1.5 rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs hover:scale-[1.02] border ${
                                                                                                    isCompleted
                                                                                                        ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/40 hover:bg-[var(--accent)]/25'
                                                                                                        : isMakeup
                                                                                                            ? 'bg-purple-100/80 text-purple-700 border-purple-300 hover:bg-purple-200 session-btn-makeup'
                                                                                                            : isCancelled
                                                                                                                ? 'bg-gray-100 text-gray-500 border-gray-300 line-through hover:bg-gray-200 session-btn-cancelled'
                                                                                                                : 'bg-amber-100/80 text-amber-800 border-amber-300 hover:bg-amber-200 session-btn-pending'
                                                                                                }`}
                                                                                            >
                                                                                                {isCompleted && <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" />}
                                                                                                {isMakeup && <RotateCcw className="w-3 h-3 text-purple-600" />}
                                                                                                {isCancelled && <XCircle className="w-3 h-3 text-gray-400" />}
                                                                                                {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                                                                                                <span>
                                                                                                    {isCompleted ? (session.autoCompleted ? 'Auto Taught' : 'Taught') :
                                                                                                     isMakeup ? 'Make-up' :
                                                                                                     isCancelled ? 'Cancelled' : 'Scheduled'}
                                                                                                </span>
                                                                                                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                                                                                            </button>

                                                                                            {/* Status Dropdown Menu */}
                                                                                            {isMenuOpen && (
                                                                                                <div
                                                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                                    className="absolute z-[999] left-0 right-0 top-full mt-1 bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] p-1.5 space-y-1 text-left animate-in fade-in duration-150 min-w-[135px]"
                                                                                                >
                                                                                                    <div className="text-[9px] font-bold text-[var(--text-muted)] px-1.5 py-0.5 uppercase">Set Status:</div>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onMouseDown={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'COMPLETED');
                                                                                                        }}
                                                                                                        onClick={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'COMPLETED');
                                                                                                        }}
                                                                                                        className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                                                                                                            isCompleted ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'hover:bg-[var(--accent-subtle)]/40 text-[var(--text-main)]'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" />
                                                                                                        <span>Taught</span>
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onMouseDown={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'MAKE_UP');
                                                                                                        }}
                                                                                                        onClick={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'MAKE_UP');
                                                                                                        }}
                                                                                                        className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                                                                                                            isMakeup ? 'bg-purple-100 text-purple-700 session-btn-makeup' : 'hover:bg-[var(--bg-subtle)] text-[var(--text-main)]'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <RotateCcw className="w-3 h-3 text-purple-500" />
                                                                                                        <span>Make-up</span>
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onMouseDown={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'PENDING');
                                                                                                        }}
                                                                                                        onClick={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'PENDING');
                                                                                                        }}
                                                                                                        className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                                                                                                            isPending ? 'bg-amber-100 text-amber-800 session-btn-pending' : 'hover:bg-[var(--bg-subtle)] text-[var(--text-main)]'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <Clock className="w-3 h-3 text-amber-500" />
                                                                                                        <span>Scheduled</span>
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onMouseDown={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'CANCELLED');
                                                                                                        }}
                                                                                                        onClick={(e) => {
                                                                                                            e.preventDefault();
                                                                                                            e.stopPropagation();
                                                                                                            handleSetStatus(session, 'CANCELLED');
                                                                                                        }}
                                                                                                        className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                                                                                                            isCancelled ? 'bg-gray-100 text-gray-600 session-btn-cancelled' : 'hover:bg-[var(--bg-subtle)] text-[var(--text-main)]'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <XCircle className="w-3 h-3 text-gray-400" />
                                                                                                        <span>Cancelled</span>
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}

                                                                                            {/* Delete button */}
                                                                                            <button
                                                                                                onClick={() => handleDeleteSession(session)}
                                                                                                title="Delete this session"
                                                                                                className="opacity-0 group-hover/card:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 rounded transition-opacity cursor-pointer shrink-0"
                                                                                            >
                                                                                                <Trash2 className="w-3 h-3" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer Guide */}
                            <div className="p-3 sm:p-4 bg-[var(--bg-subtle)]/50 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-[var(--text-main)]">Salary Policy:</span>
                                    <span>Each Taught or Make-up slot is credited towards your Total Salary</span>
                                    <span>•</span>
                                    <span>Cancelled slot is not credited</span>
                                    <span>•</span>
                                    <span className="text-[var(--accent)] font-semibold">Automatically added to Weekly & Monthly Total Salary</span>
                                </div>
                                <div className="text-[var(--text-muted)] text-[11px] opacity-80">
                                    Click any status badge to adjust session status directly
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW B: MONTHLY CALENDAR */}
                    {layoutMode === 'month' && (
                        <div className="bg-[var(--bg-card)] rounded-3xl p-3 sm:p-5 shadow-sm border border-[var(--border-color)] overflow-x-auto">
                            <div className="min-w-[850px] lg:min-w-[900px]">
                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
                                    {WEEK_DAYS_HEADER.map((col, index) => (
                                        <div
                                            key={index}
                                            className={`py-2 px-1 text-center rounded-xl border ${
                                                col.isWeekend
                                                    ? 'bg-[var(--accent-subtle)] border-[var(--border-color)] text-[var(--accent)] font-bold'
                                                    : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-main)] font-bold'
                                            }`}
                                        >
                                            <span className="text-xs uppercase">{col.label || col.en}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                    {monthCalendarDays.map((item) => {
                                        const daySessions = allCalendarSessionsByDate[item.dateKey] || [];
                                        const dayEarned = daySessions.reduce((sum, s) => {
                                            return sum + ((s.status === 'COMPLETED' || s.status === 'MAKE_UP') ? (s.rate || 60000) : 0);
                                        }, 0);

                                        return (
                                            <div
                                                key={item.dateKey}
                                                className={`rounded-2xl p-2 border min-h-[120px] sm:min-h-[140px] flex flex-col justify-between transition-all ${
                                                    item.isToday
                                                        ? 'bg-[var(--accent-subtle)]/30 border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-xs'
                                                        : item.isCurrentMonth
                                                            ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent)]/50'
                                                            : 'bg-[var(--bg-subtle)]/20 border-[var(--border-color)]/40 opacity-40'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className={`text-xs font-black ${item.isToday ? 'text-[var(--accent)] font-black' : 'text-[var(--text-main)]'}`}>
                                                            {item.dayNumber}
                                                        </span>
                                                        {daySessions.length > 0 && (
                                                            <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--bg-card)] px-1.5 py-0.2 rounded border border-[var(--border-color)]">
                                                                {dayEarned.toLocaleString('en-US')} VND
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1">
                                                        {daySessions.slice(0, 4).map(s => (
                                                            <div
                                                                key={s.id}
                                                                onClick={() => handleCycleStatus(s)}
                                                                title={`${s.className} (${s.timeRange || `${s.startTime} – ${s.endTime}`}) • ${s.location} • Status: ${s.status === 'COMPLETED' ? 'Taught' : s.status === 'MAKE_UP' ? 'Make-up' : s.status === 'CANCELLED' ? 'Cancelled' : 'Scheduled'}`}
                                                                className={`p-1 px-1.5 rounded-lg text-[10px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between gap-1 shadow-2xs ${
                                                                    s.status === 'COMPLETED' ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/40' :
                                                                    s.status === 'MAKE_UP' ? 'bg-purple-100 text-purple-700 session-btn-makeup border border-purple-200' :
                                                                    s.status === 'CANCELLED' ? 'bg-gray-100 text-gray-500 session-btn-cancelled line-through border border-gray-200' :
                                                                    'bg-amber-100 text-amber-800 session-btn-pending border border-amber-200'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1 min-w-0 truncate">
                                                                    <span className="text-[9px] opacity-75 font-mono shrink-0">{s.startTime}</span>
                                                                    <span className="truncate">{s.originalCode || s.className}</span>
                                                                </div>
                                                                <span className="shrink-0">
                                                                    {s.status === 'COMPLETED' ? (
                                                                        <CheckCircle2 className="w-3 h-3 text-pink-600 inline" />
                                                                    ) : s.status === 'MAKE_UP' ? (
                                                                        <RotateCcw className="w-3 h-3 text-purple-600 inline" />
                                                                    ) : s.status === 'CANCELLED' ? (
                                                                        <XCircle className="w-3 h-3 text-gray-400 inline" />
                                                                    ) : (
                                                                        <Clock className="w-3 h-3 text-amber-600 inline" />
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {daySessions.length > 4 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDayDetailPopup({
                                                                        dateKey: item.dateKey,
                                                                        dateLabel: item.dateKey,
                                                                        sessions: daySessions,
                                                                    });
                                                                }}
                                                                className="w-full text-[9px] text-pink-500 font-bold text-center hover:text-pink-700 hover:bg-pink-50 rounded py-0.5 transition-colors cursor-pointer"
                                                            >
                                                                +{daySessions.length - 4} more
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setEditingSession(null);
                                                        setInitialModalDate(item.dateKey);
                                                        setInitialModalSlot(null);
                                                        setIsFormModalOpen(true);
                                                    }}
                                                    className="w-full text-center py-0.5 text-[9px] text-gray-400 hover:text-pink-600 font-bold cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                                                >
                                                    + Add Slot
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW C: DETAILED RECORDS */}
                    {layoutMode === 'list' && (
                        <div className="bg-[var(--bg-card)] rounded-3xl p-4 sm:p-6 shadow-sm border border-[var(--border-color)] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                                <h3 className="font-bold text-[var(--text-main)] text-sm sm:text-base">
                                    Teaching Records for Month {selectedMonth}/{selectedYear} ({displayListSessions.length} slots)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleExportSalaryImage}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--accent-subtle)] transition-colors cursor-pointer shadow-xs"
                                        title="Export Payroll to Image"
                                    >
                                        <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                                        <span>Export Payroll Image</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExportExcel}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white font-bold text-xs hover:brightness-110 transition-colors cursor-pointer shadow-xs"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Export Excel</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase font-bold text-[10px] bg-[var(--bg-subtle)]">
                                            <th className="py-2.5 px-3">Date</th>
                                            <th className="py-2.5 px-3">Day</th>
                                            <th className="py-2.5 px-3">Time Slot</th>
                                            <th className="py-2.5 px-3">Class Name</th>
                                            <th className="py-2.5 px-3">Location</th>
                                            <th className="py-2.5 px-3 text-center">Status</th>
                                            <th className="py-2.5 px-3 text-right">Earnings</th>
                                            <th className="py-2.5 px-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {displayListSessions.map((s) => {
                                            const d = s.date ? new Date(s.date) : new Date();
                                            const isPaid = s.status === 'COMPLETED' || s.status === 'MAKE_UP';
                                            const amount = isPaid ? (s.rate || 60000) : 0;
                                            const dateDisplay = !isNaN(d.getTime())
                                                ? `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
                                                : (s.dateKey || '');

                                            return (
                                                <tr key={s.id} className="hover:bg-[var(--accent-subtle)]/20 transition-colors">
                                                    <td className="py-2 px-3 font-bold text-[var(--text-main)]">
                                                        {dateDisplay}
                                                    </td>
                                                    <td className="py-2 px-3 font-semibold text-[var(--text-muted)]">{s.dayOfWeek}</td>
                                                    <td className="py-2 px-3 font-mono font-bold text-[var(--accent)]">{s.startTime} - {s.endTime}</td>
                                                    <td className="py-2 px-3 font-bold text-[var(--text-main)]">{s.className}</td>
                                                    <td className="py-2 px-3 font-medium text-[var(--text-muted)]">{s.location}</td>
                                                    <td className="py-2 px-3 text-center">
                                                        <button
                                                            onClick={() => handleCycleStatus(s)}
                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer inline-flex items-center gap-1 border transition-all hover:scale-105 ${
                                                                s.status === 'COMPLETED' ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/40' :
                                                                s.status === 'MAKE_UP' ? 'bg-purple-100 text-purple-700 session-btn-makeup border border-purple-300' :
                                                                s.status === 'CANCELLED' ? 'bg-gray-100 text-gray-500 session-btn-cancelled line-through border border-gray-300' :
                                                                'bg-amber-100 text-amber-800 session-btn-pending border border-amber-300'
                                                            }`}
                                                        >
                                                            {s.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-pink-600 shrink-0" /> :
                                                             s.status === 'MAKE_UP' ? <RotateCcw className="w-3 h-3 text-purple-600 shrink-0" /> :
                                                             s.status === 'CANCELLED' ? <XCircle className="w-3 h-3 text-gray-400 shrink-0" /> :
                                                             <Clock className="w-3 h-3 text-amber-600 shrink-0" />}
                                                            <span>
                                                                {s.status === 'COMPLETED' ? 'Taught' :
                                                                 s.status === 'MAKE_UP' ? 'Make-up' :
                                                                 s.status === 'CANCELLED' ? 'Cancelled' : 'Scheduled'}
                                                            </span>
                                                        </button>
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-black text-[var(--accent)]">
                                                        {amount.toLocaleString('en-US')} VND
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <button
                                                            onClick={() => handleDeleteSession(s)}
                                                            className="p-1 text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Day Detail Popup — Monthly Calendar view */}
            {dayDetailPopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setDayDetailPopup(null)}
                >
                    <div
                        className="bg-[var(--bg-card)] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-[var(--border-color)]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
                            <div>
                                <p className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider">Ngày</p>
                                <h3 className="font-black text-[var(--text-main)] text-base">{dayDetailPopup.dateKey}</h3>
                            </div>
                            <button
                                onClick={() => setDayDetailPopup(null)}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Session list */}
                        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                            {dayDetailPopup.sessions.map(s => {
                                const statusConfig = {
                                    COMPLETED: { bg: 'bg-[var(--accent-subtle)]', text: 'text-[var(--accent)] font-black', border: 'border-[var(--accent)]/40', label: 'Đã dạy', icon: <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" /> },
                                    MAKE_UP:   { bg: 'bg-purple-100 session-btn-makeup', text: 'text-purple-700', border: 'border-purple-200', label: 'Học bù', icon: <RotateCcw className="w-3.5 h-3.5 text-purple-600" /> },
                                    CANCELLED: { bg: 'bg-gray-100 session-btn-cancelled', text: 'text-gray-500', border: 'border-gray-200', label: 'Huỷ', icon: <XCircle className="w-3.5 h-3.5 text-gray-400" /> },
                                    PENDING:   { bg: 'bg-amber-100 session-btn-pending', text: 'text-amber-800', border: 'border-amber-200', label: 'Lịch học', icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> },
                                };
                                const cfg = statusConfig[s.status] || statusConfig.PENDING;
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => {
                                            handleCycleStatus(s);
                                            // Update popup sessions list to reflect new status
                                            setDayDetailPopup(prev => ({
                                                ...prev,
                                                sessions: prev.sessions.map(ps =>
                                                    ps.id === s.id
                                                        ? { ...ps, status: ps.status === 'PENDING' ? 'COMPLETED' : ps.status === 'COMPLETED' ? 'MAKE_UP' : ps.status === 'MAKE_UP' ? 'CANCELLED' : 'PENDING' }
                                                        : ps
                                                )
                                            }));
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-sm ${cfg.bg} ${cfg.border}`}
                                    >
                                        <div className="shrink-0">{cfg.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-sm truncate ${cfg.text}`}>{s.originalCode || s.className}</p>
                                            <p className="text-[11px] text-gray-500 font-mono">{s.timeRange || `${s.startTime} – ${s.endTime}`}</p>
                                            {s.location && <p className="text-[10px] text-gray-400 truncate">{s.location}</p>}
                                        </div>
                                        <span className={`shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-subtle)]/50 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">{dayDetailPopup.sessions.length} lịch trong ngày</span>
                            <button
                                onClick={() => setDayDetailPopup(null)}
                                className="px-4 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:brightness-110 transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Session Form Modal (Create or Edit session) */}
            <SessionFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingSession(null);
                    setInitialModalDate(null);
                    setInitialModalSlot(null);
                }}
                onSave={handleSaveSession}
                sessionData={editingSession}
                initialDate={initialModalDate}
                initialSlot={initialModalSlot}
            />
        </div>
    );
};

export default SalaryAttendanceView;
