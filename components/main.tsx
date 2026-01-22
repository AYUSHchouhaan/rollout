"use client"

import { MessageContext } from "@/context/messagecontext";
import { UserContext } from "@/context/userdetailcontext";
import { ArrowRight } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import SignInDialog from "./signindialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Main() {
  const [input, setInput] = useState("");  
  const [opendialog, setOpendialog] = useState(false);

  const {userDetails, setUserDetails} = useContext(UserContext);
  const { messages, setMessages } = useContext(MessageContext);
  const router = useRouter();
  const createchat = useMutation(api.chats.createchat);
  
  // Monitor userDetails changes
  useEffect(() => {
    console.log('UserDetails changed in Main:', userDetails);
  }, [userDetails]);
  
  const ongenerate = async (input: string) => {
    console.log('Current userDetails:', userDetails); // Debug log
    
    if (!userDetails?.name) {
      console.log('User not authenticated, opening dialog');
      setOpendialog(true);
      return;
    }

    setMessages([
      {
        role: "user",
        content: input
      }
    ]);

    const chatid = await createchat({
      user: userDetails._id,
      messages: [
        {
          role: "user",
          content: input
        }
      ]
    });
    router.push(`/chat/${chatid}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="flex flex-col gap-8 w-full max-w-2xl px-4">
        <h2 className="font-bold text-4xl text-center">Let's build something</h2>
        
        <div className="relative w-full">
          <div className="flex items-end gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow">
            <textarea 
              placeholder="Type your idea here..." 
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                  e.preventDefault();
                  ongenerate(input);
                }
              }}
              className="outline-none bg-transparent w-full h-12 max-h-40 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {input.trim() && (
              <button
                onClick={() => ongenerate(input)}
                className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 p-2 h-10 w-10 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-110"
              >
                <ArrowRight size={20} className="text-white" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Press Enter or click the button to start building
        </p>
      </div>
      <SignInDialog opendialog={opendialog} closedialog={() => setOpendialog(false)}/>
    </div>
  );
}

export default Main;
