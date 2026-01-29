import React, { createContext } from "react";

interface UserDetails {
  id?: number;
  _id?: any; // Keep for backward compatibility during transition
  name?: string;
  email?: string;
  messagecount?:number;
  image?: string;
  uuid?: string;
  // Add other user properties as needed
}

interface UserContextType {
  userDetails: UserDetails;
  setUserDetails: any;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);
