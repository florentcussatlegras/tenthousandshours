"use client";

import { addToast, Button, Card, CardBody, Form, Input } from '@heroui/react';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { sendVerificationEmail } from '@/app/lib/auth-client';

export const SendVerificationEmailForm = () => {
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

    console.log("we are here");

    await sendVerificationEmail({
        email,
        callbackURL: "/auth/verify",
        fetchOptions: {
            onRequest: () => {
                setIsPending(true);
            },
            onResponse: () => {
                setIsPending(false);
            },
            onError: (ctx) => {
                addToast({
                    title: "Erreur envoi email vérification",
                    description: "Une erreur est survenue lors de l'envoi de l'email de vérification",
                });
            },
            onSuccess: () => {
                router.push("/auth/verify/success");
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
                    Renvoyer l'email de vérification
                </Button>
            </Form>
        </CardBody>
      </Card>
  );
}
