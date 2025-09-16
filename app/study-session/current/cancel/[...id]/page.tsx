

import * as actions from "@/app/actions/actions";
import { Breadcrumb } from "@/components/breadcrumb";
import prisma from "@/app/lib/prisma";
import StudySessionDeleteForm from "@/app/study-session/delete/[...id]/study-session-delete-form";

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
    
    return (
        <div className="w-full space-y-6">
            <Breadcrumb
                steps={[
                    { label: "Supprimer la session en cours"}
                ]}
            />
            <h1 className="text-3xl font-bold">Supprimer la session de travail en cours</h1>
            <div className="flex flex-col gap-4">
                <StudySessionDeleteForm studySession={studySession} />
            </div>
        </div>
    );
}