"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import Image from "next/image"
import { Button } from "./ui/button"
import { ChatHistory } from "./chathistory"

export function AppSidebar() {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image 
          src="/next.svg" 
          alt="Logo" 
          width={30} 
          height={30}
        />
      </SidebarHeader>
      <SidebarContent className="p-5 overflow-y-auto scrollbar-hide">
        <Button variant="outline" onClick={() => router.push('/')}>New Chat</Button>
        <SidebarGroup />
        <ChatHistory  />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}