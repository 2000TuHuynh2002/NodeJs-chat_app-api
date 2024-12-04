import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import AuthTokenHelper from "../utils/auth-token";
import { convertToSecond } from "../utils/base-unixTime";

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

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: convertToSecond(refreshExpiresIn) * 1000,
      });

      res.cookie("isLoggedIn", true, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: convertToSecond(refreshExpiresIn) * 1000,
      });

      res.status(200).json({
        message: "Login Successfully",
        user: {
          _id: user.id,
          username: user.name,
          email: user.email,
          roles: user.roles,
        },
        accessToken: accessToken,
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
          roles: newUser.roles,
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  // [POST] /api/auth/refresh
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies || {};

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required" });
      }

      const decoded = jwt.verify(refreshToken, refreshSecretKey) as JwtPayload;
      const userId = decoded._id;

      const user = await User.findById(userId);

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

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: convertToSecond(refreshExpiresIn) * 1000,
      });

      res.cookie("isLoggedIn", true, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: convertToSecond(refreshExpiresIn) * 1000,
      });

      res.status(200).json({
        message: "Token refreshed successfully",
        user: {
          _id: user.id,
          username: user.name,
          email: user.email,
          roles: user.roles,
        },
        accessToken: newAccessToken,
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  // [POST] /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies || {};
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

      res.clearCookie("refreshToken");
      res.clearCookie("isLoggedIn");

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
