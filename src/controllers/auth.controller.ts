import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY || "secret";
const User = require("../models/user.model");

class AuthController {
  // [GET] /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const user = await User.findByUsername(username.toLowerCase());
      if (user === null) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      const accessToken = jwt.sign({ _id: user.id }, secretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.status(200).json({
        status: "200",
        message: "Login Successfully",
        data: {
          _id: user.id,
          user: user.name,
          email: user.email,
          accessToken: accessToken,
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  // [POST] /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, username, email, password } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await User.createUser({
        name: name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hash,
      });

      res.status(201).json({
        status: "201",
        message: "User created successfully",
        data: {
          _id: newUser.id,
          user: newUser.name,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}

module.exports = new AuthController();
