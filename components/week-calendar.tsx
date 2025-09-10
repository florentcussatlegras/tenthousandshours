import React from "react";

export function WeekCalendar({currentDate} : {currentDate: Date}) {
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  let i = currentDate.getDay();
  let date = currentDate;
  let dayBeforeCurrentInversed = [];
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
  while (i < 7) {
    i++;
    const newDate = new Date(date.getTime() + 86400000);
    dayAfterCurrent.push(newDate);
    date = newDate;
  }

  const dayWeeks = dayBeforeCurrent.concat(dayAfterCurrent);

  console.log(dayWeeks);


  return <div className="flex flex-col">

    {JSON.stringify(currentDate.getDay())}

    <div className="flex flex-row w-full rounded-full py-2">

        {days.map((day) => (
            <div className="flex flex-col w-1/7">
                <div className="w-full text-center bg-default-100 p-2">{day}</div>
                <div className="w-full text-center h-[250px]">FOO</div>
            </div>
        ))}

    </div>

    <div>

    </div>

  </div>;
};
