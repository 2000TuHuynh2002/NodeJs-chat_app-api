import { Express } from "express";

import { ErrorController } from "../controllers/error.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

import { authRouter } from "../routes/auth.route";
import { baseRouter } from "../routes/base.route";
import { messageRouter } from "../routes/message.route";
import { roomRouter } from "../routes/room.route";
import { userRouter } from "../routes/user.route";

const appRouter = (app: Express) => {
  app.use("/api", baseRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/message", AuthMiddleware.auth, messageRouter);
  app.use("/api/room", AuthMiddleware.auth, roomRouter);
  app.use("/api/user", AuthMiddleware.auth, userRouter);
  app.use(ErrorController.get404);
};

export { appRouter };
