'use client'

import CodeSection, { CodeSectionRef } from "@/components/code-section";
import ChatSection from "@/components/chat-section";
import React, { useRef } from "react";

function ChatPage() {
    const codeSectionRef = useRef<CodeSectionRef>(null);

    return (
        <div className="flex flex-1 overflow-hidden gap-4 p-4 h-full">
            {/* Chat Section - Left side */}
            <div className="w-1/4 overflow-auto">
                <ChatSection codeSectionRef={codeSectionRef} />
            </div>
            
            {/* Code Section - Right side */}
            <div className="w-3/4 overflow-auto">
                <CodeSection ref={codeSectionRef} />
            </div>
        </div>
    );
}

export default ChatPage;