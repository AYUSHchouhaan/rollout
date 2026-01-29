"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MessageContext } from "@/context/messagecontext";
import { UserContext } from "@/context/userdetailcontext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import axios from "axios";


function Provider({ children }: { children: React.ReactNode }) {

    const [messages, setMessages] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState<any>({});

    const isauthenticated = async()=>{
        if(typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.email) {
                try {
                    const result = await axios.post('/api/users/get', {
                        email: user.email
                    });
                    console.log('User details from database:', result.data);
                    if (result.data) {
                        setUserDetails(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        }
    }

    React.useEffect(() => {
        isauthenticated();
    }, []);

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <UserContext.Provider value={{ userDetails, setUserDetails }}>
            <MessageContext.Provider value={{ messages, setMessages }}>
                <NextThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                    disableTransitionOnChange={true}
                >
                    <SidebarProvider defaultOpen={false}>
                        {userDetails?.name && <AppSidebar />}
                        <SidebarInset className="flex flex-col w-full h-screen overflow-hidden">
                            <Navbar />
                            <div className="flex-1 overflow-hidden">
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </NextThemeProvider>
            </MessageContext.Provider>
        </UserContext.Provider>
        </GoogleOAuthProvider>
    );
}

export default Provider;