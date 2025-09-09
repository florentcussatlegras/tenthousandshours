"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudySession } from "@prisma/client";

// const SignUpFormSchema = z.object({
//     name: z.string().min(5),
//     email: z.email('Votre email est invalide.'),
//     password: z.string().min(8),
//     terms: z.boolean("Veuillez accepter les termes d'utilisation"),
// });

// export async function signupAction(formState: any, formData: FormData) {

//     const data = {
//         name: formData.get("name") as string,
//         email: formData.get("email") as string,
//         password: formData.get("password") as string,
//         terms: formData.get("terms") as string,
//     };

//     const result = SignUpFormSchema.safeParse(data);

//     if(!result.success) {
//         // console.log(console.log(z.flattenError(result.error).fieldErrors));
//         const flattened = z.flattenError(result.error);

//         return { errors: flattened.fieldErrors };
//     }

//     try {
//       console.log("result data", result.data);
//     } catch (err) {
//       if (err instanceof Error) {
//         return {
//           errors: {
//             _form: [err.message],
//           },
//         };
//       } else {
//         return {
//           errors: {
//             _form: ["Something went wrong"],
//           },
//         };
//       }
//     }

//     // await signUp.email({
//     //     email: formData.email,
//     //     name: formData.name,
//     //     password: formData.password
//     // }, {
//     //     onSuccess: () => {
//     //         redirect("/dashboard");
//     //     }
//     // })

//     redirect('/dashboard');

// }

export async function getCategoryTopic(slug) {
  const categoryTopic = await prisma.categoryTopic.findFirst({
    where: {
      slug,
    },
  });

  return categoryTopic;
}

export async function getListCategoryTopic() {
  const categories = await prisma.categoryTopic.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
  });

  return categories;
}

export async function getTopic(slug) {
  const topic = await prisma.topic.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      categoryTopicId: true,
    },
    where: {
      slug,
    },
  });

  return topic;
}

export async function getListTopics() {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
  });

  return topics;
}

export async function fetchFilterStudySessions(
  yearStart: number,
  monthStart: number,
  dayStart: number,
  yearEnd: number,
  monthEnd: number,
  dayEnd: number,
) {
  const dateStartFilter = new Date(
    yearStart,
    monthStart - 1,
    dayStart + 1,
    -22,
    0,
    0
  );
  const dateEndFilter = new Date(yearEnd, monthEnd - 1, dayEnd + 1, 1, 59, 0);

  const studySessions =
    await prisma.$queryRaw`SELECT * FROM public."StudySession" WHERE "createdAt" >= ${dateStartFilter} AND "createdAt" <= ${dateEndFilter}`;

  return studySessions;
}

export async function fetchStudySessions(
  dateSelect: Date
) {
  const dateTimeSlotStart = new Date(dateSelect.getFullYear(), dateSelect.getMonth(), dateSelect.getDate() + 1, -22, 0, 0);
  const dateTimeSlotFinish = new Date(dateSelect.getFullYear(), dateSelect.getMonth(), dateSelect.getDate() + 1, 1, 59, 0);

  console.log(dateTimeSlotStart);
  console.log(dateTimeSlotFinish);

  let studySessions = [];

  studySessions =
    await prisma.$queryRaw`SELECT 
        "StudySession"."id" AS "session_id", 
        "StudySession"."createdAt" AS "session_createdAt",
        "StudySession"."startedAt",
        "StudySession"."finishedAt",
        "studyProcessId",
        "StudyProcess"."id",
        "StudyProcess"."topicId",
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name" 
      FROM public."StudySession"
      LEFT JOIN public."StudyProcess"
      ON "studyProcessId" = "StudyProcess"."id"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      WHERE "StudySession"."createdAt" >= ${dateTimeSlotStart} 
      AND "StudySession"."createdAt" <= ${dateTimeSlotFinish} 
      ORDER BY "startedAt"
  `;

  console.log(studySessions);

  return studySessions;
}

export async function getStudySession(studySessionId: string) {
  let studySession;

  if (studySessionId !== null) {
    studySession = await prisma.studySession.findFirst({
      where: {
        id: studySessionId,
      },
    });
  } else {
    return null;
  }

  return studySession;
}

export async function getTopicStudySession(studySession: StudySession) {
  const studyProcess = await prisma.studyProcess.findFirst({
    where: {
      id: studySession.studyProcessId,
    },
  });

  const topic = await prisma.topic.findFirst({
    where: {
      id: studyProcess?.topicId,
    },
  });

  return topic;
}

// export async function getFilterStudySessions(dateStartFilter: Date, dateEndFilter: Date) {

//     const response = await fetchFilterStudySessions(dateStartFilter, dateEndFilter);

//     console.log('ici', response);

//     if (!response.ok) throw new Error("Failed to fetch users");

//     const studySessions = await response.json();

//     return studySessions;

// }
