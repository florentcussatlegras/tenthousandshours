"use client";

import { addToast, Button, Card, CardBody, Form, Input } from '@heroui/react';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { resetPassword } from '@/app/lib/auth-client';

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
    if (password !== confirmPassword){
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
            }
        }
    });
  }

  return (
      <Card className="w-1/2 p-6">
        <CardBody>
            <Form onSubmit={handleSubmit} className="flex flex-col justify-center items-stretch space-y-4 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Nouveau mot de passe</label>
                    <Input type="password" id="password" name="password" />
                </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
                    <Input type="password" id="confirmPassword" name="confirmPassword" />
                </div>
                
                <Button type="submit" disabled={isPending} color="primary">
                    Réinitialiser le mot de passe
                </Button>
            </Form>
        </CardBody>
      </Card>
  );
}
