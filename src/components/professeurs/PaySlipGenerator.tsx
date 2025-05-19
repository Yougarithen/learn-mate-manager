
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { genererFichePaie, Professeur } from "@/data/database";
import { FileText } from "lucide-react";

interface PaySlipGeneratorProps {
  professeur: Professeur;
}

const PaySlipGenerator = ({ professeur }: PaySlipGeneratorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [month, setMonth] = useState<string>(format(new Date(), "M"));
  const [year, setYear] = useState<string>(format(new Date(), "yyyy"));

  const generatePDF = () => {
    const fichePaie = genererFichePaie(
      professeur.id,
      parseInt(month),
      parseInt(year)
    );

    if (!fichePaie) {
      toast.error("Erreur lors de la génération", {
        description: "Aucune heure de cours trouvée pour cette période.",
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression", {
        description: "Veuillez autoriser les popups pour ce site.",
      });
      return;
    }

    const monthName = format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy", { locale: fr });

    printWindow.document.write(`
      <html>
      <head>
        <title>Fiche de paie - ${professeur.prenom} ${professeur.nom}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .payslip { width: 210mm; margin: 0 auto; padding: 20mm; border: 1px solid #ccc; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; }
          .title { font-size: 22px; margin: 10px 0; }
          .date { font-style: italic; }
          .info { margin-bottom: 30px; }
          .info-row { margin-bottom: 10px; display: flex; }
          .label { font-weight: bold; width: 200px; }
          .value { }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          .total { font-size: 18px; font-weight: bold; margin-top: 30px; text-align: right; }
          .footer { text-align: center; font-size: 12px; margin-top: 50px; }
        </style>
      </head>
      <body>
        <div class="payslip">
          <div class="header">
            <div class="logo">Centre de Soutien Scolaire</div>
            <div class="title">Fiche de paie</div>
            <div class="date">${monthName}</div>
          </div>
          
          <div class="info">
            <div class="info-row"><span class="label">Professeur:</span> <span class="value">${
              professeur.prenom
            } ${professeur.nom}</span></div>
            <div class="info-row"><span class="label">Spécialité:</span> <span class="value">${
              professeur.specialite
            }</span></div>
            <div class="info-row"><span class="label">Adresse:</span> <span class="value">${
              professeur.adresse || "Non renseignée"
            }</span></div>
            <div class="info-row"><span class="label">Email:</span> <span class="value">${
              professeur.email
            }</span></div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Heures</th>
                <th>Taux horaire</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Heures d'enseignement</td>
                <td>${fichePaie.totalHeures.toFixed(2)}</td>
                <td>${(fichePaie.totalSalaire / fichePaie.totalHeures).toFixed(2)} €</td>
                <td>${fichePaie.totalSalaire.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total">
            Total net: ${fichePaie.totalSalaire.toFixed(2)} €
          </div>
          
          <div class="footer">
            Document généré le ${format(new Date(), "dd/MM/yyyy")}.<br>
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
    setIsDialogOpen(false);
    
    toast.success("Fiche de paie générée avec succès", {
      description: `La fiche de paie de ${professeur.prenom} ${professeur.nom} pour ${monthName} a été générée.`,
    });
  };

  const months = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  const years = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Générer fiche de paie
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Générer une fiche de paie</DialogTitle>
            <DialogDescription>
              Choisissez la période pour la fiche de paie de {professeur.prenom} {professeur.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="month">Mois</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Sélectionnez un mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="year">Année</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Sélectionnez une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={generatePDF}>Générer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaySlipGenerator;
