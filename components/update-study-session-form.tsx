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
import { DeleteIcon, EditIcon } from "./icons";
import { Time } from "@internationalized/date";

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

  const [urls, setUrls] = useState(studySession.urls.split(","));

  function addUrl() {
    setUrls([...urls, ""]);
  }

  function handleUrlRemove(index: number) {
    setUrls(urls.filter((url, i) =>
      index !== i
    ));
  }

  function handleUrlChange(evt) {
    const index = Number(evt.currentTarget.dataset.index);

    const nextUrls = urls.map((url, i) => {
      if (i === index) {
        return evt.currentTarget.value;
      } else {
        return url;
      }
    });

    setUrls(nextUrls);
  }

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
    <Card className="rounded-none relative p-4 w-2/5">
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

            <Input type="text" name="urls" value={urls.join(",")} />

            {urls.map((url, index) => {
              return (
                <div key={index} className="flex flex-row w-full gap-4">
                  <Input
                    id={`url-${index}`}
                    type="text"
                    value={urls[index]}
                    data-index={index}
                    placeholder="Saisissez l'adresse url d'un contenu utilisé lors de cette session"
                    onChange={handleUrlChange}
                  />
                  <Button
                    onPress={() => removeUrl(index)}
                    className="bg-white min-w-15"
                  >
                    <DeleteIcon width="1.5em" height="1.5em" />
                  </Button>
                </div>
              );
            })}

            <Button
              onPress={addUrl}
              className="ml-auto bg-secondary-200 text-white min-w-15"
            >
              <PlusIcon />
            </Button>

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
