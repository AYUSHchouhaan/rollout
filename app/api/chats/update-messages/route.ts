import { NextResponse } from "next/server";
import { updateMessages } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { chatId, messages } = await request.json();
    
    const chat = await updateMessages(chatId, messages);
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error updating messages:", error);
    return NextResponse.json(
      { error: "Failed to update messages" },
      { status: 500 }
    );
  }
}
