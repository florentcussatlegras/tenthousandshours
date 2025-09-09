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
} from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudySession } from "@prisma/client";
import { fetchStudySessions } from "@/app/actions/actions";
import { useDateFormatter } from "@react-aria/i18n";
import ModalStudySessionView from "./modal-study-session-view";

export default function Scheduler({ defaultDate }: { defaultDate: Date }) {
  let formatter = useDateFormatter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [valueDatePicker, setValueDatePicker] = useState(
    parseDate(currentDate.toISOString().substring(0, 10))
  );
  const [studySessions, setStudySessions] = useState([]);
  const [studySessionToView, setStudySessionToView] = useState(null);

  useEffect(() => {
    async function getStudySessions() {
      const newStudySessions = await fetchStudySessions(currentDate);
      setStudySessions(newStudySessions);
    }
    getStudySessions();
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
  };

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

  function handleDatePickerChange(value) {
    setValueDatePicker(value);
    const newDate = new Date(value.year, value.month - 1, value.day);
    setCurrentDate(value.toDate());
  }

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center mb-4">
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
      </div>

      <div>
        <ModalStudySessionView
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          studySession={studySessionToView}
        />
      </div>

      <Card className="rounded-none relative p-4 gap-4">
  
        <div className="uppercase flex justify-center items-center text-tiny text-default-500 h-10 bg-default-100 font-semibold">
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(
            currentDate
          )}
          {studySessions.length}
        </div>    

        {studySessions.length === 0 ? (
          <div className="justify-center text-default-400 font-medium uppercase py-12 text-center">
              Aucune session de travail trouvées ce jour là
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {studySessions.map((session) => {
              return (
                <button onClick={() => handleOpenModalView(session)} key={session.id} className="bg-sky-500 text-white rounded-md px-4 flex justify-between items-center text-md font-semibold gap-4 h-12 cursor-pointer">
                  <div>
                      {session.topic_name}
                  </div>
                  <div>
                    {new Intl.DateTimeFormat("fr-Fr", {
                      timeStyle: "short",
                    }).format(session.startedAt)}{" "}
                    -{" "}
                    {new Intl.DateTimeFormat("fr-Fr", {
                      timeStyle: "short",
                    }).format(session.finishedAt)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
  
      </Card>
   
    </div>
  );
}
