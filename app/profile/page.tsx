
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
      <Breadcrumb steps={[{"label": "Profile"}]} />
      <div className="space-y-8">
         <div className="flex gap-4">

        {session.user.image ? (
          <img
            src={session.user.image}
            alt="User Image"
            className="size-16 border border-primary rounded-full object-cover"
          />
        ) : (
          <div className="size-16 border border-primary rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <span className="uppercase text-lg font-bold">
              {session.user.name.slice(0, 2)}
            </span>
          </div>
        )}

        <div className="flex flex-col justify-center">
          <span className="text-md">{session.user.name}</span>
          <span className="text-sm text-default-400">{session.user.email}</span>
        </div>

      </div>
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

      <div className="flex flex-col md:flex-row gap-6">

        <Card className="p-6 w-full md:w-1/2">
          <h2 className="text-2xl font-bold">Modification de l'utilisateur</h2>

          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ""}
          />
        </Card>

        <Card className="p-6 w-full md:w-1/2">
          <h2 className="text-2xl font-bold">Modification du mot de passe</h2>

          <ChangePasswordForm />
        </Card>

      </div>

    </div>
  );
}
