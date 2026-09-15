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
        originalCode: '12NC NL (ML)',
        grade: 12,
        level: 'Nâng cao',
        location: 'Mỹ Lộc',
        group: 'NL (ML)',
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
        timeRange: '19h30 – 21h00',
        startTime: '19:30',
        endTime: '21:00',
        className: '12 Cơ bản Mỹ Lộc',
        originalCode: 'ML 12CB',
        grade: 12,
        level: 'Cơ bản',
        location: 'Mỹ Lộc',
        group: 'ML 12CB',
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
        id: 15,
        dayOfWeek: 'Chủ nhật',
        dayIndex: 0,
        timeRange: '14h00 – 15h30',
        startTime: '14:00',
        endTime: '15:30',
        className: '10 Cơ bản Long Thượng 2',
        originalCode: '10CB 2',
        grade: 10,
        level: 'Cơ bản',
        location: 'Long Thượng',
        group: '10CB 2',
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

export const TIME_SLOTS_MATRIX = [
    { 
        id: 'slot_0700',
        slot: '07h00 – 08h30', 
        label: '07:00 – 08:30', 
        shift: 'Sáng', 
        period: 'Ca 1 (Sáng)',
        periodEn: 'Slot 1 (Morning)',
        startTimes: ['07:00']
    },
    { 
        id: 'slot_0830',
        slot: '08h30 – 10h00', 
        label: '08:30 – 10:00', 
        shift: 'Sáng', 
        period: 'Ca 2 (Sáng)',
        periodEn: 'Slot 2 (Morning)',
        startTimes: ['08:30']
    },
    { 
        id: 'slot_1000',
        slot: '10h00 – 11h30', 
        label: '10:00 – 11:30', 
        shift: 'Sáng', 
        period: 'Ca 3 (Sáng)',
        periodEn: 'Slot 3 (Morning)',
        startTimes: ['10:00']
    },
    { 
        id: 'slot_1400',
        slot: '14h00 – 15h30', 
        label: '14:00 – 15:30', 
        shift: 'Chiều', 
        period: 'Ca Chiều 1 (2h - 3h30)',
        periodEn: 'Afternoon 1 (2:00 - 3:30 PM)',
        startTimes: ['14:00']
    },
    { 
        id: 'slot_1530',
        slot: '15h30 – 17h00', 
        label: '15:30 – 17:00', 
        shift: 'Chiều', 
        period: 'Ca Chiều 2 (3h30 - 5h)',
        periodEn: 'Afternoon 2 (3:30 - 5:00 PM)',
        startTimes: ['15:30']
    },
    { 
        id: 'slot_1700',
        slot: '17h00 – 18h30', 
        label: '17:00 – 18:30', 
        shift: 'Chiều', 
        period: 'Ca Chiều (5h - 6h30)',
        periodEn: 'Afternoon (5:00 - 6:30 PM)',
        startTimes: ['16:45', '17:00']
    },
    { 
        id: 'slot_1845',
        slot: '18h45 – 20h15', 
        label: '18:45 – 20:15 / 18:30 – 20:00', 
        shift: 'Tối', 
        period: 'Ca Tối (6h45 - 8h15)',
        periodEn: 'Evening (6:45 - 8:15 PM)',
        startTimes: ['18:30', '18:45']
    },
    { 
        id: 'slot_1930',
        slot: '19h30 – 21h00', 
        label: '19:30 – 21:00', 
        shift: 'Tối', 
        period: 'Ca Tối muộn (7h30 - 9h)',
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
        badgeBg: 'bg-rose-500/15',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        cardBg: 'from-rose-50 to-pink-50/50',
        borderLeft: 'border-l-rose-500',
        accentColor: '#f43f5e',
        pillColor: 'bg-rose-500',
        ringColor: 'ring-rose-400'
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
