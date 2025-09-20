"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess, Prisma, User } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { addToast } from "@heroui/react";
import { cookies } from "next/headers";

const validateCurrentStudySessionSchema = z
  .object({
    currentStudySessionStudyProcessId: z.string(),
    currentStudySessionId: z.string(),
    description: z.string(),
    urls: z.string(),
    finishedAt: z.string(),
  })
  .superRefine(({ urls }, ctx) => {
    // if (startedAt !== "" && finishedAt !== "" && finishedAt < startedAt) {
    //   ctx.addIssue({
    //     code: "custom",
    //     message: "L'heure de début doit être inférieure à l'heure de fin",
    //     path: ["finishedAt"],
    //   });
    // }
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

interface ValidateCurrentStudySessionState {
  errors: {
    currentStudySessionStudyProcessId?: string[];
    currentStudySessionId?: string[];
    finishedAt?: string[];
    description?: string[];
    urls?: string[];
    _form?: string[];
  },
  confirmValidation: boolean;
}

export async function validateCurrentStudySessionAction(
  formState: ValidateCurrentStudySessionState,
  formData: FormData
): Promise<ValidateCurrentStudySessionState> {
  const headerList = await headers();
  const cookieStore = await cookies();

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
      confirmValidation: false
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
      confirmValidation: false
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

    const dateJour = new Date();
    const objFinishedAt = result.data.finishedAt?.split(":");

    const dateFinishedAt = new Date(
      dateJour.getFullYear(),
      dateJour.getMonth(),
      dateJour.getDay(),
      Number(objFinishedAt[0]) + 2,
      Number(objFinishedAt[1]),
      Number(objFinishedAt[2])
    );

    const studySession = await prisma.studySession.findFirst({
      select: {
        startedAt: true,
      },
      where: {
        id: result.data.currentStudySessionId,
      },
    });

    const totalSecondsSession =
      (new Date().getTime() - studySession?.startedAt?.getTime()) / 1000;

    await prisma.studySession.update({
      data: {
        finishedAt: new Date(),
        totalSeconds: totalSecondsSession,
        description: result.data.description,
        urls: result.data.urls,
      },
      where: {
        id: result.data.currentStudySessionId,
      },
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
        confirmValidation: false
      };
    } else {
      return {
        errors: {
          _form: [
            "Une erreur est survenue lors de la création du processus de création",
          ],
        },
        confirmValidation: false
      };
    }
  }

  return {
    errors: {},
    confirmValidation: true,
  }

  // cookieStore.set("confirmValidation", "false");

  // sessionStorage.setItem("confirmValidation", "false");

  // revalidateTag("studySession");
  // redirect(`/study-process/${studyProcess?.slug}?confirmValidation=true`);
}
