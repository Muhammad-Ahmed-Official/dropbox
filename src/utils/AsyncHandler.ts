import { NextRequest, NextResponse } from "next/server"

export const asyncHandler = (fn : (req: NextRequest, context: { params: any }) => Promise<NextResponse> ) => {
    return async (req: NextRequest, context: { params: any }) => {
        try {
           return await fn(req, context); 
        } catch (error) {
            return NextResponse.json( { status: 500, message: error instanceof Error ? error.message : "Internal server Error" }, { status: 500 } );
        }
    }
}