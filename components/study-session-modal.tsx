import React, { useState } from "react";
import Link from "next/link";
import { Divider } from "@heroui/react";

export function StudySessionModal({ session, pos }: { session: any, pos: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Calcul de la durée à partir des dates si study_process_total_hours n'est pas disponible
  const started = new Date(session.startedAt);
  const finished = new Date(session.finishedAt);
  const durationMinutes = Math.round(
    (finished.getTime() - started.getTime()) / 60000
  );
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  // Nouvelle logique pour l'affichage de la durée
  let durationStr = "";
  if (hours === 0) {
    durationStr = `${minutes}m`;
  } else if (minutes === 0) {
    durationStr = `${hours}h`;
  } else {
    durationStr = `${hours}h ${minutes}m`;
  }

  return (
    <>
      {/* Carte cliquable */}
      {/* <div
        className="bg-sky-500 text-white text-tiny py-1 px-2 rounded-sm font-semibold cursor-pointer hover:bg-sky-600 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        {session.topic_name}
      </div> */}

        <div
            key={session.session_id}
            className="absolute left-1 right-1 bg-blue-500 text-white text-xs p-1 rounded shadow"
            style={pos}
             onClick={() => setIsOpen(true)}
        >
            {session.topic_name}
            <br />
            {new Date(session.startedAt).toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
            )}{" "}
            -{" "}
            {new Date(session.finishedAt).toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
            )}
        </div>

      {/* Modale */}
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Bouton de fermeture */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Contenu de la session */}
            <h2 className="text-2xl font-bold mb-4 text-sky-500">
              {session.topic_name}
            </h2>

            <Divider />
            {/* Durée */}
            <div className="text-base font-medium mt-4 mb-2">
              Durée : {durationStr}
            </div>

            <div className="flex flex-row gap-2 text-base mb-2">
              <span>Horaires de travail : </span>
              <span>
                {new Intl.DateTimeFormat("fr-FR", {
                  timeStyle: "short",
                }).format(session.startedAt)}
              </span>
              <span>-</span>
              <span>
                {new Intl.DateTimeFormat("fr-FR", {
                  timeStyle: "short",
                }).format(session.finishedAt)}
              </span>
            </div>

            <p className="my-4">
              {session?.description === ""
                ? "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus optio delectus harum beatae debitis nihil molestias, animi laboriosam, sint mollitia labore neque sequi soluta ea? Hic dignissimos quam voluptas neque."
                : session?.description}
            </p>

            {session.urls !== "" ? (
              <div className="flex flex-col">
                <h3 className="font-semibold mb-2">
                  Contenu utilisé lors de cette session :
                </h3>
                <ul className="list-disc list-inside">
                  {session.urls.split(",").map((url: string, index: number) => (
                    <li key={index} className="text-sky-500">
                      <Link href={url}>{url}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span>
                Aucun contenu particulier utilisé lors de cette session
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
