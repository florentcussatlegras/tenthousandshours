"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess, Prisma, User } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const validateCurrentStudySessionSchema = z.object({
  currentStudySessionStudyProcessId: z.string(),
  currentStudySessionId: z.string(),
});

interface ValidateCurrentStudySessionState {
  errors: {
    currentStudySessionStudyProcessId?: string[];
    currentStudySessionId?: string[];
    _form?: string[];
  };
}

export async function validateCurrentStudySessionAction(
  formState: ValidateCurrentStudySessionState,
  formData: FormData
): Promise<ValidateCurrentStudySessionState> {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  console.log(formData);

  const result = validateCurrentStudySessionSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    console.log(z.flattenError(result.error).fieldErrors);
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  let studyProcess = await prisma.studyProcess.findFirst({
    where: {
      id: result.data.currentStudySessionStudyProcessId,
    },
  });

  if (studyProcess === null) {
    return {
      errors: {
        _form: ["Cette session n'est liée à aucun apprentissage en cours."],
      },
    };
  }

  const totalSecondsStudyProcess = studyProcess.totalSeconds;

  try {
 
    // const studyProcessInThisHours = await prisma.$queryRaw(Prisma.sql`
    //     SELECT * FROM public."StudySession" 
    //     WHERE "StudySession"."studyProcessId" = ${result.data.studyProcessId}
    //     AND (("startedAt" <= ${dateStartedAt} AND "finishedAt" >= ${dateStartedAt}) 
    //       OR ("startedAt" <= ${dateFinishedAt} AND "finishedAt" >= ${dateFinishedAt}))
    // `);

    // if (Array.from(studyProcessInThisHours).length !== 0) {
    //   console.log(studyProcessInThisHours);
    //   return {
    //     errors: {
    //       _form: ["Cette session dans cette tranche horaire existe dèja."],
    //     },
    //   };
    // }
    const studySession = await prisma.studySession.findFirst({
      select: {
        startedAt: true
      },
      where: {
        id: result.data.currentStudySessionId
      }
    });

    const totalSecondsSession =
      (new Date().getTime() - studySession?.startedAt?.getTime()) / 1000;

    await prisma.studySession.update({
      data: {
        finishedAt: new Date(),
        totalSeconds: totalSecondsSession,
      },
      where: {
        id: result.data.currentStudySessionId
      }
    });

    await prisma.studyProcess.update({
      data: {
        totalSeconds: totalSecondsStudyProcess + totalSecondsSession,
      },
      where: {
        id: result.data.currentStudySessionStudyProcessId,
      },
    });
  } catch (err: unknown) {

    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: [
            "Une erreur est survenue lors de la création du processus de création",
          ],
        },
      };
    }
  }

  revalidateTag("studySession");
  redirect(`/study-process/${studyProcess?.slug}`);
}
