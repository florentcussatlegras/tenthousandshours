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
} from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudySession } from "@prisma/client";
import { fetchStudySessions } from "@/app/actions/actions";
// import {useDateFormatter} from "@react-aria/i18n";

export default function Scheduler({ defaultDate }: { defaultDate: Date }) {
  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [valueDatePicker, setValueDatePicker] = useState(
    parseDate(currentDate.toISOString().substring(0, 10))
  );
  const [studySessions, setStudySessions] = useState(null);

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
            className="cursor-pointer bg-default-100 hover:bg-default-200 px-4 py-2 rounded-2xl transition-color duration-500"
            onPress={handleTodaySelect}
          >
            Aujourd'hui
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
            onPress={handleDayRemove}
          >
            <ArrowLeft />
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]"
            onPress={handleDayAdd}
          >
            <ArrowRight />
          </Button>
        </div>
        <div>
          <DatePicker
            value={valueDatePicker}
            onChange={handleDatePickerChange}
          />
        </div>
      </div>
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>{}</TableColumn>
          <TableColumn className="uppercase flex justify-center items-center">
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(
              currentDate
            )}
          </TableColumn>
        </TableHeader>
        <TableBody>
          {timeSlots.map((timeSlot, index) => (
            <TableRow key={index} className="justify-center">
              <TableCell className="w-[150px]">
                {new Intl.DateTimeFormat("fr-Fr", {
                  timeStyle: "short",
                }).format(timeSlot)}
              </TableCell>
              <TableCell className="">CEO</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
