import { NextResponse } from "next/server";
import { updateFiles } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { chatId, files } = await request.json();
    
    const chat = await updateFiles(chatId, files);
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error updating files:", error);
    return NextResponse.json(
      { error: "Failed to update files" },
      { status: 500 }
    );
  }
}
