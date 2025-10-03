import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { userId } = await auth();
    if(!userId) return nextError(401, "Unauthrorized");

    const { pathname } = new URL(request.url);
    const fileId = pathname.split("/").pop(); 

    if(!fileId) return nextError(400, "Params is empty");

    const [file] = await db.select().from(files).where(and(
        eq(files.id, fileId), eq(files.userId, userId), 
    ));
    if(!file) return nextError(400, "File not found");

    // toggle the status
    const updatedFiles = await db
        .update(files)
        .set({isStarred: !files?.isStarred})
        .where(and(eq(files.id, fileId), eq(files.userId, userId)))
        .returning()

    const updatedFile = updatedFiles[0];

    return nextResponse(200, "File starred successfully")
})