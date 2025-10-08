import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  username: string;
}

export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
