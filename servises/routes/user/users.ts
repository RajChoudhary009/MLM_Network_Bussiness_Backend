import { Router } from "express";
const routes = Router();


import { register, login, users, allUsers, updateMyProfile, updateUserByAdmin } from "../../controller/users/users";

import { authMiddleware } from "../../middleware/authMiddleware";
import {varifyByAdmin} from "../../middleware/varifyByAdmin"

routes.post("/api/v1/users/register", register);
routes.post("/api/v1/users/login", login);
routes.get("/api/v1/allUsers/profile", allUsers);
routes.get("/api/v1/users/profile", authMiddleware, users);
routes.patch("/api/v1/users/profile/:id", authMiddleware, updateMyProfile);
routes.patch("/api/v1/users/profile/byAdmin/:id", varifyByAdmin, updateUserByAdmin);

export default routes;