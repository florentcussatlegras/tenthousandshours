"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 mx-auto max-w-[1536px]">
      <Breadcrumb steps={[{"label": "Les matières"}]} />
      <h1 className="text-3xl font-bold">Liste des matières</h1>
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
