
import { useState } from "react";

const Eleves = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des élèves.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-md">
        <p className="text-muted-foreground">
          Le module de gestion des élèves sera implémenté prochainement.
        </p>
      </div>
    </div>
  );
};

export default Eleves;
