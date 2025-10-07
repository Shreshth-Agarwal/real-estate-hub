import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rfqRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rfqId = parseInt(params.id);

    const [rfqRequest] = await db
      .select()
      .from(rfqRequests)
      .where(eq(rfqRequests.id, rfqId));

    if (!rfqRequest) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    return NextResponse.json({ rfqRequest });
  } catch (error) {
    console.error("Error fetching RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}