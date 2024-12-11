import express from "express";

import { LoginMiddleware } from "../middlewares/login.middleware";
import { RegisterMiddleware } from "../middlewares/register.middleware";
import { AuthController } from "../controllers/auth.controller";

const authRouter = express.Router();

const registerMiddlewaresList = [
  RegisterMiddleware.checkNull,
  RegisterMiddleware.checkValidation,
  RegisterMiddleware.checkDuplication,
];

authRouter.post("/login", LoginMiddleware.checkNull, AuthController.login);
authRouter.post("/register", registerMiddlewaresList, AuthController.register);
authRouter.post("/refreshToken", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);

export { authRouter };
