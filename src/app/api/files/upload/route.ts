import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { uuidv4 } from "zod";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { userId } = await auth();
    if(!userId) return nextError(401, "Unauthrorized");
    // parse form data
    const formData = await request.formData();
    const file = (formData.get("file") as File)
    const formUserId = (formData.get("userId") as string)
    const parentId =  (formData.get("parentId") as string) || null
    // console.log(parentId)

    if(userId !== formUserId) return nextError(401, "Unauthorized");
    
    if(!file) return nextError(400, "No file provide");
    
    if(parentId){
        const [parentFolder] = await db.select().from(files).where(and(
            eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true) 
        ))
        if (!parentFolder) {
            return NextResponse.json(
            { error: "Parent folder not found" },
            { status: 404 }
            );
        }
    }

    if(!file.type.startsWith("image/") && file.type !== "application/pdf") return nextError(400, "Invalid file format only image & pdf allow");

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId ?  `/droply/${userId}/folder/${parentId}` : `/droply/${userId}`;

    const fileExtension = file?.name?.split(".").pop() || ""
    const uniqueFileName = `${uuidv4()}.${fileExtension}`

    const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: uniqueFileName,
        folder: folderPath,
        useUniqueFileName: false,
    });

    const fileData = {
        // id: uploadResponse.fileId,
        name: file?.name,
        path: uploadResponse.filePath,
        size: file.size,
        type: file.type,
        fileUrl: uploadResponse.url,
        thumbnailUrl: uploadResponse.thumbnailUrl || null,
        userId: userId,
        parentId: parentId,
        isFolder: false,
        isStarred: false,
        isTrash: false,
    }
    console.log(fileData)

    const [NewFile] = await db.insert(files).values(fileData).returning()
    return nextResponse(200, "file upload successfully");
})