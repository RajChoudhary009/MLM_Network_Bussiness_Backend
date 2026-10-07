import express, { Request, Response } from "express";
import { testDbConnection, connectDB } from "./config/database";

const app = express();
app.use(express.json());

testDbConnection();
connectDB();



let users: User[] = [
    {
        id: 1,
        name: "Raj",
        email: "raj@gmail.com",
        age: 25
    },
    {
        id: 2,
        name: "Amit",
        email: "amit@gmail.com",
        age: 26
    }
];


// GET - All users
app.get("/users", (req: Request, res: Response) => {
    res.json(users);
});


// GET - Single user
app.get("/users/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const user = users.find(item => item.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});


// POST - Create user
app.post("/users", (req: Request, res: Response) => {

    const { name, email, age } = req.body;

    const newUser: User = {
        id: users.length + 1,
        name,
        email,
        age
    };

    users.push(newUser);

    res.status(201).json({
        message: "User created successfully",
        user: newUser
    });
});


// PUT - Update user
app.put("/users/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const user = users.find(item => item.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const { name, email, age } = req.body;

    user.name = name;
    user.email = email;
    user.age = age;

    res.json({
        message: "User updated successfully",
        user
    });
});


// DELETE - Delete user
app.delete("/users/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const userIndex = users.findIndex(item => item.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        message: "User deleted successfully",
        user: deletedUser[0]
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});