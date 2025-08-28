"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { AddIcon } from "@/components/icons";
import MenuAdminDashBoard from "@/components/menu-admin-dashboard";
import { Button } from "@heroui/button";
import Link from "next/link";

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
          { label: "Les  matières" },
        ]}
      />

      <div className="flex">
        <h1 className="text-3xl font-bold">Liste des matières</h1>

        <Button className="bg-black dark:bg-default-600 ml-auto">
          <Link
            href="/admin/dashboard/topic/new"
            className="flex flex-row items-center text-white dark:text-black gap-2"
          >
            <AddIcon />
            <span>Ajouter une matière</span>
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-1/4">
          <MenuAdminDashBoard keySelected="topic" />
        </div>
        <div className="w-3/4 bg-white box-border shadow-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
