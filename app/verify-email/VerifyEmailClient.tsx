"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const callbackURL = searchParams.get("callbackURL") ?? "/";

    if (!token) {
      setStatus("error");
      return;
    }

    // ✅ Appel REST natif de Better Auth
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Token invalide ou expiré");
        setStatus("success");

        // Redirection après succès
        setTimeout(() => router.push(callbackURL), 1500);
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {status === "loading" && <p>Vérification en cours…</p>}
      {status === "success" && <p>Email vérifié avec succès 🎉</p>}
      {status === "error" && (
        <p className="text-red-500">
          Erreur lors de la vérification. Le lien est peut-être expiré.
        </p>
      )}
    </div>
  );
}
