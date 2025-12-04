import { useMemo } from "react";
import { StudySessionModal } from "./study-session-modal";

export default function WeekCalendarWithHours({
  weekDates,
  studySessionsPerDay,
  isLoading,
}: {
  weekDates: Date[];
  studySessionsPerDay: any[][];
  isLoading: boolean;
}) {
    console.log(studySessionsPerDay);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  const weekLabel = useMemo(() => {
    const start = weekDates[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    const end = weekDates[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    return `Semaine du ${start} au ${end}`;
  }, [weekDates]);

  const getPositionStyle = (startedAt: string, finishedAt: string) => {
    const startDate = new Date(startedAt);
    const endDate = new Date(finishedAt);

    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

    const topPercent = (startHour / 24) * 100;
    const heightPercent = ((endHour - startHour) / 24) * 100;

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
    };
  };

  return (
    <div className="w-full">

      {/* Titre de la semaine */}
      <h2 className="text-xl font-semibold mb-4">{weekLabel}</h2>

      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center py-10">Chargement…</div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-8 border border-gray-200">

          {/* Colonne des heures */}
          <div className="flex flex-col border-r border-gray-200 bg-gray-50 mt-9">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[66.66px] border-b border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500"
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* 7 jours */}
          {weekDates.map((date, dayIndex) => (
            <div
              key={dayIndex}
              className="relative border-r border-gray-200"
            >
              {/* Header du jour */}
              <div className="text-center py-2 border-b border-gray-200 bg-gray-50 text-sm font-medium">
                {date.toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                })}
              </div>

              {/* Grille horaire */}
              <div className="relative h-[1600px]">
                {/* Heures en fond */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-gray-200"
                    style={{
                      top: `${(hour / 24) * 100}%`,
                      height: "calc(100%/24)",
                    }}
                  ></div>
                ))}

                {/* Sessions */}
                {studySessionsPerDay[dayIndex]?.map((session: any) => {
                  const pos = getPositionStyle(
                    session.startedAt,
                    session.finishedAt
                  );

                  return (
                    <StudySessionModal 
                        session={session}
                        pos={pos}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
