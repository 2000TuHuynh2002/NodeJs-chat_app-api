import { Express } from "express";

const ErrorController = require("../controllers/error.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");

const authRoute = require("../routes/auth.route");
const baseRoute = require("../routes/base.route");
const userRoute = require("../routes/user.route");

function router(app: Express) {
  app.use("/api", baseRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/user", AuthMiddleware.auth, userRoute);
  app.use(ErrorController.get404);
}

export default router;
