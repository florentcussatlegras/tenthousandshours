"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function StudyProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 mx-auto max-w-[1536px]">
      <div className="mx-auto w-1/2 space-y-8">
      <Breadcrumb steps={[{"label": "Nouvel aprentissage"}]} />
        <div className="inline-block text-center justify-center w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
