import mongoose, { Schema } from "mongoose";
import { IUser } from "../../../interfaces/user";

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        referralCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        referredBy: {
            type: String,
            default: null
        },

        referralCount: {
            type: Number,
            default: 0
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true
        },

        usersBlock: {
            type: String,
            enum: ["unblock", "blocked"],
            default: "unblock",
            required: true
        },

        address: {
            type: {
                house: {
                    type: String
                },
                street: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                },
                pincode: {
                    type: String
                }
            },
            default: null
        },

        walletBalance: {
            type: Number,
            default: 0
        },

        totalEarned: {
            type: Number,
            default: 0
        },

        totalWithdrawn: {
            type: Number,
            default: 0
        },

        currentMilestone: {
            type: Number,
            default: 0
        },

        completedSales: {
            type: Number,
            default: 0
        },
        scannerImage: {
            type: String,
            default: null
        },
        paymentSuccessful: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model<IUser>("User", userSchema);