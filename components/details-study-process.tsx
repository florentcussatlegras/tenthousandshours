"use client";

import { Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import { StudyProcess } from "@prisma/client";

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  const ratioProgress = (Number(studyProcess.totalHours) / 10000) * 100;
  var intl = new Intl.DateTimeFormat("fr-Fr", {
    "weekday": "long",
    "year": "numeric",
    "month": "long",
    "day": "numeric",
  });


  return (
    <Card className="h-full rounded-none relative">
      <CardHeader>
        <span className="text-">
          <Chip isDisabled color="default">Débuté le {intl.format(studyProcess.createdAt)}</Chip>
        </span>
      </CardHeader>
      <CardBody>
        <Progress
          aria-label="Loading..."
          className="w-full"
          classNames={{
            indicator: "bg-sky-500",
            track: "drop-shadow-md border border-default",
            value: "ml-auto text-foreground/60",
          }}
          value={ratioProgress}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
}
