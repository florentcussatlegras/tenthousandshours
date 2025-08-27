"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function SignUpSuccessPage() {
    
  return (
    <Card className="w-2/3 flex flex-col items-start p-6 border-default-200" shadow="none">
        <CardHeader className="mb-4">
            <h1 className="text-4xl font-bold mb-4 text-default-600">Inscription réussie</h1>
        </CardHeader>
        <CardBody>
            <p className="text-mute-foreground">
                Bravo! Votre inscription a bien été prise en compte. Merci de confirmer la validité de votre identité depuis le lien de l'email de vérification que nous vous avons envoyé.
            </p>
        </CardBody>
    </Card>
  );
}
