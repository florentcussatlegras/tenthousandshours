import React, { useEffect, useState } from "react";

export function WeekCalendar({ currentDate, currentWeek }: { currentDate: Date, currentWeek: Data[] }) {
//   const [currentWeek, setCurrentWeek] = useState([]);

  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="uppercase flex justify-center items-center text-sm text-default-500 h-10 font-semibold rounded-xl px-4 absolute top-4 right-2">
        Semaine du {new Intl.DateTimeFormat('fr-FR', {dateStyle: 'medium'}).format(currentWeek[0])} au {new Intl.DateTimeFormat('fr-FR', {dateStyle: 'medium'}).format(currentWeek[currentWeek.length - 1])}
      </div>

      <div className="flex flex-col">
        {JSON.stringify(currentDate.getDay())}

        <div className="flex flex-row w-full rounded-full py-2">
          {days.map((day) => (
            <div className="flex flex-col w-1/7">
              <div className="w-full text-center bg-default-100 p-2">{day}</div>
              <div className="w-full text-center h-[250px]">FOO</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
