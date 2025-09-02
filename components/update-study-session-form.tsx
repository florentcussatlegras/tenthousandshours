
import { updateStudySessionAction } from "@/app/actions/update-study-session.action";
import { Button, Card, CardBody, Form, Input, Textarea, TimeInput } from "@heroui/react";
import { StudyProcess, StudySession } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useActionState } from "react";
import { EditIcon } from "./icons";
import prisma from "@/app/lib/prisma";
import { getStudySession } from "@/app/actions/actions";
import {Time} from "@internationalized/date";

export function UpdateStudySessionForm ({
  studySession
}: {
  studySession: StudySession;
}) {
  const [formState, formAction] = useActionState(updateStudySessionAction, {
    errors: {},
  });

  return (
    <Card className="h-[425px] rounded-none relative p-4 w-2/5">
      <CardBody>
        <div className="flex flex-col">
          EDIT FORM
          <Form
            action={formAction}
            className="flex flex-col justify-start w-full gap-6"
          >
            {formState.errors._form ? (
              <div className="text-danger text-sm">
                {formState.errors._form?.join(", ")}
              </div>
            ) : null}
            <div className="flex flex-row w-full gap-3">
              <Input
                type="hidden"
                name="studySessionId"
                value={studySession.id}
              />
              <TimeInput
                label="Débuté à"
                className="flex-1"
                name="startedAt"
                hourCycle={24}
                value={new Time(studySession.startedAt.getHours(), studySession.startedAt.getMinutes())}
              />
              <TimeInput
                label="Terminé à"
                className="flex-1"
                name="finishedAt"
                hourCycle={24}
                value={new Time(studySession.finishedAt.getHours(), studySession.finishedAt.getMinutes())}
              />
            </div>
              <Textarea
                className="flex-3"
                label="Veuillez décrire le contenu de votre session"
                name="description"
                value={studySession.description}
              />
            <Button type="submit" className="bg-sky-500 text-white" endContent={<EditIcon />}>
              Modifier la session 
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};
