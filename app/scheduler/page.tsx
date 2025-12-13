import Scheduler from "@/components/scheduler";
import * as React from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SchedulerPage() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");
  return (
    <div className="w-full space-y-6">
      <Breadcrumb
        steps={[
          { label: "Calendrier" },
        ]}
      />
      <h1 className="text-3xl font-bold">Mon calendrier</h1>
      <Scheduler defaultDate={new Date()}></Scheduler>
    </div>
  );
}
