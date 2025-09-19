"use client";

import { StudySession } from "@prisma/client";
import React from "react";
import { validateCurrentStudySessionAction } from "@/app/actions/validate-current-study-session.action";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useActionState, useState } from "react";
import Link from "next/link";
import { DeleteIcon } from "@/components/icons";

export function CurrentStudySessionValidationForm({
  currentStudySession,
}: {
  currentStudySession: StudySession;
}) {
  const [formValidateCurrentSessionState, formValidateCurrentSessionAction] =
    useActionState(validateCurrentStudySessionAction, {
      errors: {},
    });

  const [urls, setUrls] = useState([""]);

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

  return (
    <div>
      <Form
        action={formValidateCurrentSessionAction}
        className="flex flex-col w-1/3 gap-4"
      >
        {formValidateCurrentSessionState.errors._form ? (
          <div className="text-danger text-sm">
            {formValidateCurrentSessionState.errors._form?.join(", ")}
          </div>
        ) : null}
        <Input
          type="text"
          name="currentStudySessionStudyProcessId"
          value={currentStudySession.studyProcessId}
        />
        <Input
          type="text"
          name="currentStudySessionId"
          value={currentStudySession.id}
        />
        <Textarea
          className="flex-3"
          label="Vous pouvez ajouter une description"
          name="description"
        />

        <Input type="text" name="urls" value={urls.join(",")} />

        {formValidateCurrentSessionState.errors.urls ? (
          <div className="text-danger text-sm">
            {formValidateCurrentSessionState.errors.urls?.join(", ")}
          </div>
        ) : null}

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
        <div className="flex flex-row gap-2">
          <Button type="submit" className="bg-sky-500 text-white">
            Terminer la session
          </Button>
          <Button type="button" variant="flat">
            <Link href={`/profile`}>Continuer la session</Link>
          </Button>
        </div>
      </Form>
    </div>
  );
}
