import express from "express";
import { testDbConnection, connectDB } from "./config/database";

import productRoute from "./routes/productLink/productLink"
import userRoute from "./routes/user/users"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

testDbConnection();
connectDB();

app.use('/', productRoute)
app.use('/', userRoute)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
});