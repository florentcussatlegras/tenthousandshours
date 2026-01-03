"use client";

import React from "react";
import { Button } from "@heroui/button";
import { signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import clsx from "clsx";

export const SignOutButton = ({
  gap = 1,
  charSize = "sm",
}: {
  gap?: number;
  charSize?: "xs" | "sm" | "md" | "lg";
}) => {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const gapClasses: Record<number, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
};

const textSizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};


  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          router.push("/auth/sign-in");
          router.refresh();
        },
      },
    });
  }

  return (
    <Button
      onPress={handleClick}
      disabled={isPending}
      variant="light"
      className={clsx(
        "flex items-center justify-start p-0 h-auto bg-transparent text-black dark:text-gray-200",
        "hover:bg-transparent data-[hover=true]:bg-transparent",
        "active:bg-transparent data-[active=true]:bg-transparent",
        gapClasses[gap],
        textSizeClasses[charSize]
      )}
    >
      <LogOut />
      Déconnexion
    </Button>
  );
};
