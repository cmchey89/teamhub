import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../../lib/auth/session';

export async function GET(req: NextRequest) {
  const user = getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user });
}
