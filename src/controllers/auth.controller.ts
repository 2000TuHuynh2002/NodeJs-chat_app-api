import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import AuthTokenHelper from "../utils/auth-token";

require("dotenv").config();

const accessSecretKey = process.env.JWT_ACCESS_SECRET_KEY || "secret";
const accessExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY || "secret";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const User = require("../models/user.model");

class AuthController {
  // [POST] /api/auth/login
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

      const accessToken = jwt.sign({ _id: user.id }, accessSecretKey, {
        expiresIn: accessExpiresIn,
      });

      const refreshToken = jwt.sign({ _id: user.id }, refreshSecretKey, {
        expiresIn: refreshExpiresIn,
      });

      await AuthTokenHelper.storeToken(user.id, refreshToken);

      res.status(200).json({
        status: "200",
        message: "Login Successfully",
        data: {
          _id: user.id,
          user: user.name,
          email: user.email,
          token: {
            type: "Bearer",
            refresh_token: refreshToken,
            access_token: accessToken,
          },
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

  // [POST] /api/auth/refresh
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required" });
      }

      const decoded = jwt.verify(refreshToken, refreshSecretKey) as JwtPayload;
      const userId = decoded._id;

      const isTokenExist = await AuthTokenHelper.isTokenExist(
        userId,
        refreshToken
      );

      if (!isTokenExist) {
        return res.status(401).json({ error: "Refesh token is invalid" });
      }

      const newAccessToken = jwt.sign({ _id: decoded._id }, accessSecretKey, {
        expiresIn: accessExpiresIn,
      });

      const newRefreshToken = jwt.sign({ _id: decoded._id }, refreshSecretKey, {
        expiresIn: refreshExpiresIn,
      });

      await AuthTokenHelper.storeToken(userId, newRefreshToken);

      res.status(200).json({
        status: "200",
        message: "Token refreshed successfully",
        data: {
          token: {
            refresh_token: newRefreshToken,
            access_token: newAccessToken,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  // [POST] /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "Token is required" });
      }

      const decoded = jwt.verify(refreshToken, refreshSecretKey) as JwtPayload;
      const userId = decoded._id;

      const isTokenExist = await AuthTokenHelper.isTokenExist(
        userId,
        refreshToken
      );

      if (!isTokenExist) {
        return res.status(401).json({ error: "Refesh token is invalid" });
      }

      await AuthTokenHelper.revokeToken(userId, refreshToken);

      res.status(200).json({
        status: "200",
        message: "Logout successfully",
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}

module.exports = new AuthController();
