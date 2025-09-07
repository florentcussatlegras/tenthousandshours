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
import { useState } from "react";
import {parseDate, getLocalTimeZone} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

export default function Scheduler({
  data,
  defaultDate,
}: {
  data: string;
  defaultDate: Date;
}) {

  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [valueDatePicker, setValueDatePicker] = useState(parseDate(currentDate.toISOString().substring(0, 10)));

  let listHours = [];
  for (let index = 0; index <= 24; index++) {
    listHours.push(index);
  }

  function dateAddDays(a: number, b: Date) {
    var d = new Date(b || new Date());
    d.setDate(d.getDate() + a);
    return d;
  }

  function handleDayRemove() {
    setCurrentDate(dateAddDays(-1, currentDate));
  }

  function handleDayAdd() {
    setCurrentDate(dateAddDays(1, currentDate));
  }

  function handleDatePickerChange(value) {
    console.log(value);
    setValueDatePicker(value);
    const newDate = new Date(value.year, value.month - 1, value.day);
    setCurrentDate(value.toDate());
  }

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex justify-between text-default-900 rounded-2xl gap-2">
          <Button className="cursor-pointer bg-default-100 hover:bg-default-200 px-4 py-2 rounded-2xl transition-color duration-500" onPress={() => setCurrentDate(new Date())}>
            Aujourd'hui
          </Button>
          <Button size="sm" className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]" onPress={handleDayRemove}>
            <ArrowLeft />
          </Button>
          <Button size="sm" className="cursor-pointer bg-default-100 hover:bg-default-200 rounded-2xl transition-color duration-500 h-[40px]" onPress={handleDayAdd}>
            <ArrowRight />
          </Button>
        </div>
        <div>
          <DatePicker value={valueDatePicker} onChange={handleDatePickerChange} />
        </div>
      </div>

      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>
                {}
          </TableColumn>
          <TableColumn className="uppercase flex justify-center items-center">
            {new Intl.DateTimeFormat("Fr-fr", {dateStyle: "full"}).format(currentDate)}
          </TableColumn>
        </TableHeader>
        <TableBody>
          {listHours.map((hour, index) => (
            <TableRow key={index} className="justify-center">
              <TableCell className="w-[150px]">{hour}:00</TableCell>
              <TableCell className="">CEO</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
