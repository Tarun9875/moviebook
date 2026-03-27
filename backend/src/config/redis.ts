import { createClient } from "redis";

let redis: ReturnType<typeof createClient> | null = null;

const redisUrl = process.env.REDIS_URL;

/* ================= INIT REDIS ================= */

if (redisUrl) {
  redis = createClient({
    url: redisUrl,
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });

  (async () => {
    try {
      await redis!.connect();
    } catch (err) {
      console.log("⚠️ Redis connection failed");
    }
  })();
} else {
  console.log("⚠️ Redis disabled (no REDIS_URL)");
}

export default redis;