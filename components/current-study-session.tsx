"use client";

import {
  fetchCurrentStudySession,
  getTopicsOfaUser,
  updateTotalSecondsStudySession,
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
import { Clock, Pause, Play, SearchIcon, Timer } from "lucide-react";
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

  // const [formLaunchCurrentSessionState, formLaunchCurrentSessionAction] =
  //   useActionState(launchStudySessionAction, {
  //     errors: {},
  //   });

  // const [formValidateCurrentSessionState, formValidateCurrentSessionAction] =
  //   useActionState(validateCurrentStudySessionAction, {
  //     errors: {},
  //     confirmValidation: false,
  //   });

  const [time, setTime] = useState({
    sec: 0,
    min: 0,
    hr: 0,
  });

  const [intervalId, setIntervalId] = useState();
  const [isTiming, setIsTiming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentStudySession, setCurrentStudySession] = useState(null);

  const [topics, setTopics] = useState([]);
  const [currentTopicId, setCurrentTopicId] = useState();
  const [currentTopicName, setCurrentTopicName] = useState();

  const [hoursStartedAt, setHoursStartedAt] = useState(0);

  useEffect(() => {
    async function getTopics() {
      const allTopics = await getTopicsOfaUser();

      setTopics(allTopics);
    }

    // async function getCurrentStudySession() {
    //   const newCurrentStudySession = await fetchCurrentStudySession();

    //   setCurrentStudySession(newCurrentStudySession);
    // }

    // getCurrentStudySession();
    getTopics();

    if (localStorage.getItem("current_study_session_timer")) {
      setTime(JSON.parse(localStorage.getItem("current_study_session_timer")));
      setCurrentTopicId(localStorage.getItem("current_study_session_topic_id"));
      setHoursStartedAt(
        localStorage.getItem("current_study_session_started_at")
      );
      setIsTiming(true);
      if (localStorage.getItem("current_study_session_is_playing") === "true") {
        let id = setInterval(updateTimer, 1000);
        setIntervalId(id);
        setIsPlaying(true);

        return () => {
          clearInterval(id);
        };
      } else {
        setIsPlaying(false);
      }
    }
  }, []);

  //   useEffect(() => {
  //     if (currentStudySession !== null) {
  //       let id = setInterval(updateTimer, 1000);
  //       setIntervalId(id);
  //     }

  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }, [currentStudySession]);

  const updateTimer = () => {
    setTime((prev) => {
      let newTime = { ...prev };
      // update sec and see if we need to increase min
      if (newTime.sec < 59) newTime.sec += 1;
      else {
        newTime.min += 1;
        newTime.sec = 0;
      }
      // min has increased in *newTime* by now if it was updated, see if it has crossed 59
      if (newTime.min === 60) {
        newTime.min = 0;
        newTime.hr += 1;
      }
      localStorage.setItem(
        "current_study_session_timer",
        JSON.stringify(newTime)
      );
      return newTime;
    });
  };

  function handleLaunchSession() {
    pauseOrResume();
    setIsTiming(true);
    setHoursStartedAt(new Date().getTime());
    if (!localStorage.getItem("current_study_session_topic_id")) {
      localStorage.setItem(
        "current_study_session_topic_id",
        String(currentTopicId)
      );
      localStorage.setItem(
        "current_study_session_started_at",
        String(new Date().getTime())
      );
      localStorage.setItem("current_study_session_timer", JSON.stringify(time));
      localStorage.setItem(
        "current_study_session_is_playing",
        String(isPlaying)
      );
    }
    modal1.onClose();
  }

  const pauseOrResume = () => {
    console.log(hoursStartedAt);
    console.log(currentTopicId);
    if (!intervalId) {
      let id = setInterval(updateTimer, 1000);
      setIntervalId(id);
      setIsPlaying(true);
    } else {
      clearInterval(intervalId);
      setIntervalId("");
      setIsPlaying(false);
    }
  };

  const reset = () => {
    clearInterval(intervalId);
    setTime({
      sec: 0,
      min: 0,
      hr: 0,
    });
  };

  function handleTopicChange(value) {
    setCurrentTopicId(
      topics.filter((topic) => topic.topic_name === value)[0].topic_id
    );
    setCurrentTopicName(value);
  }

  return (
    <div className="mr-4">
      {!isTiming ? (
        <>
          <Button
            onPress={modal1.onOpen}
            type="submit"
            className="text-white rounded-full bg-secondary-300"
          >
            <Play />
            {/* <span>Lancer une nouvelle session </span> */}
            <h2>{`${time.hr < 10 ? 0 : ""}${time.hr} : ${time.min < 10 ? 0 : ""}${time.min} : ${time.sec < 10 ? 0 : ""}${time.sec}`}</h2>
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
                      // action={formLaunchCurrentSessionAction}
                      className="flex gap-8"
                    >
                      {/* {formLaunchCurrentSessionState.errors._form ? (
                        <div className="text-danger text-sm">
                          {formLaunchCurrentSessionState.errors._form?.join(
                            ", "
                          )}
                        </div>
                      ) : null} */}

                      <Input
                        type="hidden"
                        name="topicId"
                        value={currentTopicId}
                      />
                      <Input type="text" name="studyProcessId" />
                      <Input
                        type="hidden"
                        name="startedAt"
                        value={String(hoursStartedAt)}
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
                          type="button"
                          className="bg-sky-500 text-white"
                          onPress={handleLaunchSession}
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
        </>
      ) : (
        <>
          <div className="flex flex-row items-center bg-success rounded-full ml-4 h-[45px]">
            {isPlaying ? (
              <Button className="text-white bg-success rounded-none rounded-l-full" onPress={pauseOrResume}>
                <Pause size={25} />
              </Button>
            ) : (
              <Button className="text-white bg-success rounded-none rounded-l-full" onPress={pauseOrResume}>
                <Play size={25} />
              </Button>
            )}
            <Button
              onPress={modal2.onOpen}
              type="submit"
              className="text-white bg-green-500 rounded-r-full h-[35px] border-l"
            >
              <div className="w-[120px] h-[20px] text-base font-semibold">
                {`${time.hr < 10 ? 0 : ""}${time.hr} h ${time.min < 10 ? 0 : ""}${time.min} min ${time.sec < 10 ? 0 : ""}${time.sec}`}
              </div>
            </Button>
          </div>
          <Modal
            isOpen={modal2.isOpen}
            onOpenChange={modal2.onOpenChange}
            size="3xl"
          >
            <ModalContent className="p-4">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 w-full mt-4 text-3xl">
                    <div>
                      Vous avez une session en cours en{" "}
                      <span className="text-sky-500">{currentTopicName}</span>
                    </div>
                  </ModalHeader>
                  <ModalBody className="flex flex-col gap-4 w-full my-8 text-2xl">
                    <div>
                      Session débutée le{" "}
                      {new Intl.DateTimeFormat("fr-Fr", {
                        dateStyle: "long",
                      }).format(
                        new Date().setTime(
                          Number(
                            localStorage.getItem(
                              "current_study_session_started_at"
                            )
                          )
                        )
                      )}{" "}
                      à{" "}
                      {new Intl.DateTimeFormat("fr-Fr", {
                        timeStyle: "short",
                      }).format(
                        new Date().setTime(
                          Number(
                            localStorage.getItem(
                              "current_study_session_started_at"
                            )
                          )
                        )
                      )}
                    </div>
                    <div className="text-3xl flex items-center gap-4 bg-success rounded-full text-white font-semibold py-2 w-[340px]">
                      {/* <Clock size={30} />
                       */}
                      <Button
                        className="bg-success text-white border-r rounded-none rounded-l-full"
                        onPress={pauseOrResume}
                        >
                        {isPlaying ? <Pause size={40} /> : <Play size={40} />}
                      </Button>
                      <div className="w-[250px]">{`${time.hr < 10 ? 0 : ""}${time.hr} h ${time.min < 10 ? 0 : ""}${time.min} min ${time.sec < 10 ? 0 : ""}${time.sec}`}</div>
                    </div>
                  </ModalBody>
                  <ModalFooter className="justify-start">
                    {/* <Form
                      action={formValidateCurrentSessionAction}
                      className="flex flex-row gap-4"
                    > */}
                    <div className="flex flex-row gap-4">
                      {/* <Input
                        type="text"
                        name="startedAt"
                        value={String(hoursStartedAt)}
                      />
                      <Input
                        type="text"
                        name="topicId"
                        value={currentTopicId}
                      />
                      <Input
                        type="text"
                        name="timer"
                        value={JSON.stringify(time)}
                      /> */}
                      <Button type="submit" className="bg-sky-500 text-white">
                        <Link href={"/study-session/current/validate/"}>
                          Terminer la session
                        </Link>
                      </Button>
                      <Button type="button" variant="flat" onPress={reset} className="bg-secondary-300 text-white">
                        {/* <Link
                          href={`/study-session/current/cancel/${currentStudySession.id}`}
                        > */}
                        Annuler la session
                        {/* </Link> */}
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={modal2.onClose}
                      >
                        Fermer
                      </Button>
                    </div>
                    {/* </Form> */}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
