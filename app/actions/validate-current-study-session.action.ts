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
    topicId: z.string(),
    startedAt: z.string(),
    finishedAt: z.string(),
    timer: z.string(),
    description: z.string(),
    urls: z.string(),
  })
  .superRefine(({ urls, startedAt, finishedAt }, ctx) => {
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

interface ValidateCurrentStudySessionState {
  errors: {
    topicId?: string[];
    startedAt?: string[];
    finishedAt?: string[];
    timer?: string[];
    description?: string[];
    urls?: string[];
    _form?: string[];
  };
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
      confirmValidation: false,
    };
  }

  let studyProcess = await prisma.studyProcess.findFirst({
    where: {
      userId: session?.user.id,
      topicId: result.data.topicId,
    },
  });

  console.log(studyProcess);

  if (studyProcess === null) {
    return {
      errors: {
        _form: ["Cette session n'est liée à aucun apprentissage en cours."],
      },
      confirmValidation: false,
    };
  }

  // const totalSecondsStudyProcess = studyProcess.totalSeconds;

  try {
    const dateStartedAt = new Date(Number(result.data.startedAt));
    const dateCreatedAt = new Date(
      dateStartedAt.getFullYear(),
      dateStartedAt.getMonth(),
      dateStartedAt.getDate(),
      +2,
      0,
      0
    );
    const dateFinishedAt = new Date(Number(result.data.finishedAt));

    console.log(dateCreatedAt);
    console.log(dateStartedAt);
    console.log(dateFinishedAt);

    const timer = JSON.parse(result.data.timer);
    const totalSeconds = timer.sec + timer.min * 60 + timer.hr * 3600;

    await prisma.studySession.create({
      data: {
        createdAt: dateCreatedAt,
        startedAt: dateStartedAt,
        finishedAt: dateFinishedAt,
        totalSeconds,
        studyProcessId: studyProcess.id,
        description: result.data.description,
        urls: result.data.urls,
      },
    });

    await prisma.studyProcess.update({
      data: {
        totalSeconds: studyProcess.totalSeconds + totalSeconds,
      },
      where: {
        id: studyProcess.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
        confirmValidation: false,
      };
    } else {
      return {
        errors: {
          _form: [
            "Une erreur est survenue lors de la création du processus de création",
          ],
        },
        confirmValidation: false,
      };
    }
  }

  return {
    errors: {},
    confirmValidation: true,
  };

  // cookieStore.set("confirmValidation", "false");

  // sessionStorage.setItem("confirmValidation", "false");

  // revalidateTag("studySession");
  // redirect(`/study-process/${studyProcess?.slug}?confirmValidation=true`);
}
