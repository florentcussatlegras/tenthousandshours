"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DatePicker,
  Button,
  Card,
  useDisclosure,
  Calendar,
  Input,
  AccordionItem,
  Accordion,
  Progress,
  Chip,
  Tab,
  Tabs,
  CardBody,
} from "@heroui/react";
import {
  ArrowBigDown,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudySession } from "@prisma/client";
import { fetchStudySessions, getTopicsOfaUser } from "@/app/actions/actions";
import { useDateFormatter } from "@react-aria/i18n";
import ModalStudySessionView from "./modal-study-session-view";
import { useSession } from "@/app/lib/auth-client";
import { ListTopicsUser } from "./list-topics-user";
import prisma from "@/app/lib/prisma";
import { convertSecondsInHourMin } from "@/app/lib/utils";
import Link from "next/link";

export default function Scheduler({ defaultDate }: { defaultDate: Date }) {
  let formatter = useDateFormatter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [valueDatePicker, setValueDatePicker] = useState(
    parseDate(currentDate.toISOString().substring(0, 10))
  );
  const [studySessions, setStudySessions] = useState([]);
  const [studySessionToView, setStudySessionToView] = useState(null);
  const [topics, setTopics] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function getStudySessions() {
      const newStudySessions = await fetchStudySessions(
        session?.user.id,
        currentDate
      );
      console.log(newStudySessions);
      setStudySessions(newStudySessions);
    }
    getStudySessions();

    async function getTopicsUser() {
      const topics = await getTopicsOfaUser(session?.user.id);
      setTopics(topics);
    }

    getTopicsUser();
  }, [currentDate]);

  console.log(studySessions);

  let timeSlots = [];
  const dateDuJour = new Date();

  for (let index = 0; index < 24; index++) {
    const timeSlot = new Date(
      dateDuJour.getFullYear(),
      dateDuJour.getMonth(),
      dateDuJour.getDay()
    );
    timeSlot.setHours(index);
    timeSlots.push(timeSlot);
  }

  function dateAddDays(a: number, b: Date) {
    var d = new Date(b || new Date());
    d.setDate(d.getDate() + a);
    return d;
  }

  function handleOpenModalView(studySession: StudySession) {
    setStudySessionToView(studySession);
    onOpen();
  }

  function handleTodaySelect() {
    const newCurrentDate = new Date();
    setCurrentDate(newCurrentDate);
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDayRemove() {
    const newCurrentDate = dateAddDays(-1, currentDate);
    setCurrentDate(newCurrentDate);
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDayAdd() {
    const newCurrentDate = dateAddDays(1, currentDate);
    setCurrentDate(newCurrentDate);
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDateCalendarChange(value) {
    setValueDatePicker(value);
    const newDate = new Date(value.year, value.month - 1, value.day);
    setCurrentDate(value.toDate());
  }

  return (
    <div className="w-full">
      {/* <div className="flex w-full justify-between items-center mb-4">
        <div className="flex justify-between text-default-900 rounded-2xl gap-2">
          <Button
            className="cursor-pointer bg-default-100 hover:bg-default-200 px-4 py-2 rounded-2xl transition-color duration-500 text-default-500 font-semibold"
            onPress={handleTodaySelect}
          >
            Aujourd'hui
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
            onPress={handleDayRemove}
          >
            <ArrowLeft className="text-default-500" />
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
            onPress={handleDayAdd}
          >
            <ArrowRight className="text-default-500" />
          </Button>
        </div>
        <div>
          <DatePicker
            value={valueDatePicker}
            onChange={handleDatePickerChange}
          />
        </div>
      </div> */}

      {/* <div>
        <ModalStudySessionView
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          studySession={studySessionToView}
        />
      </div> */}

      <div className="flex flex-row gap-6">

        <Card className="flex flex-col rounded-none items-center relative p-4 gap-4 w-1/5">

          <div className="flex justify-between text-default-900 rounded-2xl w-full">

            <Button
              className="cursor-pointer bg-default-100 hover:bg-default-200 px-4 py-2 rounded-2xl transition-color duration-500 text-default-500 font-semibold"
              onPress={handleTodaySelect}
            >
              Aujourd'hui
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
                onPress={handleDayRemove}
              >
                <ArrowLeft className="text-default-500" />
              </Button>
              <Button
                size="sm"
                className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
                onPress={handleDayAdd}
              >
                <ArrowRight className="text-default-500" />
              </Button>
              
            </div>

          </div>

          <Calendar
            showMonthAndYearPickers
            aria-label="Date (Show Month and Year Picker)"
            classNames={{
              base: "shadow-none",
            }}
            onChange={handleDateCalendarChange}
          />
          <Input
            type="search"
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0" />
            }
          />
          <ListTopicsUser topics={topics} />

        </Card>

        <Card className="rounded-none relative p-4 gap-0 w-4/5 flex flex-col">

            <Tabs aria-label="Options" className="font-semibold">

              <Tab key="day" title="Jour">

                <div className="flex flex-col gap-4 pt-1">

                    <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 font-semibold rounded-xl px-4 absolute top-4 right-2">
                      {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(
                        currentDate
                      )}
                    </div>

                    {studySessions.length === 0 ? (

                      <div className="justify-center text-default-400 font-medium uppercase py-12 text-center">
                        Aucune session de travail trouvées ce jour là
                      </div>

                    ) : (

                      <div className="flex flex-col gap-3">

                        <span className="text-sm text-default-500 ml-auto pr-1">{studySessions.length} sessions de travail</span>

                        <Accordion variant="splitted" className="px-0">

                          {studySessions.map((session) => {

                            const ratioProgress = (Number(session.study_process_total_hours) / 10000) * 100;

                            return (
                   
                              <AccordionItem
                                key={session.session_id}
                                aria-label={`Accordion ${session.session_id}`}
                                title={`${session.topic_name}`}
                                classNames={{
                                  base: "relative px-6 mb-2",
                                  title: "text-xl text-sky-500",
                                  indicator: "w-[350px]",
                                }}
                                subtitle={
                                  <Chip isDisabled color="secondary">{convertSecondsInHourMin(session.totalSeconds)}</Chip>
                                }
                                disableIndicatorAnimation={true}
                                indicator={
                                  <div className="flex flex-row items-end gap-4">
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
                                    <ChevronDown className="-mb-2" />
                                  </div>
                                }
                              >
                                <div className="flex flex-col gap-2 py-4">
                                  <div className="flex flex-row gap-2 text-base mb-2">
                                    <span>Horaires de travail : </span>
                                    <span>
                                      {new Intl.DateTimeFormat("fr-Fr", {
                                        timeStyle: "short",
                                      }).format(session.startedAt)}
                                    </span>
                                    <span>-</span>
                                    <span>
                                      {new Intl.DateTimeFormat("fr-Fr", {
                                        timeStyle: "short",
                                      }).format(session.finishedAt)}
                                    </span>
                                  </div>
                                  <div>Vous avez travaillé {session.study_process_total_hours} heures au total sur cette matière</div>
                                  <p className="my-4">
                                    {session?.description === '' ?
                                      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus optio delectus harum beatae debitis nihil molestias, animi laboriosam, sint mollitia labore neque sequi soluta ea? Hic dignissimos quam voluptas neque."
                                    :
                                      session?.description
                                    }
                                  </p>
                                  {session.urls !== '' ?
                                    <div className="flex flex-col">
                                      <h2>Vous avez utilisé le contenu suivant lors de cette session de travail :</h2>
                                      <ul>
                                        {session.urls.split(',').map((url) => (
                                          <li className="text-sky-500"><Link href={url}>{url}</Link></li>
                                        ))}
                                      </ul>
                                    </div>
                                    : <span>Vous n'avez indiqué aucun contenu particulier utilisé lors de cette session de travail</span>
                                  }
                                </div>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    )}
                  {/* </CardBody> */}
                </div>
              </Tab>
              <Tab key="week" title="Semaine">
                <div className="flex flex-col gap-4 pt-1">

                    <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 font-semibold rounded-xl px-4 absolute top-4 right-2">
                      Semaine du au
                    </div>
                      
                    CALENDRIER SEMAINE





                  </div>
          
              </Tab>
              
            </Tabs>
            

            {/* <Tabs className="ml-auto absolute right-0 p-2 rounded-xl flex gap-2"> */}
              {/* <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 bg-default-100 font-semibold rounded-xl px-4 relative"> */}
                {/* {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(
                  currentDate
                )} */}
                  {/* <Tab key="day" title="JOUR">
                    <Card>
                      <CardBody>
                        {studySessions.length === 0 ? (
                          <div className="justify-center text-default-400 font-medium uppercase py-12 text-center">
                            Aucune session de travail trouvées ce jour là
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <Accordion variant="splitted">
                              {studySessions.map((session) => {
                                const ratioProgress =
                                  (Number(session.study_process_total_hours) / 10000) * 100;
                                return (
                                  // <button
                                  //   onClick={() => handleOpenModalView(session)}
                                  //   key={session.id}
                                  //   className="bg-sky-500 text-white rounded-md px-4 flex justify-between items-center text-md font-semibold gap-4 h-12 cursor-pointer"
                                  // >
                                  //   <div>{session.topic_name}</div>
                                  //   <div>
                                  //     {new Intl.DateTimeFormat("fr-Fr", {
                                  //       timeStyle: "short",
                                  //     }).format(session.startedAt)}{" "}
                                  //     -{" "}
                                  //     {new Intl.DateTimeFormat("fr-Fr", {
                                  //       timeStyle: "short",
                                  //     }).format(session.finishedAt)}
                                  //   </div>
                                  // </button>

                                  <AccordionItem
                                    key={session.session_id}
                                    aria-label={`Accordion ${session.session_id}`}
                                    title={`${session.topic_name}`}
                                    classNames={{
                                      base: "relative px-6",
                                      title: "text-xl text-sky-500 mb-2",
                                      indicator: "w-[350px]",
                                    }}
                                    subtitle={
                                      <Chip isDisabled color="secondary">{convertSecondsInHourMin(session.totalSeconds)}</Chip>
                                    }
                                    disableIndicatorAnimation={true}
                                    indicator={
                                      <div className="flex flex-row items-end gap-4">
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
                                        <ChevronDown className="-mb-2" />
                                      </div>
                                    }
                                  >
                                    <div className="flex flex-col gap-1 py-4">
                                      <div className="flex flex-row gap-2 text-base mb-2">
                                        <span>Horaires de travail : </span>
                                        <span>
                                          {new Intl.DateTimeFormat("fr-Fr", {
                                            timeStyle: "short",
                                          }).format(session.startedAt)}
                                        </span>
                                        <span>-</span>
                                        <span>
                                          {new Intl.DateTimeFormat("fr-Fr", {
                                            timeStyle: "short",
                                          }).format(session.finishedAt)}
                                        </span>
                                      </div>
                                      <div>Vous avez travaillé {session.study_process_total_hours} heures au total sur cette matière</div>
                                      <p className="my-4">
                                        {session?.description === '' ?
                                          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus optio delectus harum beatae debitis nihil molestias, animi laboriosam, sint mollitia labore neque sequi soluta ea? Hic dignissimos quam voluptas neque."
                                        :
                                          session?.description
                                        }
                                      </p>
                                      {session.urls !== '' ?
                                        <div className="flex flex-col">
                                          <h2>Vous avez utilisé le contenu suivant lors de cette session de travail :</h2>
                                          <ul>
                                            {session.urls.split(',').map((url) => (
                                              <li className="text-sky-500"><Link href={url}>{url}</Link></li>
                                            ))}
                                          </ul>
                                        </div>
                                        : <span>Vous n'avez indiqué aucun contenu particulier utilisé lors de cette session de travail</span>
                                      }
                                    </div>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab>SEMAINE</Tab> */}
              {/* </div> */}
            {/* </Tabs> */}
        </Card>
      </div>
    </div>
  );
}
