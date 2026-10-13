import { Types } from "mongoose";

export interface IUser {
    name: string;
    mobile: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy: string | null;
    referralCount: number;
    role: "admin" | "user";
    usersBlock: "unblock" | "blocked";
    // address: {
    //     house: string;
    //     street: string;
    //     city: string;
    //     state: string;
    //     pincode: string;
    // } | null;
    // addresses?: IAddress[];   // virtual ke liye, optional
    // transactions?: ITransaction[];
    // rank?: IRank;  
    scannerImage: string | null;
    rewardEarned: number;
    paymentSuccessful: boolean;
    walletBalance: number;
    walletBalance2: number;
    totalEarned: number;
    totalWithdrawn: number;
    currentMilestone: number;
    currentTeamMilestone: number;
    completedSales: number;
}


export interface IRegisterRequest {
    name: string;
    mobile: string;
    email: string;
    password: string;
    referredBy?: string | null;
}

export interface JwtPayload {
    userId: string;
    role: "admin" | "user";
}

export interface UpdateUserBody {
    name?: string;
    mobile?: string;
    email?: string;
    password?: string;
    referralCode?: string;
    referredBy?: string | null;
    referralCount?: number;
    role?: "admin" | "user";
    usersBlock?: "unblock" | "blocked";
    address?: {
        house?: string;
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
    } | null;
    walletBalance?: number;
    walletBalance2?: number;
    totalEarned?: number;
    totalWithdrawn?: number;
    currentMilestone?: number;
    currentTeamMilestone?: number;
    completedSales?: number;
    scannerImage?: string | null;
    paymentSuccessful?: boolean;
}

export interface IAddress {
    userId: Types.ObjectId;
    house?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

declare global {
    namespace Express {
    interface Request {
    user?: {
    userId: string;
    role: "admin" | "user";
    };
    }
    }
    }




export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

export interface UserLogin {
    email: string;
    password: string;
}

