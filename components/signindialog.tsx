"use client"

import React, { useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";  
import { UserContext } from "@/context/userdetailcontext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";

function SignInDialog({ opendialog, closedialog }: any) {

    const CreateUser = useMutation(api.user.createUser)
    const {userDetails, setUserDetails} = useContext(UserContext);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            console.log('Google login success:', credentialResponse);
            
            // Decode JWT token to get user info
            const base64Url = credentialResponse.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const user = JSON.parse(jsonPayload);
            console.log('User info from Google:', user);

            const createdUser = await CreateUser({
                email: user.email,
                name: user.name,
                image: user.picture,
                uuid: uuid4(),
            });

            console.log('Created/fetched user from Convex:', createdUser);

            if (!createdUser) {
                console.error('Failed to create/fetch user from Convex');
                alert('Failed to sign in. Please make sure Convex is running.');
                return;
            }

            // Save Convex user data (with _id) to both localStorage and context
            if(typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(createdUser));
                console.log('Saved to localStorage:', createdUser);
            }

            setUserDetails(createdUser);                
            closedialog(false);

        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error);
        }
    };

    return (
        <div>
            <Dialog open={opendialog} onOpenChange={closedialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex flex-col item-center justify-center gap-4">
                                <h2 className="font-bold text-2xl text-center">
                                    Please sign in to continue
                                </h2>
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => console.log('Login Failed')}
                                        theme="filled_blue"
                                        size="large"
                                        shape="rectangular"
                                        logo_alignment="left"
                                        width="300"
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}



export default SignInDialog;