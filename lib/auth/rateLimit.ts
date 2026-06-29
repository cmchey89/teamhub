interface Bucket { count: number; resetAt: number; }
const buckets = new Map<string, Bucket>();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function clientIp(req: { headers: { get(name: string): string | null } }): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}
