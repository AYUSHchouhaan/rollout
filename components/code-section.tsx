import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import Lookup from "@/public/Lookup";
import { MessageContext } from "@/context/messagecontext";
import Prompt from "@/public/Prompt";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

const { sandpackFiles, sandpackDependencies } = Lookup;

function CodeSection({ selectedModel = 'google', initialFiles = null }: {
  selectedModel?: 'google' | 'ollama';
  initialFiles?: Record<string, any> | null;
}) {

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const { messages, setMessages } = useContext(MessageContext);
  const [files, setfiles] = useState(sandpackFiles);
  const [loading, setloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const generationRef = useRef<Promise<void> | null>(null);
  // Track custom (non-default) files separately for DB persistence
  const customFilesRef = useRef<Record<string, any>>(initialFiles || {});

  // Initialize from parent-provided data (no duplicate API call)
  useEffect(() => {
    customFilesRef.current = initialFiles || {};
    if (initialFiles) {
      setfiles({ ...sandpackFiles, ...initialFiles });
    } else {
      setfiles(sandpackFiles);
    }
    // Match message count to prevent regeneration on initial load
    setMessageCount(messages.length);
    setIsInitialLoad(false);
  }, []);

  const generatecode = async () => {
    if (generationRef.current) return; // Prevent multiple simultaneous generations

    const generation = (async () => {
      setIsGenerating(true);
      setloading(true);
    
    // Include existing files and conversation history for context
    const existingCustomFiles = customFilesRef.current;
    const hasExistingFiles = Object.keys(existingCustomFiles).length > 0;
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const userPrompt = lastUserMessage?.content || '';
    
    let prompt = '';
    if (hasExistingFiles) {
      prompt += `Existing project files:\n${JSON.stringify(existingCustomFiles)}\n\n`;
    }
    if (messages.length > 1) {
      const recentMessages = messages.slice(-10); // recent context
      prompt += `Recent conversation:\n${JSON.stringify(recentMessages)}\n\n`;
    }
    prompt += `Latest request: ${userPrompt}\n\n`;
    if (hasExistingFiles) {
      prompt += `Update the existing project based on the latest request. Keep unchanged files as-is and only modify what's needed.\n\n`;
    }
    prompt += Prompt.CODE_GEN_PROMPT;

    try {
      const response = await fetch('/api/chat/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, model: selectedModel }),
      });

      const data = await response.json();
      
      // Server already parses the LLM response — just use data.files directly
      const filesToMerge = (data.files && Object.keys(data.files).length > 0) ? data.files : {};
      
      // Update files if we have any — merge with existing custom files
      if (Object.keys(filesToMerge).length > 0) {
        customFilesRef.current = { ...customFilesRef.current, ...filesToMerge };
        const mergefiles = { ...sandpackFiles, ...customFilesRef.current };
        setfiles(mergefiles);
        await axios.post('/api/chats/update-files', {
          chatId: parseInt(id as string),
          files: customFilesRef.current
        });
        console.log('✅ Files updated successfully:', Object.keys(filesToMerge));
      } else {
        console.warn('⚠️ No files found in response');
      }

      setloading(false);
      setIsGenerating(false);

    } catch (error) {
      console.error('Error generating code:', error);
      setloading(false);
      setIsGenerating(false);
    }
    })();

    generationRef.current = generation;
    try {
      await generation;
    } finally {
      generationRef.current = null;
    }
  }

  useEffect(() => {
    // Skip if we're still loading initial data
    if (isInitialLoad) return;
    
    // Only generate code for NEW messages, not when loading existing chat history
    if (messages.length > 0 && messages.length > messageCount && !isGenerating) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        generatecode();
      }
      setMessageCount(messages.length);
    }
  }, [messages.length]);

  return (
    <div className="relative h-full flex flex-col">
      <div className='bg-[#181818] w-full p-2 border'>
        <div className='flex items-center justify-center flex-wrap shrink-0'>
          <div className='bg-black p-1 justify-center gap-3 rounded-full flex items-center'>
            <h2 className={`text-sm cursor-pointer
              ${activeTab === "code" ? "text-purple-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
              onClick={() => setActiveTab("code")}>
              Code
            </h2>
            
            <h2 className={`text-sm cursor-pointer
              ${activeTab === "preview" ? "text-purple-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
              onClick={() => setActiveTab("preview")}>
              Preview
            </h2>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden scrollbar-hide">
        <SandpackProvider
          template="react"
          theme="dark"    
          files={files}
          customSetup={{
            dependencies: sandpackDependencies,
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <div style={{ display: activeTab === 'code' ? 'flex' : 'none', width: '100%', height: '100%' }}>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </div>
            <div style={{ display: activeTab === 'preview' ? 'block' : 'none', width: '100%', height: '100%' }}>
              <SandpackPreview style={{ height: "80vh" }} showNavigator={true} />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {loading && (
        <div className="p-10 bg-gray-900 bg-opacity-50 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin h-6 w-6 text-purple-400" />
            <span className="text-white">Generating code...</span>
          </div>
        </div>
      )}
    </div >
  );
}

export default CodeSection;

