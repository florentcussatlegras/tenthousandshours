"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess, Prisma, User } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

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
          path: ["finishedAt"]
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

    const objStartedAt = result.data.startedAt?.split(":");
    const objFinishedAt = result.data.finishedAt?.split(":");
    const objCreatedAt = result.data.date.split('-');

    const dateCreatedAt = new Date(
      Number(objCreatedAt[0]),
      Number(objCreatedAt[1]) - 1,
      Number(objCreatedAt[2]) + 1,
      -22,
      0,
      0
    );

    const dateStartedAt = new Date(
      Number(objCreatedAt[0]),
      Number(objCreatedAt[1]) - 1,
      Number(objCreatedAt[2]),
      Number(objStartedAt[0]) + 2,
      Number(objStartedAt[1]),
      Number(objStartedAt[2])
    );
    const dateFinishedAt = new Date(
      Number(objCreatedAt[0]),
      Number(objCreatedAt[1]) - 1,
      Number(objCreatedAt[2]),
      Number(objFinishedAt[0]) + 2,
      Number(objFinishedAt[1]),
      Number(objFinishedAt[2])
    );

    console.log(dateCreatedAt, dateStartedAt, dateFinishedAt);

    const studyProcessInThisHours = await prisma.$queryRaw(Prisma.sql`
              SELECT * FROM public."StudySession" 
              WHERE 
                "id" != ${result.data.studySessionId}
                AND (("startedAt" <= ${dateStartedAt} AND "finishedAt" >= ${dateStartedAt}) 
                OR ("startedAt" <= ${dateFinishedAt} AND "finishedAt" >= ${dateFinishedAt}))
    `);

    if (Array.from(studyProcessInThisHours).length !== 0) {
      return {
        errors: {
          _form: ["Cette session dans cette tranche horaire existe dèja."],
        },
      };
    }

    const totalSecondsSession =
      (dateFinishedAt.getTime() - dateStartedAt.getTime()) / 1000;

    studySession = await prisma.studySession.update({
      where: {id: result.data.studySessionId},
      data: {
        description: result.data.description,
        createdAt: dateCreatedAt,
        startedAt: dateStartedAt,
        finishedAt: dateFinishedAt,
        totalSeconds: totalSecondsSession,
        studyProcessId: result.data.studyProcessId,
        urls: result.data.urls,
      },
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
