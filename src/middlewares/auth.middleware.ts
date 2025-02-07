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
      
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
      
      req.body.userId = decoded._id;

      next();
    } catch (err: any) {
      if (err.message === "jwt expired") {
        return res
          .status(401)
          .json({ error: "Access token expired" });
      }
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export { AuthMiddleware };
