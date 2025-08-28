"use client";

import { changePasswordAction } from "@/app/actions/change-password.action";
import { updateUser } from "@/app/lib/auth-client";
import { addToast, Button, Form, Input } from "@heroui/react";
import { changePassword } from "better-auth/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(false);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await changePasswordAction(formData);
    console.log(error);
    if (error) {
      addToast({
        title: "Erreur changement mot de passe",
        description: error,
        color: "danger",
      });
    } else {
      addToast({
        title: "Succès changement mot de passe",
        description: "Votre mot de passe a bien été modifié",
        color: "success",
      });
      (evt.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        type="password"
        id="currentPassword"
        name="currentPassword"
        label="Mot de passe actuel"
        labelPlacement="inside"
        classNames={{
          label: "self-start"
        }}
        size="md"
      />

      <Input
        type="password"
        id="newPassword"
        name="newPassword"
        label="Nouveau mot de passe"
        labelPlacement="inside"
        classNames={{
          label: "self-start"
        }}
        size="md"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="bg-sky-500 text-white uppercase font-bold dark:text-black dark:bg-default-600"
      >
        Valider
      </Button>
    </Form>
  );
};
