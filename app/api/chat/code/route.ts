import { createCodeGenerationSession } from "@/lib/model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log('🚀 Code generation request received');
  console.log('📝 Prompt length:', prompt.length);
  
  try {
    console.log('⚙️ Creating code generation session...');
    const codeSession = await createCodeGenerationSession();
    
    console.log('📤 Sending message to AI...');
    const result = await codeSession.sendMessage(prompt);
    
    let fullResponse = '';
    console.log('📥 Streaming response chunks...');
    let chunkCount = 0;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      chunkCount++;
      fullResponse += chunkText;
      console.log(`   Chunk ${chunkCount}: ${chunkText.substring(0, 100)}...`);
    }
    console.log('✅ Response received, length:', fullResponse.length);

    // Try to parse as JSON
    try {
      let jsonString = fullResponse.trim();
      
      // Remove ```json and ``` if present
      jsonString = jsonString.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
      
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