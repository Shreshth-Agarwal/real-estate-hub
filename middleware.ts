import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/dashboard", "/provider/:path*", "/projects", "/admin"],
};