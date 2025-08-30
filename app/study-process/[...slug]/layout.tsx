"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function StudyProcessDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start py-8 md:py-10 max-w-[1536] mx-auto">
      {children}
    </section>
  );
}
