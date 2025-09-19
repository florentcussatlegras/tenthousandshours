"use client";

import {
  fetchCurrentStudySession,
  getTopicsOfaUser,
} from "@/app/actions/actions";
import { launchStudySessionAction } from "@/app/actions/launch-study-session.action";
import { validateCurrentStudySessionAction } from "@/app/actions/validate-current-study-session.action";
import { useSession } from "@/app/lib/auth-client";
import { useActionState, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { SearchIcon, Timer } from "lucide-react";
import Link from "next/link";
import { StudyProcess } from "@prisma/client";
import { usePathname } from "next/navigation";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function CurrentStudySession({
  studyProcess,
}: {
  studyprocess?: StudyProcess;
}) {
  const modal1 = useDisclosure();
  const modal2 = useDisclosure();

  const pathname = usePathname();

  const [formLaunchCurrentSessionState, formLaunchCurrentSessionAction] =
    useActionState(launchStudySessionAction, {
      errors: {},
    });

  const [formValidateCurrentSessionState, formValidateCurrentSessionAction] =
    useActionState(validateCurrentStudySessionAction, {
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

  const [topics, setTopics] = useState([]);
  const [currentTopicId, setCurrentTopicId] = useState();
  const [hoursStartedAt, setHoursStartedAt] = useState(
    new Intl.DateTimeFormat("fr-Fr", {
      timeStyle: "short",
    }).format(new Date())
  );

  useEffect(() => {
    async function getTopics() {
      const allTopics = await getTopicsOfaUser();

      setTopics(allTopics);
    }

    async function getCurrentStudySession() {
      const newCurrentStudySession = await fetchCurrentStudySession();

      setCurrentStudySession(newCurrentStudySession);
    }

    getCurrentStudySession();
    getTopics();

    const intervalId = setInterval(() => {
      setHoursStartedAt(
        new Intl.DateTimeFormat("fr-Fr", {
          timeStyle: "short",
        }).format(new Date())
      );
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentStudySession !== null) {
      let diffTime = 0;
      if (Date.now() - Date.parse(currentStudySession.startedAt) > 0) {
        diffTime = Date.now() - Date.parse(currentStudySession.startedAt);
      }
      setTimespanCurrentStudySession(diffTime);

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

  function handleTopicChange(value) {
    setCurrentTopicId(
      topics.filter((topic) => topic.topic_name === value)[0].topic_id
    );
  }
  if (pathname !== "/") {
    if (currentStudySession === null) {
      if (studyProcess === undefined) {
        return (
          <div>
            <Button
              onPress={modal1.onOpen}
              type="submit"
              className="bg-sky-500 text-white"
            >
              <Timer />
              <span>Lancer une nouvelle session </span>
            </Button>
            <Modal
              isOpen={modal1.isOpen}
              onOpenChange={modal1.onOpenChange}
              size="xl"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 w-full mt-4">
                      <h1>Lancer une nouvelle session de travail</h1>
                    </ModalHeader>
                    <ModalBody className="flex flex-col gap-2 w-full my-4">
                      <Form
                        action={formLaunchCurrentSessionAction}
                        className="flex gap-8"
                      >
                        {formLaunchCurrentSessionState.errors._form ? (
                          <div className="text-danger text-sm">
                            {formLaunchCurrentSessionState.errors._form?.join(
                              ", "
                            )}
                          </div>
                        ) : null}

                        <Input
                          type="hidden"
                          name="topicId"
                          value={currentTopicId}
                        />
                        <Input type="hidden" name="studyProcessId" />
                        <Input
                          type="hidden"
                          name="startedAt"
                          value={hoursStartedAt}
                        />
                        <Autocomplete
                          aria-label="Selectionner une matière"
                          //   inputValue={currentTopicName}
                          classNames={{
                            base: "max-w-full mb-8",
                            listboxWrapper: "max-h-[320px]",
                            selectorButton: "text-default-500",
                          }}
                          defaultItems={topics}
                          inputProps={{
                            classNames: {
                              input: "ml-4 text-base text-default-600",
                              inputWrapper:
                                "h-[60px] border-1 border-default-100 shadow-lg dark:bg-content1",
                            },
                          }}
                          listboxProps={{
                            hideSelectedIcon: true,
                            itemClasses: {
                              base: [
                                "rounded-medium",
                                "text-default-500",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "dark:data-[hover=true]:bg-default-50",
                                "data-[pressed=true]:opacity-70",
                                "data-[hover=true]:bg-default-200",
                                "data-[selectable=true]:focus:bg-default-100",
                                "data-[focus-visible=true]:ring-default-500",
                              ],
                            },
                          }}
                          placeholder="Exple: saxophone, javascript, maçonnerie..."
                          popoverProps={{
                            offset: 10,
                            classNames: {
                              base: "rounded-large",
                              content:
                                "p-1 border-small border-default-100 bg-background",
                            },
                          }}
                          radius="full"
                          startContent={
                            <SearchIcon
                              className="text-default-400"
                              size={20}
                              strokeWidth={2.5}
                            />
                          }
                          variant="bordered"
                          onInputChange={handleTopicChange}
                        >
                          {(item) => (
                            <AutocompleteItem
                              key={item.topic_id}
                              textValue={item.topic_name}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  {/* <Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatar} /> */}
                                  <div className="flex flex-col">
                                    <span className="text-base">
                                      {item.topic_name}
                                    </span>
                                    {/* <span className="text-tiny text-default-400">{item.team}</span> */}
                                  </div>
                                </div>
                                {/* <Button
                                            className="border-small mr-0.5 font-medium shadow-small"
                                            radius="full"
                                            size="sm"
                                            variant="bordered"
                                            >
                                            Add
                                            </Button> */}
                              </div>
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <div className="flex flex-row gap-2">
                          <Button
                            type="submit"
                            className="bg-sky-500 text-white"
                          >
                            Lancer la session
                          </Button>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={modal1.onClose}
                          >
                            Fermer
                          </Button>
                        </div>
                      </Form>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        );
      } else {
        return (
          <Form action={formLaunchCurrentSessionAction} className="ml-auto">
            <Input type="hidden" name="topicId" />
            <Input
              type="hidden"
              name="studyProcessId"
              defaultValue={studyProcess.id}
            />
            <Input type="hidden" name="startedAt" value={hoursStartedAt} />
            <Button type="submit" className="bg-sky-500 text-white">
              <Timer />
              <span>
                Lancer une nouvelle session de {studyProcess.topic.name}
              </span>
            </Button>
          </Form>
        );
      }
    }

    return (
      <div>
        <Button
          onPress={modal2.onOpen}
          type="submit"
          variant="bordered"
          color="success"
          className="uppercase"
        >
          <Timer />
          <span>Vous avez une session de travail en cours ... </span>
        </Button>
        <Modal
          isOpen={modal2.isOpen}
          onOpenChange={modal2.onOpenChange}
          size="xl"
        >
          <ModalContent className="p-4">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 w-full mt-4">
                  <div>
                    Vous avez une session en cours en{" "}
                    <span className="text-sky-500">
                      {currentStudySession.topic_name}
                    </span>
                  </div>
                  <span className="text-sm">
                    {currentStudySession.studyprocess_name}
                  </span>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-2 w-full my-4">
                  {/* {JSON.stringify(currentStudySession)} */}
                  <div>
                    Session débutée le{" "}
                    {new Intl.DateTimeFormat("fr-Fr", {
                      dateStyle: "long",
                    }).format(currentStudySession.startedAt)}{" "}
                    à{" "}
                    {new Intl.DateTimeFormat("fr-Fr", {
                      timeStyle: "medium",
                    }).format(currentStudySession.startedAt)}
                  </div>
                  <span className="text-3xl">
                    {daysElapsedCurrentStudySession}j -{" "}
                    {hoursElapsedCurrentStudySession}h -{" "}
                    {minutesElapsedCurrentStudySession}min -{" "}
                    {secondsElapsedCurrentStudySession}sec
                  </span>
                </ModalBody>
                <ModalFooter className="justify-start">
                  {/* <Form
                    action={formValidateCurrentSessionAction}
                    className="flex flex-row"
                  > */}
                  <div className="flex flex-row gap-2">
                    {/* <Input
                        type="hidden"
                        name="currentStudySessionStudyProcessId"
                        value={currentStudySession.studyprocess_id}
                        />
                        <Input
                        type="hidden"
                        name="currentStudySessionId"
                        value={currentStudySession.id}
                        /> */}
                    <Button type="button" className="bg-sky-500 text-white">
                        <Link
                        href={`/study-session/current/validate/${currentStudySession.id}`}
                        >
                        Terminer la session 2
                        </Link>
                    </Button>
                    <Button type="button" variant="flat">
                        <Link
                        href={`/study-session/current/cancel/${currentStudySession.id}`}
                        >
                        Annuler la session
                        </Link>
                    </Button>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={modal2.onClose}
                    >
                        Fermer
                    </Button>
                    {/* </Form> */}
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  return null;
}
