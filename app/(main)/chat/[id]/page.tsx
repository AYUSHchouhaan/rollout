'use client'

import CodeSection from "@/components/code-section";
import ChatSection from "@/components/chat-section";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MessageContext } from "@/context/messagecontext";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

function ChatPage() {
    const { id } = useParams();
    const { setMessages } = useContext(MessageContext);
    const [initialFiles, setInitialFiles] = useState<Record<string, any> | null>(null);
    const [chatLoaded, setChatLoaded] = useState(false);
    const [selectedModel, setSelectedModel] = useState<'google' | 'ollama'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('selectedModel') as 'google' | 'ollama') || 'google';
        }
        return 'google';
    });

    // Single API call to load chat data for both ChatSection and CodeSection
    useEffect(() => {
        const loadChat = async () => {
            try {
                const result = await axios.get('/api/chats/get', {
                    params: { chatId: parseInt(id as string) }
                });
                if (result.data) {
                    setMessages(result.data.messages || []);
                    setInitialFiles(result.data.files || null);
                }
            } catch (error) {
                console.error('Error loading chat:', error);
            }
            setChatLoaded(true);
        };
        if (id) loadChat();
    }, [id]);

    if (!chatLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2Icon className="animate-spin h-6 w-6 text-purple-400" />
            </div>
        );
    }

    return (
        <div className="flex flex-1 overflow-hidden gap-4 p-4 h-full">
            {/* Chat Section - Left side */}
            <div className="w-1/4 overflow-auto">
                <ChatSection
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                />
            </div>
            
            {/* Code Section - Right side */}
            <div className="w-3/4 overflow-auto">
                <CodeSection
                    selectedModel={selectedModel}
                    initialFiles={initialFiles}
                />
            </div>
        </div>
    );
}

export default ChatPage;