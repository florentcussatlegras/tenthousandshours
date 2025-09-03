"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function deleteStudySession(formData: FormData) {
  const studyProcess = await prisma.studyProcess.findFirst({
    where: {
      id: String(formData.get("studyProcessId")),
    },
  });

  try {
    await prisma.studySession.delete({
      where: {
        id: String(formData.get("id")),
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
            "Une erreur est survenue lors de la suppression de la session de travail",
          ],
        },
      };
    }
  }

  revalidateTag("studySession");
  redirect(`/study-process/${studyProcess?.slug}`);
}
