"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { SessionProvider, useSession } from "next-auth/react";
import { MessageContext } from "@/context/messagecontext";
import { UserContext } from "@/context/userdetailcontext";
import Navbar from "@/components/navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import axios from "axios";

function InnerProvider({ children }: { children: React.ReactNode }) {

    const [messages, setMessages] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState<any>({});
    const { data: session, status } = useSession();

    React.useEffect(() => {
        const syncUser = async () => {
            if (session?.user?.email) {
                try {
                    const result = await axios.get('/api/users/get', {
                        params: { email: session.user.email }
                    });
                    if (result.data) {
                        setUserDetails(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            } else if (status === 'unauthenticated') {
                setUserDetails({});
            }
        };
        syncUser();
    }, [session?.user?.email, status]);

    return (
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
    );
}

function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchOnWindowFocus={false} refetchInterval={5 * 60}>
            <InnerProvider>{children}</InnerProvider>
        </SessionProvider>
    );
}

export default Provider;