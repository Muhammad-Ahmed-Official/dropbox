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

    const trashFiles = await db.select().from(files).where(and( eq(files.userId, userId), eq(files.isTrash, true) ));
    if(trashFiles.length === 0){
        return nextResponse(200, "No trash found")
    };

    for (const file of trashFiles) {
      if (file.isFolder || !file.path) continue;

      try {
        const fullPath = file.path; 
        const lastSlash = fullPath.lastIndexOf("/");
        const folderPath = fullPath.substring(0, lastSlash);
        const fileName = fullPath.substring(lastSlash + 1);
        const found = await imageKit.listFiles({
          searchQuery: `name="${fileName}"`,
          path: folderPath,
          limit: 1,
        });

        if (found.length === 0) {
          console.log("Not found in ImageKit:", folderPath, fileName);
          continue;
        }

        await imageKit.deleteFile(found[0].fileId);
      } catch (err) {
        console.error("Image delete failed:", err);
      }
    };

    const deleteTrashFiles = await db.delete(files).where(and( eq(files.userId, userId), eq(files.isTrash, true) )).returning();
    return nextResponse(200, "Trash empty successfully");
})