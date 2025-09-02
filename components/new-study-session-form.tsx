"use client";

import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import { Button, Card, CardBody, Form, Input, Textarea, TimeInput } from "@heroui/react";
import { StudyProcess } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useActionState } from "react";

export const NewStudySessionForm = ({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) => {
  const [formState, formAction] = useActionState(createStudySessionAction, {
    errors: {},
  });

  return (
    <Card className="h-[425px] rounded-none relative p-4 w-2/5">
      <CardBody>
        <div className="flex flex-col">
          ADD FORM
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
                name="studyProcessId"
                value={studyProcess.id}
              />
              <TimeInput
                label="Débuté à"
                className="flex-1"
                name="startedAt"
                hourCycle={24}
              />
              <TimeInput
                label="Terminé à"
                className="flex-1"
                name="finishedAt"
                hourCycle={24}
              />
            </div>
              <Textarea
                className="flex-3"
                label="Veuillez décrire le contenu de votre session"
                name="description"
              />
            <Button type="submit" className="bg-sky-500 text-white" endContent={<PlusIcon />}>
              Ajouter une nouvelle session 
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};
