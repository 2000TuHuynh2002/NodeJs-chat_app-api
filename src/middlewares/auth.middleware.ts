import { Request, Response, NextFunction } from "express";

require("dotenv").config();

const jwt = require("jsonwebtoken");

class AuthMiddleware {
  static auth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "Access denied" });
      }

      jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

      next();
    } catch (err: any) {
      if (err.message === "jwt expired") {
        return res
          .status(401)
          .json({ status: "error", message: "Access token expired" });
      }
      res.status(500).json({ status: "error", message: err.message });
    }
  };
}

export { AuthMiddleware };
