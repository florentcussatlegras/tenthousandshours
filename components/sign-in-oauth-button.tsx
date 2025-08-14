"use client";

import { signIn } from "@/app/lib/auth-client";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import React, { useState } from "react";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/auth/sign-in/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          addToast({
            title: "Erreur identification",
            description: "Une erreur s'est produite lors de l'identification",
            color: "warning",
          });
        },
      },
    });
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "Github";

  return (
    <Button onPress={handleClick} className="w-2/3" variant="faded">
      Sign {action} with {providerName}
    </Button>
  );
};
