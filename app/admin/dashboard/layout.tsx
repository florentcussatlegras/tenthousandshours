"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-10 mx-auto max-w-[1536px]">
        {children}
    </section>
  );
}
