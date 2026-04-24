import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getAuthUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export const POST = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authUser = await getAuthUser();
  if (!authUser) return nextError(401, "Unauthorized");
  const userId = authUser.userId;

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const formUserId = formData.get("userId") as string;
  const parentId = (formData.get("parentId") as string) || null;

  if (userId !== formUserId) return nextError(401, "Unauthorized");
  if (!file) return nextError(400, "No file provided");

  if (parentId) {
    const [parentFolder] = await db.select().from(files).where(and(
      eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true)
    ));
    if (!parentFolder) {
      return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }
  }

  const ALLOWED_TYPES = [
    "image/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const isAllowed = ALLOWED_TYPES.some((t) =>
    t.endsWith("/") ? file.type.startsWith(t) : file.type === t
  );
  if (!isAllowed) {
    return nextError(400, "Invalid file format — only images, PDF, and Word documents allowed");
  }

  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);
  const folderPath = parentId ? `/droply/${userId}/folder/${parentId}` : `/droply/${userId}`;
  const fileExtension = file?.name?.split(".").pop() || "";
  const uniqueFileName = `${randomUUID()}.${fileExtension}`;

  const uploadResponse = await imageKit.upload({
    file: fileBuffer,
    fileName: uniqueFileName,
    folder: folderPath,
    useUniqueFileName: false,
  });

  const fileData = {
    name: file?.name,
    path: uploadResponse.filePath,
    size: file.size,
    type: file.type,
    fileUrl: uploadResponse.url,
    thumbnailUrl: uploadResponse.thumbnailUrl || null,
    userId,
    parentId,
    isFolder: false,
    isStarred: false,
    isTrash: false,
  };

  await db.insert(files).values(fileData).returning();
  return nextResponse(200, "File uploaded successfully");
});
