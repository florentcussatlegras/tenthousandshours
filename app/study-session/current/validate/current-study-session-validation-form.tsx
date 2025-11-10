"use client";

import { StudySession } from "@prisma/client";
import React, { useEffect } from "react";
import { validateCurrentStudySessionAction } from "@/app/actions/validate-current-study-session.action";
import { addToast, Button, Form, Input, Textarea } from "@heroui/react";
import { LinkIcon, Play, PlusIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { DeleteIcon } from "@/components/icons";
import { redirect } from "next/navigation";
import { fetchStudyProcessByTopic } from "@/app/actions/actions";
import { resumeCurrentStudySessionAction } from "@/app/actions/resume-current-study-session.action";

export function CurrentStudySessionValidationForm() {
  const [formValidateCurrentSessionState, formValidateCurrentSessionAction] =
    useActionState(validateCurrentStudySessionAction, {
      errors: {},
      confirmValidation: false,
    });

  const [formResumeCurrentSessionState, formResumeCurrentSessionAction] =
    useActionState(resumeCurrentStudySessionAction, {
      resumeCurrentStudySession: false,
    });

  const [urls, setUrls] = useState([""]);

  const [studyProcess, setStudyProcess] = useState<any>(null);

  useEffect(() => {
    async function toastAndRedirect() {
      const newStudyProcess = await fetchStudyProcessByTopic(
        localStorage.getItem("current_study_session_topic_id")
      );

      setStudyProcess(newStudyProcess);

      if (formValidateCurrentSessionState.confirmValidation) {
        addToast({
          title: "Confirmation",
          description: "La session a bien été ajoutée",
          color: "success",
        });

        clearStorage();

        redirect(`/study-process/${newStudyProcess?.slug}`);
      }
    }

    toastAndRedirect();
  }, [formValidateCurrentSessionState]);

  useEffect(() => {
    if (formResumeCurrentSessionState.resumeCurrentStudySession) {
      localStorage.setItem("current_study_session_resume", "true");
      redirect(`/study-process/${studyProcess.slug}`);
    }
  }, [formResumeCurrentSessionState]);

  function addUrl() {
    setUrls([...urls, ""]);
  }

  function handleUrlRemove(index: number) {
    setUrls(urls.filter((url, i) => index !== i));
  }

  function handleUrlChange(evt: React.ChangeEvent<HTMLInputElement>) {
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

  function clearStorage() {
    localStorage.removeItem("current_study_session_topic_id");
    localStorage.removeItem("current_study_session_started_at");
    localStorage.removeItem("current_study_session_timer");
    localStorage.removeItem("current_study_session_is_playing");
    localStorage.removeItem("current_study_session_finished_at");
    localStorage.removeItem("current_study_session_topic_name");
    localStorage.removeItem("current_study_session_resume");
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <Form
        action={formValidateCurrentSessionAction}
        className="flex flex-col w-1/3 gap-4"
      >
        {formValidateCurrentSessionState.errors._form ? (
          <div className="text-danger text-sm">
            {formValidateCurrentSessionState.errors._form?.join(", ")}
          </div>
        ) : null}

        <div className="flex flex-col">
          <div className="flex flex-row gap-2 text-2xl">
            <div>Début:</div>
            <div>
              {new Intl.DateTimeFormat("fr-Fr", {
                dateStyle: "long",
              }).format(
                new Date().setTime(
                  Number(
                    localStorage.getItem("current_study_session_started_at")
                  )
                )
              )}
            </div>
            <div>
              {new Intl.DateTimeFormat("fr-Fr", {
                timeStyle: "short",
              }).format(
                new Date().setTime(
                  Number(
                    localStorage.getItem("current_study_session_started_at")
                  )
                )
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2 text-2xl">
            <div>Fin:</div>
            <div>
              {new Intl.DateTimeFormat("fr-Fr", {
                dateStyle: "long",
              }).format(
                new Date().setTime(
                  Number(
                    localStorage.getItem("current_study_session_finished_at")
                  )
                )
              )}
            </div>
            <div>
              {new Intl.DateTimeFormat("fr-Fr", {
                timeStyle: "short",
              }).format(
                new Date().setTime(
                  Number(
                    localStorage.getItem("current_study_session_finished_at")
                  )
                )
              )}
            </div>
          </div>
        </div>

        <Input
          type="hidden"
          name="topicId"
          value={String(localStorage.getItem("current_study_session_topic_id"))}
        />

        <Input
          type="hidden"
          name="startedAt"
          value={String(
            localStorage.getItem("current_study_session_started_at")
          )}
        />

        <Input
          type="hidden"
          name="finishedAt"
          value={String(
            localStorage.getItem("current_study_session_finished_at")
          )}
        />

        <Input
          type="hidden"
          name="timer"
          value={String(localStorage.getItem("current_study_session_timer"))}
        />

        <Textarea
          className="flex-3"
          label="Vous pouvez ajouter une description"
          name="description"
        />
        <Input type="hidden" name="urls" value={urls.join(",")} />
        {formValidateCurrentSessionState.errors.urls ? (
          <div className="text-danger text-sm">
            {formValidateCurrentSessionState.errors.urls?.join(", ")}
          </div>
        ) : null}
        {urls.map((url, index) => {
          return (
            <div
              key={index}
              className="flex flex-row w-full gap-4 items-center"
            >
              <LinkIcon />
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
          className="ml-auto bg-secondary-400 text-white min-w-15"
        >
          <PlusIcon />
        </Button>

        <Button type="submit" className="bg-sky-500 text-white">
          Terminer la session
        </Button>
      </Form>
      <Form action={formResumeCurrentSessionAction}>
        <Button type="submit" className="absolute bottom-4 left-45">
          <Play />
          Reprendre
        </Button>
      </Form>
    </div>
  );
}
