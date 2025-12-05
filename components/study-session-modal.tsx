import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Divider } from "@heroui/react";

export function StudySessionModal({ session, pos }: { session: any; pos?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Calcul durée
  const started = new Date(session.startedAt);
  const finished = new Date(session.finishedAt);
  const durationMinutes = Math.round((finished.getTime() - started.getTime()) / 60000);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  let durationStr = "";
  if (hours === 0) durationStr = `${minutes}m`;
  else if (minutes === 0) durationStr = `${hours}h`;
  else durationStr = `${hours}h ${minutes}m`;

  // Bloque le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Tag / carte cliquable dans la grille */}
      <div
        key={session.session_id}
        className="absolute left-1 right-1 bg-blue-500 text-white text-xs p-1 rounded shadow cursor-pointer"
        style={pos}
        onClick={() => setIsOpen(true)}
        role="button"
        aria-label={`Ouvrir session ${session.topic_name}`}
      >
        <div className="font-semibold truncate">{session.topic_name}</div>
        <div className="text-[10px] opacity-90">
          {new Date(session.startedAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(session.finishedAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* MODAL (render only when open) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* CONTENT */}
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
            onClick={(e) => e.stopPropagation()} // important : évite la fermeture quand on clique dans la boîte
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer la fenêtre"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-sky-500">{session.topic_name}</h2>

            <Divider />

            <div className="text-base font-medium mt-4 mb-2">Durée : {durationStr}</div>

            <div className="flex flex-row gap-2 text-base mb-2">
              <span>Horaires de travail :</span>
              <span>
                {new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" }).format(started)}
              </span>
              <span>-</span>
              <span>
                {new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" }).format(finished)}
              </span>
            </div>

            <p className="my-4">
              {session?.description === "" ? (
                "Aucune description fournie."
              ) : (
                session.description
              )}
            </p>

            {session.urls && session.urls !== "" ? (
              <div className="flex flex-col">
                <h3 className="font-semibold mb-2">Contenu utilisé lors de cette session :</h3>
                <ul className="list-disc list-inside">
                  {session.urls.split(",").map((url: string, index: number) => (
                    <li key={index} className="text-sky-500 break-words">
                      <Link href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span>Aucun contenu particulier utilisé lors de cette session</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
