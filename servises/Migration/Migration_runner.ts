import "dotenv/config";
import { connectDB } from "../config/database";
import { up } from "../Migration/Model_Migration";

const runMigration = async () => {
    try {
        await connectDB();
        await up();
        console.log("Migration completed successfully");
        process.exitCode = 0;
    } catch (error) {
        console.error("Migration failed:", error);
        process.exitCode = 1;
    }
};

runMigration();