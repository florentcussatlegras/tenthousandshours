import { convertSecondsInHourMin } from "@/app/lib/utils";
import { Accordion, AccordionItem, Chip, Progress } from "@heroui/react";
import { StudySession } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import ThreeDotsLoader from "./three-dots-loader";

export function DayCalendar({
  currentDate,
  studySessions,
}: {
  currentDate: Date;
  studySessions: StudySession[];
}) {

  const prevDateRef = useRef(currentDate);
  const prevSessionsRef = useRef(studySessions);

  const [loadingDate, setLoadingDate] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // ---------------- DATE CHANGE → top loader ----------------
  useEffect(() => {
    if (prevDateRef.current !== currentDate) {
      prevDateRef.current = currentDate;
      setLoadingDate(true);
      setLoadingSessions(true);
    }
  }, [currentDate]);

  // ---------------- SESSIONS CHANGE → central loader ----------------
  useEffect(() => {
    if (prevSessionsRef.current !== studySessions) {
      prevSessionsRef.current = studySessions;
      setLoadingDate(false);
      setLoadingSessions(false);
    }
  }, [studySessions]);

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="uppercase inline-flex w-max h-8 items-center justify-center min-w-[280px] px-4 py-1 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold text-sm shadow-sm absolute top-4 left-4 md:left-auto md:right-5 mt-2">
        {loadingDate ? (
          <ThreeDotsLoader />
        ) : (
          new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(currentDate)
        )}
      </div>

      {/* Central content */}
      {loadingSessions ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ThreeDotsLoader />
        </div>
        ) :
          studySessions.length === 0 ? (
          <div className="justify-center text-default-400 text-xs md:text-base font-medium uppercase py-10 md:py-32 text-center italic">
            Aucune session de travail trouvées ce jour
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-sm text-default-500 ml-auto pr-1">
              {studySessions.length} sessions de travail
            </span>

            <Accordion variant="splitted">
              {studySessions.map((session: any) => {
                console.log(session);
                // const ratioProgress =
                //   (Number(session.study_process_total_hours) / 10000) * 100;

                return (
                  <AccordionItem
                    key={session.session_id}
                    aria-label={`Accordion ${session.session_id}`}
                    title={`${session.topic_name}`}
                    classNames={{
                      base: "relative px-0 mb-2 border-b-1 border-default-200 rounded-none shadow-none",
                      title: "text-xl text-default-900",
                      indicator: "w-[350px]",
                    }}
                    subtitle={
                      <Chip isDisabled className="bg-sky-500 text-white font-semibold mt-2">
                        {convertSecondsInHourMin(session.totalSeconds)}
                      </Chip>
                    }
                    disableIndicatorAnimation={true}
                    indicator={
                      <div className="flex flex-row items-end">
                        {/* <Progress
                          aria-label="Loading..."
                          className="w-full"
                          classNames={{
                            indicator: "bg-sky-500",
                            track: "drop-shadow-md border border-default",
                            value: "ml-auto text-foreground/60 text-sm",
                          }}
                          value={ratioProgress}
                          showValueLabel={true}
                        /> */}
                        <ChevronDown className="-mb-2 ml-auto" />
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-2 py-4">
                      <div className="flex flex-row gap-2 text-base mb-2">
                        <span>Horaires de travail : </span>
                        <span>
                          {new Intl.DateTimeFormat("fr-Fr", {
                            timeStyle: "short",
                          }).format(session.startedAt)}
                        </span>
                        <span>-</span>
                        <span>
                          {new Intl.DateTimeFormat("fr-Fr", {
                            timeStyle: "short",
                          }).format(session.finishedAt)}
                        </span>
                      </div>
                      {/* <div>
                        Vous avez travaillé {session.study_process_total_hours}{" "}
                        heures au total sur cette matière
                      </div> */}
                      <p className="my-4">
                        {session?.description === ""
                          ? "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus optio delectus harum beatae debitis nihil molestias, animi laboriosam, sint mollitia labore neque sequi soluta ea? Hic dignissimos quam voluptas neque."
                          : session?.description}
                      </p>
                      {session.urls !== "" ? (
                        <div className="flex flex-col">
                          <h2>
                            Vous avez utilisé le contenu suivant lors de cette
                            session de travail :
                          </h2>
                          <ul>
                            {session.urls.split(",").map((url: string) => (
                              <li className="text-sky-500">
                                <Link href={url}>{url}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span>
                          Vous n'avez indiqué aucun contenu particulier utilisé
                          lors de cette session de travail
                        </span>
                      )}
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )
      }
    </div>
  );
}
