"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 max-w-[1536] mx-auto">
      <Breadcrumb steps={[{"label": "Les catégories de matières"}]} />
      <h1 className="text-3xl font-bold">Liste des catégories de matière</h1>
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
