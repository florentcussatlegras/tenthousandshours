"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess, Prisma, User } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

function buildLocalDate(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);

  return new Date(y, m - 1, d, h, min, 0, 0); // mois indexé à 0
}

const updateStudySessionSchema = z.object({
  description: z.string(),
  date: z.string(),
  startedAt: z.string().min(1, "Veuillez saisir une heure de début"),
  finishedAt: z.string().min(1, "Veuillez saisir une heure de fin"),
  studySessionId: z.string(),
  studyProcessId: z.string(),
  urls: z.string(),
}).superRefine(({ urls, startedAt, finishedAt }, ctx) => {
  if (startedAt != "" && finishedAt !== "" && finishedAt < startedAt) {
    ctx.addIssue({
      code: "custom",
      message: "L'heure de début doit être inférieure à l'heure de fin",
      path: ["finishedAt"]
    });
  }
  if (urls.length > 0) {
    const arrayUrls = urls.split(',');
    console.log(arrayUrls);
    var httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    arrayUrls.forEach(url => {
      if (httpRegex.test(url) === false) {
        ctx.addIssue({
          code: "custom",
          message: "Merci de saisir une url valide",
          path: ["urls"]
        });
      } 
    });
  }
});

interface UpdateStudySessionState {
  errors: {
    description?: string[];
    date?: string[];
    startedAt?: string[];
    finishedAt?: string[];
    _form?: string[];
    urls?: string[];
  };
}

export async function updateStudySessionAction(
  formState: UpdateStudySessionState,
  formData: FormData
): Promise<UpdateStudySessionState> {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  const result = updateStudySessionSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    console.log(z.flattenError(result.error).fieldErrors);
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const studyProcess = await prisma.studyProcess.findFirst({
    where: {
      id: result.data.studyProcessId,
    },
  });

  if (studyProcess === null) {
    return {
      errors: {
        _form: ["Cette session n'est liée à aucun apprentissage en cours."],
      },
    };
  }

  try {

    let studySession;

    studySession = await prisma.studySession.findFirst({
      where: {
        id: result.data.studySessionId
      }
    });

    if (studySession === null) {
      return {
        errors: {
          _form: ["Cette session n'existe pas."],
        },
      };
    }

    // const objStartedAt = result.data.startedAt?.split(":");
    // const objFinishedAt = result.data.finishedAt?.split(":");
    // const objCreatedAt = result.data.date.split('-');

    // const dateCreatedAt = new Date(
    //   Number(objCreatedAt[0]),
    //   Number(objCreatedAt[1]) - 1,
    //   Number(objCreatedAt[2]) + 1,
    //   -22,
    //   0,
    //   0
    // );

    // const dateStartedAt = new Date(
    //   Number(objCreatedAt[0]),
    //   Number(objCreatedAt[1]) - 1,
    //   Number(objCreatedAt[2]),
    //   Number(objStartedAt[0]) + 2,
    //   Number(objStartedAt[1]),
    //   Number(objStartedAt[2])
    // );
    // const dateFinishedAt = new Date(
    //   Number(objCreatedAt[0]),
    //   Number(objCreatedAt[1]) - 1,
    //   Number(objCreatedAt[2]),
    //   Number(objFinishedAt[0]) + 2,
    //   Number(objFinishedAt[1]),
    //   Number(objFinishedAt[2])
    // );

    const startedAt = buildLocalDate(result.data.date, result.data.startedAt);
    const finishedAt = buildLocalDate(result.data.date, result.data.finishedAt);

    // Pour createdAt si tu veux :
    const createdAt = buildLocalDate(result.data.date, "00:00");

    console.log(createdAt, startedAt, finishedAt);

    const studyProcessInThisHours: any[] = await prisma.$queryRaw(Prisma.sql`
              SELECT * FROM public."StudySession" 
              WHERE "StudySession"."id" != ${result.data.studySessionId}
                AND "StudySession"."studyProcessId" = ${result.data.studyProcessId}
                AND (("startedAt" <= ${startedAt} AND "finishedAt" >= ${startedAt}) 
                OR ("startedAt" <= ${finishedAt} AND "finishedAt" >= ${finishedAt}))
    `);

    if (Array.from(studyProcessInThisHours).length !== 0) {
      return {
        errors: {
          _form: ["Cette session dans cette tranche horaire existe dèja."],
        },
      };
    }

    const totalSecondsSession =
      (finishedAt.getTime() - startedAt.getTime()) / 1000;

    studySession = await prisma.studySession.update({
      where: {id: result.data.studySessionId},
      data: {
        description: result.data.description,
        createdAt: createdAt,
        startedAt: startedAt,
        finishedAt: finishedAt,
        totalSeconds: totalSecondsSession,
        studyProcessId: result.data.studyProcessId,
        urls: result.data.urls,
      },
    });

    const allSessions = await prisma.studySession.findMany({
      where: { studyProcessId: result.data.studyProcessId },
      select: { totalSeconds: true },
    });

    const newTotalSeconds = allSessions.reduce(
      (acc, s) => acc + (s.totalSeconds ?? 0),
      0
    );

    await prisma.studyProcess.update({
      where: { id: result.data.studyProcessId },
      data: { totalSeconds: newTotalSeconds },
    });

  } catch (err: unknown) {
    console.log(err);
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
