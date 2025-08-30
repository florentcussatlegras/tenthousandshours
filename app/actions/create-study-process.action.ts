"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const createTopicSchema = z.object({
  name: z.string(),
  description: z.string(),
  timeDedicated: z.string().nullable(),
  timeDedicatedPeriod: z.string().nullable(),
  topicId: z.string(),
});

interface CreateStudyProcessState {
  errors: {
    name?: string[];
    description?: string[];
    timeDedicated?: string[];
    topicId?: string[];
    _form?: string[];
  };
}

export async function createStudyProcess(
  formState: CreateStudyProcessState,
  formData: FormData
): Promise<CreateStudyProcessState> {

  const headerList = await headers();
  
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  const result = createTopicSchema.safeParse(
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
    var slugify = require('slugify');

    const studyProcessUser = await prisma.studyProcess.findFirst({
      where: {
        userId: session.user.id,
        topicId: result.data.topicId,
      }
    });

    if (studyProcessUser !== null) {
      return {
          errors: {
            _form: ["Vous êtes déja en train d'apprendre cette matière. Veuillez en choisir une nouvelle."],
          },
        };
    }

    studyProcess = await prisma.studyProcess.create({
      data: {
        name: result.data.name,
        slug: slugify(result.data.name),
        description: result.data.description,
        forecastedDedicatedHours: result.data.timeDedicated === '' ? null : Number(result.data.timeDedicated),
        forecastedDedicatedHoursPeriod: result.data.timeDedicated === '' ? null : result.data.timeDedicatedPeriod,
        topicId: result.data.topicId,
        userId: session.user.id,
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
            _form: ['Une erreur est survenue lors de la création du processus de création'],
          },
        };
    }
  }

  revalidateTag("studyProcess");
  redirect("/profile");
}
