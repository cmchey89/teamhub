import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../lib/auth/session';
import { db } from "../../../lib/db/client";
import { projects, projectMembers } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await db.select().from(projects).where(eq(projects.createdBy, session.id));
  return NextResponse.json(owned);
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();
  const [project] = await db.insert(projects).values({
    name, description, createdBy: session.id,
  }).returning();

  await db.insert(projectMembers).values({
    projectId: project.id, userId: session.id, role: "owner",
  });

  return NextResponse.json(project);
}
