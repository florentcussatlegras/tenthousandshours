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
  useCheckbox,
  tv,
  VisuallyHidden,
  CheckboxGroup,
} from "@heroui/react";
import {
  ArrowBigDown,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  ChevronDown,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudySession, Topic } from "@prisma/client";
import { fetchStudySessionsPerDay, getTopicsOfaUser } from "@/app/actions/actions";
import { useDateFormatter } from "@react-aria/i18n";
import ModalStudySessionView from "./modal-study-session-view";
import { useSession } from "@/app/lib/auth-client";
import { ListTopicsUser } from "./list-topics-user";
import prisma from "@/app/lib/prisma";
import { convertSecondsInHourMin } from "@/app/lib/utils";
import Link from "next/link";
import { WeekCalendar } from "./week-calendar";
import { DayCalendar } from "./day-calendar";

function getCurrentWeek(currentDate: Date) {
  let i = currentDate.getDay();
  let date = currentDate;
  let dayBeforeCurrentInversed = [];

  if (i === 0) {
    i = 7;
  }
  while (i > 1) {
    i--;
    const newDate = new Date(date.getTime() - 86400000);
    dayBeforeCurrentInversed.push(newDate);
    date = newDate;
  }

  const dayBeforeCurrent = dayBeforeCurrentInversed.reverse();
  dayBeforeCurrent.push(currentDate);

  i = currentDate.getDay();
  date = currentDate;
  let dayAfterCurrent = [];
  if (i === 0) {
    i = 7;
  }
  while (i < 7) {
    i++;
    const newDate = new Date(date.getTime() + 86400000);
    dayAfterCurrent.push(newDate);
    date = newDate;
  }

  const dayWeeks = dayBeforeCurrent.concat(dayAfterCurrent);

  return dayWeeks;
}

export const CustomCheckbox = (props: any) => {
  const checkbox = tv({
    slots: {
      base: "bg-secondary hover:bg-secondary border-none",
      content: "text-white px-4 font-bold",
    },
    variants: {
      isSelected: {
        true: {
          base: "bg-secondary hover:bg-secondary",
          content: "text-white text-base pl-1 w-full",
        },
      },
      isFocusVisible: {
        true: {
          // base: "outline-solid outline-transparent",
        },
      },
    },
  });

  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="secondary"
        startContent={isSelected ? <CheckIcon className="ml-1" /> : null}
        variant="faded"
        // {...getLabelProps()}
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};

export default function Scheduler({ defaultDate }: { defaultDate: Date }) {
  let formatter = useDateFormatter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [groupSelected, setGroupSelected] = useState<any>([]);
  const [haveUsedTopicSelection, setHaveUsedTopicSelection] = useState(false);

  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek(currentDate));

  const [valueDatePicker, setValueDatePicker] = useState<any>(
    parseDate(currentDate.toISOString().substring(0, 10))
  );
  const [studySessions, setStudySessions] = useState<any>([]);
  const [studySessionsFilter, setStudySessionsFilter] = useState<any>([]);
  // const [studySessionToView, setStudySessionToView] = useState(null);
  const [studySessionsPerDay, setStudySessionsPerDay] = useState<any>([]);
  const [studySessionsPerDayFilter, setStudySessionsPerDayFilter] = useState<any>(
    []
  );

  const [topics, setTopics] = useState<any>([]);
  const [displayTab, setDisplayTab] = useState<string>("day");

  // const [searchItem, setSearchItem] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    async function getStudySessions() {
      const newStudySessions = await fetchStudySessionsPerDay(
        String(session?.user.id),
        currentDate
      );

      setStudySessions(newStudySessions);

      if (groupSelected.length !== 0) {
        const newStudySessionsFilter = newStudySessions.filter((item: any) => {
          return groupSelected.includes(item.topic_id);
        });
        setStudySessionsFilter(newStudySessionsFilter);
      } else {
        setStudySessionsFilter(newStudySessions);
      }
    }

    async function getStudySessionsPerDay() {
      let newStudySessionsPerDay = [];

      const getStudySessionPerDay = async (day: any) => {
        return await fetchStudySessionsPerDay(String(session?.user.id), day);
      };

      for (let index = 0; index < currentWeek.length; index++) {
        let day = currentWeek[index];
        newStudySessionsPerDay[day.getDay()] = await getStudySessionPerDay(day);
      }

      if (groupSelected.length !== 0) {
        let newStudySessionsPerDayFilter: any[] = [];

        newStudySessionsPerDay.forEach((items, indexDay) => {
          const newitems = items.filter((item: any) => {
            return groupSelected.includes(item.topic_id);
          });
          newStudySessionsPerDayFilter[indexDay] = newitems;
        });

        setStudySessionsPerDayFilter(newStudySessionsPerDayFilter);
      } else {
        setStudySessionsPerDayFilter(newStudySessionsPerDay);
      }

      // setStudySessionsPerDayFilter(newStudySessionsPerDay);
      setStudySessionsPerDay(newStudySessionsPerDay);
    }

    async function getTopicsUser() {
      const topics = await getTopicsOfaUser();
      setTopics(topics);
    }

    getStudySessions();
    getStudySessionsPerDay();
    getTopicsUser();
  }, [currentDate]);

  useEffect(() => {
    setCurrentWeek(getCurrentWeek(currentDate));
  }, []);

  useEffect(() => {
    if (groupSelected.length !== 0) {
      console.log(groupSelected);
      const newitems = studySessions.filter((item: any) => {
        return groupSelected.includes(item.topic_id);
      });
      setStudySessionsFilter(newitems);

      let result: any[] = [];

      studySessionsPerDay.forEach((items: any, indexDay: any) => {
        const newitems = items.filter((item: any) => {
          return groupSelected.includes(item.topic_id);
        });
        result[indexDay] = newitems;
      });
      setStudySessionsPerDayFilter(result);
    } else if (haveUsedTopicSelection) {
      setStudySessionsFilter(studySessions);
      setStudySessionsPerDayFilter(studySessionsPerDay);
    }
  }, [groupSelected]);

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

  function handleTodaySelect() {
    const newCurrentDate = new Date();
    setCurrentDate(newCurrentDate);
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDayRemove() {
    let newCurrentDate;
    if (displayTab === "day") {
      newCurrentDate = dateAddDays(-1, currentDate);
    } else {
      newCurrentDate = dateAddDays(-7, currentDate);
    }
    setCurrentDate(newCurrentDate);
    setCurrentWeek(getCurrentWeek(newCurrentDate));
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDayAdd() {
    let newCurrentDate;
    if (displayTab === "day") {
      newCurrentDate = dateAddDays(1, currentDate);
    } else {
      newCurrentDate = dateAddDays(7, currentDate);
    }
    setCurrentDate(newCurrentDate);
    setCurrentWeek(getCurrentWeek(newCurrentDate));
    setValueDatePicker(
      parseDate(newCurrentDate.toISOString().substring(0, 10))
    );
  }

  function handleDateCalendarChange(value: any) {
    setValueDatePicker(value);
    const newDate = new Date(value.year, value.month - 1, value.day);
    setCurrentDate(value.toDate());
    setCurrentWeek(getCurrentWeek(value.toDate()));
    console.log(getCurrentWeek(value.toDate()));
  }

  // function handleInputSearchChange(evt) {
  //   const newSearchTerm = evt.currentTarget.value;
  //   // console.log(newSearchTerm);
  //   setSearchItem(newSearchTerm);

  //   if (displayTab === "day") {
  //     const newitems = studySessions.filter((item) => {
  //       return item.topic_name
  //         .toLowerCase()
  //         .includes(newSearchTerm.toLowerCase());
  //     });

  //     setStudySessionsFilter(newitems);
  //   } else {
  //     let result = [];

  //     studySessionsPerDay.forEach((items, indexDay) => {
  //       const newitems = items.filter((item) => {
  //         return item.topic_name
  //           .toLowerCase()
  //           .includes(newSearchTerm.toLowerCase());
  //       });
  //       result[indexDay] = newitems;
  //     });

  //     setStudySessionsPerDayFilter(result);
  //   }
  // }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex flex-col rounded-none items-center relative p-4 gap-4 w-full md:w-1/3 xl:w-1/5">
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
            value={valueDatePicker}
          />
          {/* <Input
            type="search"
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 pointer-events-none shrink-0" />
            }
            onChange={handleInputSearchChange}
            value={searchItem}
          /> */}

          <div className="flex flex-col w-full gap-2">
            <CheckboxGroup
              className="gap-1"
              orientation="horizontal"
              value={groupSelected}
              onChange={setGroupSelected}
            >
              {topics.map((topic: any) => (
                <CustomCheckbox
                  key={topic.topic_id}
                  value={topic.topic_id}
                  onClick={() => setHaveUsedTopicSelection(true)}
                >
                  {topic.topic_name}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
        </Card>

        <Card className="rounded-none relative p-4 gap-0 w-full md:w-2/3 xl:w-4/5 flex flex-col">
          <Tabs aria-label="Options" className="font-semibold">
            <Tab key="day" title="Jour" onClick={() => setDisplayTab("day")}>
              <DayCalendar
                currentDate={currentDate}
                studySessions={studySessionsFilter}
              />
            </Tab>
            <Tab
              key="week"
              title="Semaine"
              onClick={() => setDisplayTab("week")}
            >
              <WeekCalendar
                currentWeek={currentWeek}
                studySessionsPerDay={studySessionsPerDayFilter}
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
