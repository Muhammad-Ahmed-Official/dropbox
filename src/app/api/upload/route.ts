import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authUser = await getAuthUser();
  if (!authUser) return nextError(401, "Unauthorized");
  const userId = authUser.userId;

  const body = await request.json();
  const { imageKit, userId: bodyUserId } = body;

  if (bodyUserId !== userId) return nextError(401, "Unauthorized");
  if (!imageKit || !imageKit.url) return nextError(400, "Invalid file data");

  const fileData = {
    name: imageKit.name || "untitled",
    path: imageKit.filePath || `droply/${userId}/${imageKit.name}`,
    size: imageKit.size || 0,
    userId,
    type: imageKit.fileType || "image",
    fileUrl: imageKit.url,
    thumbnailUrl: imageKit.thumbnailUrl || null,
    parentId: null,
    isFolder: false,
    isStarred: false,
    isTrash: false,
  };

  const [newFile] = await db.insert(files).values(fileData).returning();
  return nextResponse(200, "", newFile);
});
