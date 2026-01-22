import { LogOut, Settings, Wallet } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SidebarFooter() {

    const router = useRouter();

    const options = [
        {
            name: 'subscription',
            icon : Wallet,
            path: '/pricing'
        },
        {
            name: 'log out',
            icon :LogOut,
            action: 'logout' 
        }
     ];
    const navigateTo = (option:any) => {
        if (option.path) {
            router.push(option.path);
        } else if (option.action === 'logout') {
            console.log('Logging out...');
        }
    }

  return (
   <div className="p-2 mb-10">
    {options.map((option,index) => (
        <Button variant="ghost" 
        key={index} 
        className="w-full flex justify-start" 
        onClick={() => navigateTo(option)}>
            <option.icon/>
            {option.name}
        </Button>
    ))}
   </div>
  )
}
