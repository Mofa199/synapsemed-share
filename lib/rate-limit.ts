/**
 * Token-Bucket Rate Limiter for SynapseMed
 * Tracks client IP requests with automatic token refill and cleanup.
 */

interface RateLimitStore {
  tokens: number
  lastRefill: number
}

const stores = new Map<string, RateLimitStore>()

// Periodic memory cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, store] of stores.entries()) {
      if (now - store.lastRefill > 10 * 60 * 1000) {
        stores.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

export function checkRateLimit(
  identifier: string,
  { limit = 100, windowMs = 60 * 1000 }: RateLimitOptions = {}
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = `${identifier}:${limit}:${windowMs}`

  let store = stores.get(key)
  if (!store) {
    store = { tokens: limit, lastRefill: now }
    stores.set(key, store)
  }

  // Refill tokens based on elapsed time
  const elapsed = now - store.lastRefill
  if (elapsed > windowMs) {
    store.tokens = limit
    store.lastRefill = now
  }

  if (store.tokens > 0) {
    store.tokens -= 1
    return {
      success: true,
      remaining: store.tokens,
      reset: Math.ceil((store.lastRefill + windowMs - now) / 1000)
    }
  }

  return {
    success: false,
    remaining: 0,
    reset: Math.ceil((store.lastRefill + windowMs - now) / 1000)
  }
}
