import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { uuidv4 } from "zod";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const {userId} = await auth();
    if(!userId) return nextError(401, "Unauthorized");

    const body = await request.json();
    const {name, userId:bodyUserId, parentId = null} = body;

    if(bodyUserId !== userId) return nextError(401, "Unauthorized");

    if(!name || typeof name !== "string" || name.trim() === "") return nextError(400, "Foldername is required");

    if(parentId){
        const [parentFolder] = await db.select().from(files).where(and(
            eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true)
        ));
        if(!parentFolder) return nextError(400, "Parent folder not found");
    }

    // create a folder 
    const folderData = {
        name: name.trim(),
        path: `/folder/${userId}/${uuidv4}`,
        size: 0,
        type: "folder",
        fileUrl: "",
        thumbnailUrl: "",
        userId,
        parentId,
        isFolder: true,
        isStarred: false,
        isTrash: false,
    }

    const [newFolder] = await db.insert(files).values(folderData).returning();
    return nextResponse(200, "", newFolder);
})