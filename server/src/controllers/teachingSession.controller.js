import prisma from "../config/db.js";

const DAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const getTeachingSessions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const month = parseInt(req.query.month) || (now.getMonth() + 1);
        const year = parseInt(req.query.year) || now.getFullYear();

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const sessions = await prisma.teachingSession.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' }
            ]
        });

        // Automatically update status to COMPLETED for sessions whose scheduled time has passed
        const todayDateStr = now.toISOString().slice(0, 10);
        const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const passedPendingSessions = sessions.filter(s => {
            if (s.status !== 'PENDING') return false;
            const sessionDateStr = new Date(s.date).toISOString().slice(0, 10);
            if (sessionDateStr < todayDateStr) return true;
            if (sessionDateStr === todayDateStr && s.endTime && s.endTime <= currentHHMM) return true;
            return false;
        });

        if (passedPendingSessions.length > 0) {
            const passedIds = passedPendingSessions.map(s => s.id);
            await prisma.teachingSession.updateMany({
                where: { id: { in: passedIds } },
                data: { status: 'COMPLETED' }
            });
            // Update in-memory objects
            sessions.forEach(s => {
                if (passedIds.includes(s.id)) {
                    s.status = 'COMPLETED';
                }
            });
        }

        // Calculate statistics
        let totalCount = sessions.length;
        let completedCount = 0;
        let cancelledCount = 0;
        let makeupCount = 0;
        let pendingCount = 0;
        let totalEarnings = 0;
        let expectedEarnings = 0;

        sessions.forEach(s => {
            const rate = s.rate || 60000;
            if (s.status === 'COMPLETED') {
                completedCount++;
                totalEarnings += rate;
                expectedEarnings += rate;
            } else if (s.status === 'MAKE_UP') {
                makeupCount++;
                totalEarnings += rate;
                expectedEarnings += rate;
            } else if (s.status === 'CANCELLED') {
                cancelledCount++;
            } else if (s.status === 'PENDING') {
                pendingCount++;
                expectedEarnings += rate;
            }
        });

        const paidSessionsCount = completedCount + makeupCount;
        const completionRate = totalCount > 0 
            ? ((paidSessionsCount / totalCount) * 100).toFixed(1) 
            : 0;

        const summary = {
            month,
            year,
            totalCount,
            completedCount,
            cancelledCount,
            makeupCount,
            pendingCount,
            paidSessionsCount,
            defaultRate: 60000,
            totalEarnings,
            expectedEarnings,
            completionRate: Number(completionRate)
        };

        res.json({
            success: true,
            data: {
                sessions,
                summary
            }
        });
    } catch (error) {
        console.error("Error in getTeachingSessions:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi lấy dữ liệu ca dạy", error: error.message });
    }
};

export const generateMonthlySessions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const month = parseInt(req.body.month) || (now.getMonth() + 1);
        const year = parseInt(req.body.year) || now.getFullYear();
        const defaultRate = parseInt(req.body.defaultRate) || 60000;
        const overwrite = Boolean(req.body.overwrite);

        // Lấy thời khóa biểu hiện hành của giáo viên (từ body gửi lên hoặc từ DB)
        let timetableItems = req.body.timetableItems;
        if (!Array.isArray(timetableItems) || timetableItems.length === 0) {
            timetableItems = await prisma.timetableItem.findMany({
                where: { userId },
                orderBy: [{ dayIndex: 'asc' }, { startTime: 'asc' }]
            });
        }

        if (!Array.isArray(timetableItems) || timetableItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Chưa tìm thấy thời khóa biểu nào. Vui lòng thêm ca học vào thời khóa biểu trước!"
            });
        }

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        const totalDaysInMonth = new Date(year, month, 0).getDate();

        // Nếu overwrite = true, xóa các ca chưa tùy biến trước đó
        if (overwrite) {
            await prisma.teachingSession.deleteMany({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            });
        }

        // Lấy danh sách ca đã có trong tháng để tránh trùng lặp
        const existingSessions = await prisma.teachingSession.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                timetableItemId: true,
                date: true,
                startTime: true
            }
        });

        const existingKeySet = new Set(
            existingSessions.map(s => {
                const dStr = new Date(s.date).toISOString().slice(0, 10);
                return `${dStr}_${s.timetableItemId || s.startTime}`;
            })
        );

        const newSessionsToInsert = [];
        const todayDateStr = now.toISOString().slice(0, 10);

        for (let day = 1; day <= totalDaysInMonth; day++) {
            // Giờ trưa 12:00 UTC để tránh lệch múi giờ +/-
            const sessionDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
            // Lấy thứ trong tuần: 0 = CN, 1 = T2, ..., 6 = T7
            const dayIndex = sessionDate.getUTCDay();
            const dateStr = sessionDate.toISOString().slice(0, 10);

            // Tìm các ca học trong TKB khớp với dayIndex
            const matchedTimetableItems = timetableItems.filter(item => item.dayIndex === dayIndex);

            for (const item of matchedTimetableItems) {
                const key = `${dateStr}_${item.id || item.startTime}`;
                if (!existingKeySet.has(key)) {
                    const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    const isPast = dateStr < todayDateStr || (dateStr === todayDateStr && item.endTime && item.endTime <= currentHHMM);
                    newSessionsToInsert.push({
                        userId,
                        timetableItemId: String(item.id || ''),
                        date: sessionDate,
                        dayOfWeek: item.dayOfWeek,
                        dayIndex: item.dayIndex,
                        timeRange: item.timeRange,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        className: item.className,
                        originalCode: item.originalCode,
                        grade: item.grade,
                        location: item.location,
                        shift: item.shift || 'Chiều',
                        rate: defaultRate,
                        status: isPast ? 'COMPLETED' : 'PENDING',
                        note: null
                    });
                }
            }
        }

        if (newSessionsToInsert.length > 0) {
            await prisma.teachingSession.createMany({
                data: newSessionsToInsert
            });
        }

        res.json({
            success: true,
            message: `Đã nạp thành công ${newSessionsToInsert.length} ca dạy từ Weekly Grid vào bảng tính tiền Tháng ${month}/${year}!`,
            insertedSessionsCount: newSessionsToInsert.length
        });
    } catch (error) {
        console.error("Error in generateMonthlySessions:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi tạo lịch tháng", error: error.message });
    }
};

export const createTeachingSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            date,
            dayOfWeek,
            timeRange,
            startTime,
            endTime,
            className,
            originalCode,
            grade,
            location,
            shift,
            rate = 60000,
            status = 'MAKE_UP',
            note
        } = req.body;

        if (!date || !className || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ ngày học, tên lớp, giờ bắt đầu và giờ kết thúc" });
        }

        let sessionDate;
        if (typeof date === 'string' && date.includes('T')) {
            sessionDate = new Date(date);
        } else if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [y, m, d] = date.split('-').map(Number);
            sessionDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        } else {
            sessionDate = new Date(date);
        }
        const dayIndex = sessionDate.getUTCDay();
        const calculatedDayOfWeek = dayOfWeek || DAY_NAMES[dayIndex];
        const calculatedTimeRange = timeRange || `${startTime} – ${endTime}`;

        // Find existing session for same user on this date (UTC day bounds) and start time
        const dayStart = new Date(sessionDate);
        dayStart.setUTCHours(0, 0, 0, 0);
        const dayEnd = new Date(sessionDate);
        dayEnd.setUTCHours(23, 59, 59, 999);

        const existingSession = await prisma.teachingSession.findFirst({
            where: {
                userId,
                date: {
                    gte: dayStart,
                    lte: dayEnd
                },
                startTime
            }
        });

        let newSession;
        if (existingSession) {
            newSession = await prisma.teachingSession.update({
                where: { id: existingSession.id },
                data: {
                    status: status || 'MAKE_UP',
                    className: className || existingSession.className,
                    originalCode: originalCode !== undefined ? originalCode : existingSession.originalCode,
                    rate: Number.isFinite(parseInt(rate)) ? parseInt(rate) : existingSession.rate,
                    location: location || existingSession.location,
                    grade: grade ? parseInt(grade) : existingSession.grade,
                    shift: shift || existingSession.shift,
                    note: note !== undefined ? note : existingSession.note,
                    timeRange: calculatedTimeRange,
                    endTime: endTime || existingSession.endTime
                }
            });
        } else {
            newSession = await prisma.teachingSession.create({
                data: {
                    userId,
                    date: sessionDate,
                    dayOfWeek: calculatedDayOfWeek,
                    dayIndex,
                    timeRange: calculatedTimeRange,
                    startTime,
                    endTime,
                    className,
                    originalCode: originalCode || '',
                    grade: grade ? parseInt(grade) : null,
                    location: location || '',
                    shift: shift || 'Chiều',
                    rate: parseInt(rate) || 60000,
                    status: status || 'MAKE_UP',
                    note: note || null
                }
            });
        }

        res.status(201).json({
            success: true,
            message: "Tạo ca dạy thành công",
            data: newSession
        });
    } catch (error) {
        console.error("Error in createTeachingSession:", error);
        res.status(500).json({ success: false, message: "Lỗi khi tạo ca dạy", error: error.message });
    }
};

export const updateTeachingSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const {
            status,
            rate,
            note,
            className,
            location,
            timeRange,
            startTime,
            endTime,
            date
        } = req.body;

        const session = await prisma.teachingSession.findFirst({
            where: { id, userId }
        });

        if (!session) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ca dạy này" });
        }

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (rate !== undefined) updateData.rate = parseInt(rate);
        if (note !== undefined) updateData.note = note;
        if (className !== undefined) updateData.className = className;
        if (location !== undefined) updateData.location = location;
        if (timeRange !== undefined) updateData.timeRange = timeRange;
        if (startTime !== undefined) updateData.startTime = startTime;
        if (endTime !== undefined) updateData.endTime = endTime;
        if (date !== undefined) updateData.date = new Date(date);

        const updatedSession = await prisma.teachingSession.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            message: "Cập nhật ca dạy thành công",
            data: updatedSession
        });
    } catch (error) {
        console.error("Error in updateTeachingSession:", error);
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật ca dạy", error: error.message });
    }
};

export const batchUpdateStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ids, sessionIds, status } = req.body;
        const targetIds = ids || sessionIds;

        if (!Array.isArray(targetIds) || targetIds.length === 0 || !status) {
            return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
        }

        await prisma.teachingSession.updateMany({
            where: {
                id: { in: targetIds },
                userId
            },
            data: { status }
        });

        res.json({
            success: true,
            message: `Đã cập nhật ${targetIds.length} ca dạy sang trạng thái ${status}`
        });
    } catch (error) {
        console.error("Error in batchUpdateStatus:", error);
        res.status(500).json({ success: false, message: "Lỗi cập nhật hàng loạt", error: error.message });
    }
};

export const deleteTeachingSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const session = await prisma.teachingSession.findFirst({
            where: { id, userId }
        });

        if (!session) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ca dạy" });
        }

        await prisma.teachingSession.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: "Xóa ca dạy thành công"
        });
    } catch (error) {
        console.error("Error in deleteTeachingSession:", error);
        res.status(500).json({ success: false, message: "Lỗi khi xóa ca dạy", error: error.message });
    }
};

export const clearMonthlySessions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const month = parseInt(req.body.month);
        const year = parseInt(req.body.year);

        if (!month || !year) {
            return res.status(400).json({ success: false, message: "Vui lòng chọn tháng và năm hợp lệ" });
        }

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const result = await prisma.teachingSession.deleteMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        res.json({
            success: true,
            message: `Đã làm mới và xóa ${result.count} ca dạy của Tháng ${month}/${year}`
        });
    } catch (error) {
        console.error("Error in clearMonthlySessions:", error);
        res.status(500).json({ success: false, message: "Lỗi làm mới tháng", error: error.message });
    }
};
