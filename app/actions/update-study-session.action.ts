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
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  studySessionId: z.string(),
  studyProcessId: z.string(),
});

interface UpdateStudySessionState {
  errors: {
    description?: string[];
    startedAt?: string[];
    finishedAt?: string[];
    _form?: string[];
  };
}

export async function updateStudySessionAction(
  formState: updateStudySessionSchema,
  formData: FormData
): Promise<updateStudySessionSchema> {
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

  try {
    var slugify = require("slugify");

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

    const objStartedAt = result.data.startedAt?.split(":");
    const objFinishedAt = result.data.finishedAt?.split(":");
    const dateJour = new Date();
    const dateStartedAt = new Date(
      dateJour.getFullYear(),
      dateJour.getMonth(),
      dateJour.getDay(),
      Number(objStartedAt[0]),
      Number(objStartedAt[1]),
      Number(objStartedAt[2])
    );
    const dateFinishedAt = new Date(
      dateJour.getFullYear(),
      dateJour.getMonth(),
      dateJour.getDay(),
      Number(objFinishedAt[0]),
      Number(objFinishedAt[1]),
      Number(objFinishedAt[2])
    );

    studyProcess = await prisma.$queryRaw(Prisma.sql`SELECT * FROM public."StudySession" WHERE ("startedAt" <= ${dateStartedAt} AND "finishedAt" >= ${dateStartedAt}) OR ("startedAt" <= ${dateFinishedAt} AND "finishedAt" >= ${dateFinishedAt})`);

    // studyProcess =
    //   await prisma.$queryRaw`SELECT * FROM "public"."StudyProcess" WHERE (${dateStartedAt} >= "startedAt" AND ${dateStartedAt} <= "finishedAt") OR (${dateFinishedAt} >= "startedAt" AND ${dateFinishedAt} <= "finishedAt")`;

    // studyProcess =
    //   await prisma.$queryRaw`SELECT * FROM "public"."StudyProcess" WHERE (${date} >= "startedAt"  AND ${date} <= "finishedAt") OR (${date} >= "startedAt" AND ${date} <= "finishedAt")`;

    // console.log(Array.from(studyProcess));
    // console.log(Array.from(studyProcess).length);
    // console.log(studyProcess);

    if (Array.from(studyProcess).length !== 0) {
      console.log("Cette session dans cette tranche horaire existe dèja.");
      return {
        errors: {
          _form: ["Cette session dans cette tranche horaire existe dèja."],
        },
      };
    }

    const studySession = await prisma.studySession.update({
      where: {id: studySessionId},
      data: {
        description: result.data.description,
        startedAt: dateStartedAt,
        finishedAt: dateFinishedAt,
        totalSeconds:
          (dateFinishedAt.getTime() - dateStartedAt.getTime()) / 1000,
        studyProcessId: result.data.studyProcessId,
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

  // revalidateTag("studySession");
  // redirect(`/study-process/${studyProcess.slug}`);
}
