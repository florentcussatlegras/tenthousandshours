import { fetchStudySessions } from "@/app/actions/actions";
import { useSession } from "@/app/lib/auth-client";
import { StudySession } from "@prisma/client";
import React from "react";

export function WeekCalendar({
  currentWeek,
  studySessionsPerDay
}: {
  currentWeek: Date[];
  studySessionsPerDay: StudySession[]
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


  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 font-semibold rounded-xl px-4 absolute top-4 right-2">
        Semaine du{" "}
        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
          currentWeek[0]
        )}{" "}
        au{" "}
        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
          currentWeek[currentWeek.length - 1]
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row w-full rounded-full py-2">
          {currentWeek.map((day, index) => (
            <div className="flex flex-col w-1/7">
              <div className="w-full text-center bg-default-100 p-2">
                {days[day.getDay()]}
              </div>
              <div className="w-full text-center flex flex-col gap-3 py-4 px-2">
                {studySessionsPerDay[day.getDay()] !== undefined 
                  ? studySessionsPerDay[day.getDay()].map((session) => (
                      <div className="bg-sky-500 text-white text-tiny py-1 rounded-sm font-semibold">{session.topic_name}</div>
                    ))
                  : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
