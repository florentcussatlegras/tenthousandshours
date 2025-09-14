import Scheduler from "@/components/scheduler";
import * as React from "react";
import { Breadcrumb } from "@/components/breadcrumb";

export default async function SchedulerPage() {
  return (
    <div className="w-full space-y-6">
      <Breadcrumb
        steps={[
          { label: "Mes apprentissages", url: "/profile" },
          { label: "Mes sessions de travail" },
        ]}
      />
      <h1 className="text-3xl font-bold">Mes sessions de travail</h1>
        <Scheduler defaultDate={new Date()}></Scheduler>
    </div>
  );
}
