import { startChatSession, startOllamaChatSession } from "@/lib/model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt, model } = await request.json();

        if (model === 'ollama') {
            const session = await startOllamaChatSession();
            const response = await session.sendMessage(prompt);
            return NextResponse.json({ response });
        }

        // Default: Google Gemini
        const chatSession = await startChatSession();
        const result = await chatSession.sendMessage(prompt);

        let airesponse = '';
        for await (const chunk of result.stream) {
            airesponse += chunk.text();
        }

        return NextResponse.json({ response: airesponse });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}