"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/app/lib/prisma";

function buildLocalDate(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

export async function checkCurrentStudySessionAction(
  studyProcessId: string,
  dateStr: string,
  timeStr: string
) {
  const checkDate = buildLocalDate(dateStr, timeStr);

  const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
    SELECT *
    FROM public."StudySession"
    WHERE "studyProcessId" = ${studyProcessId}
    AND (
      "startedAt" <= ${checkDate}
      AND "finishedAt" >= ${checkDate}
    )
  `);

  return rows.length > 0;
}

