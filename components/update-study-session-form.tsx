import { updateStudySessionAction } from "@/app/actions/update-study-session.action";
import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { StudyProcess, StudySession } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { EditIcon } from "./icons";
import prisma from "@/app/lib/prisma";
import { getStudySession } from "@/app/actions/actions";
import { Time } from "@internationalized/date";
import { toUpperCase } from "better-auth/*";

export function UpdateStudySessionForm({
  onReset,
  studyProcess,
  studySession,
}: {
  studyProcess: StudyProcess;
  studySession: StudySession;
}) {
  const [formState, formAction] = useActionState(updateStudySessionAction, {
    errors: {},
  });

  const [startedAtValue, setStartedAtValue] = useState(
    new Time(
      studySession.startedAt.getHours(),
      studySession.startedAt.getMinutes()
    )
  );

  const [finishedAtValue, setFinishedAtValue] = useState(
    new Time(
      studySession.finishedAt.getHours(),
      studySession.finishedAt.getMinutes()
    )
  );

  const [descriptionValue, setDescriptionValue] = useState(
    studySession.description
  );

  const dateCreationStr = new Intl.DateTimeFormat("fr-Fr", {
    dateStyle: "full",
  }).format(studySession.createdAt);

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
            <Input
                type="hidden"
                name="studySessionId"
                value={studySession.id}
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
                  value={startedAtValue}
                  onKeyDown={(e) => setStartedAtValue(e.currentTarget.value)}
                />
                <TimeInput
                  label="Terminé à"
                  className="flex-1"
                  name="finishedAt"
                  hourCycle={24}
                  value={finishedAtValue}
                  onKeyDown={(e) => setFinishedAtValue(e.currentTarget.value)}
                />
              </div>
            </div>
            
            <Textarea
              className="flex-3"
              label="Veuillez décrire le contenu de votre session"
              name="description"
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.currentTarget.value)}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-sky-500 text-white"
                endContent={<EditIcon />}
              >
                Modifier la session
              </Button>
              <Button type="button" variant="flat" onPress={onReset}>
                Annuler
              </Button>
            </div>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
}
