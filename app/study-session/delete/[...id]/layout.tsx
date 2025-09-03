"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import MenuAdminDashBoard from "@/components/menu-admin-dashboard";
import { title } from "@/components/primitives";

export default function StudySessionDeleteLayout({
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
