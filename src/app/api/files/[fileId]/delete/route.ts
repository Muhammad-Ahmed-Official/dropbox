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

type ImageKitFile = {
  fileId: string;
  name: string;
  url: string;
};

export const DELETE = asyncHandler(async (request:NextRequest, context: { params: { fileId: string}}):Promise<NextResponse> => {
    const {userId} = await auth();
    if(!userId) return nextError(401, "Unauthorized");
    
    const { fileId } = await context.params;
    if(!fileId) return nextError(400, "Params is empty");
    
    const [file] = await db.select().from(files).where(and(
        eq(files?.id, fileId), eq(files?.userId, userId)
    ));
    if(!file) return nextError(400, "File not found");

    if(file?.isFolder){
        const childFiles = await db
            .select()
            .from(files)
            .where(and(eq(files.parentId, fileId), eq(files?.userId, userId)));

        for(const child of childFiles){
            if (!child.isFolder && child.path) {
                const lastSlash = child.path.lastIndexOf("/");
                const folderPath = child.path.substring(0, lastSlash); 
                const fileName = child.path.substring(lastSlash + 1);   
                const files = await imageKit.listFiles({
                    searchQuery: `name="${fileName}"`,
                    path: folderPath,
                    limit: 1,
                });

                if (!files.length) {
                    console.log("No file found in ImageKit:", folderPath, fileName);
                    throw new Error("File not found in ImageKit");
                }

                const foundFile = files[0] as ImageKitFile;
                await imageKit.deleteFile(foundFile?.fileId);
            }
        }

        await db.delete(files).where(and(
            eq(files?.parentId, fileId), eq(files?.userId, userId)
        ));

        await db.delete(files).where(
            and(eq(files.id, fileId), eq(files.userId, userId))
        );
        return nextResponse(200, "File deleted successfully");
    };

    if (!file.isFolder && file.path) {
        const lastSlash = file.path.lastIndexOf("/");
        const folderPath = file.path.substring(0, lastSlash); 
        const fileName = file.path.substring(lastSlash + 1);   
        const files = await imageKit.listFiles({
            searchQuery: `name="${fileName}"`,
            path: folderPath,
            limit: 1,
        });

        if (!files.length) {
            console.log("No file found in ImageKit:", folderPath, fileName);
            throw new Error("File not found in ImageKit");
        }

        const foundFile = files[0] as ImageKitFile;
        await imageKit.deleteFile(foundFile?.fileId);
    }

    await db.delete(files).where(and(
        eq(files?.id, fileId), eq(files?.userId, userId)
    ));
    return nextResponse(200, "File deleted successfully");
})