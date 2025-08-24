"use client";

import { addToast, Button, Card, CardBody, Form, Input } from '@heroui/react';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { forgetPassword } from '@/app/lib/auth-client';

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
            description: "Please enter your email"
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
            }
        }
    });

  }

  return (
      <Card className="w-1/2 p-6">
        <CardBody>
            <Form onSubmit={handleSubmit} className="flex flex-col justify-center items-stretch space-y-4 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <Input type="email" id="email" name="email" />
                </div>
                
                <Button type="submit" disabled={isPending} color="primary">
                    Envoyer un lien de réinitialisation de votre mot de passe
                </Button>
            </Form>
        </CardBody>
      </Card>
  );
}
