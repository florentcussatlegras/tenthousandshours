"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { title } from "@/components/primitives";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-0 md:py-10 max-w-[1536] mx-auto">
      <Breadcrumb steps={[{"label": "Mentions légales"}]} />
      <h1 className="text-3xl font-bold text-default-600">Mentions légales</h1>
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
