import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../sign-out/sign-out-button";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Profile</h1>
            </div>

            <SignOutButton />

            <pre className="text-sm overflow-clip">
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    );
}