import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from '../../../../lib/auth/session';
import { db } from "../../../../lib/db/client";
import { tasks } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await db.select().from(tasks).where(eq(tasks.assignedTo, session.name || session.email || ""));
  return NextResponse.json(result);
}
