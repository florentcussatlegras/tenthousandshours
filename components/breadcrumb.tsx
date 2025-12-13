"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

interface StepBreadcrumb {
  label: String;
  url?: Url;
}

export const Breadcrumb = ({ steps }: { steps: StepBreadcrumb[] }) => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/profile">Accueil</Link>
        </BreadcrumbItem>
        {steps.map((step) => (
          <BreadcrumbItem>
            {step.url ? <Link href={step.url}>{step.label}</Link> : step.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};
