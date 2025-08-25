"use client";

import React from "react";
import { Button } from "@heroui/button";
import { signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = () => {
    const [isPending, setIsPending] = React.useState(false);
    const router = useRouter();
    
    async function handleClick() {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false)
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    router.push("/auth/sign-in");
                    router.refresh();
                }
            }
        });
    }

    return (
        <Button onPress={handleClick} color="light" disabled={isPending} className="p-0 h-4">
            Déconnexion
        </Button>
    );
}
