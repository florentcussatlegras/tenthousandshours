"use client";

import { addToast, Button, Card, CardBody, Form, Input } from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/lib/auth-client";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const password = String(formData.get("password"));

    if (!password) {
      return addToast({
        title: "Erreur mot de passe",
        description: "Merci de saisir votre mot de passe.",
        color: "danger",
      });
    }

    const confirmPassword = String(formData.get("confirmPassword"));
    if (password !== confirmPassword) {
      return addToast({
        title: "Erreur mot de passe",
        description: "Merci de resaisir le même mot de passe.",
        color: "danger",
      });
    }

    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          addToast({
            title: "Erreur réinitialisation du mot de passe",
            description: ctx.error.message,
            color: "danger",
          });
        },
        onSuccess: () => {
          router.push("/auth/reset-password/success");
        },
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="justify-center items-start mx-auto flex flex-col gap-6 w-full"
    >

        <Input
          type="password"
          id="password"
          name="password"
          label="Mot de passe"
          labelPlacement="outside-top"
          size="lg"
        />

        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmez le mot de passe"
          labelPlacement="outside-top"
          size="lg"
        />

        <Button
            type="submit"
            disabled={isPending}
            className="bg-sky-500 text-white font-bold uppercase dark:bg-default-500 dark:text-white"
        >
            Réinitialiser le mot de passe
        </Button>

    </Form>
  );
};
