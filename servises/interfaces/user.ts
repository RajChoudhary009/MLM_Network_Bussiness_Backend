
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
    address: {
        house: string;
        street: string;
        city: string;
        state: string;
        pincode: string;
    } | null;

    scannerImage: string | null;
    rewardEarned: number;
    paymentSuccessful: boolean;
    walletBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
    currentMilestone: number;
    completedSales: number;
}


export interface IRegisterRequest {
    name: string;
    mobile: string;
    email: string;
    password: string;
    referredBy?: string | null;
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

