

import * as actions from "@/app/actions/actions";
import StudySessionDeleteForm from "./study-session-delete-form";
import { Breadcrumb } from "@/components/breadcrumb";
import prisma from "@/app/lib/prisma";

export default async function StudySessionDeletePage({ params }) {
    const { id } = await params;
    const studySession = await prisma.studySession.findFirst({
        where: {
            id: String(id),
        },
        select: {
            id: true,
            studyProcessId: true,
        }
    });
    const studyProcess = await prisma.studyProcess.findFirst({
        where: {
            id: studySession?.studyProcessId
        },
        select: {
            slug: true,
            topicId: true,
        }
    });
    const topic = await prisma.topic.findFirst({
        where: {
            id: studyProcess?.topicId
        },
        select: {
            name: true,
        }
    });
    
    return (
        <div className="w-full space-y-6">
            <Breadcrumb
                steps={[
                    { label: "Mes apprentissages", url: "/profile" },
                    { label: `${topic?.name}`, url: `/study-process/${studyProcess?.slug}` },
                    { label: "Supprimer une session"}
                ]}
            />

            <h1 className="text-3xl font-bold">Supprimer une session de travail</h1>
            <div className="flex flex-col gap-4">
                <StudySessionDeleteForm studySession={studySession} />
            </div>
        </div>
    );
}