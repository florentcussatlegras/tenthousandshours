"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { StudySession, User } from "@prisma/client";
import { UUID } from "crypto";
import { CalendarDate } from "@heroui/react";

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

import { auth } from "../lib/auth";
import { headers } from "next/headers";

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session?.user.id;
}

export async function getCategoryTopic(slug: String) {
  const categoryTopic = await prisma.categoryTopic.findFirst({
    where: {
      slug: String(slug),
    },
  });

  return categoryTopic;
}

export async function getListCategoryTopic() {
  const categories = await prisma.categoryTopic.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      slug: true,
      description: true,
      status: true,
    },
  });

  return categories;
}

export async function getCategoryTopicUsedByUser() {
  const userId = await getUser();

  const categoryTopics: any[] = await prisma.$queryRaw`
        SELECT DISTINCT "CategoryTopic"."id" AS "category_topic_id",
        "CategoryTopic"."name" AS "category_topic_name"
          -- "CategoryTopic"."name" AS "category_topic_name"
        FROM public."CategoryTopic" 
        LEFT JOIN public."Topic"
        ON "CategoryTopic"."id" = "Topic"."categoryTopicId"
        LEFT JOIN public."StudyProcess"
        ON "Topic"."id" = "StudyProcess"."topicId"
        WHERE "StudyProcess"."userId" = ${userId}
      `;

  return categoryTopics;
}

export async function getTopic(slug: String) {
  const topic = await prisma.topic.findFirst({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      slug: true,
      description: true,
      status: true,
      categoryTopicId: true,
    },
    where: {
      slug: String(slug),
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

export async function fetchStudySessionsFinished(studyProcessId: Number) {
  const studySessions: any[] = await prisma.$queryRaw`SELECT 
        "StudySession"."id", 
        "StudySession"."createdAt",
        "StudySession"."startedAt",
        "StudySession"."finishedAt",
        "StudySession"."totalSeconds",
        "StudySession"."description",
        "StudySession"."urls",
        "studyProcessId"
      FROM public."StudySession"
      WHERE "totalSeconds" > 0
      AND "studyProcessId" = ${studyProcessId}
    `;

  return studySessions;
}

export async function fetchStudySessionsPerRangeDays(
  studyProcessId: String,
  yearStart: number | null,
  monthStart: number | null,
  dayStart: number | null,
  yearEnd: number | null,
  monthEnd: number | null,
  dayEnd: number | null
) {
  let studySessions: any[] = [];

  if (
    yearStart !== null &&
    monthStart !== null &&
    dayStart !== null &&
    yearEnd !== null &&
    monthEnd !== null &&
    dayEnd !== null
  ) {
    const dateStartFilter = new Date(
      yearStart,
      monthStart - 1,
      dayStart,
      0,
      0,
      0
    );

    const dateEndFilter = new Date(
      yearEnd, 
      monthEnd - 1, 
      dayEnd, 
      23, 
      59, 
      59,
      999
    );

    studySessions = await prisma.$queryRaw`
        SELECT * FROM public."StudySession" 
        WHERE "studyProcessId" = ${studyProcessId}
        AND "createdAt" >= ${dateStartFilter} 
        AND "createdAt" <= ${dateEndFilter}
        AND "totalSeconds" > 0
      `;
  } else {
    studySessions = await prisma.$queryRaw`
        SELECT * FROM public."StudySession" 
        WHERE "studyProcessId" = ${studyProcessId}
        AND "totalSeconds" > 0 
      `;
  }

  return studySessions;
}

export async function fetchStudySessionsPerDay(userId: String, dateSelect: Date) {
  const dateTimeSlotStart = new Date(
    dateSelect.getFullYear(),
    dateSelect.getMonth(),
    dateSelect.getDate(),
    0,
    0,
    0
  );
  const dateTimeSlotFinish = new Date(
    dateSelect.getFullYear(),
    dateSelect.getMonth(),
    dateSelect.getDate(),
    23, 
    59, 
    59,
    999
  );

  console.log("filtering by:" + dateTimeSlotStart + '-' + dateTimeSlotFinish);
  console.log("user id est: " + userId);

  const studySessions: any = await prisma.$queryRaw`SELECT 
        "StudySession"."id" AS "session_id", 
        "StudySession"."createdAt" AS "session_createdAt",
        "StudySession"."startedAt",
        "StudySession"."finishedAt",
        "StudySession"."totalSeconds",
        "StudySession"."description",
        "StudySession"."urls",
        "studyProcessId",
        "StudyProcess"."id",
        "StudyProcess"."topicId",
        "StudyProcess"."totalSeconds" AS "study_process_total_seconds",
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name" 
      FROM public."StudySession"
      LEFT JOIN public."StudyProcess"
      ON "studyProcessId" = "StudyProcess"."id"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      WHERE "StudySession"."createdAt" >= ${dateTimeSlotStart} 
      AND "StudySession"."createdAt" <= ${dateTimeSlotFinish}
      AND "StudySession"."totalSeconds" > 0
      AND "StudyProcess"."userId" = ${userId}
      ORDER BY "startedAt"
  `;

  return studySessions;
}

export async function fetchStudyProcessByTopic(topicId: string | null) {
  const userId = await getUser();

  // const studyProcess = await prisma.studyProcess.findFirst({
  //   where: {
  //     topicId,
  //     userId,
  //   },
  // });

  const studyProcess: any[] = await prisma.$queryRaw`SELECT
        *
      FROM public."StudyProcess" 
      WHERE "StudyProcess"."topicId" = ${topicId}
      AND "StudyProcess"."userId" = ${userId}
  `;

  return studyProcess[0];
}

export async function fetchCurrentStudySession() {
  const userId = await getUser();

  const studySession: any[] = await prisma.$queryRaw`SELECT
        "StudySession"."id" AS "id",
        "StudySession"."startedAt",
        "StudySession"."studyProcessId" AS "studyprocess_id",
        "StudyProcess"."name" AS "studyprocess_name",
        "Topic"."name" AS "topic_name"
      FROM public."StudySession"
      LEFT JOIN public."StudyProcess"
      ON "StudySession"."studyProcessId" = "StudyProcess"."id"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      WHERE "StudyProcess"."userId" = ${userId}
      AND "StudySession"."totalSeconds" = 0
  `;

  if (studySession.length > 0) {
    return studySession[0];
  }

  return null;
}

export async function updateTotalSecondsStudySession(
  id: string,
  timeSpan: number
) {
  await prisma.studySession.update({
    data: {
      totalSeconds: timeSpan / 1000,
    },
    where: {
      id,
    },
  });
}

export async function getTopicsOfaUser() {
  const userId = await getUser();

  const topics: any[] = await prisma.$queryRaw`SELECT
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name"
      FROM public."Topic"
      LEFT JOIN public."StudyProcess"
      ON "Topic"."id" = "StudyProcess"."topicId"
      WHERE "StudyProcess"."userId" = ${userId}
  `;

  // return topics;

  // console.log(userId);

  // const topics = await prisma.topic.findMany({
  //   select: {
  //     id: true,
  //     name: true,
  //     studyProcesses: {
  //       where: {
  //         userId: userId
  //       }
  //     },
  //   },
  // });
  // console.log(topics);

  return topics;
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

export async function getStudyProcessBySlug(slug: String) {
  const userId = await getUser();

  const studyProcess: any[] = await prisma.$queryRaw`SELECT
        "StudyProcess"."id",
        "StudyProcess"."name",
        "StudyProcess"."createdAt",
        "StudyProcess"."totalSeconds",
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name"
      FROM public."StudyProcess"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      WHERE "StudyProcess"."userId" = ${userId}
      AND "StudyProcess"."slug" = ${slug}
  `;

  return studyProcess[0];
}

export async function getStudyProcesses() {
  const userId = await getUser();

  const studyProcesses: any[] = await prisma.$queryRaw`SELECT
        "StudyProcess"."id",
        "StudyProcess"."totalSeconds",
        "StudyProcess"."slug",
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name",
        "CategoryTopic"."id" AS "category_topic_id",
        "CategoryTopic"."name" AS "category_topic_name"
      FROM public."StudyProcess"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      LEFT JOIN public."CategoryTopic"
      ON "Topic"."categoryTopicId" = "CategoryTopic"."id"
      WHERE "StudyProcess"."userId" = ${userId}
  `;

  return studyProcesses;
}

export async function getStudyProcessesAchieved() {
  const userId = await getUser();

  const studyProcesses: any[] = await prisma.$queryRaw`SELECT
        "StudyProcess"."id",
        "StudyProcess"."slug",
        "Topic"."id" AS "topic_id",
        "Topic"."name" AS "topic_name"
      FROM public."StudyProcess"
      LEFT JOIN public."Topic"
      ON "StudyProcess"."topicId" = "Topic"."id"
      WHERE "StudyProcess"."userId" = ${userId}
      AND "StudyProcess"."totalSeconds" >= 36000000
  `;

  return studyProcesses;
}

export async function foo(studyProcessId: UUID) {
  const studySession = await prisma.$queryRaw`SELECT
    max("createdAt")
    FROM public."StudySession"
    WHERE "StudySession"."studyProcessId" = ${studyProcessId} 
  `;
  console.log("totototot");
  console.log(studySession);
  return "fooooooo";
}

export async function getLastStudySessionByStudyProcess(studyProcessId: String) {
  const studySession: any[] = await prisma.$queryRaw`SELECT
    max("createdAt")
    FROM public."StudySession"
    WHERE "StudySession"."studyProcessId" = ${studyProcessId} 
  `;

  return studySession[0].max;
}

export async function getFirstStudySessionByStudyProcess(studyProcessId: String) {
  const studySession: any[] = await prisma.$queryRaw`SELECT
    min("createdAt")
    FROM public."StudySession"
    WHERE "StudySession"."studyProcessId" = ${studyProcessId} 
  `;

  return studySession[0].min;
}

// export async function getFilterStudySessions(dateStartFilter: Date, dateEndFilter: Date) {

//     const response = await fetchFilterStudySessions(dateStartFilter, dateEndFilter);

//     console.log('ici', response);

//     if (!response.ok) throw new Error("Failed to fetch users");

//     const studySessions = await response.json();

//     return studySessions;

// }
