"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function CurrentStudySessionDeleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 max-w-[1536] mx-auto">
      <Breadcrumb steps={[{ label: "Nouvelle session de travail" }]} />
      <h1 className="text-3xl font-bold text-default-600">Valider votre session de travail en {localStorage.getItem('current_study_session_topic_name')}</h1>
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
