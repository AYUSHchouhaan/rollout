import { NextResponse } from "next/server";
import { createChat } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { messages, userId } = await request.json();
    
    const chat = await createChat({ messages, userId });
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
