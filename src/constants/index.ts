export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const REDIS_PORT = process.env.REDIS_PORT as string;
export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PASSWORD = process.env.REDIS_PASWORD as string;
export const REDIS_URL = process.env.REDIS_URL as string;

export const COOKIE_OPTIONS = {
  httpOnly: true, // More secure - not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};
