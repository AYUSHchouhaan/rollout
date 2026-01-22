"use client";

import { UserContext } from "@/context/userdetailcontext";
import React from "react";

export default function PricingPage() {

    const {userDetails,setUserDetails} = React.useContext(UserContext);



  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold ">Pricing</h2>

      <div className="p-5 border rounded-xl mt-10 items-center">
        <h2 className="text-lg">
            <span className="font-bold">messages left: 
            {userDetails?.messagecount}
            </span>
            </h2>
        </div>        

    </div>
  );
}