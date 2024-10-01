import express from "express";

const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.get("/login", AuthController.login);
router.post("/register", AuthController.register);

module.exports = router;
