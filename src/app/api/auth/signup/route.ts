import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { nextError, nextResponse } from "@/utils/Response";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, email, password } = body;

    if (!userName || !email || !password) {
      return nextError(400, "All fields are required");
    }

    if (userName.length < 3) {
      return nextError(400, "Username must be at least 3 characters");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      return nextError(400, "Username can only contain letters, numbers, and underscores");
    }

    if (password.length < 8) {
      return nextError(400, "Password must be at least 8 characters");
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(or(eq(users.userName, userName), eq(users.email, email)));

    if (existing) {
      if (existing.userName === userName) {
        return nextError(400, "Username already taken");
      }
      return nextError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({ userName, email, password: hashedPassword })
      .returning();

    const token = await signToken({
      userId: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
    });

    const response = nextResponse(201, "Account created successfully", { userId: newUser.id });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return nextError(500, "Internal server error");
  }
}
