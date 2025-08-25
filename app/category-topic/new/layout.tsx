"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 py-8 md:py-10">
      <Breadcrumb steps={['Catégories de matières', 'Nouvelle catégorie']} />
      <h1 className={title()}>Ajouter une catégorie de matière</h1>
      <div className="inline-block w-1/2 text-center justify-center">
        {children}
      </div>
    </section>
  );
}
