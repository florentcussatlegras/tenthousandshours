"use client";

import { addToast, Button, Card, CardBody, Form, Input } from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forgetPassword } from "@/app/lib/auth-client";

export const ForgetPasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) {
      return addToast({
        title: "Erreur email",
        description: "Please enter your email",
      });
    }

    await forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          addToast({
            title: "Erreur envoi email réinitialisation du mot de passe",
            description: ctx.error.message,
          });
        },
        onSuccess: () => {
          router.push("/auth/forget-password/success");
        },
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="justify-center items-start mx-0 flex flex-col gap-6 w-full px-0"
    >

      <Input
        type="email"
        id="email"
        name="email"
        label="Email"
        labelPlacement="outside-top"
        size="lg"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="bg-sky-500 text-white font-bold dark:bg-default-500 dark:text-white uppercase"
      >
        Envoyer un lien de réinitialisation de votre mot de passe
      </Button>
      
    </Form>
  );
};
