import { nextError, nextResponse } from "@/utils/Response";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) return nextError(401, "Unauthorized");

  return nextResponse(200, "", {
    id: authUser.userId,
    userName: authUser.userName,
    email: authUser.email,
  });
}
