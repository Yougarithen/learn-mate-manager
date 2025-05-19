
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  getRecuPaiements, 
  getEleveById, 
  getPaiementById, 
  getCoursById,
  RecuPaiement 
} from "@/data/database";

const ReceiptHistory = () => {
  const [recus, setRecus] = useState<RecuPaiement[]>([]);

  useEffect(() => {
    setRecus(getRecuPaiements());
  }, []);

  const handlePrint = (recu: RecuPaiement) => {
    const eleve = getEleveById(recu.eleveId);
    const paiement = getPaiementById(recu.paiementId);
    
    if (!eleve || !paiement) return;
    
    const coursList = recu.coursIds.map(id => {
      const cours = getCoursById(id);
      return cours ? cours.matiere + " (" + cours.niveau + ")" : "";
    }).join(", ");
    
    const dateStr = format(new Date(recu.date), "dd/MM/yyyy");
    
    // Créer une fenêtre d'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
      <head>
        <title>Reçu de Paiement</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { width: 80mm; margin: 0 auto; padding: 10mm; border: 1px solid #ccc; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; }
          .info { margin-bottom: 20px; }
          .info-row { margin-bottom: 5px; }
          .label { font-weight: bold; }
          .value { }
          .courses { margin-bottom: 20px; }
          .total { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">Centre de Soutien Scolaire</div>
            <div>Reçu de Paiement</div>
          </div>
          
          <div class="info">
            <div class="info-row"><span class="label">Date:</span> <span class="value">${dateStr}</span></div>
            <div class="info-row"><span class="label">Élève:</span> <span class="value">${eleve.prenom} ${eleve.nom}</span></div>
            <div class="info-row"><span class="label">Niveau:</span> <span class="value">${eleve.niveau}</span></div>
          </div>
          
          <div class="courses">
            <div class="label">Cours:</div>
            <div class="value">${coursList}</div>
          </div>
          
          <div class="total">
            Total: ${paiement.montant.toFixed(2)} DA
          </div>
          
          <div class="footer">
            Merci pour votre confiance !<br>
            Centre de Soutien Scolaire
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Historique des paiements</h2>
      
      {recus.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          Aucun reçu de paiement enregistré
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Élève</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recus.map(recu => {
                const eleve = getEleveById(recu.eleveId);
                const paiement = getPaiementById(recu.paiementId);
                const coursNames = recu.coursIds
                  .map(id => {
                    const cours = getCoursById(id);
                    return cours ? cours.matiere : "";
                  })
                  .join(", ");
                
                return (
                  <TableRow key={recu.id}>
                    <TableCell>
                      {recu.date ? format(new Date(recu.date), "dd/MM/yyyy") : ""}
                    </TableCell>
                    <TableCell>{eleve ? `${eleve.prenom} ${eleve.nom}` : ""}</TableCell>
                    <TableCell>{coursNames}</TableCell>
                    <TableCell>{paiement ? `${paiement.montant.toFixed(2)} DA` : ""}</TableCell>
                    <TableCell>
                      {paiement ? (
                        paiement.methode.charAt(0).toUpperCase() + paiement.methode.slice(1)
                      ) : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePrint(recu)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReceiptHistory;
