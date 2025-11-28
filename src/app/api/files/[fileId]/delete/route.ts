import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const {userId} = await auth();
    if(!userId) return nextError(401, "Unauthorized");

    const url = new URL(request.url);
    const fileId = url.searchParams.get("id") 
    if(!fileId) return nextError(400, "Params is empty");
    
    const [file] = await db.select().from(files).where(and(
        eq(files?.id, fileId), eq(files?.userId, userId)
    ));
    if(!file) return nextError(400, "File not found");

    if(file?.isFolder){
        const childFiles = await db
            .select()
            .from(files)
            .where(and(eq(files?.id, fileId), eq(files?.userId, userId)));

            for(const child of childFiles){
                await imageKit.deleteFile(child?.id);
            }

            await db.delete(files).where(and(
                eq(files?.parentId, fileId), eq(files?.userId, userId)
            ));
            return nextResponse(200, "File deleted successfully");
    };

    await imageKit.deleteFile(file?.id);
    await db.delete(files).where(and(
        eq(files?.id, fileId), eq(files?.userId, userId)
    ));
    return nextResponse(200, "File deleted successfully");
})