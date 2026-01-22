"use client";

import { UserContext } from '@/context/userdetailcontext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { use, useContext, useEffect } from 'react';
import { useSidebar } from './ui/sidebar';

export function ChatHistory() {

    const {userDetails, setUserDetails} = useContext(UserContext);
    const [chatlist,setchatlist] = React.useState<any[]>();
    const {toggleSidebar} = useSidebar()
    const convex = useConvex();

    const fetchChats = async()=>{
        if (!userDetails?._id) {
            console.log('Cannot fetch chats: userDetails._id is missing');
            return;
        }
        const result = await convex.query(api.chats.getuserchats,{
            userid: userDetails._id
        })
        setchatlist(result as any);
    };

    useEffect(()=>{
        if (userDetails?._id) {
            fetchChats();
        }
    },[userDetails])



  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">Chat History</h2>
        <div>
            {chatlist && chatlist.map((chat, index) => (
                <Link key={index} href={`/chat/${chat?._id}`} className='flex flex-col border-b py-2'>
                    <div onClick={toggleSidebar} className='text-sm text-gray-400 mt-2 font-light hover:text-purple-400 '>
                        {chat.messages[0]?.content}
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
}