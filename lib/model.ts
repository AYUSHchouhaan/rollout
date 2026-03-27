import {GoogleGenerativeAI} from '@google/generative-ai';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';

export const startOllamaChatSession = async () => {
  const sendMessage = async (message: string): Promise<string> => {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'user', content: message }],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content ?? '';
  };

  return { sendMessage };
};

export const createOllamaCodeGenerationSession = async () => {
  const sendMessage = async (message: string): Promise<string> => {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'user', content: message }],
        stream: false,
        options: { temperature: 0, num_predict: 8000 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content ?? '';
  };

  return { sendMessage };
};

// ─── Google / Gemini ──────────────────────────────────────────────────────────

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

  const sendMessage = async (message: string) => {
    const contents = [
      ...(history || []),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];
    
    return genModel.generateContentStream({
      contents,
      generationConfig,
    });
  };

  return { sendMessage };
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
  
  const sendMessage = async (message: string) => {
    const contents = [
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];
    
    return genModel.generateContentStream({
      contents,
      generationConfig: CodegenerationConfig,
    });
  };

  return { sendMessage };
};
