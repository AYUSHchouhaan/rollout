"use client";

import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext as MessagesContext } from "@/context/messagecontext";
import { UserContext } from "@/context/userdetailcontext";
import { ArrowRight, Loader2Icon } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Prompt from "@/public/Prompt";
import { useSidebar } from "./ui/sidebar";

interface ChatSectionProps {
  selectedModel: 'google' | 'ollama';
  onModelChange: (model: 'google' | 'ollama') => void;
}

function ChatSection({ selectedModel, onModelChange }: ChatSectionProps) {
  const { id } = useParams();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const {toggleSidebar} = useSidebar();

  const [input, setInput] = useState("");
  const [loading, setloading] = useState(false);
  const isProcessingRef = useRef(false);


  const getairesponse = async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setloading(true);
    const prompt = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post('/api/chat', {
      prompt,
      model: selectedModel,
    });
    
    const updatedMessages = [
      ...messages, {
        role: 'assistant',
        content: result.data.response
      }];
    
    setMessages(updatedMessages);
    
    await axios.post('/api/chats/update-messages', {
      chatId: parseInt(id as string),
      messages: updatedMessages
    });
    
    const messagecount = (userDetails?.messagecount ?? 0) - 1;
    if (userDetails?.id) {
      await axios.post('/api/users/update-message-count', {
        userId: userDetails.id,
        messagecount
      });
    }
    setloading(false);
    isProcessingRef.current = false;
  };

  const ongenerate = (input: string) => {
    if (isProcessingRef.current) return;
    
    setMessages((prev: any) => [
      ...prev,
      {
        role: "user",
        content: input
      }
    ]);
    setInput("");
  }

  useEffect(() => {
    if (messages.length > 0 && !isProcessingRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        getairesponse();
      }
    }
  }, [messages.length]);


  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide ">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg mb-2 ${
              message.role === 'user' 
                ? 'bg-gray-200 dark:bg-gray-800 ml-8' 
                : 'bg-transparent'
            }`}
          >
            <div className="whitespace-pre-line break-words">
              {message.role === 'assistant' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="p-3 rounded-lg mb-2 flex gap-2 items-center">
          <Loader2Icon className="animate-spin" />
          <span>generating...</span>
        </div>}
      </div>

      {/* input section  */}
      <div className="p-4 border-rounded-xl max-w-xl w-full mt-3">
        <div className="flex fl`ex-col gap-2 p-3 border rounded-xl bg-gray-50 dark:bg-gray-900">
          <textarea placeholder="Type your idea here..."
            value={input}
            className="outline-none bg-transparent w-full h-24 resize-none"
            onChange={(event) => setInput(event.target.value)} />
          <div className="flex items-center justify-between">
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value as 'google' | 'ollama')}
              className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer outline-none"
            >
              <option value="google">Google Gemini</option>
              <option value="ollama">Ollama (Local)</option>
            </select>
            {input && <ArrowRight
              onClick={() => ongenerate(input)}
              className="bg-purple-500 p-2 h-10 w-10 rounded-md cursor-pointer flex-shrink-0" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
