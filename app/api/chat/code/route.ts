import { createCodeGenerationSession, createOllamaCodeGenerationSession } from "@/lib/model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();
  console.log('🚀 Code generation request received, model:', model ?? 'google');
  console.log('📝 Prompt length:', prompt.length);
  
  try {
    let fullResponse = '';

    if (model === 'ollama') {
      console.log('⚙️ Using Ollama for code generation...');
      const codeSession = await createOllamaCodeGenerationSession();
      fullResponse = await codeSession.sendMessage(prompt);
      console.log('✅ Ollama response received, length:', fullResponse.length);
    } else {
      console.log('⚙️ Creating Google code generation session...');
      const codeSession = await createCodeGenerationSession();

      console.log('📤 Sending message to AI...');
      const result = await codeSession.sendMessage(prompt);

      console.log('📥 Streaming response chunks...');
      let chunkCount = 0;
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        chunkCount++;
        fullResponse += chunkText;
        console.log(`   📄 Chunk ${chunkCount}: ${chunkText}`);
      }
    }
    console.log('✅ Response received, length:', fullResponse.length);
    console.log('📋 Response preview:', fullResponse.substring(0, 300));

    // Try to parse as JSON
    try {
      let jsonString = fullResponse.trim();
      
      // Remove ```json and ``` if present (handle nested code blocks too)
      const codeBlockMatch = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }
      
      const parsedResponse = JSON.parse(jsonString);
      console.log('✅ Parsed successfully, files:', Object.keys(parsedResponse.files || {}));
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.log('❌ Parse error:', String(parseError));
      return NextResponse.json({
        response: fullResponse,
        files: {},
        projectTitle: "Generated Code",
        explanation: "Code generated successfully"
      });
    }
  } catch (e) {
    console.error('❌ Code generation error:', e);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}