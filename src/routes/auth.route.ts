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

router.get("/login", LoginMiddleware.checkNull, AuthController.login);
router.post("/register", registerMiddlewaresList, AuthController.register);

module.exports = router;
