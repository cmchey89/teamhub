import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../../../lib/auth/session';
import { db } from "../../../../../lib/db/client";
import { tasks } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const result = await db.select().from(tasks).where(eq(tasks.projectId, id));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title, description, priority, assignedTo, dueDate, sourceTeam, currentTeam } = await req.json();
  const [task] = await db.insert(tasks).values({
    projectId: id,
    title,
    description,
    priority: priority ?? "medium",
    assignedTo: assignedTo || null,
    dueDate: dueDate ? new Date(dueDate) : null,
    sourceTeam: sourceTeam || null,
    currentTeam: currentTeam || null,
    createdBy: session.id,
  }).returning();
  return NextResponse.json(task);
}
