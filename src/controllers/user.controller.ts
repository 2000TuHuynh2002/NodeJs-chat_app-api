import { Request, Response } from "express";

import { UserModel as User } from "../models/user.model";

class UserController {
  // [GET] /api/user/list
  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.fetchAll();
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
  static getUserByUsername = async (req: Request, res: Response) => {
    try {
      const queryUsername = req.params.username;
      const user = await User.findByUsername(queryUsername);
      if (user === null) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json({
        user: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          roles: user.roles,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Not valid" });
      }
    }
  };

  // [GET] /api/user/email/{email}
  static getUserByEmail = async (req: Request, res: Response) => {
    try {
      const queryEmail = req.params.email;
      const user = await User.findByEmail(queryEmail);
      if (user === null) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json({
        user: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          roles: user.roles,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Not valid" });
      }
    }
  };
}

export { UserController };
