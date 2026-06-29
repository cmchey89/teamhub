import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../../lib/auth/session';
import { db } from "../../../../lib/db/client";
import { projects } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  return NextResponse.json(project ?? null);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
