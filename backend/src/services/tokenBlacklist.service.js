// Token Blacklist Service
// In production, consider using Redis for better performance and persistence

class TokenBlacklistService {
  constructor() {
    // In-memory storage for blacklisted tokens
    // Key: token, Value: expiration time
    this.blacklistedTokens = new Map();
    
    // Clean up expired tokens every hour
    this.startCleanupInterval();
  }

  // Add a token to the blacklist
  blacklistToken(token, expirationTime) {
    this.blacklistedTokens.set(token, expirationTime);
  }

  // Check if a token is blacklisted
  isTokenBlacklisted(token) {
    const expirationTime = this.blacklistedTokens.get(token);
    
    if (!expirationTime) {
      return false;
    }

    // If token has expired naturally, remove it from blacklist
    if (Date.now() > expirationTime) {
      this.blacklistedTokens.delete(token);
      return false;
    }

    return true;
  }

  // Blacklist all tokens for a specific user (for logout from all devices)
  blacklistAllUserTokens(userId, beforeTimestamp = Date.now()) {
    // Store the timestamp - any token issued before this time is invalid
    const key = `user_${userId}_invalidate_before`;
    this.blacklistedTokens.set(key, beforeTimestamp);
  }

  // Check if a user's token was issued before the invalidation timestamp
  isUserTokenInvalidated(userId, tokenIssuedAt) {
    const key = `user_${userId}_invalidate_before`;
    const invalidateBefore = this.blacklistedTokens.get(key);
    
    if (!invalidateBefore) {
      return false;
    }

    // Token was issued before the invalidation timestamp
    return tokenIssuedAt < invalidateBefore;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.blacklistedTokens.entries()) {
      // For individual tokens, check if expired
      if (key.startsWith('eyJ') && now > value) { // JWT tokens start with 'eyJ'
        this.blacklistedTokens.delete(key);
      }
      // For user invalidation timestamps, keep them for 24 hours
      else if (key.startsWith('user_') && now > (value + 24 * 60 * 60 * 1000)) {
        this.blacklistedTokens.delete(key);
      }
    }
  }

  // Start automatic cleanup
  startCleanupInterval() {
    // Clean up every hour
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);
  }

  // Get blacklist stats (for monitoring)
  getStats() {
    return {
      totalEntries: this.blacklistedTokens.size,
      tokenEntries: Array.from(this.blacklistedTokens.keys()).filter(k => k.startsWith('eyJ')).length,
      userInvalidations: Array.from(this.blacklistedTokens.keys()).filter(k => k.startsWith('user_')).length
    };
  }
}

// Create a singleton instance
const tokenBlacklistService = new TokenBlacklistService();

export default tokenBlacklistService;
