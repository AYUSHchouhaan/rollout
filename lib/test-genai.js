import 'dotenv/config';
import { startChatSession } from './model.ts';

async function test() {
  console.log('Testing Google Generative AI...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found ✓' : 'Not found ✗');
  
  try {
    const chatSession = await startChatSession();
    console.log('Chat session created ✓');
    
    const response = await chatSession.sendMessage('Say hello in 5 words');
    console.log('Response received ✓');
    
    // Read the stream
    console.log('\nAI Response:');
    for await (const chunk of response.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
    
    console.log('\n\n✓ Test successful!');
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

test();
