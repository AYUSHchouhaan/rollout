import { NextResponse } from "next/server";
import { getChat } from "@/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = parseInt(searchParams.get('chatId') ?? '');

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
    }

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
