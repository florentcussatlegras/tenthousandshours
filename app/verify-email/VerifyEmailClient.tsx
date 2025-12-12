// app/verify-email/VerifyEmailClient.tsx
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

    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          // optional: read server message
          const errText = await res.text().catch(() => "");
          console.error("verify-email response not ok:", res.status, errText);
          throw new Error("Invalid or expired token");
        }

        if (!mounted) return;
        setStatus("success");

        setTimeout(() => {
          router.push(callbackURL);
        }, 1500);
      } catch (e) {
        console.error("verify-email error:", e);
        if (mounted) setStatus("error");
      }
    })();

    return () => {
      mounted = false;
    };
    // include searchParams so effect re-runs if url changes
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      {status === "loading" && <p>Vérification en cours…</p>}
      {status === "success" && <p>Email vérifié avec succès 🎉 — redirection…</p>}
      {status === "error" && <p>Erreur lors de la vérification. Le lien est peut-être expiré.</p>}
    </div>
  );
}
