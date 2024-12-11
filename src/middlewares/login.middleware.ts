import { Request, Response, NextFunction } from "express";

class LoginMiddleware {
  static checkNull= async(req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    let errors = [];

    if (!username) {
      errors.push("Username is required");
    }

    if (!password) {
      errors.push("Password is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: errors });
    }

    next();
  }
}

export { LoginMiddleware };
