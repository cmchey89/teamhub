import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../../../lib/auth/session';
import { db } from "../../../../../lib/db/client";
import { messages } from "../../../../../lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const result = await db.select().from(messages).where(eq(messages.projectId, id)).orderBy(asc(messages.createdAt));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { content } = await req.json();
  const [msg] = await db.insert(messages).values({
    projectId: id,
    userId: session.id,
    userName: session.name || session.email || "Unknown",
    content,
  }).returning();
  return NextResponse.json(msg);
}
