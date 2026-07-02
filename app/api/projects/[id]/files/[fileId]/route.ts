import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../../../../lib/auth/session";
import { db } from "../../../../../../lib/db/client";
import { projectFiles } from "../../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fileId } = await params;
  await db.delete(projectFiles).where(eq(projectFiles.id, fileId));
  return NextResponse.json({ ok: true });
}
