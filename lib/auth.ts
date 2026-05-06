import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'telecaller';
  phone?: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getUserFromDb(userId: number): Promise<AuthUser | null> {
  const users = await query(
    'SELECT id, name, email, role, phone, profile_picture FROM users WHERE id = ? AND is_active = TRUE',
    [userId]
  ) as any[];
  return users.length > 0 ? users[0] : null;
}

export function getTokenFromHeaders(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function getAuthUser(request: Request): AuthUser | null {
  const token = getTokenFromHeaders(request);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(request: Request): { user: AuthUser } | { error: string; status: number } {
  const user = getAuthUser(request);
  if (!user) {
    return { error: 'Authentication required', status: 401 };
  }
  return { user };
}

export function requireAdmin(request: Request): { user: AuthUser } | { error: string; status: number } {
  const result = requireAuth(request);
  if ('error' in result) return result;
  if (result.user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  return result;
}