import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getAuthUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = asyncHandler(async (request: NextRequest, context: { params: { fileId: string } }): Promise<NextResponse> => {
  const authUser = await getAuthUser();
  if (!authUser) return nextError(401, "Unauthorized");
  const userId = authUser.userId;

  const { fileId } = await context.params;
  if (!fileId) return nextError(400, "Params is empty");

  const [file] = await db.select().from(files).where(and(
    eq(files.id, fileId), eq(files.userId, userId),
  ));
  if (!file) return nextError(400, "File not found");

  const updatedFiles = await db
    .update(files)
    .set({ isStarred: !file.isStarred })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .returning();

  return nextResponse(200, "File starred successfully", updatedFiles[0]);
});
