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
        ringColor: 'ring-emerald-400'
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
        ringColor: 'ring-indigo-400'
    },
    12: {
        label: 'Grade 12',
        badgeBg: 'bg-pink-100',
        badgeText: 'text-pink-700',
        badgeBorder: 'border-pink-200',
        cardBg: 'from-pink-50 to-pink-100',
        borderLeft: 'border-l-pink-500',
        accentColor: '#ec4899',
        pillColor: 'bg-pink-500',
        ringColor: 'ring-pink-400'
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

// Xuất file Excel bảng kê chấm công và tiền dạy học
export function exportPayrollToExcel(sessions, summary, filename) {
    const wb = XLSX.utils.book_new();
    const fname = filename || `Bang_Ke_Thu_Nhap_Day_Hoc_Thang_${summary?.month || 1}_${summary?.year || 2026}.xlsx`;

    const summaryRows = [
        ['BẢNG TỔNG HỢP CHẤM CÔNG & TIỀN DẠY HỌC'],
        [`Tháng ${summary?.month || ''} / ${summary?.year || ''}`],
        [],
        ['Chỉ số', 'Giá trị', 'Đơn vị tính'],
        ['Đơn giá chuẩn / ca', (summary?.defaultRate || 60000).toLocaleString('vi-VN') + ' đ', 'VNĐ / ca'],
        ['Tổng số ca trong tháng', summary?.totalCount || 0, 'Ca'],
        ['Số ca đã dạy hoàn thành', summary?.completedCount || 0, 'Ca'],
        ['Số ca dạy bù / tăng cường', summary?.makeupCount || 0, 'Ca'],
        ['Số ca báo nghỉ / hủy', summary?.cancelledCount || 0, 'Ca'],
        ['Số ca sắp diễn ra (Pending)', summary?.pendingCount || 0, 'Ca'],
        ['Tỷ lệ hoàn thành thực dạy', `${summary?.completionRate || 0}%`, 'Phần trăm'],
        ['TỔNG TIỀN THỰC NHẬN (Đã dạy + Bù)', (summary?.totalEarnings || 0).toLocaleString('vi-VN') + ' đ', 'VNĐ'],
        ['Thu nhập dự kiến toàn bộ tháng', (summary?.expectedEarnings || 0).toLocaleString('vi-VN') + ' đ', 'VNĐ'],
        []
    ];

    const detailRows = [
        ['DANH SÁCH CHI TIẾT CÁC CA DẠY'],
        [],
        ['STT', 'Ngày', 'Thứ', 'Khung giờ', 'Tên lớp', 'Khối', 'Cơ sở', 'Trạng thái', 'Đơn giá (đ)', 'Thành tiền (đ)', 'Ghi chú']
    ];

    sessions.forEach((s, idx) => {
        const dateStr = new Date(s.date).toLocaleDateString('vi-VN');
        const isPaid = s.status === 'COMPLETED' || s.status === 'MAKE_UP';
        const amount = isPaid ? (s.rate || 60000) : 0;
        let statusText = 'Scheduled';
        if (s.status === 'COMPLETED') statusText = 'Taught';
        else if (s.status === 'CANCELLED') statusText = 'Cancelled';
        else if (s.status === 'MAKE_UP') statusText = 'Make-up';

        detailRows.push([
            idx + 1,
            dateStr,
            s.dayOfWeek || '',
            s.timeRange || `${s.startTime} - ${s.endTime}`,
            s.className || '',
            s.grade ? `Khối ${s.grade}` : '',
            s.location || '',
            statusText,
            s.rate || 60000,
            amount,
            s.note || ''
        ]);
    });

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    const wsDetail = XLSX.utils.aoa_to_sheet(detailRows);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Hợp Thu Nhập');
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Chi Tiết Ca Dạy');

    XLSX.writeFile(wb, fname);
}
