import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";
import { User } from "../../models/mongo_database/users/users";
import { IRegisterRequest, UpdateUserBody, IUser } from "../../interfaces/user";

// ---------------- MULTER STORAGE ----------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Sirf ek image
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
}).single("scannerImage");


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

        const user = await User.findOne({ email }).select("+password");

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

export const allUsers = async (req: Request, res: Response) => {

    try {

        const user = await User.find()

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

// GET SINGLE USER
export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const userId =
            req.user!.role === "admin" && req.params.id
                ? req.params.id
                : req.user!.userId;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// DELETE USER - ADMIN ONLY
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete an image file from disk (safe if file does not exist)
const deleteImage = (imagePath?: string | null) => {
    if (!imagePath) return;
    const fullPath = path.resolve(imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};


// UPDATE MY PROFILE - USER (only scanner image)
export const updateMyProfile = (req: Request, res: Response): void => {
    upload(req, res, async (err: unknown) => {
        // Multer error
        if (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            console.error("Multer error:", err);

            res.status(400).json({
                success: false,
                message: "Image upload failed",
                error: message
            });
            return;
        }

        // Remove the newly uploaded image if the request fails
        const cleanup = (): void => {
            if (req.file) deleteImage(req.file.path);
        };

        try {
            // User can only update scanner image
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: "Please upload an image"
                });
                return;
            }

            // const userId = req.user!.userId;
            const userId = req.user!.role === "admin" && req.params.id
                ? req.params.id
                : req.user!.userId;

            console.log("userId", userId)
            const user = await User.findById(userId);

            if (!user) {
                cleanup();
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }

            const oldImage = user.scannerImage;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { scannerImage: `uploads/${req.file.filename}` } },
                { new: true, runValidators: true }
            ).select("-password");

            // Remove old image only after the new one is saved
            deleteImage(oldImage);

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedUser
            });

        } catch (error) {
            console.error("Update profile error:", error);

            cleanup();

            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });
};

// UPDATE USER - ADMIN ONLY
export const updateUserByAdmin = (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        // Multer error
        if (err) {
            console.error("Multer error:", err);

            return res.status(400).json({
                success: false,
                message: "Image upload failed",
                error: err.message,
            });
        }

        try {
            // const { id } = req.params;
            const userId = req.user!.role === "admin" && req.params.id
                ? req.params.id
                : req.user!.userId;

            if (!mongoose.isValidObjectId(userId)) {
                if (req.file) deleteImage(req.file.path);

                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const user = await User.findById(userId);

            if (!user) {
                if (req.file) deleteImage(req.file.path);

                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const { name, mobile, email, role, usersBlock, walletBalance, walletBalance2, totalEarned, totalWithdrawn,
                currentMilestone, currentTeamMilestone, completedSales, paymentSuccessful }: UpdateUserBody = req.body;

            // Only the fields that came in req.body are updated
            const updates: Partial<IUser> = {};

            if (name !== undefined) updates.name = name.trim();
            if (mobile !== undefined) updates.mobile = mobile;
            if (email !== undefined) updates.email = email.toLowerCase().trim();
            if (role !== undefined) updates.role = role;
            if (usersBlock !== undefined) updates.usersBlock = usersBlock;
            if (walletBalance !== undefined) updates.walletBalance = Number(walletBalance);
            if (walletBalance2 !== undefined) updates.walletBalance2 = Number(walletBalance2);
            if (totalEarned !== undefined) updates.totalEarned = Number(totalEarned);
            if (totalWithdrawn !== undefined) updates.totalWithdrawn = Number(totalWithdrawn);
            if (currentMilestone !== undefined) updates.currentMilestone = Number(currentMilestone);
            if (currentTeamMilestone !== undefined) updates.currentTeamMilestone = Number(currentTeamMilestone);
            if (completedSales !== undefined) updates.completedSales = Number(completedSales);
            if (paymentSuccessful !== undefined) {
                updates.paymentSuccessful = String(paymentSuccessful) === "true";
            }

            // New image: save path, delete old one after update
            const oldImage = user.scannerImage;
            if (req.file) updates.scannerImage = `uploads/${req.file.filename}`;

            const updatedUser = await User.findByIdAndUpdate(userId,
                { $set: updates },
                { new: true, runValidators: true }
            ).select("-password");

            if (req.file) deleteImage(oldImage);

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser,
            });

        } catch (error) {
            console.error("Admin update user error:", error);

            // Delete uploaded image on error
            if (req.file) deleteImage(req.file.path);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    });
};
