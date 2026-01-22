import React, { createContext } from "react";

interface Message {
	role: string;
	content: string;
}

interface MessageContextType {
	messages: Message[];
	setMessages: any;
}

export const MessageContext = createContext<MessageContextType>({} as MessageContextType);