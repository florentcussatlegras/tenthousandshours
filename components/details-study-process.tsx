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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { StudyProcess } from "@prisma/client";
import { Timer } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import useTimer from "./useTimer";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [formState, formAction] = useActionState(launchStudySessionAction, {
    errors: {},
  });

  const [currentStudySession, setCurrentStudySession] = useState(null);

  const [timespanCurrentStudySession, setTimespanCurrentStudySession] =
    useState(0);

  const [daysElapsedCurrentStudySession, setDaysElapsedCurrentStudySession] =
    useState(0);
  const [hoursElapsedCurrentStudySession, setHoursElapsedCurrentStudySession] =
    useState(0);
  const [
    minutesElapsedCurrentStudySession,
    setMinutesElapsedCurrentStudySession,
  ] = useState(0);
  const [
    secondsElapsedCurrentStudySession,
    setSecondsElapsedCurrentStudySession,
  ] = useState(0);

  useEffect(() => {
    async function getCurrentStudySession() {
      const newCurrentStudySession = await fetchCurrentStudySession(
        String(session?.user.id)
      );
      setCurrentStudySession(newCurrentStudySession);
    }

    getCurrentStudySession();
  }, []);

  useEffect(() => {
    if (currentStudySession !== null) {
      console.log(currentStudySession);
      setTimespanCurrentStudySession(
        Date.now() - Date.parse(currentStudySession.startedAt)
      );

      const intervalId = setInterval(() => {
        setTimespanCurrentStudySession((_timespan) => _timespan + 1000);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentStudySession]);

  useEffect(() => {
    setDaysElapsedCurrentStudySession(
      Math.floor(timespanCurrentStudySession / DAY)
    );
    setHoursElapsedCurrentStudySession(
      Math.floor((timespanCurrentStudySession / HOUR) % 24)
    );
    setMinutesElapsedCurrentStudySession(
      Math.floor((timespanCurrentStudySession / MINUTE) % 60)
    );
    setSecondsElapsedCurrentStudySession(
      Math.floor((timespanCurrentStudySession / SECOND) % 60)
    );
  }, [timespanCurrentStudySession]);

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
        {currentStudySession !== null ? (
          <div className="ml-auto">
            <Button
              onPress={onOpen}
              type="submit"
              className="bg-sky-500 text-white uppercase"
            >
              <Timer />
              <span>
                Vous avez une session de travail en cours ...{" "}
                {currentStudySession.id}
              </span>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 w-full mt-4">
                      <div>Vous avez une session en cours en <span className="text-sky-500">{currentStudySession.topic_name}</span></div>
                      <span className="text-sm">{currentStudySession.studyprocess_name}</span>
                    </ModalHeader>
                    <ModalBody className="flex flex-col gap-2 w-full my-4">
                      {/* {JSON.stringify(currentStudySession)} */}
                      <div>Session débutée le {new Intl.DateTimeFormat('fr-Fr', {
                        dateStyle: "long"
                      }).format(currentStudySession.startedAt)} à {new Intl.DateTimeFormat('fr-Fr', {
                        timeStyle: "medium"
                      }).format(currentStudySession.startedAt)}
                      </div>
                      <span className="text-3xl">
                        {daysElapsedCurrentStudySession}j - {" "}
                        {hoursElapsedCurrentStudySession}h - {" "}
                        {minutesElapsedCurrentStudySession}min - {" "}
                        {secondsElapsedCurrentStudySession}sec
                      </span>
                    </ModalBody>
                    <ModalFooter>
                      <Button className="bg-sky-500 text-white">
                        Terminer la session
                      </Button>
                      <Button variant="faded">
                          Annuler la session
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Fermer
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
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
