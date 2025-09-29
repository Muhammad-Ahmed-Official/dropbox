import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { auth } from "@clerk/nextjs/server";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})


export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
      
    const { userId } = await auth();
    if(!userId){
        return nextError(401, "Unauthrorized");
    }
    const authParams = imageKit.getAuthenticationParameters();

    return nextResponse(200, "", authParams);
})