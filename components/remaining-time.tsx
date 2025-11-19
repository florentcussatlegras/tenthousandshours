// "use client";

// import {
//   foo,
//   getFirstStudySessionByStudyProcess,
//   getLastStudySessionByStudyProcess,
// } from "@/app/actions/actions";
// import { StudyProcess } from "@prisma/client";
// import { useEffect, useState } from "react";
// import { PassThrough } from "stream";

// export function RemainingTime({
//   studyProcess,
// }: {
//   studyProcess: StudyProcess;
// }) {
//   const [remainingDaysUntilGoal, setRemainingDaysUntilGoal] = useState<any>();
//   const [dateGoal, setDateGoal] = useState<any>();

//   useEffect(() => {
//     async function getFirstAndLastSessions() {
//       const newFirstSessionDate = await getFirstStudySessionByStudyProcess(
//         studyProcess.id
//       );
//       console.log(newFirstSessionDate);
//       const newLastSessionDate = await getLastStudySessionByStudyProcess(
//         studyProcess.id
//       );
//       console.log(newLastSessionDate);

//       const diffDays =
//         (newLastSessionDate.getTime() - newFirstSessionDate.getTime()) /
//         1000 /
//         60 /
//         60 /
//         24;

//       const averageDaySpendingTime = Number(studyProcess.totalSeconds) / diffDays;

//       const remainingTimeUntilGoal = 36000000 - Number(studyProcess.totalSeconds);
//       const newRemainingDaysUntilGoal =
//         remainingTimeUntilGoal / averageDaySpendingTime;

//       setRemainingDaysUntilGoal(newRemainingDaysUntilGoal);

//       const newDate = new Date();
//       const newDateGoal = newDate.setDate(
//         newDate.getDate() + newRemainingDaysUntilGoal
//       );
//       setDateGoal(newDateGoal);
//     }

//     getFirstAndLastSessions();
//   }, []);

//   return (
//     <span>
//       dans environ{" "}
//       <span className="font-semibold">{remainingDaysUntilGoal} jours</span> soit
//       le{" "}
//       <span className="font-semibold">
//         {new Intl.DateTimeFormat("fr-Fr", { dateStyle: "short" }).format(
//           dateGoal
//         )}
//       </span>
//     </span>
//   );
// }

"use client";

import {
  getFirstStudySessionByStudyProcess,
  getLastStudySessionByStudyProcess,
} from "@/app/actions/actions";
import { StudyProcess } from "@prisma/client";
import { useEffect, useState } from "react";

export function RemainingTime({ studyProcess }: { studyProcess: StudyProcess }) {
  const [remainingDaysUntilGoal, setRemainingDaysUntilGoal] = useState<number | null>(null);
  const [dateGoal, setDateGoal] = useState<Date | null>(null);

  useEffect(() => {
    async function compute() {
      const first = await getFirstStudySessionByStudyProcess(studyProcess.id);
      const last = await getLastStudySessionByStudyProcess(studyProcess.id);

      if (!first || !last) return;

      // Nombre de jours passés
      const diffDays =
        (last.getTime() - first.getTime()) / 1000 / 60 / 60 / 24;

      if (diffDays <= 0) return;

      // Temps moyen passé par jour (en secondes)
      const avgSecondsPerDay = Number(studyProcess.totalSeconds) / diffDays;

      if (avgSecondsPerDay <= 0) return;

      // 10 000 heures = 36 000 000 secondes
      const remainingSeconds = 36000000 - Number(studyProcess.totalSeconds);

      const remainingDays = remainingSeconds / avgSecondsPerDay;
      setRemainingDaysUntilGoal(remainingDays);

      // Calcul de la date d'atteinte
      const goal = new Date();
      goal.setDate(goal.getDate() + remainingDays);
      setDateGoal(goal);
    }

    compute();
  }, [studyProcess.id, studyProcess.totalSeconds]);

  if (!dateGoal || remainingDaysUntilGoal === null) return null;

  return (
    <span>
      dans environ{" "}
      <span className="font-semibold">{remainingDaysUntilGoal.toFixed(1)} jours</span> soit le{" "}
      <span className="font-semibold">
        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(dateGoal)}
      </span>
    </span>
  );
}

