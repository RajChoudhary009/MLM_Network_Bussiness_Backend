import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import "dotenv/config";


// mysql sequelizer
const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false
    }
);

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Mysql Database connected successfully.");

    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
};


// Mongo DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB Databse connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export { sequelize, testDbConnection, connectDB};