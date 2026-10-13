// interfaces/user.ts
import { Types } from "mongoose";

export type TransactionType =
    | "credit"
    | "debit"
    | "withdraw"
    | "deposit"
    | "referral"
    | "milestone"
    | "teamMilestone"
    | "directIncome";

export type TransactionStatus = "pending" | "success" | "failed";

export interface ITransaction {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    type: TransactionType;
    amount: number;
    balanceBefore?: number | null;
    balanceAfter?: number | null;
    status: TransactionStatus;
    userScreenshot?: string | null;
    adminScreenshot?: string | null;
    referenceId?: string | null;
    description?: string;
    fromUserId?: Types.ObjectId | null;
    reviewedBy?: Types.ObjectId | null;
    reviewedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}