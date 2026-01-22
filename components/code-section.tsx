import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from "react";
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
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const { sandpackFiles, sandpackDependencies } = Lookup;

export interface CodeSectionRef {
  selectedContext: any;
  clearSelectedContext: () => void;
}

const CodeSection = forwardRef<CodeSectionRef>((props, ref) => {

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const { messages, setMessages } = useContext(MessageContext);
  const [files, setfiles] = useState(sandpackFiles);
  const [loading, setloading] = useState(false);
  const Updatefiles = useMutation(api.chats.updatefiles);
  const convex = useConvex();


  useEffect(() => {
    setIsInitialLoad(true);
    getfiles();
  }, [id]);

  const getfiles = async () => {
    const result = await convex.query(api.chats.getchats, {
      chatid: id as any
    });
    if (result?.files) {
      const mergefiles = { ...sandpackFiles, ...result.files };
      setfiles(mergefiles);
    } else {
      setfiles(sandpackFiles);
    }
    
    // Set the message count to match loaded messages to prevent regeneration
    if (result?.messages) {
      setMessageCount(result.messages.length);
    }
    setIsInitialLoad(false);
  }

  const [isGenerating, setIsGenerating] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const generatecode = async () => {
    if (isGenerating) return; // Prevent multiple simultaneous generations
    
    setIsGenerating(true);
    setloading(true);
    
    // Only send the last user message to avoid token limit issues
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const userPrompt = lastUserMessage?.content || '';
    
    let prompt = userPrompt + " " + Prompt.CODE_GEN_PROMPT;

    try {
      const response = await fetch('/api/chat/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      
      let filesToMerge = {};
      
      // Parse the response string if it contains JSON
      if (data.response && typeof data.response === 'string') {
        try {
          // Remove markdown code blocks if present
          let jsonString = data.response.trim();
          const codeBlockMatch = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
          if (codeBlockMatch) {
            jsonString = codeBlockMatch[1].trim();
          }
          
          // Parse the JSON
          const parsedData = JSON.parse(jsonString);
          if (parsedData.files && Object.keys(parsedData.files).length > 0) {
            filesToMerge = parsedData.files;
          }
        } catch (parseError) {
          console.warn('Failed to parse response JSON:', parseError);
        }
      }
      
      // Fallback to data.files if available
      if (Object.keys(filesToMerge).length === 0 && data.files && Object.keys(data.files).length > 0) {
        filesToMerge = data.files;
      }
      
      // Update files if we have any
      if (Object.keys(filesToMerge).length > 0) {
        const mergefiles = { ...sandpackFiles, ...filesToMerge };
        setfiles(mergefiles);
        await Updatefiles({
          chatid: id as any,
          files: filesToMerge
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
  }

  useImperativeHandle(ref, () => ({
    selectedContext: null,
    clearSelectedContext: () => {},
  }));

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
          {activeTab == 'code' ? <>
            <SandpackFileExplorer style={{ height: "80vh" }} />
            <SandpackCodeEditor style={{ height: "80vh" }} />
          </> :
            <>
              <SandpackPreview style={{ height: "80vh" }} showNavigator={true} />
            </>}  
        </SandpackLayout>
      </SandpackProvider>

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
});

CodeSection.displayName = 'CodeSection';

export default CodeSection;


