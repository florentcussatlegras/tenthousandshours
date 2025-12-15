"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess, Prisma, User } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const TEN_THOUSAND_HOURS_IN_SECONDS = 10_000 * 60 * 60;

function buildLocalDate(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);

  return new Date(y, m - 1, d, h, min, 0, 0); // mois indexé à 0
}

const createStudySessionSchema = z
  .object({
    description: z.string(),
    date: z.string(),
    startedAt: z.string().min(1, "Veuillez saisir une heure de début"),
    finishedAt: z.string().min(1, "Veuillez saisir une heure de fin"),
    studyProcessId: z.string(),
    urls: z.string(),
  })
  .superRefine(({ urls, startedAt, finishedAt }, ctx) => {
    if (startedAt == finishedAt) {
      ctx.addIssue({
        code: "custom",
        message: "L'heure de début ne peut pas être égale à l'heure de fin",
        path: ["finishedAt"],
      });
    }
    if (startedAt !== "" && finishedAt !== "" && finishedAt < startedAt) {
      ctx.addIssue({
        code: "custom",
        message: "L'heure de début doit être inférieure à l'heure de fin",
        path: ["finishedAt"],
      });
    }
    if (urls.length > 0) {
      const arrayUrls = urls.split(",");
      var httpRegex =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
      arrayUrls.forEach((url) => {
        if (httpRegex.test(url) === false) {
          ctx.addIssue({
            code: "custom",
            message: "Merci de saisir une url valide",
            path: ["urls"],
          });
        }
      });
    }
  });

createStudySessionSchema.refine((obj) => obj.startedAt < obj.finishedAt);

interface CreateStudySessionState {
  errors: {
    description?: string[];
    date?: string[];
    startedAt?: string[];
    finishedAt?: string[];
    urls?: string[];
    _form?: string[];
  };
}

export async function createStudySessionAction(
  formState: CreateStudySessionState,
  formData: FormData
): Promise<CreateStudySessionState> {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  const result = createStudySessionSchema.safeParse(
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

  const totalSecondsStudyProcess = studyProcess.totalSeconds;

  try {
    const startedAt = buildLocalDate(result.data.date, result.data.startedAt);
    const finishedAt = buildLocalDate(result.data.date, result.data.finishedAt);

    const createdAt = buildLocalDate(result.data.date, "00:00");

    const studyProcessInThisHours: any[] = await prisma.$queryRaw(Prisma.sql`
        SELECT * FROM public."StudySession" 
        WHERE "StudySession"."studyProcessId" = ${result.data.studyProcessId}
        AND (("startedAt" <= ${startedAt} AND "finishedAt" >= ${startedAt}) 
          OR ("startedAt" <= ${finishedAt} AND "finishedAt" >= ${finishedAt}))
    `);

    if (Array.from(studyProcessInThisHours).length !== 0) {
      console.log(studyProcessInThisHours);
      return {
        errors: {
          _form: ["Une session dans cette tranche horaire existe dèja."],
        },
      };
    }

    const totalSecondsSession =
      (finishedAt.getTime() - startedAt.getTime()) / 1000;

    const newTotalSeconds =
      Number(totalSecondsStudyProcess) + totalSecondsSession;

    const hasReached10kBefore = studyProcess.reachedAt != null;

    const isReaching10kNow =
      !hasReached10kBefore && newTotalSeconds >= TEN_THOUSAND_HOURS_IN_SECONDS;

    const studySession = await prisma.studySession.create({
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

    await prisma.studyProcess.update({
      data: {
        totalSeconds: newTotalSeconds,
        ...(isReaching10kNow && {
          reachedAt: new Date()
        }),
      },
      where: {
        id: result.data.studyProcessId,
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

  revalidateTag("studySession", {});
  redirect(`/study-process/${studyProcess?.slug}`);
}
