import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserContext } from "@/context/userdetailcontext";
import { useSidebar } from "./ui/sidebar";
import { Menu } from "lucide-react";
import SignInDialog from "./signindialog";
 
function Navbar() {

  const {userDetails, setUserDetails} = useContext(UserContext);
  const { toggleSidebar } = useSidebar();
  const [openSignInDialog, setOpenSignInDialog] = useState(false);

  return (
    <div className="p-4 flex items-center border-b">
        {/* Menu button on far left */}
        {userDetails.name && (
            <Button variant={"ghost"} size="icon" onClick={toggleSidebar} className="mr-3">
                <Menu className="h-5 w-5" />
            </Button>
        )}
        
        {/* Logo right next to menu button */}
        <Image src="/angry-panda-head-mascot-logo-vector.png" alt="Logo" width={40} height={40} />
        
        {/* Push sign in to the right */}
        <div className="ml-auto">
            {!userDetails.name && (
                <Button variant={"ghost"} onClick={() => setOpenSignInDialog(true)}>
                    Sign In
                </Button>
            )}
        </div>

        {/* Sign In Dialog */}
        <SignInDialog opendialog={openSignInDialog} closedialog={setOpenSignInDialog} />
    </div>
  );
}
export default Navbar;