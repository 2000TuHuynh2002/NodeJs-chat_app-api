import { Request, Response, NextFunction } from "express";
import validator from "validator";

const UserModel = require("../models/user.model");

class RegisterMiddleware {
  static checkNull = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, username, email, password, password_confirmation } = req.body;
    let errors = [];

    if (!name) {
      errors.push("Name is required");
    }
    if (!username) {
      errors.push("Username is required");
    }

    if (!email) {
      errors.push("Email is required");
    }

    if (!password) {
      errors.push("Password is required");
    }

    if (!password_confirmation) {
      errors.push("Password confirmation is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: errors });
    }

    next();
  };

  static checkValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, username, email, password, password_confirmation } = req.body;
    let errors = [];

    if (!validator.isEmail(email)) {
      errors.push("Email is invalid");
    }

    if (email.length < 6 || email.length > 50) {
      errors.push("Email must be at least 6 characters and less than 50");
    }

    if (username.length < 6 || username.length > 20) {
      errors.push("Username must be at least 6 characters and less than 20");
    }

    if (name.length < 3 || name.length > 50) {
      errors.push("Name must be at least 3 characters and less than 50");
    }

    if (password.length < 6 || password.length > 50) {
      errors.push("Password must be at least 6 characters and less than 50");
    }

    if (password !== password_confirmation) {
      errors.push("Password and password confirmation do not match");
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: errors });
    }

    next();
  };

  static checkDuplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, username } = req.body;
    let errors = [];

    const emailExist = await UserModel.findByEmail(email.toLowerCase());
    if (emailExist !== null) {
      errors.push("Email already exists");
    }

    const userExist = await UserModel.findByUsername(username.toLowerCase());
    if (userExist !== null) {
      errors.push("Username already exists");
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: errors });
    }

    next();
  };
}

export { RegisterMiddleware };
