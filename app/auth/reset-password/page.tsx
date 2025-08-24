import { ReturnButton } from "@/components/return-button";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/sign-in");

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8 w-full flex flex-col items-center">
        <ReturnButton href="/auth/sign-in" label="Sign In" />

        <h1 className="text-2xl font-bold">Réinitialiser votre mot de passe</h1>

        <p className="text-mute-foreground">
          Merci d'entrer votre nouveau mot de passe.
        </p>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
