"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@heroui/react";
import { useSession } from "@/app/lib/auth-client";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { title, subtitle } from "@/components/primitives";

// NOTE: Give the user some feedback about the form submission before being
// redirected by using a SubmitButton component that uses the useFormStatus hook

function GetStartedButton() {
  const { data: session, isPending } = useSession();

  if(isPending) {
    return (
        <Button>Get Started</Button>
    )
  }

  const href = session ? "/profile" : "/auth/sign-in";

  return <div className={subtitle({ class: "mt-4 flex flex-col items-center gap-4" })}>
            {session && (
                <p className="flex items-center gap-2">
                    <span 
                        data-role={session.user.role} 
                        className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600" 
                    />
                    Welcome back, {session.user.name}!
                </p>
            )}
            <Link
                className={buttonStyles({
                    color: "primary",
                })}
                href={href}>
                    Get Started
            </Link>
    </div>;
}

export default GetStartedButton;