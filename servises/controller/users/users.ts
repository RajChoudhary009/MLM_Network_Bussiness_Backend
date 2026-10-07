import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../../models/mongo_database/users/users";
import { IRegisterRequest } from "../../interfaces/user"


export const validateRegister = (data: IRegisterRequest) => {

    const { name, mobile, email, password } = data;

    if (!name || !mobile || !email || !password) {
        return "Name, mobile, email and password are required";
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        return "Mobile must be exactly 10 digits";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Invalid email";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    return null;
};

const generateReferralCode = () => {
    return "LIFE" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const register = async (req: Request, res: Response) => {
    try {

        const { name, mobile, email, password, referredBy }: IRegisterRequest = req.body;

        const validationError = validateRegister(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email or mobile already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            mobile,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            referralCode: generateReferralCode(),
            referredBy: referredBy || null
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user
        });

    } catch (error) {

        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Invalid email"
            });
        }

        const token = jwt.sign({ userId: user._id, role: user.role, usersBlock: user.usersBlock },
            process.env.JWT_SECRET as string, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const users = async (req: Request, res: Response) => {

    try {

        const userId = (req as any).user.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};