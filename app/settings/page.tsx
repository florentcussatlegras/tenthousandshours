"use client";

import { ChangePasswordForm } from "@/components/change-password-form";
import { UpdateUserForm } from "@/components/update-user-form";
import { Card } from "@heroui/react";
import React from "react";
import { useSession } from "../lib/auth-client";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-4">
          {session?.user.image ? (
            <img
              src={session?.user.image}
              alt="User Image"
              className="size-16 border border-primary rounded-full object-cover"
            />
          ) : (
            <div className="size-16 border border-primary rounded-full bg-sky-500 text-primary-foreground flex items-center justify-center">
              <span className="uppercase text-lg font-bold">
                {session?.user.firstname.slice(0, 2)}
              </span>
            </div>
          )}

          <div className="flex flex-col items-start justify-center">
            <span className="text-xl text-default-600 font-medium">
              {session?.user.firstname} {session?.user.name}
            </span>
            <span className="text-sm text-sky-500">{session?.user.email}</span>
          </div>
        </div>

        <div className="md:ml-auto text-xs md:text-sm rounded-full bg-success/20 text-success-700 px-4 py-2 font-semibold">
          Vous êtes inscrit le {new Intl.DateTimeFormat('fr-Fr', {dateStyle: 'medium'}).format(session?.user.createdAt)}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="p-6 w-full md:w-1/2 flex flex-col rounded-none">
          <h2 className="text-2xl font-bold text-default-600">
            Modification de l'utilisateur
          </h2>

          <UpdateUserForm
            name={session?.user.name}
            firstname={session?.user.firstname}
            image={session?.user.image ?? ""}
          />
        </Card>

        <Card className="p-6 w-full md:w-1/2 rounded-none">
          <h2 className="text-2xl font-bold text-default-600">
            Modification du mot de passe
          </h2>

          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
