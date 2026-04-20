import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { nextError, nextResponse } from "@/utils/Response";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return nextError(400, "All fields are required");
    }

    const isEmail = identifier.includes("@");
    const [user] = isEmail
      ? await db.select().from(users).where(eq(users.email, identifier))
      : await db.select().from(users).where(eq(users.userName, identifier));

    if (!user) {
      return nextError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return nextError(401, "Invalid credentials");
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      userName: user.userName,
    });

    const response = nextResponse(200, "Signed in successfully");
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
