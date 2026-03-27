import { NextResponse } from "next/server";
import { getUserChats } from "@/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') ?? '');

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

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
