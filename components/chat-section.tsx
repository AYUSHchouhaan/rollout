"use client";

import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState, RefObject } from "react";
import { MessageContext as MessagesContext } from "@/context/messagecontext";
import { UserContext } from "@/context/userdetailcontext";
import { ArrowRight, Loader2Icon } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Prompt from "@/public/Prompt";
import { useSidebar } from "./ui/sidebar";

interface ChatSectionProps {
  codeSectionRef: RefObject<any>;
}

function ChatSection({ codeSectionRef }: ChatSectionProps) {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const {toggleSidebar} = useSidebar();
  const updatemessage = useMutation(api.chats.updatemessages);

  const [input, setInput] = useState("");
  const [loading, setloading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const updatemessagecount = useMutation(api.user.updateMessageCount);

  const getchatdata = async () => {
    const result = await convex.query(api.chats.getchats, {
      chatid: id as any
    });
    setMessages(result?.messages || []);
    console.log(result);
  };


  const getairesponse = async () => {
    if (isProcessing) return; // Prevent duplicate calls
    
    setIsProcessing(true);
    setloading(true);
    const prompt = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post('/api/chat', {
      prompt
    });
    
    const updatedMessages = [
      ...messages, {
        role: 'assistant',
        content: result.data.response
      }];
    
    setMessages(updatedMessages);
    
    await updatemessage({
      chatid: id as any,
      messages: updatedMessages
    });
    const messagecount = (userDetails?.messagecount ?? 0) - 1;
    if (userDetails?._id) {
      await updatemessagecount({
        messagecount,
        userid: userDetails._id
      });
    }
    setloading(false);
    setIsProcessing(false);
  };

  const ongenerate = (input: string) => {
    if (isProcessing) return; 
    
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
    if (messages.length > 0 && !isProcessing) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        getairesponse();
      }
    }
  }, [messages.length]); 

  
  useEffect(() => {
    id && getchatdata();
  }, [id]);


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
        <div className="flex gap-2 p-3 border rounded-xl bg-gray-50 dark:bg-gray-900">
          <textarea placeholder="Type your idea here..."
            value={input}
            className="outline-none bg-transparent w-full h-24 resize-none"
            onChange={(event) => setInput(event.target.value)} />
          {input && <ArrowRight
            onClick={() => ongenerate(input)}
            className="bg-purple-500 p-2 h-10 w-10 rounded-md cursor-pointer flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
