import { convertSecondsInHourMin } from "@/app/lib/utils";
import { Accordion, AccordionItem, Chip, Progress } from "@heroui/react";
import { StudySession } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

export function DayCalendar({
  currentDate,
  studySessions,
}: {
  currentDate: Date;
  studySessions: StudySession[];
}) {
  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 font-semibold rounded-xl px-4 absolute top-4 right-2">
        {new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "full",
        }).format(currentDate)}
      </div>

      {studySessions.length === 0 ? (
        <div className="justify-center text-default-400 font-medium uppercase py-12 text-center">
          Aucune session de travail trouvées ce jour là
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="text-sm text-default-500 ml-auto pr-1">
            {studySessions.length} sessions de travail
          </span>

          <Accordion variant="splitted" className="px-0">
            {studySessions.map((session) => {
              const ratioProgress =
                (Number(session.study_process_total_hours) / 10000) * 100;

              return (
                <AccordionItem
                  key={session.session_id}
                  aria-label={`Accordion ${session.session_id}`}
                  title={`${session.topic_name}`}
                  classNames={{
                    base: "relative px-6 mb-2",
                    title: "text-xl text-sky-500",
                    indicator: "w-[350px]",
                  }}
                  subtitle={
                    <Chip isDisabled color="secondary">
                      {convertSecondsInHourMin(session.totalSeconds)}
                    </Chip>
                  }
                  disableIndicatorAnimation={true}
                  indicator={
                    <div className="flex flex-row items-end gap-4">
                      <Progress
                        aria-label="Loading..."
                        className="w-full"
                        classNames={{
                          indicator: "bg-sky-500",
                          track: "drop-shadow-md border border-default",
                          value: "ml-auto text-foreground/60 text-sm",
                        }}
                        value={ratioProgress}
                        showValueLabel={true}
                      />
                      <ChevronDown className="-mb-2" />
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
                    <div>
                      Vous avez travaillé {session.study_process_total_hours}{" "}
                      heures au total sur cette matière
                    </div>
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
                          {session.urls.split(",").map((url) => (
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
      )}
    </div>
  );
}
