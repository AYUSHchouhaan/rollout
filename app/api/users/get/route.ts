import { NextResponse } from "next/server";
import { getUser } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const user = await getUser(email);
    
    return NextResponse.json(user || null);
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
