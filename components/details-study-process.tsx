"use client";

import { fetchCurrentStudySession } from "@/app/actions/actions";
import { launchStudySessionAction } from "@/app/actions/launch-study-session.action";
import { useSession } from "@/app/lib/auth-client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Form,
  Input,
  Progress,
} from "@heroui/react";
import { StudyProcess } from "@prisma/client";
import { Timer } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  const { data: session } = useSession();

  const [formState, formAction] = useActionState(launchStudySessionAction, {
    errors: {},
  });

  const [currentStudySession, setCurrentStudySession] = useState([]);

  useEffect(() => {
    async function getCurrentStudySession() {
      const currentStudySession = await fetchCurrentStudySession(
        String(session?.user.id)
      );
      console.log(currentStudySession);
      setCurrentStudySession(currentStudySession);
    }

    getCurrentStudySession();
  }, []);

  const ratioProgress = (Number(studyProcess.totalSeconds) / 36000000) * 100;

  var intl = new Intl.DateTimeFormat("fr-Fr", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="rounded-none relative p-4">
      <CardHeader className="flex">
        {/* <h2 className="font-bold text-sky-500">{studyProcess.topic.name}</h2> */}
        <span className="text-default-500 text-sm">
          Apprentissage débuté le {intl.format(studyProcess.createdAt)}
        </span>
        {currentStudySession.length > 0 ? (
          <Button type="submit" className="bg-sky-500 text-white ml-auto uppercase">
              <Timer />
              <span>Vous avez une session de travail en cours ... {currentStudySession[0].id}</span>
            </Button>
        ) : (
          <Form action={formAction} className="ml-auto">
            <Input
              type="hidden"
              name="studyProcessId"
              defaultValue={studyProcess.id}
            />
            <Input
              type="hidden"
              name="startedAt"
              defaultValue={new Intl.DateTimeFormat("fr-Fr", {
                timeStyle: "short",
              }).format(new Date())}
            />
            <Button type="submit" className="bg-sky-500 text-white">
              <Timer />
              <span>Lancer une nouvelle session</span>
            </Button>
          </Form>
        )}
      </CardHeader>
      <CardBody className="flex flex-col">
        <Chip
          isDisabled
          color="secondary"
        >{`${Math.round(studyProcess.totalSeconds / 3600)} heures`}</Chip>
        <Progress
          aria-label="Loading..."
          className="w-full"
          classNames={{
            indicator: "bg-sky-500",
            track: "drop-shadow-md border border-default",
            value: "ml-auto text-foreground/60 text-sm",
          }}
          value={ratioProgress}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
}
