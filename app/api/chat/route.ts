import { startChatSession } from "@/lib/model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        const chatSession = await startChatSession();
        
        const result = await chatSession.sendMessage(prompt);
        
        // Collect all streaming chunks into a single response
        let airesponse = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            airesponse += chunkText;
        }

        return NextResponse.json({ response: airesponse });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}