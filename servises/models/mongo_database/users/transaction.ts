import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../../../interfaces/transaction";

const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Kind of transaction
        type: {
            type: String,
            enum: [
                "credit",
                "debit",
                "withdraw",
                "deposit",
                "referral",
                "milestone",
                "teamMilestone",
                "directIncome"
            ],
            required: true
        },

        // Transaction amount
        amount: {
            type: Number, 
            required: true, 
            min: 0 
        },

        // Wallet balance before and after this transaction
        balanceBefore: { type: Number, default: null },
        balanceAfter: { type: Number, default: null },

        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending"
        },

        // Payment screenshot uploaded by the user
        userScreenshot: {
             type: String, 
             default: null 
            },

        // Payment screenshot uploaded by the admin
        adminScreenshot: { 
            type: String, 
            default: null 
        },

        // UTR or payment reference number
        referenceId: { 
            type: String, 
            default: null, 
            trim: true 
        },

        // Note or reject reason
        description: { 
            type: String,
             default: "" 
            },

        // The user who caused this income (for referral and income types)
        fromUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // The admin who approved or rejected this transaction
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        reviewedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

// Get a user's transactions, latest first
transactionSchema.index({ userId: 1, createdAt: -1 });

// Admin panel: find pending deposits and withdrawals
transactionSchema.index({ status: 1, type: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);