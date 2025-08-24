import { ReturnButton } from "@/components/return-button";
import { SendVerificationEmailForm } from "@/app/auth/verify/send-verification-email-form";
import { Card, CardBody } from "@heroui/react";
import { redirect } from "next/navigation";

interface SignInErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function VerifyPage({
  searchParams,
}: SignInErrorPageProps) {
  const error = (await searchParams).error;

  if (!error) redirect("/profile");

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8 w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold">Email de vérification</h1>

        <p className="text-red-600 text-center">
          {error === "invalid_token" || error === "token_expired"
            ? "Votre token est invalide ou a expiré. Merci d'en récupérer un nouveau."
            : error === "email_not_verified"
              ? "Merci de valider votre inscription depuis l'email de vérification que nous vous avons envoyé, ou refaire une demande d'envoi d'email de vérification"
              : "Oops! Une erreur s'est produite. Merci d'essayer à nouveau."}
        </p>

        <SendVerificationEmailForm />
      </div>
    </div>
  );
}
