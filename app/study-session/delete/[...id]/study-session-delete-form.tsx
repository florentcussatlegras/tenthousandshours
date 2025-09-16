"use client";

import { deleteStudySession } from "@/app/actions/delete-study-session.action";
import { Form, Input, Button, Textarea, addToast } from "@heroui/react";
import { StudySession } from "@prisma/client";
import Link from "next/link";

export default function StudySessionDeleteForm({
  studySession,
}: {
  studySession: StudySession;
}) {
  const { id, studyProcessId } = studySession;

  return (
    <Form action={deleteStudySession} className="gap-4">
      <div className="flex items-center">
        <span>Etes-vous sûr de vouloir supprimer cette session? {id}</span>
      </div>
      <Input type="hidden" value={id} name="id" />
      <Input type="hidden" value={studyProcessId} name="studyProcessId" />
      <div className="flex gap-4">
        <Button type="submit" color="danger" className="uppercase font-bold">
          Valider
        </Button>
        <Button
          type="submit"
          color="default"
          variant="flat"
          className="uppercase font-bold"
        >
          <Link href="/category-topic/list">Annuler</Link>
        </Button>
      </div>
    </Form>
  );
}
