
import { useState } from "react";

const Salles = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des salles.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-md">
        <p className="text-muted-foreground">
          Le module de gestion des salles sera implémenté prochainement.
        </p>
      </div>
    </div>
  );
};

export default Salles;
