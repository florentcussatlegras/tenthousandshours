"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { z } from "zod";

interface LaunchSessionState {
  errors: {
    studyProcessId?: String[];
    startedAt?: String[];
    _form?: String[];
  };
}

const launchStudySessionSchema = z.object({
  studyProcessId: z.string(),
  startedAt: z.string().min(1, "Veuillez saisir une heure de début"),
});

export async function launchStudySessionAction(
  formState: LaunchSessionState,
  formData: FormData
): Promise<LaunchSessionState> {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  const result = launchStudySessionSchema.safeParse(
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

  console.log(studyProcess);

  if (studyProcess === null) {
    return {
      errors: {
        _form: ["Cette session n'est liée à aucun apprentissage en cours."],
      },
    };
  }

  return {
    errors: {},
  };

  //   try {
  //     await prisma.studySession.delete({
  //       where: {
  //         id: String(formData.get("id")),
  //       },
  //     });
  //   } catch (err: unknown) {
  //     if (err instanceof Error) {
  //       return {
  //         errors: {
  //           _form: [err.message],
  //         },
  //       };
  //     } else {
  //       return {
  //         errors: {
  //           _form: [
  //             "Une erreur est survenue lors de la suppression de la session de travail",
  //           ],
  //         },
  //       };
  //     }
  // }

  revalidateTag("studySession");
  redirect(`/study-process/${studyProcess?.slug}`);
}
