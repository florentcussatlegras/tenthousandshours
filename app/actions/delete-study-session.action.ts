"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function deleteStudySession(formData: FormData) {
  const studyProcessId = String(formData.get("studyProcessId"));
  const sessionId = String(formData.get("id"));

  const studyProcess = await prisma.studyProcess.findFirst({
    where: {
      id: String(formData.get("studyProcessId")),
    },
  });

  try {
    // await prisma.studySession.delete({
    //   where: {
    //     id: String(formData.get("id")),
    //   },
    // });

    // 1. Delete the session
    await prisma.studySession.delete({
      where: { id: sessionId },
    });

    // 2. Recalculate totalSeconds for this studyProcess
    const allSessions = await prisma.studySession.findMany({
      where: { studyProcessId },
      select: { totalSeconds: true },
    });

    const newTotalSeconds = allSessions.reduce(
      (acc, session) => acc + (session.totalSeconds ?? 0),
      0
    );

    console.log(newTotalSeconds);

    // 3. Update the studyProcess
    await prisma.studyProcess.update({
      where: { id: studyProcessId },
      data: { totalSeconds: newTotalSeconds },
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
            "Une erreur est survenue lors de la suppression de la session de travail",
          ],
        },
      };
    }
  }

  revalidatePath(`/study-process/${studyProcess?.slug}`);
  redirect(`/study-process/${studyProcess?.slug}`);
}
