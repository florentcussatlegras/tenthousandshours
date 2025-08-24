import { ReturnButton } from "@/components/return-button";

export default async function ResetPasswordSuccessPage() {
    
  return (

        <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

            <div className="space-y-8 w-full flex flex-col items-center">

                <ReturnButton href="/auth/sign-in" label="Sign In" />

                <h1 className="text-2xl font-bold">Réinitialisation de votre mot de passe</h1>

                <p className="text-mute-foreground">
                    Bravo! Votre mot de passe a bien été modifié.
                </p>

            </div>

        </div>

  );
}
