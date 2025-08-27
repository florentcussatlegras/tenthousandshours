"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import MenuAdminDashBoard from "@/components/menu-admin-dashboard";
import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="w-full space-y-8">
    
        <Breadcrumb steps={[{"label": "Les matières", "url": "/topic/list"}, {"label": "Ajout"}]} />
  
        <h1 className="text-3xl font-bold">Ajouter une matière</h1>
  
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
