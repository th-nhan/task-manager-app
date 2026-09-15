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
        console.error('Server error fetching categories:', error);
        return res.status(500).json({ message: 'Server error fetching categories!' });
    }
}

export const createCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, color} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please enter category name!' });
        }

        const existingCategory = await prisma.category.findFirst({
            where: { userId, name },
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists!' });
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
            message: 'Category created successfully!',
            data: newCategory,
        });
    } catch (error) {
        console.error('Server error creating category:', error);
        return res.status(500).json({ message: 'Server error creating category!' });
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
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category is in use by tasks
        const tasksCount = await prisma.task.count({
            where: { categoryId: id },
        });

        if (tasksCount > 0) {
            return res.status(400).json({ message: 'Category is in use by tasks!' });
        }

        await prisma.category.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Category deleted successfully!',
        });
    } catch (error) {
        console.error('Server error deleting category:', error);
        return res.status(500).json({ message: 'Server error deleting category!' });
    }
}