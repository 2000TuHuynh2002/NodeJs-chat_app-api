import express from "express";

import { UserController } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/all", UserController.getAllUsers);
userRouter.get("/email/:email", UserController.getUserByEmail);
userRouter.get("/username/:username", UserController.getUserByUsername);

export { userRouter };
