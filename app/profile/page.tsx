
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");

  const FULL_STUDY_PROCESS_ACCESS = await auth.api.userHasPermission({
    headers: headerList,
    body: {
      userId: session.user.id,
      permissions: {
        studyProcesses: ["update", "delete"],
      },
    },
  });

  const CATEGORY_TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "ADMIN",
      permissions: {
        categoryTopic: ["create", "update", "delete"],
      },
    },
  });

  const TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "ADMIN",
      permissions: {
        topic: ["create", "update", "delete"],
      },
    },
  });

  return (
    <div className="py-8 container mx-auto max-w-screen-lg space-y-8">
      <Breadcrumb steps={[]} />
      
      <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
      </div>

      {/* <div className="text-2xl font-bold">Permissions</div> */}

      <div className="space-x-4">
        {TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/topic/list" className="text-white">TOPICS</Link>
          </Button>
        )}

        {CATEGORY_TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/category-topic/list" className="text-white">CATEGORY TOPICS</Link>
          </Button>
        )}

        <Button color="primary" variant="solid">
          MY STUDY PROCESSES
        </Button>

        {FULL_STUDY_PROCESS_ACCESS.success && (
          <Button variant="solid" color="primary">
            ALL STUDY PROCESSES
          </Button>
        )}
      </div>

      {/* <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre> */}

    </div>
  );
}
