
import React, { useMemo } from "react";
import horaires from "@/data/horaires.json";
import { getCoursById, Programmation } from "@/data/database";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const dayMap: Record<string, number> = {
  "2024-05-05": 0, // Dimanche (ignoré car hors emploi du temps)
  "2024-05-06": 0, // Lundi
  "2024-05-07": 1, // Mardi
  "2024-05-08": 2, // Mercredi
  "2024-05-09": 3, // Jeudi
  "2024-05-10": 4, // Vendredi
  "2024-05-11": 5, // Samedi (ignoré car hors emploi du temps)
};

interface TimetableProps {
  programmations: Programmation[];
}

export default function Timetable({ programmations }: TimetableProps) {
  // Créer la structure de l'emploi du temps
  const timetableData = useMemo(() => {
    // Initialiser la grille vide
    const grid: Record<string, Array<string | null>> = {};
    horaires.forEach(hour => {
      grid[hour] = Array(5).fill(null);
    });

    // Remplir avec les programmations de l'élève
    programmations.forEach(prog => {
      // Vérifier si l'heure est dans notre grille et si la date correspond à un jour de la semaine
      if (horaires.includes(prog.heure) && prog.date in dayMap) {
        const dayIndex = dayMap[prog.date];
        
        // Vérifier si le jour est dans notre plage (lundi à vendredi)
        if (dayIndex >= 0 && dayIndex < 5) {
          const cours = getCoursById(prog.coursId);
          if (cours) {
            grid[prog.heure][dayIndex] = cours.matiere;
          }
        }
      }
    });

    return grid;
  }, [programmations]);

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
                    {timetableData[hour][i] || "-"}
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
