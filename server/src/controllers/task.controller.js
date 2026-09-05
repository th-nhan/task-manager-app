import prisma from "../config/db.js";

export const getTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {status, priority, search, page = 1, limit = 10} = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where ={
            userId,
            ...(status && {status}),
            ...(priority && {priority}),
            ...(search && {title: {contains: search, mode: 'insensitive'}}),
        };

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take,
                orderBy: {createdAt: 'desc'},
                include: {category: true},
            }),
            prisma.task.count({where}),
        ]);

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Lỗi server khi lấy danh sách công việc:', error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

export const getTaskById = async (req, res) =>{
    try {
        const {id} = req.params;
        const task = await prisma.task.findUnique({
            where: {id},
            include: {category: true},
        });

        if (!task || task.userId !== req.user.userId){
            return res.status(404).json({message: 'Không tìm thấy công việc'});
        }

        res.json({success: true, data: task});
    } catch (error) {
        console.error('Lỗi server khi lấy công việc:', error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

export const createTask = async(req, res)=>{
    try {
        const userId = req.user.userId;
        const {title, description, dueDate, status, priority, categoryId, reminder} = req.body;

        if (!title){
            return res.status(400).json({message: 'Vui lòng nhập tiêu đề công việc!'});
        }

        const newTask = await prisma.task.create({
            data: {
              userId,
              title,
              description,
              priority: priority || 'LOW',
              dueDate: dueDate ? new Date(dueDate) : null,
              categoryId: categoryId || null,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Tạo công việc thành công',
            data: newTask,
        });
        
    } catch (error) {
        console.error('Lỗi server khi tạo công việc:', error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

export const updateTask = async(req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;
        const {title, description, dueDate, status, priority, categoryId} = req.body;

        const existingTask = await prisma.task.findUnique({
            where: {id, userId},
        });

        if (!existingTask || existingTask.userId !== userId){
            return res.status(404).json({message: 'Không tìm thấy công việc'});
        }

        const updateTask = await prisma.task.update({
            where: {id},
            data: {
              ...(title && { title }),
              ...(description !== undefined && { description }),
              ...(status && { status }),
              ...(priority && { priority }),
              ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
              ...(categoryId !== undefined && { categoryId }),
            },
        });

        res.json({
            success: true,
            message: 'Cập nhật công việc thành công!',
            data: updateTask,
        })
    } catch (error) {
        console.error('Lỗi server khi cập nhật công việc:', error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

export const deleteTask = async(req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;

        const existingTask = await prisma.task.findUnique({
            where: {id, userId},
        });

        if (!existingTask || existingTask.userId !== userId){
            return res.status(404).json({message: 'Không tìm thấy công việc'});
        }

        await prisma.task.delete({
            where: {id},
        });

        res.json({
            success: true,
            message: 'Xóa công việc thành công!',
        });
    } catch (error) {
        console.error('Lỗi server khi xóa công việc:',error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}