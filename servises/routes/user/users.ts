import { Router } from "express";
const routes = Router();


import { register, login, users } from "../../controller/users/users";

import { authMiddleware } from "../../middleware/authMiddleware";

routes.post("/api/v1/users/register", register);
routes.post("/api/v1/users/login", login);
routes.get("/api/v1/users/profile", authMiddleware, users);

export default routes;