"use client";

import { ForgetPasswordForm } from "./forget-password-form";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function ForgetPasswordPage() {
  return (
    <Card className="w-2/3 flex flex-col items-center p-6" shadow="none">
      <CardHeader className="flex flex-col gap-2 mb-4 items-start">
        <h1 className="text-4xl font-bold mb-4 text-default-600">
          Mot de passe oublié
        </h1>
        <p className="text-mute-foreground">
          Merci de saisir votre adresse email afin de recevoir un lien pour
          resaisir votre mot de passe.
        </p>
      </CardHeader>
      <CardBody className="overflow-x-hidden">
        <ForgetPasswordForm />
      </CardBody>
    </Card>
  );
}
