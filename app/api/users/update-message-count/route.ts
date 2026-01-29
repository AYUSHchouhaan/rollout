import { NextResponse } from "next/server";
import { updateMessageCount } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { userId, messagecount } = await request.json();
    
    const user = await updateMessageCount(userId, messagecount);
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating message count:", error);
    return NextResponse.json(
      { error: "Failed to update message count" },
      { status: 500 }
    );
  }
}
