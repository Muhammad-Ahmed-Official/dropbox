import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const user = await currentUser();
    if(!user) return nextError(401, "Unauthorized");

    const existingUser = await db.select().from(users).where(eq(users.id, user.id));
    if(existingUser.length > 0) return nextError(200, "User alredy exist");

    await db.insert(users).values({
        id: user?.id!,
        userName: user?.fullName!,
        email: user?.primaryEmailAddress?.emailAddress!,
    }).returning();

    return nextResponse(200, "Account created successfully");
});