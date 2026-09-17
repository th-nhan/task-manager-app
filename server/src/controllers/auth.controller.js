import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { OAuth2Client } from 'google-auth-library'

export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if ( !name || !email || !password) {
            return res.status(400).json({message: 'Please provide name, email, and password!'});
        }

        const existingUser = await prisma.user.findUnique({where: {email}});

        if (existingUser){
            return res.status(400).json({message: 'Email is already in use!'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {id: true, name: true, email: true, createdAt: true},
        });

        res.status(201).json({message: 'Registration successful!', user: newUser});
        


    } catch (err){
        console.log('Server error during registration:', err);
        return res.status(500).json({message: 'Server error'});
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Please provide email and password!'});
        }

        const user = await prisma.user.findUnique({where: {email}});

        if(!user){
            return res.status(401).json({message: 'Invalid email or password!'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid email or password!'});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error){
        console.error('Server error during login:', error);
        return res.status(500).json({message: 'Server error'});
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const {credential} = req.body;
        if (!credential) {
            return res.status(400).json({message: 'Google token not found!'});
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {email, name, picture} = payload;

        let user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    avatarUrl: picture,
                },
                select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error) {
        console.error('Server error during Google login:', error);
        return res.status(500).json({message: 'Google authentication failed!'});
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                password: true,
                _count: {
                    select: {
                        tasks: true,
                        categories: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch task counts grouped by status
        const tasksByStatus = await prisma.task.groupBy({
            by: ['status'],
            where: { userId },
            _count: { status: true },
        });

        const statusCounts = {
            TODO: 0,
            IN_PROGRESS: 0,
            DONE: 0,
        };

        tasksByStatus.forEach((item) => {
            statusCounts[item.status] = item._count.status;
        });

        const hasPassword = Boolean(user.password);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                hasPassword,
                stats: {
                    totalTasks: user._count.tasks,
                    categoriesCount: user._count.categories,
                    todoTasks: statusCounts.TODO,
                    inProgressTasks: statusCounts.IN_PROGRESS,
                    doneTasks: statusCounts.DONE,
                },
            },
        });
    } catch (error) {
        console.error('Server error getting profile:', error);
        return res.status(500).json({ message: 'Server error getting profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, avatarUrl } = req.body;

        if (name !== undefined && (!name || name.trim().length < 2)) {
            return res.status(400).json({ message: 'Name must be at least 2 characters long' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            message: 'Profile updated successfully!',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Server error updating profile:', error);
        return res.status(500).json({ message: 'Server error updating profile' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user already has a password, verify old password
        if (user.password) {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Please provide your current password' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({
            message: 'Password changed successfully!',
        });
    } catch (error) {
        console.error('Server error changing password:', error);
        return res.status(500).json({ message: 'Server error changing password' });
    }
};