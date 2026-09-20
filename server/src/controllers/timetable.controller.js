import prisma from "../config/db.js";

const DEFAULT_TIMETABLE_SEED = [
    { dayOfWeek: 'Thứ 2', dayIndex: 1, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '10 Cơ bản Long Thượng 1', originalCode: '10CB LT 1', grade: 10, level: 'Cơ bản', location: 'Long Thượng', group: 'LT 1', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 2', dayIndex: 1, timeRange: '18h45 – 20h15', startTime: '18:45', endTime: '20:15', className: '12 Nâng cao Long Thượng 2', originalCode: '12NC LT 2', grade: 12, level: 'Nâng cao', location: 'Long Thượng', group: 'LT 2', shift: 'Tối' },
    { dayOfWeek: 'Thứ 3', dayIndex: 2, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '10 Mỹ Lộc 1', originalCode: '10 ML 1', grade: 10, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML 1', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 3', dayIndex: 2, timeRange: '18h45 – 20h15', startTime: '18:45', endTime: '20:15', className: '12 Cơ bản Long Thượng 1', originalCode: '12CB LT 1', grade: 12, level: 'Cơ bản', location: 'Long Thượng', group: 'LT 1', shift: 'Tối' },
    { dayOfWeek: 'Thứ 4', dayIndex: 3, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '11 Mỹ Lộc Cơ bản', originalCode: '11 ML CB', grade: 11, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML CB', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 4', dayIndex: 3, timeRange: '18h45 – 20h15', startTime: '18:45', endTime: '20:15', className: '12 Nâng cao Mỹ Lộc', originalCode: '12NC ML', grade: 12, level: 'Nâng cao', location: 'Mỹ Lộc', group: 'ML', shift: 'Tối' },
    { dayOfWeek: 'Thứ 5', dayIndex: 4, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '10 Cơ bản Long Thượng 2', originalCode: '10CB LT 2', grade: 10, level: 'Cơ bản', location: 'Long Thượng', group: 'LT 2', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 5', dayIndex: 4, timeRange: '18h45 – 20h15', startTime: '18:45', endTime: '20:15', className: '12 Nâng cao Long Thượng 1', originalCode: '12NC LT 1', grade: 12, level: 'Nâng cao', location: 'Long Thượng', group: 'LT 1', shift: 'Tối' },
    { dayOfWeek: 'Thứ 6', dayIndex: 5, timeRange: '16h45 – 18h15', startTime: '16:45', endTime: '18:15', className: '12 Cơ bản Mỹ Lộc', originalCode: '12CB ML', grade: 12, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 6', dayIndex: 5, timeRange: '18h45 – 20h15', startTime: '18:45', endTime: '20:15', className: '11 Cơ bản Long Thượng 2', originalCode: '11CB LT 2', grade: 11, level: 'Cơ bản', location: 'Long Thượng', group: 'LT 2', shift: 'Tối' },
    { dayOfWeek: 'Thứ 7', dayIndex: 6, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '12 Cơ bản Mỹ Lộc', originalCode: '12CB ML', grade: 12, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML', shift: 'Chiều' },
    { dayOfWeek: 'Thứ 7', dayIndex: 6, timeRange: '18h30 – 20h00', startTime: '18:30', endTime: '20:00', className: '12 Cơ bản Mỹ Lộc', originalCode: '12CB ML', grade: 12, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML', shift: 'Tối' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '07h00 – 08h30', startTime: '07:00', endTime: '08:30', className: '12 Nâng cao Cơ bản Long Thượng', originalCode: '12 NC CB LT', grade: 12, level: 'Nâng cao & Cơ bản', location: 'Long Thượng', group: 'NC CB LT', shift: 'Sáng' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '08h30 – 10h00', startTime: '08:30', endTime: '10:00', className: '10 Cơ bản Long Thượng 1', originalCode: '10CB 1', grade: 10, level: 'Cơ bản', location: 'Long Thượng', group: '10CB 1', shift: 'Sáng' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '10h00 – 11h30', startTime: '10:00', endTime: '11:30', className: '12 Cơ bản Long Thượng 1', originalCode: '12CB LT 1', grade: 12, level: 'Cơ bản', location: 'Long Thượng', group: 'LT 1', shift: 'Sáng' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '12h30 – 14h00', startTime: '12:30', endTime: '14:00', className: '10 Mỹ Lộc', originalCode: '10 ML', grade: 10, level: 'Cơ bản', location: 'Mỹ Lộc', group: '10 ML', shift: 'Chiều' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '14h00 – 15h30', startTime: '14:00', endTime: '15:30', className: '10 Long Thượng', originalCode: '10 LT', grade: 10, level: 'Cơ bản', location: 'Long Thượng', group: '10 LT', shift: 'Chiều' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '15h30 – 17h00', startTime: '15:30', endTime: '17:00', className: '12 Cơ bản Long Thượng', originalCode: '12CB', grade: 12, level: 'Cơ bản', location: 'Long Thượng', group: '12CB', shift: 'Chiều' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '17h00 – 18h30', startTime: '17:00', endTime: '18:30', className: '11 Mỹ Lộc Cơ bản', originalCode: '11 ML CB', grade: 11, level: 'Cơ bản', location: 'Mỹ Lộc', group: 'ML CB', shift: 'Chiều' },
    { dayOfWeek: 'Chủ nhật', dayIndex: 0, timeRange: '18h30 – 20h00', startTime: '18:30', endTime: '20:00', className: '12 Nâng cao Mỹ Lộc', originalCode: '12NC ML', grade: 12, level: 'Nâng cao', location: 'Mỹ Lộc', group: 'ML', shift: 'Tối' }
];

// Lấy toàn bộ thời khóa biểu của người dùng
export const getTimetable = async (req, res) => {
    try {
        const userId = req.user.userId;

        let items = await prisma.timetableItem.findMany({
            where: { userId },
            orderBy: [
                { dayIndex: 'asc' },
                { startTime: 'asc' }
            ]
        });

        // Nếu người dùng chưa có ca học nào trong DB, tự động khởi tạo theo bộ seed mặc định
        if (items.length === 0) {
            const seedData = DEFAULT_TIMETABLE_SEED.map(item => ({
                ...item,
                userId
            }));

            await prisma.timetableItem.createMany({
                data: seedData
            });

            items = await prisma.timetableItem.findMany({
                where: { userId },
                orderBy: [
                    { dayIndex: 'asc' },
                    { startTime: 'asc' }
                ]
            });
        }

        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error('Server error fetching timetable:', error);
        return res.status(500).json({ message: 'Server error fetching timetable' });
    }
};

// Tạo ca học mới
export const createTimetableItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            dayOfWeek,
            dayIndex,
            timeRange,
            startTime,
            endTime,
            className,
            originalCode,
            grade,
            level,
            location,
            group,
            shift,
            note
        } = req.body;

        if (!className || !dayOfWeek || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide all required class information' });
        }

        const newItem = await prisma.timetableItem.create({
            data: {
                userId,
                dayOfWeek,
                dayIndex: Number(dayIndex ?? 1),
                timeRange: timeRange || `${startTime.replace(':', 'h')} – ${endTime.replace(':', 'h')}`,
                startTime,
                endTime,
                className,
                originalCode: originalCode || className,
                grade: Number(grade || 10),
                level: level || 'Cơ bản',
                location: location || 'Long Thượng',
                group: group || '',
                shift: shift || 'Chiều',
                note: note || ''
            }
        });

        res.status(201).json({
            success: true,
            message: 'Class session created successfully',
            data: newItem
        });
    } catch (error) {
        console.error('Server error creating timetable item:', error);
        return res.status(500).json({ message: 'Server error creating timetable item' });
    }
};

// Cập nhật ca học
export const updateTimetableItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const {
            dayOfWeek,
            dayIndex,
            timeRange,
            startTime,
            endTime,
            className,
            originalCode,
            grade,
            level,
            location,
            group,
            shift,
            note
        } = req.body;

        const existing = await prisma.timetableItem.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== userId) {
            return res.status(404).json({ message: 'Class session not found' });
        }

        const updated = await prisma.timetableItem.update({
            where: { id },
            data: {
                ...(dayOfWeek && { dayOfWeek }),
                ...(dayIndex !== undefined && { dayIndex: Number(dayIndex) }),
                ...(timeRange && { timeRange }),
                ...(startTime && { startTime }),
                ...(endTime && { endTime }),
                ...(className && { className }),
                ...(originalCode && { originalCode }),
                ...(grade !== undefined && { grade: Number(grade) }),
                ...(level && { level }),
                ...(location && { location }),
                ...(group !== undefined && { group }),
                ...(shift && { shift }),
                ...(note !== undefined && { note })
            }
        });

        res.json({
            success: true,
            message: 'Class session updated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Server error updating timetable item:', error);
        return res.status(500).json({ message: 'Server error updating timetable item' });
    }
};

// Xóa ca học
export const deleteTimetableItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existing = await prisma.timetableItem.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== userId) {
            return res.status(404).json({ message: 'Class session not found' });
        }

        await prisma.timetableItem.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Class session deleted successfully'
        });
    } catch (error) {
        console.error('Server error deleting timetable item:', error);
        return res.status(500).json({ message: 'Server error deleting timetable item' });
    }
};

// Đồng bộ hàng loạt toàn bộ thời khóa biểu (Dành cho Import Excel hoặc Reset Default)
export const syncBulkTimetable = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: 'Items must be an array' });
        }

        const formattedItems = items.map(item => ({
            userId,
            dayOfWeek: item.dayOfWeek || 'Thứ 2',
            dayIndex: Number(item.dayIndex ?? 1),
            timeRange: item.timeRange || `${item.startTime?.replace(':', 'h') || ''} – ${item.endTime?.replace(':', 'h') || ''}`,
            startTime: item.startTime || '17:00',
            endTime: item.endTime || '18:30',
            className: item.className || '',
            originalCode: item.originalCode || item.className || '',
            grade: Number(item.grade || 10),
            level: item.level || 'Cơ bản',
            location: item.location || 'Long Thượng',
            group: item.group || item.originalCode || '',
            shift: item.shift || 'Chiều',
            note: item.note || ''
        }));

        await prisma.$transaction([
            prisma.timetableItem.deleteMany({ where: { userId } }),
            prisma.timetableItem.createMany({ data: formattedItems })
        ]);

        const updatedList = await prisma.timetableItem.findMany({
            where: { userId },
            orderBy: [
                { dayIndex: 'asc' },
                { startTime: 'asc' }
            ]
        });

        res.json({
            success: true,
            message: 'Timetable synchronized successfully',
            data: updatedList
        });
    } catch (error) {
        console.error('Server error syncing timetable:', error);
        return res.status(500).json({ message: 'Server error syncing timetable' });
    }
};
