"use client";

import { Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import { StudyProcess } from "@prisma/client";

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  const ratioProgress = (Number(studyProcess.totalHours) / 10000) * 100;
  console.log(studyProcess);

  var intl = new Intl.DateTimeFormat("fr-Fr", {
    "weekday": "long",
    "year": "numeric",
    "month": "long",
    "day": "numeric",
  });

  return (
    <Card className="rounded-none relative p-4">
      <CardHeader className="flex flex-col items-start gap-6">
        {/* <h2 className="font-bold text-sky-500">{studyProcess.topic.name}</h2> */}
        <span className="text-default-500 text-sm">Apprentissage débuté le {intl.format(studyProcess.createdAt)}</span>
      </CardHeader>
      <CardBody>
        <Chip isDisabled color="secondary">{`${studyProcess.totalHours} heures`}</Chip>
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
      </CardBody>
    </Card>
  );
}
