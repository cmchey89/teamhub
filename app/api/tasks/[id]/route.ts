import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../../lib/auth/session';
import { db } from "../../../../lib/db/client";
import { tasks } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const [task] = await db.update(tasks).set({ ...body, updatedAt: new Date() })
    .where(eq(tasks.id, id)).returning();
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(tasks).where(eq(tasks.id, id));
  return NextResponse.json({ ok: true });
}
