import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { OAuth2Client } from 'google-auth-library'

export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if ( !name || !email || !password) {
            return res.status(400).json({message: 'Vui lòng điền họ tên, email và mật khẩu!'});
        }

        const existingUser = await prisma.user.findUnique({where: {email}});

        if (existingUser){
            return res.status(400).json({message: 'Email đã được sử dụng!'});
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

        res.status(201).json({message: 'Đăng ký thành công!', user: newUser});
        


    } catch (err){
        console.log('Lỗi server khi đăng ký:', err);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Vui lòng nhập email và mật khẩu!'});
        }

        const user = await prisma.user.findUnique({where: {email}});

        if(!user){
            return res.status(401).json({message: 'Email hoặc mật khẩu không đúng!'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Email hoặc mật khẩu không đúng!'});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: {id: user.id, name: user.name, email: user.email},
        });
    } catch (error){
        console.error('Lỗi server khi đăng nhập:', error);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const {credential} = req.body;
        if (!credential) {
            return res.status(400).json({message: 'Không tìm thấy google token!'});
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
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error) {
        console.error('Lỗi server khi đăng nhập google:', error);
        return res.status(500).json({message: 'Xác thực Google thất bại!'});
    }
}