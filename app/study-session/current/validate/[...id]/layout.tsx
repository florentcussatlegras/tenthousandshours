"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function validateCurrentStudySessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <section className="flex flex-col items-start gap-6 py-8 md:py-10 max-w-[1536] mx-auto">
      <Breadcrumb steps={[{"label": "Valider la session en cours"}]} />
      <h1 className="text-3xl font-bold text-default-600">Validation de la session en cours</h1>
      <div className="inline-block w-full text-center justify-center">
        {children}
      </div>
    </section>

    // <section className="flex flex-col items-start gap-6 py-8 md:py-10 mx-auto max-w-[1536px]">
    //   <div className="mx-auto w-1/2 space-y-8">
    //   <Breadcrumb steps={[{"label": "Nouvel apprentissage"}]} />
    //     <div className="inline-block text-center justify-center w-full">
    //       {children}
    //     </div>
    //   </div>
    // </section>
  );
}
