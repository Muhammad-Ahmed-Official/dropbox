import { nextResponse } from "@/utils/Response";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = nextResponse(200, "Signed out successfully");
  response.cookies.set(AUTH_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
