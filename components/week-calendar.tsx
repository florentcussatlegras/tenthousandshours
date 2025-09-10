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

  function current_week(date: Date) {
    let yearStart = +new Date(date.getFullYear(), 0, 1);
    let today = +new Date(date.getFullYear(),date.getMonth(),date.getDate());
    let dayOfYear = ((today - yearStart + 1) / 86400000);
    let week = Math.ceil(dayOfYear / 7);
    console.log(week);
  }

  console.log('here');
  console.log(current_week(currentDate));

  let i = currentDate.getDay();
  let date = currentDate;
  let dayBeforeCurrent = [];
  while (i > 1) {
    i--;
    console.log(i);
    const newDate = new Date(date.getTime() - 86400000);
    console.log(newDate);
    dayBeforeCurrent.push(newDate);
    date = newDate;
  }

  let i = currentDate.getDay();
  let date = currentDate;
  let dayBeforeCurrent = [];
  while (i > 1) {
    i--;
    console.log(i);
    const newDate = new Date(date.getTime() - 86400000);
    console.log(newDate);
    dayBeforeCurrent.push(newDate);
    date = newDate;
  }

  console.log(dayBeforeCurrent);


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
