import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { userId } = await auth();
    if(!userId){
        return nextError(401, "Unauthrorized");
    };

    // parse request body
    const body = await request.json();
    const { imageKit, userId:bodyUserId } = body;
    if(bodyUserId !== userId) return nextError(401, "Unauthrized");

    if(!imageKit || !imageKit.url) return nextError(401, "Invalid file and data");

    const fileData = {
        name: imageKit.name || "untitled",
        path: imageKit.filePath || `droply/${userId}/${imageKit.name}`,
        size: imageKit.size || 0,
        userId: userId,
        type: imageKit.fileType || "image",
        fileUrl: imageKit.url,
        thumnailUrl: imageKit.thumnailUrl || null,
        parentId: null,
        isFolder: false,
        isStared: false,
        isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return nextResponse(200, "", newFile);
});