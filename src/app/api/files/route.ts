import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const {userId} = await auth();
    if(!userId) return nextError(401, "Unauthorized");

    const searchParam = request.nextUrl.searchParams;
    const queryUserId = searchParam.get("userId");
    const parentId = searchParam.get("parentId");

    if(!queryUserId || queryUserId !== userId) return nextError(400, "Params is Empty");

    let userFiles;
    if(parentId){
        userFiles = await db.select().from(files).where(and(
            eq(files.userId, userId), eq(files.parentId, parentId)
        ))
    } else {
        userFiles = await db.select().from(files).where(and(
            eq(files.userId, userId), isNull(files.parentId)
        ))
    };
    return nextResponse(200, "", userFiles);
});