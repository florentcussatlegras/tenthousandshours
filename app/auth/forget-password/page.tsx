import { ReturnButton } from "@/components/return-button";
import { ForgetPasswordForm } from "./forget-password-form";

export default async function ForgetPasswordPage() {
    
  return (

        <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

            <div className="space-y-8 w-full flex flex-col items-center">

                <ReturnButton href="/auth/sign-in" label="Sign In" />

                <h1 className="text-2xl font-bold">Mot de passe oublié</h1>

                <p className="text-mute-foreground">
                    Merci de saisir votre adresse email afin de recevoir un lien pour resaisir votre mot de passe.
                </p>

                <ForgetPasswordForm />

            </div>

        </div>

  );
}
