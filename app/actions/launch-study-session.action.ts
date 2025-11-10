"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { z } from "zod";

interface LaunchSessionState {
  errors: {
    topicId?: String[];
    studyProcessId?: String[];
    startedAt?: String[];
    _form?: String[];
  };
}

const launchStudySessionSchema = z.object({
  topicId: z.string(),
  studyProcessId: z.string(),
  startedAt: z.string().min(1, "Veuillez saisir une heure de début"),
});

export async function launchStudySessionAction(
  formLaunchCurrentSessionState: LaunchSessionState,
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

  let studyProcess = null;

  if (result.data.studyProcessId !== "") {
    studyProcess = await prisma.studyProcess.findFirst({
      where: {
        id: result.data.studyProcessId,
      },
    });
  } else {
    studyProcess = await prisma.studyProcess.findFirst({
      where: {
        topicId: result.data.topicId,
      },
    });
  }

  if (studyProcess === null) {
    return {
      errors: {
        _form: ["Veuillez préciser la matière concernée."],
      },
    };
  }

  try {
      // const objStartedAt = result.data.startedAt?.split(":");
      // const objStartedAt = result.data.startedAt;
      const objCreatedAt = new Date();
  
      const dateCreatedAt = new Date(
        objCreatedAt.getFullYear(),
        objCreatedAt.getMonth(),
        objCreatedAt.getDate() + 1,
        -22,
        0,
        0
      );
  
      // const dateStartedAt = new Date(
      //   objCreatedAt.getFullYear(),
      //   objCreatedAt.getMonth(),
      //   objCreatedAt.getDate(),
      //   Number(objStartedAt[0]),
      //   Number(objStartedAt[1]),
      //   Number(objStartedAt[2]),
      // );
      const dateStartedAt = new Date(Number(result.data.startedAt) + 3000);
      console.log(result.data.startedAt);
      console.log(dateStartedAt);
      const dateFinishedAt = null;
  
      const studyProcessInThisHours: any[] = await prisma.$queryRaw`
          SELECT * FROM public."StudySession" 
          WHERE "StudySession"."studyProcessId" = ${result.data.studyProcessId}
          AND ("startedAt" <= ${dateStartedAt} AND "finishedAt" >= ${dateStartedAt})
      `;
  
      if (Array.from(studyProcessInThisHours).length !== 0) {
        return {
          errors: {
            _form: ["Cette session dans cette tranche horaire existe dèja."],
          },
        };
      }
  
      const studySession = await prisma.studySession.create({
        data: {
          description: "",
          createdAt: dateCreatedAt,
          startedAt: dateStartedAt,
          finishedAt: null,
          totalSeconds: 0,
          studyProcessId: String(studyProcess.id),
          urls: ""
        },
      });
  
      // await prisma.studyProcess.update({
      //   data: {
      //     totalSeconds: totalSecondsStudyProcess + totalSecondsSession,
      //   },
      //   where: {
      //     id: result.data.studyProcessId,
      //   },
      // });
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

  revalidateTag("CurrentStudySession");
  revalidateTag("studySession");
  redirect(`/study-process/${studyProcess?.slug}`);
}
