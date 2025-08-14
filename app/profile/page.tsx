import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default async function Page() {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList,
    });

    if (!session) redirect("auth/sign-in");

    const FULL_POST_ACCESS = await auth.api.userHasPermission({
        headers: headerList,
        body: {
            userId: session.user.id,
            permissions: {
                studyProcesses: ["update", "delete"],
            }
        }
    });
    
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Profile</h1>
            </div>

            <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                    <Button>
                        <Link href="/admin/dashboard">Admin Dashboard</Link>
                    </Button>
                )}
                
                <SignOutButton />
            </div>

            <div className="text-2xl font-bold">Permissions</div>

            <div className="space-x-4">
                <Button color="primary" variant="solid">MANAGE OWN STUDY PROCESSES</Button>
                <Button variant={FULL_POST_ACCESS.success ? "solid" : "flat"} color="primary" disabled={!FULL_POST_ACCESS.success}>MANAGE ALL STUDY PROCESSES</Button>
            </div>

            <pre className="text-sm overflow-clip">
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    );
}