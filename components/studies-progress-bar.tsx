"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/react";

interface StudyProgression {
  totalHours?: Number;
  topic?: {
    name?: String;
  };
}

export default function StudiesProgressbar({
  userStudies,
}: {
  userStudies: StudyProgression[];
}) {
  return (
    <Card className="h-full rounded-none">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4 h-full justify-center">
          {userStudies.map((study) => {
            const ratioProgress = (Number(study.totalHours) / 10000) * 100;
            return (
              <>
                <Progress
                  aria-label="Loading..."
                  label={study?.topic?.name}
                  className="w-full"
                  classNames={{ indicator: "bg-sky-500", label: "text-md", track: "drop-shadow-md border border-default", value: "text-foreground/60" }}
                  value={ratioProgress}
                  showValueLabel={true}
                />
              </>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
