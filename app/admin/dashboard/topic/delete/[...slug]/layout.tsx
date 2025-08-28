"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import MenuAdminDashBoard from "@/components/menu-admin-dashboard";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full space-y-8">
      <Breadcrumb
        steps={[
          { label: "Tableau de bord administrateur" },
          { label: "Les matières", url: "/admin/dashboard/topic/list" },
          { label: "Suppression" },
        ]}
      />

      <h1 className="text-3xl font-bold">Supprimer une matière</h1>

      <div className="flex gap-4">
        <div className="w-1/4">
          <MenuAdminDashBoard keySelected="topic" />
        </div>
        <div className="w-3/4 bg-white box-border shadow-medium p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
