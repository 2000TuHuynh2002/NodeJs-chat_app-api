import { RedisClient } from "../configs/redis.conf";
import * as UnixTimeHelper from "./base-unixTime";

require("dotenv").config();

class AuthTokenHelper {
  private refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = new RedisClient(
      process.env.REDIS_URL || "redis://localhost:6379"
    );
    this.redisClient.connect();
  }

  public async storeToken(userId: string, token: string) {
    const key = `user-${userId}:sessions`;
    const field = `refresh`;
    const ttl = UnixTimeHelper.convertToSecond(this.refreshExpiresIn);

    await this.redisClient.hSet(key, field, token);
    await this.redisClient.hExpire(key, field, ttl);
  }

  public async revokeToken(userId: string, token: string) {
    await this.redisClient.del(token);
    const key = `user-${userId}:sessions`;
    const field = `refresh`;

    await this.redisClient.hDel(key, field);
  }

  public async isTokenExist(userId: string, token: string) {
    const key = `user-${userId}:sessions`;
    const field = `refresh`;
    const storedToken = await this.redisClient.hGet(key, field);
    return storedToken === token;
  }
}

export default new AuthTokenHelper();
