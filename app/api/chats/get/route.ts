import { NextResponse } from "next/server";
import { getChat } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { chatId } = await request.json();
    
    const chat = await getChat(chatId);
    
    return NextResponse.json(chat || null);
  } catch (error) {
    console.error("Error getting chat:", error);
    return NextResponse.json(
      { error: "Failed to get chat" },
      { status: 500 }
    );
  }
}
