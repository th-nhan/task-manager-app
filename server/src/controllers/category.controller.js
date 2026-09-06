import prisma from "../config/db.js";

export const getCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'desc' },
            include: {
                _count: {
                    select: {tasks: true}
                },
            },
        });

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Lỗi server khi lấy danh sách danh mục:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách danh mục!' });
    }
}

export const createCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, color} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Vui lòng nhập tên danh mục!' });
        }

        const existingCategory = await prisma.category.findFirst({
            where: { userId, name },
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Danh mục đã tồn tại!' });
        }

        const newCategory = await prisma.category.create({
            data: {
                userId,
                name,
                color: color || '#6366f1',
            },
        });

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công!',
            data: newCategory,
        });
    } catch (error) {
        console.error('Lỗi server khi tạo danh mục:', error);
        return res.status(500).json({ message: 'Lỗi server khi tạo danh mục!' });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingCategory = await prisma.category.findUnique({
            where: { id, userId },
        });

        if (!existingCategory || existingCategory.userId !== userId){
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Kiểm tra xem danh mục có công việc nào đang sử dụng không
        const tasksCount = await prisma.task.count({
            where: { categoryId: id },
        });

        if (tasksCount > 0) {
            return res.status(400).json({ message: 'Danh mục đang được sử dụng bởi công việc!' });
        }

        await prisma.category.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Xóa danh mục thành công!',
        });
    } catch (error) {
        console.error('Lỗi server khi xóa danh mục:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa danh mục!' });
    }
}