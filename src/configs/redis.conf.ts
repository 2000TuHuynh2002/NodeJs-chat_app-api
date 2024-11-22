import { createClient } from "redis";

class RedisClient {
  private readonly url: string;

  private client: any;
  private isConnected: boolean = false;

  constructor(url: string) {
    this.url = url;
  }

  public async connect() {
    if (!this.isConnected) {
      this.client = await createClient({ url: this.url })
        .on("error", (err) => console.log("[x] Error: " + err))
        .connect();
      this.isConnected = true;
      console.log("[*] Connected to Redis");
    }
  }

  public async set(key: string, value: string | JSON) {
    await this.client.set(key, value);
  }

  public async get(key: string) {
    return await this.client.get(key);
  }

  public async del(key: string) {
    await this.client.del(key);
  }

  public async hSet(key: string, field: string, value: string | JSON) {
    await this.client.hSet(key, field, value);
  }

  public async hGet(key: string, field: string) {
    return await this.client.hGet(key, field);
  }

  public async hExpire(key: string, field: string, seconds: number) {
    await this.client.hExpire(key, field, seconds);
  }

  public async hDel(key: string, field: string) {
    await this.client.hDel(key, field);
  }

  public async close() {
    await this.client.disconnect();
  }
}

export { RedisClient };
