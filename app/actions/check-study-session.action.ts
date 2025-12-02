"use server";

import prisma from "@/app/lib/prisma";

export async function checkCurrentStudySessionAction(studyProcessId: string, dateStartedAt: number) {

  const rows = await prisma.$queryRaw<any[]>`
    SELECT * FROM public."StudySession"
    WHERE "studyProcessId" = ${studyProcessId}
    AND ("startedAt" <= ${dateStartedAt} AND "finishedAt" >= ${dateStartedAt})
  `;

  return rows.length > 0;

}
