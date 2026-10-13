import { User } from "../models/mongo_database/users/users";

export const up = async () => {
    const result = await User.updateMany(
        { walletBalance2: { $exists: false } },
        { $set: { walletBalance2: 0 } }
    );

    console.log("Matched:", result.matchedCount);
    console.log("Updated:", result.modifiedCount);

    const users = await User.find({}).select("name walletBalance2");

    console.log(users);
};