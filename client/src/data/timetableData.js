import * as XLSX from 'xlsx';

// Dữ liệu thời khóa biểu 18 ca học chuẩn xác cập nhật
export const DEFAULT_TIMETABLE_ITEMS = [
    {
        id: 1,
        dayOfWeek: 'Thứ 2',
        dayIndex: 1, // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '10 Cơ bản Long Thượng 1',
        originalCode: '10CB LT 1',
        grade: 10,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: 'LT 1',
        shift: 'Chiều' // Sáng | Chiều | Tối
    },
    {
        id: 2,
        dayOfWeek: 'Thứ 2',
        dayIndex: 1,
        timeRange: '18h45 – 20h15',
        startTime: '18:45',
        endTime: '20:15',
        className: '12 Nâng cao Long Thượng 2',
        originalCode: '12NC LT 2',
        grade: 12,
        level: 'Nâng cao',
        location: 'Long Thượng',
        group: 'LT 2',
        shift: 'Tối'
    },
    {
        id: 3,
        dayOfWeek: 'Thứ 3',
        dayIndex: 2,
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '10 Mỹ Lộc 1',
        originalCode: '10 ML 1',
        grade: 10,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML 1',
        shift: 'Chiều'
    },
    {
        id: 4,
        dayOfWeek: 'Thứ 3',
        dayIndex: 2,
        timeRange: '18h45 – 20h15',
        startTime: '18:45',
        endTime: '20:15',
        className: '12 Cơ bản Long Thượng 1',
        originalCode: '12CB LT 1',
        grade: 12,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: 'LT 1',
        shift: 'Tối'
    },
    {
        id: 5,
        dayOfWeek: 'Thứ 4',
        dayIndex: 3,
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '11 Mỹ Lộc Cơ bản',
        originalCode: '11 ML CB',
        grade: 11,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML CB',
        shift: 'Chiều'
    },
    {
        id: 6,
        dayOfWeek: 'Thứ 4',
        dayIndex: 3,
        timeRange: '18h45 – 20h15',
        startTime: '18:45',
        endTime: '20:15',
        className: '12 Nâng cao Mỹ Lộc',
        originalCode: '12NC ML',
        grade: 12,
        level: 'Nâng cao',
        location: 'Mỹ Lộc',
        group: 'ML',
        shift: 'Tối'
    },
    {
        id: 7,
        dayOfWeek: 'Thứ 5',
        dayIndex: 4,
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '10 Cơ bản Long Thượng 2',
        originalCode: '10CB LT 2',
        grade: 10,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: 'LT 2',
        shift: 'Chiều'
    },
    {
        id: 8,
        dayOfWeek: 'Thứ 5',
        dayIndex: 4,
        timeRange: '18h45 – 20h15',
        startTime: '18:45',
        endTime: '20:15',
        className: '12 Nâng cao Long Thượng 1',
        originalCode: '12NC LT 1',
        grade: 12,
        level: 'Nâng cao',
        location: 'Long Thượng',
        group: 'LT 1',
        shift: 'Tối'
    },
    {
        id: 9,
        dayOfWeek: 'Thứ 6',
        dayIndex: 5,
        timeRange: '16h45 – 18h15',
        startTime: '16:45',
        endTime: '18:15',
        className: '12 Cơ bản Mỹ Lộc',
        originalCode: '12CB ML',
        grade: 12,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML',
        shift: 'Chiều'
    },
    {
        id: 10,
        dayOfWeek: 'Thứ 6',
        dayIndex: 5,
        timeRange: '18h45 – 20h15',
        startTime: '18:45',
        endTime: '20:15',
        className: '11 Cơ bản Long Thượng 2',
        originalCode: '11CB LT 2',
        grade: 11,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: 'LT 2',
        shift: 'Tối'
    },
    {
        id: 11,
        dayOfWeek: 'Thứ 7',
        dayIndex: 6,
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '12 Cơ bản Mỹ Lộc',
        originalCode: '12CB ML',
        grade: 12,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML',
        shift: 'Chiều'
    },
    {
        id: 19,
        dayOfWeek: 'Thứ 7',
        dayIndex: 6,
        timeRange: '18h30 – 20h00',
        startTime: '18:30',
        endTime: '20:00',
        className: '12 Cơ bản Mỹ Lộc',
        originalCode: '12CB ML',
        grade: 12,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML',
        shift: 'Tối'
    },
    {
        id: 12,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '07h00 – 08h30',
        startTime: '07:00',
        endTime: '08:30',
        className: '12 Nâng cao Cơ bản Long Thượng',
        originalCode: '12 NC CB LT',
        grade: 12,
        level: 'Nâng cao & Cơ bản',
        location: 'Long Thượng',
        group: 'NC CB LT',
        shift: 'Sáng'
    },
    {
        id: 13,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '08h30 – 10h00',
        startTime: '08:30',
        endTime: '10:00',
        className: '10 Cơ bản Long Thượng 1',
        originalCode: '10CB 1',
        grade: 10,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: '10CB 1',
        shift: 'Sáng'
    },
    {
        id: 14,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '10h00 – 11h30',
        startTime: '10:00',
        endTime: '11:30',
        className: '12 Cơ bản Long Thượng 1',
        originalCode: '12CB LT 1',
        grade: 12,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: 'LT 1',
        shift: 'Sáng'
    },
    {
        id: 20,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '12h30 – 14h00',
        startTime: '12:30',
        endTime: '14:00',
        className: '10 Mỹ Lộc',
        originalCode: '10 ML',
        grade: 10,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: '10 ML',
        shift: 'Chiều'
    },
    {
        id: 15,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '14h00 – 15h30',
        startTime: '14:00',
        endTime: '15:30',
        className: '10 Long Thượng',
        originalCode: '10 LT',
        grade: 10,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: '10 LT',
        shift: 'Chiều'
    },
    {
        id: 16,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '15h30 – 17h00',
        startTime: '15:30',
        endTime: '17:00',
        className: '12 Cơ bản Long Thượng',
        originalCode: '12CB',
        grade: 12,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: '12CB',
        shift: 'Chiều'
    },
    {
        id: 17,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '17h00 – 18h30',
        startTime: '17:00',
        endTime: '18:30',
        className: '11 Mỹ Lộc Cơ bản',
        originalCode: '11 ML CB',
        grade: 11,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML CB',
        shift: 'Chiều'
    },
    {
        id: 18,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '18h30 – 20h00',
        startTime: '18:30',
        endTime: '20:00',
        className: '12 Nâng cao Mỹ Lộc',
        originalCode: '12NC ML',
        grade: 12,
        level: 'Nâng cao',
        location: 'Mỹ Lộc',
        group: 'ML',
        shift: 'Tối'
    }
];

export const DAYS_OF_WEEK = [
    { key: 'Thứ 2', label: 'Monday', labelEn: 'Monday', shortLabel: 'Mon', shortLabelEn: 'Mon', index: 1 },
    { key: 'Thứ 3', label: 'Tuesday', labelEn: 'Tuesday', shortLabel: 'Tue', shortLabelEn: 'Tue', index: 2 },
    { key: 'Thứ 4', label: 'Wednesday', labelEn: 'Wednesday', shortLabel: 'Wed', shortLabelEn: 'Wed', index: 3 },
    { key: 'Thứ 5', label: 'Thursday', labelEn: 'Thursday', shortLabel: 'Thu', shortLabelEn: 'Thu', index: 4 },
    { key: 'Thứ 6', label: 'Friday', labelEn: 'Friday', shortLabel: 'Fri', shortLabelEn: 'Fri', index: 5 },
    { key: 'Thứ 7', label: 'Saturday', labelEn: 'Saturday', shortLabel: 'Sat', shortLabelEn: 'Sat', index: 6, isWeekend: true },
    { key: 'Chủ nhật', label: 'Sunday', labelEn: 'Sunday', shortLabel: 'Sun', shortLabelEn: 'Sun', index: 0, isWeekend: true }
];

export const VI_TO_EN_DAY = {
    'Thứ 2': 'Monday',
    'Thứ 3': 'Tuesday',
    'Thứ 4': 'Wednesday',
    'Thứ 5': 'Thursday',
    'Thứ 6': 'Friday',
    'Thứ 7': 'Saturday',
    'Chủ nhật': 'Sunday',
    'Chủ Nhật': 'Sunday',
};

export const getDayLabelEn = (day) => VI_TO_EN_DAY[day] || day;

export const TIME_SLOTS_MATRIX = [
    { 
        id: 'slot_0700',
        slot: '07h00 – 08h30', 
        label: '07:00 – 08:30', 
        shift: 'Morning', 
        period: 'Slot 1 (Morning)',
        periodEn: 'Slot 1 (Morning)',
        startTimes: ['07:00']
    },
    { 
        id: 'slot_0830',
        slot: '08h30 – 10h00', 
        label: '08:30 – 10:00', 
        shift: 'Morning', 
        period: 'Slot 2 (Morning)',
        periodEn: 'Slot 2 (Morning)',
        startTimes: ['08:30']
    },
    { 
        id: 'slot_1000',
        slot: '10h00 – 11h30', 
        label: '10:00 – 11:30', 
        shift: 'Morning', 
        period: 'Slot 3 (Morning)',
        periodEn: 'Slot 3 (Morning)',
        startTimes: ['10:00']
    },
    { 
        id: 'slot_1230',
        slot: '12h30 – 14h00', 
        label: '12:30 – 14:00', 
        shift: 'Afternoon', 
        period: 'Noon / Early Afternoon (12:30 - 2:00 PM)',
        periodEn: 'Noon / Early Afternoon (12:30 - 2:00 PM)',
        startTimes: ['12:30']
    },
    { 
        id: 'slot_1400',
        slot: '14h00 – 15h30', 
        label: '14:00 – 15:30', 
        shift: 'Afternoon', 
        period: 'Afternoon 1 (2:00 - 3:30 PM)',
        periodEn: 'Afternoon 1 (2:00 - 3:30 PM)',
        startTimes: ['14:00']
    },
    { 
        id: 'slot_1530',
        slot: '15h30 – 17h00', 
        label: '15:30 – 17:00', 
        shift: 'Afternoon', 
        period: 'Afternoon 2 (3:30 - 5:00 PM)',
        periodEn: 'Afternoon 2 (3:30 - 5:00 PM)',
        startTimes: ['15:30']
    },
    { 
        id: 'slot_1700',
        slot: '17h00 – 18h30', 
        label: '17:00 – 18:30', 
        shift: 'Afternoon', 
        period: 'Afternoon (5:00 - 6:30 PM)',
        periodEn: 'Afternoon (5:00 - 6:30 PM)',
        startTimes: ['16:45', '17:00']
    },
    { 
        id: 'slot_1845',
        slot: '18h45 – 20h15', 
        label: '18:45 – 20:15 / 18:30 – 20:00', 
        shift: 'Evening', 
        period: 'Evening (6:45 - 8:15 PM)',
        periodEn: 'Evening (6:45 - 8:15 PM)',
        startTimes: ['18:30', '18:45']
    },
    { 
        id: 'slot_1930',
        slot: '19h30 – 21h00', 
        label: '19:30 – 21:00', 
        shift: 'Evening', 
        period: 'Late Evening (7:30 - 9:00 PM)',
        periodEn: 'Late Evening (7:30 - 9:00 PM)',
        startTimes: ['19:30']
    }
];

export const GRADE_CONFIG = {
    10: {
        label: 'Grade 10',
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
        cardBg: 'from-emerald-50 to-teal-50/50',
        borderLeft: 'border-l-emerald-500',
        accentColor: '#10b981',
        pillColor: 'bg-emerald-500',
        ringColor: 'ring-emerald-400',
        // Dark theme overrides
        darkCardBg: 'bg-[rgba(6,78,59,0.5)]',
        darkBadgeBg: 'bg-[rgba(16,185,129,0.2)]',
        darkBadgeText: 'text-emerald-300',
        darkLegendText: 'text-emerald-300'
    },
    11: {
        label: 'Grade 11',
        badgeBg: 'bg-indigo-500/15',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
        cardBg: 'from-indigo-50 to-violet-50/50',
        borderLeft: 'border-l-indigo-500',
        accentColor: '#6366f1',
        pillColor: 'bg-indigo-500',
        ringColor: 'ring-indigo-400',
        // Dark theme overrides
        darkCardBg: 'bg-[rgba(49,46,129,0.5)]',
        darkBadgeBg: 'bg-[rgba(99,102,241,0.2)]',
        darkBadgeText: 'text-indigo-300',
        darkLegendText: 'text-indigo-300'
    },
    12: {
        label: 'Grade 12',
        badgeBg: 'grade-badge-config-12',
        badgeText: '',
        badgeBorder: 'border-amber-300',
        cardBg: 'from-pink-50 to-pink-100',
        borderLeft: 'border-l-pink-500',
        accentColor: '#ec4899',
        pillColor: 'grade-icon-12',
        ringColor: 'ring-pink-400',
        // Dark theme overrides
        darkCardBg: 'bg-[rgba(136,19,55,0.5)]',
        darkBadgeBg: 'bg-[rgba(217,119,6,0.28)]',
        darkBadgeText: 'text-amber-200',
        darkLegendText: 'text-pink-300'
    }
};

export const LOCATION_CONFIG = {
    'Long Thượng': {
        short: 'LT',
        label: 'Long Thượng',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        marker: 'bg-blue-500'
    },
    'Mỹ Lộc': {
        short: 'ML',
        label: 'Mỹ Lộc',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        marker: 'bg-amber-500'
    }
};

export const LEVEL_CONFIG = {
    'Cơ bản': {
        label: 'Basic',
        color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    'Nâng cao': {
        label: 'Advanced',
        color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    'Nâng cao & Cơ bản': {
        label: 'Advanced & Basic',
        color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
    }
};

// Phân tích trạng thái hiện tại (Đang diễn ra / Tiếp theo)
export function getLiveScheduleStatus(timetableItems, now = new Date()) {
    const currentDayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    let activeClass = null;
    let nextClass = null;
    let upcomingMinutes = Infinity;

    timetableItems.forEach(item => {
        const [startH, startM] = item.startTime.split(':').map(Number);
        const [endH, endM] = item.endTime.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        if (item.dayIndex === currentDayIndex) {
            // Check if class is currently in progress
            if (currentTimeInMinutes >= startTotal && currentTimeInMinutes <= endTotal) {
                activeClass = {
                    ...item,
                    minutesRemaining: endTotal - currentTimeInMinutes
                };
            }
            // Check if it's upcoming today
            if (currentTimeInMinutes < startTotal) {
                const diff = startTotal - currentTimeInMinutes;
                if (diff < upcomingMinutes) {
                    upcomingMinutes = diff;
                    nextClass = {
                        ...item,
                        minutesUntil: diff,
                        isToday: true
                    };
                }
            }
        }
    });

    // If no upcoming class today, find the earliest class tomorrow or next days
    if (!activeClass && !nextClass && timetableItems.length > 0) {
        for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
            const checkDayIndex = (currentDayIndex + dayOffset) % 7;
            const itemsOnDay = timetableItems
                .filter(it => it.dayIndex === checkDayIndex)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
            if (itemsOnDay.length > 0) {
                nextClass = {
                    ...itemsOnDay[0],
                    dayOffset,
                    isToday: false
                };
                break;
            }
        }
    }

    return { activeClass, nextClass };
}

// Check if a teaching session's scheduled time has already passed
export function isSessionPassed(date, endTime, startTime) {
    if (!date) return false;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const d = new Date(date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    // Same day: compare current hour/minute to session end time
    const currentMins = now.getHours() * 60 + now.getMinutes();
    let endMins = 0;
    if (endTime && endTime.includes(':')) {
        const [h, m] = endTime.split(':').map(Number);
        endMins = h * 60 + m;
    } else if (startTime && startTime.includes(':')) {
        const [h, m] = startTime.split(':').map(Number);
        endMins = h * 60 + m + 90;
    } else {
        return false;
    }
    return currentMins >= endMins;
}

// Xuất file Excel từ danh sách TKB
export function exportTimetableToExcel(timetableItems, filename = 'Teaching_Timetable_Schedule.xlsx') {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Detailed List
    const detailRows = [
        ['TEACHING TIMETABLE SCHEDULE (UPDATED SAT & SUN)'],
        ['Conventions: CB: Basic | NC: Advanced | LT: Long Thuong | ML / NL: My Loc'],
        [],
        ['No.', 'Day', 'Time Slot', 'Class (Full Name)', 'Original Code', 'Grade', 'Level', 'Location', 'Shift']
    ];

    timetableItems.forEach((item, index) => {
        detailRows.push([
            index + 1,
            item.dayOfWeek,
            item.timeRange,
            item.className,
            item.originalCode,
            `Grade ${item.grade}`,
            item.level,
            item.location,
            item.shift
        ]);
    });

    const wsDetail = XLSX.utils.aoa_to_sheet(detailRows);
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Detailed Schedule');

    // Sheet 2: Saturday & Sunday Focus
    const weekendRows = [
        ['WEEKEND SCHEDULE (SATURDAY & SUNDAY)'],
        [],
        ['No.', 'Day', 'Time Slot', 'Class Name', 'Original Code', 'Location']
    ];

    const weekendItems = timetableItems
        .filter(item => item.dayIndex === 6 || item.dayIndex === 0)
        .sort((a, b) => {
            if (a.dayIndex !== b.dayIndex) return b.dayIndex - a.dayIndex; // T7 first, CN second
            return a.startTime.localeCompare(b.startTime);
        });

    weekendItems.forEach((item, idx) => {
        weekendRows.push([
            idx + 1,
            item.dayOfWeek,
            item.timeRange,
            item.className,
            item.originalCode,
            item.location
        ]);
    });

    const wsWeekend = XLSX.utils.aoa_to_sheet(weekendRows);
    XLSX.utils.book_append_sheet(wb, wsWeekend, 'Sat & Sun Schedule');

    // Save File
    XLSX.writeFile(wb, filename);
}

// Đọc và phân tích file Excel TKB do người dùng tải lên
export function parseUploadedTimetableExcel(fileBuffer) {
    const wb = XLSX.read(fileBuffer, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    const parsedItems = [];
    let startRow = -1;

    for (let r = 0; r < rawData.length; r++) {
        const row = rawData[r];
        if (row.some(cell => String(cell).includes('Khung giờ') || String(cell).includes('Lớp học') || String(cell).includes('Thứ'))) {
            startRow = r + 1;
            break;
        }
    }

    if (startRow === -1) startRow = 3;

    for (let r = startRow; r < rawData.length; r++) {
        const row = rawData[r];
        if (!row || row.length < 3 || !row[1] || !row[2]) continue;

        const dayStr = String(row[1]).trim();
        const timeStr = String(row[2]).trim();
        const classStr = String(row[3] || row[2] || '').trim();
        const codeStr = String(row[4] || '').trim();

        if (!dayStr || !timeStr || !classStr) continue;

        let dayIndex = 1;
        if (dayStr.toLowerCase().includes('chủ') || dayStr.toLowerCase().includes('cn')) dayIndex = 0;
        else if (dayStr.includes('2')) dayIndex = 1;
        else if (dayStr.includes('3')) dayIndex = 2;
        else if (dayStr.includes('4')) dayIndex = 3;
        else if (dayStr.includes('5')) dayIndex = 4;
        else if (dayStr.includes('6')) dayIndex = 5;
        else if (dayStr.includes('7')) dayIndex = 6;

        let grade = 10;
        if (classStr.includes('11') || codeStr.includes('11')) grade = 11;
        else if (classStr.includes('12') || codeStr.includes('12')) grade = 12;

        let level = 'Cơ bản';
        if (classStr.toLowerCase().includes('nâng cao') || codeStr.toLowerCase().includes('nc')) {
            level = classStr.toLowerCase().includes('cơ bản') ? 'Nâng cao & Cơ bản' : 'Nâng cao';
        }

        let location = 'Long Thượng';
        if (classStr.toLowerCase().includes('mỹ lộc') || codeStr.toLowerCase().includes('ml') || codeStr.toLowerCase().includes('nl')) {
            location = 'Mỹ Lộc';
        }

        let startTime = '17:00';
        let endTime = '18:30';
        const timeMatch = timeStr.match(/(\d{1,2})h(\d{2})?\s*[–-]\s*(\d{1,2})h(\d{2})?/i);
        if (timeMatch) {
            startTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}`;
            endTime = `${timeMatch[3].padStart(2, '0')}:${timeMatch[4] || '00'}`;
        }

        let shift = 'Chiều';
        const startHour = parseInt(startTime.split(':')[0], 10);
        if (startHour < 12) shift = 'Sáng';
        else if (startHour >= 18) shift = 'Tối';

        parsedItems.push({
            id: parsedItems.length + 1,
            dayOfWeek: dayStr,
            dayIndex,
            timeRange: timeStr,
            startTime,
            endTime,
            className: classStr,
            originalCode: codeStr || classStr,
            grade,
            level,
            location,
            group: codeStr,
            shift
        });
    }

    return parsedItems.length > 0 ? parsedItems : null;
}

// Xuất file Excel báo cáo mức lương tổng cả tháng và số ca dạy
export function exportPayrollToExcel(sessions = [], summary = {}, filename) {
    const wb = XLSX.utils.book_new();

    let month = summary?.month;
    let year = summary?.year;
    if (!month || !year) {
        const validDate = sessions.find(s => s.date)?.date;
        const d = validDate ? new Date(validDate) : new Date();
        if (!month) month = d.getMonth() + 1;
        if (!year) year = d.getFullYear();
    }

    const completedCount = summary?.completed ?? summary?.completedCount ?? sessions.filter(s => s.status === 'COMPLETED').length;
    const makeupCount = summary?.makeup ?? summary?.makeupCount ?? sessions.filter(s => s.status === 'MAKE_UP').length;
    const paidCount = summary?.paidCount ?? summary?.paidSessionsCount ?? (completedCount + makeupCount);

    const totalEarnings = summary?.earned ?? summary?.totalEarnings ?? sessions.reduce((acc, s) => {
        if (s.status === 'COMPLETED' || s.status === 'MAKE_UP') {
            return acc + (s.rate || 60000);
        }
        return acc;
    }, 0);

    const fname = filename || `Bao_Cao_Luong_Thang_${month}_${year}.xlsx`;

    const reportRows = [
        ['BÁO CÁO LƯƠNG GIẢNG DẠY'],
        [`Tháng ${month} / ${year}`],
        [],
        ['Thông tin', 'Giá trị', 'Đơn vị tính'],
        ['Số ca dạy trong tháng', paidCount, 'Ca'],
        ['Mức lương tổng cả tháng', (totalEarnings || 0).toLocaleString('vi-VN') + ' đ', 'VNĐ']
    ];

    const wsReport = XLSX.utils.aoa_to_sheet(reportRows);

    // Set column widths for readability
    wsReport['!cols'] = [
        { wch: 28 },
        { wch: 22 },
        { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, wsReport, 'Báo Cáo Lương');
    XLSX.writeFile(wb, fname);
}

// Hàm vẽ hình chữ nhật bo góc tương thích mọi trình duyệt
function drawRoundRect(ctx, x, y, width, height, radius, fill = true, stroke = false) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

// Xuất thẻ ảnh PNG chất lượng cao cho Tổng Lương và Số ca dạy
export function exportSalaryAsImage(sessions = [], summary = {}, filename) {
    let month = summary?.month;
    let year = summary?.year;
    if (!month || !year) {
        const validDate = sessions.find(s => s.date)?.date;
        const d = validDate ? new Date(validDate) : new Date();
        if (!month) month = d.getMonth() + 1;
        if (!year) year = d.getFullYear();
    }

    const completedCount = summary?.completed ?? summary?.completedCount ?? sessions.filter(s => s.status === 'COMPLETED').length;
    const makeupCount = summary?.makeup ?? summary?.makeupCount ?? sessions.filter(s => s.status === 'MAKE_UP').length;
    const paidCount = summary?.paidCount ?? summary?.paidSessionsCount ?? (completedCount + makeupCount);

    const totalEarnings = summary?.earned ?? summary?.totalEarnings ?? sessions.reduce((acc, s) => {
        if (s.status === 'COMPLETED' || s.status === 'MAKE_UP') {
            return acc + (s.rate || 60000);
        }
        return acc;
    }, 0);

    const fname = filename || `Tong_Luong_Thang_${month}_${year}.png`;

    const canvas = document.createElement('canvas');
    const width = 960;
    const height = 540;
    const scale = 2; // 2x Retina / Full HD 1920x1080
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // 1. Nền đen obsidian sang trọng theo phong cách monochrome chuyên nghiệp
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#1c1c20'); // Graphite dark zinc
    bgGrad.addColorStop(0.5, '#111114'); // Deep zinc
    bgGrad.addColorStop(1, '#09090b'); // Pure obsidian black
    ctx.fillStyle = bgGrad;
    drawRoundRect(ctx, 0, 0, width, height, 32, true, false);

    // Viền khung ngoài thanh lịch
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, 1, 1, width - 2, height - 2, 31, false, true);

    // Họa tiết ánh sáng mềm đơn sắc (ambient glow)
    const rad1 = ctx.createRadialGradient(820, 90, 10, 820, 90, 260);
    rad1.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    rad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rad1;
    ctx.beginPath();
    ctx.arc(820, 90, 260, 0, Math.PI * 2);
    ctx.fill();

    const rad2 = ctx.createRadialGradient(100, 480, 10, 100, 480, 220);
    rad2.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    rad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rad2;
    ctx.beginPath();
    ctx.arc(100, 480, 220, 0, Math.PI * 2);
    ctx.fill();

    // 2. Header
    // Badge danh mục
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 48, 44, 260, 36, 18, true, true);
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('✦ BÁO CÁO THU NHẬP DẠY HỌC', 64, 66);

    // Tiêu đề Tháng / Năm
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`THÁNG ${month} / ${year}`, 330, 69);

    // Ngày xuất
    const todayStr = new Date().toLocaleDateString('vi-VN');
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Ngày xuất: ${todayStr}`, width - 48, 67);
    ctx.textAlign = 'left';

    // Đường kẻ phân cách
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, 100);
    ctx.lineTo(width - 48, 100);
    ctx.stroke();

    // 3. Khối Hero: Mức Lương Tổng Cả Tháng (Dark glassmorphism cao cấp)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, 48, 122, width - 96, 140, 22, true, true);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TỔNG MỨC LƯƠNG CẢ THÁNG (THỰC NHẬN)', 76, 158);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${(totalEarnings || 0).toLocaleString('vi-VN')} đ`, 76, 226);

    // Huy hiệu Xác nhận ở góc phải ô Hero: Nền trắng chữ đen tương phản mạnh
    ctx.fillStyle = '#ffffff';
    drawRoundRect(ctx, width - 212, 168, 136, 36, 18, true, false);
    ctx.fillStyle = '#09090b';
    ctx.font = '900 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('✓ ĐÃ XÁC NHẬN', width - 196, 190);

    // 4. Thẻ Chi Tiết Dưới: Số ca dạy trong tháng (Nền trắng tinh khiết, chữ đen bóng bẩy)
    const cardWidth = width - 96;
    const cardHeight = 140;
    const cardY = 284;

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
    drawRoundRect(ctx, 48, cardY, cardWidth, cardHeight, 20, true, false);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Tiêu đề & Giá trị Số ca dạy
    ctx.fillStyle = '#52525b';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SỐ CA DẠY TRONG THÁNG', 76, cardY + 38);

    ctx.fillStyle = '#09090b';
    ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${paidCount} Ca`, 76, cardY + 92);

    ctx.fillStyle = '#71717a';
    ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const subBreakdown = makeupCount > 0 
        ? `${completedCount} ca dạy chính + ${makeupCount} ca dạy bù` 
        : `${completedCount} ca dạy hoàn thành`;
    ctx.fillText(subBreakdown, 76, cardY + 120);

    // Huy hiệu thống kê bên phải thẻ Số ca dạy (Monochrome)
    if (makeupCount > 0) {
        // Pill 1: Ca chính (Xám nhạt)
        ctx.fillStyle = '#f4f4f5';
        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 1;
        drawRoundRect(ctx, width - 48 - 290, cardY + 38, 130, 64, 14, true, true);
        ctx.fillStyle = '#71717a';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('CA DẠY CHÍNH', width - 48 - 275, cardY + 58);
        ctx.fillStyle = '#09090b';
        ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`${completedCount} Ca`, width - 48 - 275, cardY + 88);

        // Pill 2: Ca bù (Đen tương phản)
        ctx.fillStyle = '#09090b';
        drawRoundRect(ctx, width - 48 - 146, cardY + 38, 126, 64, 14, true, false);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('CA DẠY BÙ', width - 48 - 131, cardY + 58);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`+${makeupCount} Ca`, width - 48 - 131, cardY + 88);
    } else {
        // Pill: Đã hoàn thành 100% (Monochrome tinh giản)
        ctx.fillStyle = '#f4f4f5';
        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 1;
        drawRoundRect(ctx, width - 48 - 220, cardY + 40, 200, 60, 14, true, true);
        ctx.fillStyle = '#71717a';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('TRẠNG THÁI CA DẠY', width - 48 - 200, cardY + 60);
        ctx.fillStyle = '#09090b';
        ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('✓ Hoàn thành 100%', width - 48 - 200, cardY + 86);
    }

    // 5. Chân trang Footer
    ctx.fillStyle = '#71717a';
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Task Manager • Teaching Schedule & Payroll', 48, height - 32);

    ctx.fillStyle = '#a1a1aa';
    ctx.textAlign = 'right';
    ctx.fillText('Bản tổng kết mức lương chính thức', width - 48, height - 32);
    ctx.textAlign = 'left';

    // 6. Tải ảnh về máy
    canvas.toBlob((blob) => {
        if (!blob) {
            const link = document.createElement('a');
            link.download = fname;
            link.href = canvas.toDataURL('image/png');
            link.click();
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fname;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
}
