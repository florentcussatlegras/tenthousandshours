import Scheduler from "@/components/scheduler";
import * as React from "react";
import { fetchStudySessions } from "../actions/actions";

export default async function SchedulerPage() {
  return (
    <>
      <Scheduler defaultDate={new Date()}>{/* <DayView /> */}</Scheduler>
    </>
  );
}
