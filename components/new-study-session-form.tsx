"use client";

import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Textarea,
  TimeInput,
} from "@heroui/react";
import {Time} from "@internationalized/date";
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

  const dateJour = new Date();

  const dateCreationStr = new Intl.DateTimeFormat("fr-Fr", {
    dateStyle: "full",
  }).format(dateJour);

  return (
    <Card className="h-[425px] rounded-none relative p-4 w-2/5">
      <CardBody>
        <div className="flex flex-col gap-4">
          <h1>
            {dateCreationStr.slice(0, 1).toUpperCase() +
              dateCreationStr.slice(1)}
          </h1>
          <Form
            action={formAction}
            className="flex flex-col justify-start w-full gap-6"
          >
            {formState.errors._form ? (
              <div className="text-danger text-sm">
                {formState.errors._form?.join(", ")}
              </div>
            ) : null}
            
            <Input
              type="hidden"
              name="studyProcessId"
              value={studyProcess.id}
            />
            <div className="flex flex-col w-full">
              <div className="flex flex-row w-full gap-3 mb-2">
                {formState.errors.startedAt ? (
                  <div className="text-danger text-sm">
                    {formState.errors.startedAt?.join(", ")}
                  </div>
                ) : null}
                {formState.errors.finishedAt ? (
                  <div className="text-danger text-sm">
                    {formState.errors.finishedAt?.join(", ")}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-row w-full gap-3">
                <TimeInput
                  label="Débuté à"
                  className="flex-1"
                  name="startedAt"
                  hourCycle={24}
                  defaultValue={new Time(dateJour.getHours(), dateJour.getMinutes())}
                />
                <TimeInput
                  label="Terminé à"
                  className="flex-1"
                  name="finishedAt"
                  hourCycle={24}
                />
              </div>
            </div>

            <Textarea
              className="flex-3"
              label="Veuillez décrire le contenu de votre session"
              name="description"
            />
            <Button
              type="submit"
              className="bg-sky-500 text-white"
              endContent={<PlusIcon />}
            >
              Ajouter une nouvelle session
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};
