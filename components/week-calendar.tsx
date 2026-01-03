import { useSession } from "@/app/lib/auth-client";
// import { StudySession } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { Progress } from "@heroui/react";
import ThreeDotsLoader from "./three-dots-loader";
import { StudySessionModal } from "./study-session-modal";

export function WeekCalendar({
  currentWeek,
  studySessionsPerDay,
}: {
  currentWeek: Date[];
  studySessionsPerDay: any[];
}) {
  const { data: session } = useSession();

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const prevWeekRef = useRef(currentWeek);
  const prevSessionsRef = useRef(studySessionsPerDay);

  const [loadingWeek, setLoadingWeek] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  /* ---------------- WEEK CHANGE → top loader ---------------- */
  useEffect(() => {
    if (prevWeekRef.current !== currentWeek) {
      prevWeekRef.current = currentWeek;

      setLoadingWeek(true);
      setLoadingSessions(true);
    }
    console.log(currentWeek);
  }, [currentWeek]);

  /* ------------ SESSIONS CHANGE → central grid loader ------------ */
  useEffect(() => {
    if (prevSessionsRef.current !== studySessionsPerDay) {
      prevSessionsRef.current = studySessionsPerDay;

      setLoadingWeek(false);
      setLoadingSessions(false);
    }
  }, [studySessionsPerDay]);

  // --------------------------
  // Vérifie si la semaine est vide
  const isEmptyWeek = studySessionsPerDay.every(
    (daySessions) => !daySessions || daySessions.length === 0
  );
  // --------------------------

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="uppercase inline-flex w-max h-8 items-center justify-center min-w-[280px] px-4 py-1 rounded-xl bg-white border dark:bg-content1 dark:text-white border-gray-300 text-gray-700 font-semibold text-sm shadow-sm absolute top-4 left-4 md:left-auto md:right-5 mt-2">
        {loadingWeek ? (
          <ThreeDotsLoader />
        ) : (
          <>
            Semaine du{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
              currentWeek[0]
            )}{" "}
            au{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
              currentWeek[currentWeek.length - 1]
            )}
          </>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col h-full min-h-[300px] min-w-[700px]">
          <div className="flex flex-row min-w-max gap-2">
            {currentWeek.map((day, index) => (
              <div key="index" className="flex flex-row w-1/7">
                <div className="w-full text-center bg-default-100 px-4 py-2 rounded-xl text-sm">
                  {days[day.getDay()]}
                </div>
              </div>
            ))}
          </div>
          <div className=" flex flex-row w-full rounded-full py-2 transition-opacity min-h-[235px]">
            {loadingSessions ? (
              <div className="h-full w-full flex justify-center items-center min-h-[235px]">
                <ThreeDotsLoader />
              </div>
            ) : (
              <>
                {isEmptyWeek ? (
                  <div className="justify-center text-default-400 text-xs md:text-base font-medium uppercase py-10 md:py-32 text-center italic w-full">
                    Aucune session de travail trouvées cette semaine
                  </div>
                ) : (
                  currentWeek.map((day, index) => (
                    <div key={index} className="flex flex-col w-1/7">
                      {/* <div className="w-full text-center bg-default-100 p-2">
                      {days[day.getDay()]}
                    </div> */}
                      <div className="w-full text-center flex flex-col gap-3 py-4 px-2">
                        {studySessionsPerDay[day.getDay()]?.map(
                          (session: any) => (
                            // <div className="bg-sky-500 text-white text-tiny py-1 rounded-sm font-semibold">
                            //   {session.topic_name}
                            // </div>
                            <StudySessionModal session={session} />
                          )
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
