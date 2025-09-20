import { fetchStudySessionsFinished } from "@/app/actions/actions";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Breadcrumb } from "@/components/breadcrumb";
import { ConfirmCurrentSessionValidation } from "@/components/confirm-current-session-validation";
import DetailsStudyProcess from "@/components/details-study-process";
import ListStudiesSession from "@/components/list-studies-session";
import { NewStudySessionForm } from "@/components/new-study-session-form";
import { StudySessions } from "@/components/study-sessions";
import { addToast, Card } from "@heroui/react";
import { headers, cookies } from "next/headers";

export default async function studyProcessDetailPage({ params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const paramsObj = await params;
  const slug = paramsObj.slug[0];

  const cookieStore = await cookies();
  const confirmValidation = cookieStore.get('confirmValidation');

  const studyProcess = await prisma.studyProcess.findFirst({
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      totalSeconds: true,
      topic: {
        select: {
          name: true,
        },
      },
      // studySessions: {
      //   select: {
      //     description: true,
      //     id: true,
      //     createdAt: true,
      //     totalSeconds: true,
      //     startedAt: true,
      //     finishedAt: true,
      //     studyProcessId: true,
      //   },
      //   where: {
      //     finishedAt: null
      //   }
      // },
    },
    where: {
      slug,
      userId: session?.user.id,
    },
  });

  const studySessions = await fetchStudySessionsFinished(studyProcess.id);

  return (
    <div className="w-full space-y-6">
      <Breadcrumb
        steps={[
          { label: "Mes apprentissages", url: "/profile" },
          { label: `${studyProcess?.topic.name}` },
        ]}
      />
      {confirmValidation && <ConfirmCurrentSessionValidation />}
      <h1 className="text-3xl font-bold">
        Mes sessions de travail{" "}
        <span className="text-sky-500">{studyProcess.topic.name}</span>
      </h1>
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <DetailsStudyProcess studyProcess={studyProcess} />
        </div>
        <StudySessions
          studySessions={studySessions}
          studyProcess={studyProcess}
        />
      </div>
    </div>
  );
}
