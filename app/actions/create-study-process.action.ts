"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudyProcess } from "@prisma/client";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const createTopicSchema = z.object({
  description: z.string(),
  timeDedicated: z.string().optional().nullable(),
  timeDedicatedPeriod: z.string().optional().nullable(),
  topicId: z.string(),
});

interface CreateStudyProcessState {
  errors: {
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

  const topicId = formData.get("topicId");
  console.log(topicId);

  if (!topicId || topicId === "null" || topicId === "") {
    return {
      errors: {
        _form: ["Veuillez saisir une matière"],
      },
    };
  }

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

    const topic = await prisma.topic.findFirst({
      select: {
        name: true
      },
      where: {
        id: result.data.topicId
      }
    })

    const studyProcessUser = await prisma.studyProcess.findFirst({
      where: {
        userId: session.user.id,
        topicId: result.data.topicId,
      }
    });

    if (studyProcessUser !== null) {
      console.log(result.data.topicId);
      return {
          errors: {
            _form: ["Vous êtes déja en train d'apprendre cette matière. Veuillez en choisir une nouvelle."],
          },
        };
    }

    studyProcess = await prisma.studyProcess.create({
      data: {
        name: "",
        slug: slugify(String(topic?.name)),
        description: result.data.description,
        forecastedDedicatedHours: !result.data.timeDedicated ? null : Number(result.data.timeDedicated),
        forecastedDedicatedHoursPeriod: !result.data.timeDedicated ? null : result.data.timeDedicatedPeriod,
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

  revalidateTag("studyProcess", {});
  redirect("/profile");
}
