import { Request, Response, NextFunction } from "express";
import { RedisClient } from "../configs/redis.conf";

require("dotenv").config();

const jwt = require("jsonwebtoken");

class AuthMiddleware {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = new RedisClient(
      process.env.REDIS_URL || "redis://localhost:6379"
    );
    this.redisClient.connect();
  }

  async auth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "Access denied" });
      }

      const isRevoked = await this.redisClient.get(token);

      if (isRevoked) {
        return res.status(401).json({ error: "Your token is revoked" });
      }

      jwt.verify(token, process.env.JWT_SECRET_KEY);
      // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // return res.status(200).json({ status: "200", message: "Access granted", data: decoded })

      next();
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}

module.exports = new AuthMiddleware();
