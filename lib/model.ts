
import {
  GoogleGenerativeAI,
} from '@google/generative-ai';

export async function initializeAI() {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  const config = {
    temperature: 0.7,
    maxOutputTokens: 1000,
  };
  
  const model = 'models/gemini-2.5-flash';
  
  return { ai, config, model };
}

export const startChatSession = async (generationConfig?: any, history?: any[]) => {
  const { ai, model } = await initializeAI();
  const genModel = ai.getGenerativeModel({ model });

  return {
    sendMessage: async (message: string) => {
      const contents = [
        ...(history || []),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];
      
      return await genModel.generateContentStream({
        contents,
        generationConfig,
      });
    }
  };
};

// Export individual components for direct use
export const defaultConfig = {
  temperature: 0.7,
  maxOutputTokens: 1000,
};

// Code generation configuration
export const CodegenerationConfig = {
  temperature: 0.7,
  maxOutputTokens: 8000,
};

// Function to create a code generation chat session
export const createCodeGenerationSession = async () => {
  const { ai, model } = await initializeAI();
  const genModel = ai.getGenerativeModel({ model });
  
  return {
    sendMessage: async (message: string) => {
      const contents = [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];
      
      return await genModel.generateContentStream({
        contents,
        generationConfig: CodegenerationConfig,
      });
    }
  };
};

