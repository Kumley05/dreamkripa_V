import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Rate limiting middleware
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): Promise<{ allowed: boolean; remaining: number; resetTime?: number }> {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset existing one
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';

  // Add user agent fingerprint for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return `${ip}-${userAgent}`;
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Indian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Detect SQL injection patterns
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    // SQL commands followed by suspicious operators or keywords
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE)\b\s+.*\b(FROM|INTO|TABLE|WHERE|DATABASE)\b)/i,
    // SQL comments (must be standalone or at end)
    /(--\s*$)|(--\s*\n)/,
    // Boolean operators with column-like patterns (1=1, etc)
    /\b(OR|AND)\s+\w+\s*[=<>!]/i,
    // Union-based injection patterns
    /\bUNION\s+ALL\s+SELECT\b/i,
    // Multiple statements
    /;\s*(DROP|DELETE|UPDATE|INSERT)\b/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

// Detect XSS patterns
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    // Script tags with content
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    // JavaScript protocol in href/src attributes
    /javascript:/gi,
    // Event handlers with executable code (not just empty)
    /on\w+\s*=\s*["'][^"']*[^"\s][^"']*["']/gi,
    // iframe/object/embed tags with src
    /<(iframe|object|embed)\b[^>]*\bsrc\s*=/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

// Security headers middleware
export function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;"
  );

  return response;
}

// CSRF token generation (simplified)
export function generateCSRFToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

// Validate request origin
export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin) return true; // Allow same-origin requests without Origin header

  const allowedOrigins = [
    `https://${host}`,
    process.env.NEXT_PUBLIC_APP_URL,
    'https://ds521u300p80.drytis.ai',
  ].filter(Boolean);

  return allowedOrigins.some(allowed => origin === allowed);
}

// Mask sensitive data for logging
export function maskSensitiveData(data: any): any {
  const masked = { ...data };

  if (masked.email) {
    const [username, domain] = masked.email.split('@');
    masked.email = `${username.charAt(0)}***@${domain}`;
  }

  if (masked.phone) {
    masked.phone = masked.phone.slice(-4).padStart(10, '*');
  }

  return masked;
}

// Clean up expired rate limit records
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 60 * 60 * 1000);
}

// Rate limit error response
export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  const response = NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    },
    { status: 429 }
  );
  response.headers.set('Retry-After', retryAfter.toString());
  return response;
}
