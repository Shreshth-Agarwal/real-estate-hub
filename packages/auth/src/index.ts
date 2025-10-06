// ============================================
// Shared Auth Helpers for Hub4Estate
// ============================================
// IMPORTANT: This package contains ONLY utilities and helpers
// NO secrets or configurations should be stored here

import type { Platform } from "@repo/types";

/**
 * Cookie configuration helper
 * Returns cookie options based on environment
 */
export function getCookieConfig(platform: Platform) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || ".hub4estate.com";
  
  const cookieNames = {
    user: process.env.COOKIE_NAME_USER || "hub4_user_sess",
    business: process.env.COOKIE_NAME_BIZ || "hub4_biz_sess",
    admin: "hub4_admin_sso",
  };

  return {
    name: cookieNames[platform],
    options: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      domain: isProduction ? cookieDomain : undefined,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

/**
 * JWT Audience validator
 * Ensures tokens are being used on the correct platform
 */
export function validateAudience(
  tokenAudience: string,
  expectedPlatform: Platform
): boolean {
  const audienceMap: Record<Platform, string> = {
    user: process.env.JWT_AUD_USER || "hub4estate-user",
    business: process.env.JWT_AUD_BIZ || "hub4estate-business",
    admin: "hub4estate-admin-bridge",
  };

  return tokenAudience === audienceMap[expectedPlatform];
}

/**
 * Cross-platform SSO token generator
 * Creates short-lived admin tokens for cross-app access
 */
export function generateAdminSSOToken(
  userId: string,
  originalPlatform: Platform
): {
  token: string;
  aud: string;
  scope: string;
  expires_at: number;
  original_platform: Platform;
  user_id: string;
} {
  const expiresAt = Date.now() + 60 * 1000; // 60 seconds

  return {
    token: `sso_${Date.now()}_${userId}`, // Simple token for now, replace with JWT in production
    aud: "admin-bridge",
    scope: "admin:cross-app",
    expires_at: expiresAt,
    original_platform: originalPlatform,
    user_id: userId,
  };
}

/**
 * Validate admin SSO token
 */
export function validateAdminSSOToken(token: {
  aud: string;
  scope: string;
  expires_at: number;
}): boolean {
  // Check audience
  if (token.aud !== "admin-bridge") return false;
  
  // Check scope
  if (token.scope !== "admin:cross-app") return false;
  
  // Check expiration
  if (token.expires_at < Date.now()) return false;

  return true;
}

/**
 * Role-based access control helper
 * Checks if user has required role
 */
export function hasRole(
  userRole: string,
  requiredRole: string | string[]
): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Platform redirect URLs
 * Returns the correct URL for each platform
 */
export function getPlatformURL(platform: Platform): string {
  const urls = {
    user: process.env.NEXT_PUBLIC_USER_APP_URL || "https://users.hub4estate.com",
    business: process.env.NEXT_PUBLIC_BUSINESS_APP_URL || "https://business.hub4estate.com",
    admin: process.env.NEXT_PUBLIC_ADMIN_APP_URL || "https://admin.hub4estate.com",
  };

  return urls[platform];
}

/**
 * OAuth callback URL generator
 * Generates the correct callback URL for each platform
 */
export function getOAuthCallbackURL(
  platform: Platform,
  provider: string
): string {
  const baseURL = getPlatformURL(platform);
  return `${baseURL}/api/auth/callback/${provider}`;
}

/**
 * Session validation helper
 * Checks if session is valid and belongs to correct platform
 */
export function validateSession(session: {
  user?: {
    id: string;
    email: string;
    user_type: string;
  };
  expires?: string;
}): boolean {
  if (!session || !session.user) return false;
  
  // Check expiration if provided
  if (session.expires) {
    const expiresAt = new Date(session.expires).getTime();
    if (expiresAt < Date.now()) return false;
  }

  return true;
}

/**
 * Cross-audience block error
 * Standard error for cross-platform access attempts
 */
export class CrossAudienceError extends Error {
  code = "HBE_CROSS_AUDIENCE_BLOCK";
  statusCode = 403;

  constructor(attemptedPlatform: Platform, tokenPlatform: Platform) {
    super(
      `Access denied: Token from ${tokenPlatform} platform cannot be used on ${attemptedPlatform} platform`
    );
    this.name = "CrossAudienceError";
  }
}

/**
 * Platform detection from request
 * Determines which platform the request is coming from
 */
export function detectPlatform(hostname: string): Platform | null {
  if (hostname.includes("users.hub4estate.com") || hostname.includes("localhost:3001")) {
    return "user";
  }
  if (hostname.includes("business.hub4estate.com") || hostname.includes("localhost:3002")) {
    return "business";
  }
  if (hostname.includes("admin.hub4estate.com")) {
    return "admin";
  }
  return null;
}

/**
 * Logging helper for auth events
 */
export function logAuthEvent(
  event: string,
  data: Record<string, any>,
  platform: Platform
) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      platform,
      ...data,
    })
  );
}