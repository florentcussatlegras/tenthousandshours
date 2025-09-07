import Scheduler from '@/components/scheduler';
import * as React from 'react';

const displayDate: Date = new Date("2019-08-27T08:00:00.000Z")
const data: any[] = [{
    id: 0,
    title: 'Breakfast with Tom',
    start: new Date("2019-08-27T08:30:00.000Z"),
    end: new Date("2019-08-27T09:00:00.000Z")
}]

const SchedulerPage = () => {
    return (
      <>
        <Scheduler data={data} defaultDate={displayDate}>
          {/* <DayView /> */}
        </Scheduler>
      </>
    )
}

export default SchedulerPage;
