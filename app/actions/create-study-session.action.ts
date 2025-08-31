"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const createStudySessionSchema = z.object({
  description: z.string(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  studyProcessId: z.string(),
});

interface CreateStudySessionState {
  errors: {
    description?: string[];
    startedAt?: string[];
    finishedAt?: string[];
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

  let studyProcess: StudyProcess;

  try {
    var slugify = require("slugify");

    studyProcess = await prisma.studyProcess.findFirst({
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

  const objStartedAt = result.data.startedAt?.split(':');
  const objFinishedAt = result.data.finishedAt?.split(':');
  const dateJour = new Date();
  const dateStartedAt = new Date(dateJour.getFullYear(), dateJour.getMonth(), dateJour.getDay(), Number(objStartedAt[0]), Number(objStartedAt[1]), Number(objStartedAt[2]));
  const dateFinishedAt = new Date(dateJour.getFullYear(), dateJour.getMonth(), dateJour.getDay(), Number(objFinishedAt[0]), Number(objFinishedAt[1]), Number(objFinishedAt[2]));


    const studySession = await prisma.studySession.create({
      data: {
        description: result.data.description,
        startedAt: dateStartedAt,
        finishedAt: dateFinishedAt,
        totalSeconds: (dateFinishedAt.getTime() - dateStartedAt.getTime()) / 1000,
        studyProcessId: result.data.studyProcessId,
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
  redirect(`/study-process/${studyProcess.slug}`);
}
