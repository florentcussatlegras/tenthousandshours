import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";

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
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Bonjour {session.user.name}</h1>
      </div>

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
          <Button variant="solid" color="primary">
            TOPICS
          </Button>
        )}

        {CATEGORY_TOPIC_ACCESS.success && (
          <Button>
            <Link href="/category-topic/">CATEGORY TOPICS</Link>
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

      {session.user.image ? (
        <img
          src={session.user.image}
          alt="User Image"
          className="size-24 border border-primary rounded-md object-cover"
        />
      ) : (
        <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
          <span className="uppercase text-lg font-bold">
            {session.user.name.slice(0, 2)}
          </span>
        </div>
      )}

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>

      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-blue-600">
        <h2 className="text-2xl font-bold">Update User</h2>

        <UpdateUserForm
          name={session.user.name}
          image={session.user.image ?? ""}
        />
      </div>
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-red-600">
        <h2 className="text-2xl font-bold">Change password</h2>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
