"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading"|"success"|"error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const callbackURL = searchParams.get("callbackURL") ?? "/";

    if (!token) {
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("Invalid token");

        setStatus("success");

        // Redirection
        setTimeout(() => {
          router.push(callbackURL);
        }, 1500);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    })();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && <p>Vérification en cours…</p>}
      {status === "success" && <p>Email vérifié avec succès 🎉</p>}
      {status === "error" && <p>Erreur lors de la vérification.</p>}
    </div>
  );
}
