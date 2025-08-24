import { ReturnButton } from "@/components/return-button";

export default async function SignInErrorPage() {
    
  return (

        <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

            <div className="space-y-8 w-full flex flex-col items-center">

                <ReturnButton href="/auth/login" label="Sign In" />

                <h1 className="text-2xl font-bold">Email de vérification</h1>

                <p className="text-mute-foreground">
                    L'email de vérification a bien été envoyé.
                </p>

            </div>

        </div>

  );
}
