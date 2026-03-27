import redis from "../../config/redis";

export type LockedSeatMap = Record<string, string>;

const LOCK_TTL = 300; // 5 minutes

/* =====================================================
   LOCK SEATS
===================================================== */
export const lockSeats = async (
  showId: string,
  seats: string[],
  userId: string
) => {
  const key = `seat-lock:${showId}`;

  /* ✅ IF REDIS NOT AVAILABLE → SKIP LOCKING */
  if (!redis) {
    console.log("⚠️ Redis not available → skipping seat lock");
    return;
  }

  const redisResult = await redis.hGetAll(key);
  const lockedSeats = (redisResult ?? {}) as LockedSeatMap;

  for (const seat of seats) {
    if (lockedSeats[seat] && lockedSeats[seat] !== userId) {
      throw new Error(`Seat ${seat} already locked`);
    }
  }

  const multi = redis.multi();

  seats.forEach((seat) => {
    multi.hSet(key, seat, userId);
  });

  multi.expire(key, LOCK_TTL);

  await multi.exec();
};

/* =====================================================
   UNLOCK SEATS
===================================================== */
export const unlockSeats = async (
  showId: string,
  seats: string[],
  userId: string
) => {
  const key = `seat-lock:${showId}`;

  if (!redis) return;

  const redisResult = await redis.hGetAll(key);
  const lockedSeats = (redisResult ?? {}) as LockedSeatMap;

  const multi = redis.multi();

  seats.forEach((seat) => {
    if (lockedSeats[seat] === userId) {
      multi.hDel(key, seat);
    }
  });

  await multi.exec();
};

/* =====================================================
   GET LOCKED SEATS
===================================================== */
export const getLockedSeats = async (
  showId: string
): Promise<LockedSeatMap> => {
  const key = `seat-lock:${showId}`;

  if (!redis) {
    return {}; // no locks if redis disabled
  }

  const redisResult = await redis.hGetAll(key);
  return (redisResult ?? {}) as LockedSeatMap;
};