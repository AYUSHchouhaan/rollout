import { NextResponse } from "next/server";
import { createUser } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { email, name, image, uuid } = await request.json();
    
    const user = await createUser({ email, name, image, uuid });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
