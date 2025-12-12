"use client";

import { admin } from "@/app/lib/auth-client";
import { addToast } from "@heroui/react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserRoleSelectProps {
    userId: string;
    role: UserRole;
}

export const UserRoleSelect = ({ userId, role }: UserRoleSelectProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = evt.target.value as UserRole;

    const roleForAuth = newRole === "ADMIN" ? "admin" : "user";

    const canChangeRole = await admin.hasPermission({
        permissions: {
            user: ["set-role"],
        }
    });

    if (canChangeRole.error) {
        return addToast({
            title: "Erreurs changements droits",
            description: "Une erreur s'est produite",
            color: "warning",
        });
    }

    await admin.setRole({
        userId,
        role: roleForAuth,
        fetchOptions: {
            onRequest: () => {
                setIsPending(true);
            },
            onResponse: () => {
                setIsPending(false);
            },
            onError: (ctx) => {
                addToast({
                    title: "Erreurs droits",
                    description: ctx.error.message,
                    color: "warning",
                });
            },
            onSuccess: () => {
                addToast({
                    title: "Succès changement role",
                    description: "Le role a bien été modifié",
                    color: "success",
                });
                router.refresh();
            }
        }
    });
  }

  return (
    <select
        value={role}
        onChange={handleChange}
        disabled={role === "ADMIN" || isPending}
        className="px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
    </select>
  )
}
