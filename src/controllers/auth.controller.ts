import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserModel as User } from "../models/user.model";
import { unixTimeNow, convertToSecond } from "../utils/base-unixTime";
import AuthTokenHelper from "../utils/auth-token";

require("dotenv").config();

const accessSecretKey = process.env.JWT_ACCESS_SECRET_KEY || "secret";
const accessExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY || "secret";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

class AuthController {
  // [POST] /api/auth/login
  static login = async (req: Request, res: Response) => {
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
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
        },
        accessToken: {
          token: accessToken,
          expiredAt: unixTimeNow() + convertToSecond(accessExpiresIn),
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };

  // [POST] /api/auth/register
  static register = async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await User.createUser({
        firstName: firstName,
        lastName: lastName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hash,
      });

      res.status(201).json({
        status: "201",
        message: "User created successfully",
        data: {
          _id: newUser.id,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          roles: newUser.roles,
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };

  // [POST] /api/auth/refreshToken
  static refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies || {};

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required" });
      }

      const decoded = jwt.verify(refreshToken, refreshSecretKey) as JwtPayload;
      const userId = decoded._id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

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
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
        },
        accessToken: {
          token: newAccessToken,
          expiredAt: unixTimeNow() + convertToSecond(accessExpiresIn),
        },
      });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  // [POST] /api/auth/logout
  static logout = async (req: Request, res: Response) => {
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
  };
}

export { AuthController };
