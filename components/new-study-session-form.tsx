"use client";

import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Form,
  Input,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudyProcess } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { DeleteIcon } from "./icons";

export const NewStudySessionForm = ({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) => {
  const [formState, formAction] = useActionState(createStudySessionAction, {
    errors: {},
  });
  const [urls, setUrls] = useState([""]);
  const [dateCreation, setDateCreation] = useState(
    parseDate(new Date().toISOString().substring(0, 10))
  );

  let formatter = useDateFormatter({ dateStyle: "full" });

  function addUrl() {
    setUrls([...urls, ""]);
  }

  function handleUrlRemove(index: number) {
    setUrls(urls.filter((url, i) => index !== i));
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

  const dateCreationStr = new Intl.DateTimeFormat("fr-Fr", {
    dateStyle: "full",
  }).format(dateCreation.toDate(getLocalTimeZone()));

  return (
    <Card className="rounded-none relative p-4 w-2/5">
      <CardBody>
        <div className="flex flex-col gap-4">
          <Form
            action={formAction}
            className="flex flex-col justify-start w-full gap-6"
          >
            <div className="flex flex-row items-center justify-around w-full">
              <h1>
                {dateCreationStr.slice(0, 1).toUpperCase() +
                  dateCreationStr.slice(1)}
              </h1>
              <div className="ml-auto">
                <DatePicker
                  name="date"
                  className="max-w-[150px]"
                  value={dateCreation}
                  onChange={setDateCreation}
                />
              </div>
            </div>

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
                  defaultValue={
                    new Time(new Date().getHours(), new Date().getMinutes())
                  }
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

            <Input type="hidden" name="urls" value={urls.join(",")} />

            {urls.map((url, index) => {
              return (
                <div key={index} className="flex flex-row w-full gap-4">
                  <Input
                    type="text"
                    value={url}
                    data-index={index}
                    placeholder="Saisissez l'adresse url d'un contenu utilisé lors de cette session"
                    onChange={handleUrlChange}
                  />
                  <Button
                    onPress={() => handleUrlRemove(index)}
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

            <Button type="submit" className="bg-sky-500 text-white">
              Enregistrer la session
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};
