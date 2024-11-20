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

  public async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  public async get(key: string) {
    return await this.client.get(key);
  }

  public async del(key: string) {
    await this.client.del(key);
  }

  public async close() {
    await this.client.disconnect();
  }
}

export { RedisClient };
