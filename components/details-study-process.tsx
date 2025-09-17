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
import Link from "next/link";
import { validateCurrentStudySessionAction } from "@/app/actions/validate-current-study-session.action";
import { CurrentStudySession } from "./current-study-session";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  // const { data: session } = useSession();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // const [formLaunchCurrentSessionState, formLaunchCurrentSessionAction] = useActionState(launchStudySessionAction, {
  //   errors: {},
  // });

  // const [formValidateCurrentSessionState, formValidateCurrentSessionAction] = useActionState(validateCurrentStudySessionAction, {
  //   errors: {},
  // });

  // const [currentStudySession, setCurrentStudySession] = useState(null);

  // const [timespanCurrentStudySession, setTimespanCurrentStudySession] =
  //   useState(0);

  // const [daysElapsedCurrentStudySession, setDaysElapsedCurrentStudySession] =
  //   useState(0);
  // const [hoursElapsedCurrentStudySession, setHoursElapsedCurrentStudySession] =
  //   useState(0);
  // const [
  //   minutesElapsedCurrentStudySession,
  //   setMinutesElapsedCurrentStudySession,
  // ] = useState(0);
  // const [
  //   secondsElapsedCurrentStudySession,
  //   setSecondsElapsedCurrentStudySession,
  // ] = useState(0);

  // useEffect(() => {
  //   async function getCurrentStudySession() {
  //     const newCurrentStudySession = await fetchCurrentStudySession();
  //     setCurrentStudySession(newCurrentStudySession);
  //   }

  //   getCurrentStudySession();
  // }, []);

  // useEffect(() => {
  //   if (currentStudySession !== null) {
  //     let diffTime = 0
  //     if (Date.now() - Date.parse(currentStudySession.startedAt) > 0) {
  //       diffTime = Date.now() - Date.parse(currentStudySession.startedAt);
  //     }
  //     setTimespanCurrentStudySession(
  //       diffTime
  //     );

  //     const intervalId = setInterval(() => {
  //       setTimespanCurrentStudySession((_timespan) => _timespan + 1000);
  //     }, 1000);

  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }
  // }, [currentStudySession]);

  // useEffect(() => {
  //   setDaysElapsedCurrentStudySession(
  //     Math.floor(timespanCurrentStudySession / DAY)
  //   );
  //   setHoursElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / HOUR) % 24)
  //   );
  //   setMinutesElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / MINUTE) % 60)
  //   );
  //   setSecondsElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / SECOND) % 60)
  //   );
  // }, [timespanCurrentStudySession]);

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
        <div className="ml-auto">
            <CurrentStudySession />
        </div>
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
