import React, { createContext } from "react";

interface UserDetails {
  _id?: any;
  name?: string;
  email?: string;
  messagecount?:number;
  // Add other user properties as needed
}

interface UserContextType {
  userDetails: UserDetails;
  setUserDetails: any;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);
