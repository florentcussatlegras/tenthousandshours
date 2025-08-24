import { ReturnButton } from "@/components/return-button";
import { ForgetPasswordForm } from "../forget-password-form";

export default async function ForgetPasswordSuccessPage() {
    
  return (

        <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

            <div className="space-y-8 w-full flex flex-col items-center">

                <ReturnButton href="/auth/sign-in" label="Sign In" />

                <h1 className="text-2xl font-bold">Réinitialisation de votre mot de passe</h1>

                <p className="text-mute-foreground">
                    Nous vous avons renvoyé un lien par email afin que vous puissiez réinitialiser votre mot de passe.
                </p>

            </div>

        </div>

  );
}
