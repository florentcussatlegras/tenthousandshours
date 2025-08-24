import { ReturnButton } from "@/components/return-button";

export default async function SignUpSuccessPage() {
    
  return (

        <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

            <div className="space-y-8 w-full flex flex-col items-center">

                <ReturnButton href="/auth/login" label="Sign In" />

                <h1 className="text-2xl font-bold">Inscription réussie</h1>

                <p className="text-mute-foreground">
                    Bravo! Votre inscription a bien été prise en compte. Merci de confirmer la validité de votre identité depuis le lien de l'email de vérification que nous vous avons envoyé.
                </p>

            </div>

        </div>

  );
}
