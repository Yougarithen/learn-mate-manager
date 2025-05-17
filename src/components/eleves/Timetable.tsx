
import React from "react";
import horaires from "@/data/horaires.json";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default function Timetable() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Emploi du Temps</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-2 bg-muted">Heure</th>
              {days.map((day) => (
                <th key={day} className="border px-2 py-2 bg-muted">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horaires.map((hour) => (
              <tr key={hour}>
                <td className="border px-2 py-2 text-center font-semibold">{hour}</td>
                {days.map((day, i) => (
                  <td key={`${day}-${i}`} className="border px-2 py-2 text-center">
                    -
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
