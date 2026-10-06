// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}

const tracker = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = tracker.get(key) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  validTimestamps.push(now);
  tracker.set(key, { timestamps: validTimestamps });

  return { allowed: true, remaining: limit - validTimestamps.length };
}
