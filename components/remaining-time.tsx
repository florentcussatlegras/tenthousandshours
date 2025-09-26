"use client";

import {
  foo,
  getFirstStudySessionByStudyProcess,
  getLastStudySessionByStudyProcess,
} from "@/app/actions/actions";
import { StudyProcess } from "@prisma/client";
import { useEffect, useState } from "react";
import { PassThrough } from "stream";

export function RemainingTime({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  const [remainingDaysUntilGoal, setRemainingDaysUntilGoal] = useState();
  const [dateGoal, setDateGoal] = useState();

  useEffect(() => {
    async function getFirstAndLastSessions() {
      const newFirstSessionDate = await getFirstStudySessionByStudyProcess(
        studyProcess.id
      );
      const newLastSessionDate = await getLastStudySessionByStudyProcess(
        studyProcess.id
      );

      const diffDays =
        (newLastSessionDate.getTime() - newFirstSessionDate.getTime()) /
        1000 /
        60 /
        60 /
        24;

      const averageDaySpendingTime = studyProcess.totalSeconds / diffDays;

      const remainingTimeUntilGoal = 36000000 - studyProcess.totalSeconds;
      const newRemainingDaysUntilGoal =
        remainingTimeUntilGoal / averageDaySpendingTime;

      setRemainingDaysUntilGoal(newRemainingDaysUntilGoal);

      const newDate = new Date();
      const newDateGoal = newDate.setDate(
        newDate.getDate() + newRemainingDaysUntilGoal
      );
      setDateGoal(newDateGoal);
    }

    getFirstAndLastSessions();
  }, []);

  return (
    <span>
      dans environ{" "}
      <span className="font-semibold">{remainingDaysUntilGoal} jours</span> soit
      le{" "}
      <span className="font-semibold">
        {new Intl.DateTimeFormat("fr-Fr", { dateStyle: "short" }).format(
          dateGoal
        )}
      </span>
    </span>
  );
}
