export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db/client';
import { users } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../../../../lib/auth/password';
import { getSessionFromRequest } from '../../../../lib/auth/session';

export async function POST(req: NextRequest) {
  // Only admins can create accounts
  const session = getSessionFromRequest(req);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { email, name, password, role } = await req.json().catch(() => ({}));
  if (!email || !name || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(users).values({
    email, name, passwordHash, role: role ?? 'member',
  }).returning();

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const allUsers = await db.select({ id: users.id, email: users.email, name: users.name, role: users.role, createdAt: users.createdAt }).from(users);
  return NextResponse.json(allUsers);
}
