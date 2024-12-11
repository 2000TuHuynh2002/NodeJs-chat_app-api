import { Request, Response, NextFunction } from "express";

const UserModel = require("../models/user.model");

class UserController {
  // [GET] /api/user/list
  static getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await UserModel.fetchAll();
      if (users.length === 0) {
        res.status(404).json({ message: "No user found" });
        return;
      }
      res.status(200).json({ result: users });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  };

  // [GET] /api/user/username/{username}
  static getUserByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await UserModel.findByUsername(req.query.value);
      if (user === null) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ result: user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Not valid" });
      }
    }
  };

  // [GET] /api/user/email/{email}
  static getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await UserModel.findByEmail(req.query.value);
      if (user === null) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ result: user });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Not valid" });
      }
    }
  };
}

export { UserController };
