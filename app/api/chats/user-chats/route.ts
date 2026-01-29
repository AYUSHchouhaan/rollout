import { NextResponse } from "next/server";
import { getUserChats } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    const chats = await getUserChats(userId);
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error getting user chats:", error);
    return NextResponse.json(
      { error: "Failed to get user chats" },
      { status: 500 }
    );
  }
}
