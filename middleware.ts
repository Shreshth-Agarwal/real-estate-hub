import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard", "/provider/dashboard", "/provider/catalog", "/provider/kyc", "/provider/rfq", "/projects", "/admin"],
};
