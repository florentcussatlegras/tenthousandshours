"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function StudyProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 mx-auto max-w-[1536px]">
      <Breadcrumb steps={[{"label": "Ajout"}]} />
      <h1 className="text-3xl font-bold">Ajouter une processus d'étude</h1>
      <div className="inline-block w-1/2 text-center justify-center">
        {children}
      </div>
    </section>
  );
}
