import express from "express";

const AuthController = require("../controllers/auth.controller");

const LoginMiddleware = require("../middlewares/login.middleware");
const RegisterMiddleware = require("../middlewares/register.middleware");

const router = express.Router();

const registerMiddlewaresList = [
  RegisterMiddleware.checkNull,
  RegisterMiddleware.checkValidation,
  RegisterMiddleware.checkDuplication,
];

router.post("/login", LoginMiddleware.checkNull, AuthController.login);
router.post("/register", registerMiddlewaresList, AuthController.register);
router.post("/refreshToken", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

module.exports = router;
