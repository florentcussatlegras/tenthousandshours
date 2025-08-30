import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Breadcrumb } from "@/components/breadcrumb";
import DetailsStudyProcess from "@/components/details-study-process";
import ListStudiesSession from "@/components/list-studies-session";
import { Card } from "@heroui/react";
import { headers } from "next/headers";

export default async function studyProcessDetailPage({ params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params.slug;

  const studyProcess = await prisma.studyProcess.findFirst({
    select: {
      name: true,
      createdAt: true,
      description: true,
      topic: {
        select: {
          name: true,
        }
      },
      studySessions: {
            select: {
                description: true,
                id: true, 
                createdAt: true,
                totalHours: true, 
                startedAt: true, 
                finishedAt: true, 
                studyProcessId: true,
            }
        }
    },
    where: {
        slug,
        userId: session?.user.id
    }
  });

  return (
    <div className="w-full space-y-6">
      <Breadcrumb steps={[{ label: "Mes apprentissages", url: "/profile" }, { label: `${studyProcess?.topic.name}` }]} />
      <h1 className="text-3xl font-bold">
        Mes apprentissages
      </h1>
      <div className="grid grid-cols-3 w-full gap-4">
        <div className="col-span-1">
            <DetailsStudyProcess studyProcess={studyProcess} />
        </div>
        <div className="col-span-2">
            <ListStudiesSession studySessions={studyProcess?.studySessions} />
        </div>
      </div>
    </div>
  );
}
