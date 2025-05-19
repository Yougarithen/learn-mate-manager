
import { useState } from "react";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { getCours, addPaiement, addRecuPaiement, Eleve, Cours } from "@/data/database";
import { Receipt } from "lucide-react";

interface ReceiptGeneratorProps {
  eleve: Eleve;
}

const ReceiptGenerator = ({ eleve }: ReceiptGeneratorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [duration, setDuration] = useState("1");
  const [montant, setMontant] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("espèces");
  const [allCourses, setAllCourses] = useState<Cours[]>([]);

  const durations = [
    { value: "1", label: "1 mois", tarif: 100 },
    { value: "3", label: "3 mois", tarif: 270 },
    { value: "6", label: "6 mois", tarif: 500 },
    { value: "12", label: "12 mois", tarif: 900 },
  ];

  const paymentMethods = [
    { value: "espèces", label: "Espèces" },
    { value: "chèque", label: "Chèque" },
    { value: "carte", label: "Carte bancaire" },
    { value: "virement", label: "Virement" },
  ];

  useState(() => {
    setAllCourses(getCours());
  });

  const handleDurationChange = (value: string) => {
    setDuration(value);
    const selectedDuration = durations.find(d => d.value === value);
    if (selectedDuration) {
      const baseAmount = selectedDuration.tarif;
      const coursCount = Math.max(1, selectedCourses.length);
      setMontant((baseAmount * coursCount).toString());
    }
  };

  const handleCoursesChange = (value: string) => {
    const courses = value.split(",").filter(Boolean);
    setSelectedCourses(courses);
    
    const selectedDuration = durations.find(d => d.value === duration);
    if (selectedDuration) {
      const baseAmount = selectedDuration.tarif;
      const coursCount = Math.max(1, courses.length);
      setMontant((baseAmount * coursCount).toString());
    }
  };

  const generateReceipt = () => {
    if (selectedCourses.length === 0) {
      toast.error("Sélectionnez au moins un cours", {
        description: "Veuillez sélectionner au moins un cours pour générer un reçu.",
      });
      return;
    }

    const amount = parseFloat(montant);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide", {
        description: "Veuillez entrer un montant valide.",
      });
      return;
    }

    // Créer un nouveau paiement
    const newPaiement = addPaiement({
      montant: amount,
      date: new Date().toISOString(),
      methode: paymentMethod,
      reference: `RECU-${eleve.nom.substring(0, 3)}-${format(new Date(), "yyyyMMdd")}`
    });

    // Créer un reçu associant le paiement à l'élève et aux cours
    const newRecu = addRecuPaiement({
      eleveId: eleve.id,
      paiementId: newPaiement.id,
      coursIds: selectedCourses,
      date: new Date().toISOString()
    });

    // Générer le PDF du reçu
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression", {
        description: "Veuillez autoriser les popups pour ce site.",
      });
      return;
    }

    const durationText = durations.find(d => d.value === duration)?.label || "";
    const coursesText = selectedCourses
      .map(id => {
        const cours = allCourses.find(c => c.id === id);
        return cours ? `${cours.matiere} (${cours.niveau})` : "";
      })
      .filter(Boolean)
      .join(", ");

    printWindow.document.write(`
      <html>
      <head>
        <title>Reçu de Paiement - ${eleve.prenom} ${eleve.nom}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { width: 80mm; margin: 0 auto; padding: 10mm; border: 1px solid #ccc; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; }
          .title { margin: 10px 0; }
          .info { margin-bottom: 20px; }
          .info-row { margin-bottom: 5px; }
          .label { font-weight: bold; }
          .value { }
          .courses { margin-bottom: 20px; }
          .payment-details { margin-bottom: 20px; }
          .total { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: right; }
          .footer { text-align: center; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">Centre de Soutien Scolaire</div>
            <div class="title">Reçu de Paiement</div>
            <div class="reference">N° ${newPaiement.reference}</div>
          </div>
          
          <div class="info">
            <div class="info-row"><span class="label">Date:</span> <span class="value">${format(new Date(), "dd/MM/yyyy")}</span></div>
            <div class="info-row"><span class="label">Élève:</span> <span class="value">${eleve.prenom} ${eleve.nom}</span></div>
            <div class="info-row"><span class="label">Niveau:</span> <span class="value">${eleve.niveau}</span></div>
          </div>
          
          <div class="payment-details">
            <div class="label">Détails du paiement:</div>
            <div class="info-row"><span class="label">Durée:</span> <span class="value">${durationText}</span></div>
            <div class="info-row"><span class="label">Mode de paiement:</span> <span class="value">${paymentMethod}</span></div>
          </div>
          
          <div class="courses">
            <div class="label">Cours:</div>
            <div class="value">${coursesText}</div>
          </div>
          
          <div class="total">
            Total: ${amount.toFixed(2)} €
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
    setIsDialogOpen(false);
    
    toast.success("Reçu de paiement généré avec succès", {
      description: `Le reçu de ${eleve.prenom} ${eleve.nom} a été généré.`,
    });
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Receipt className="h-4 w-4" />
        Générer un reçu
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Générer un reçu de paiement</DialogTitle>
            <DialogDescription>
              Créer un reçu pour {eleve.prenom} {eleve.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Select value={duration} onValueChange={handleDurationChange}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label} ({d.tarif} €)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="payment-method">Mode de paiement</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Sélectionnez un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="courses">Cours</Label>
              <Select onValueChange={handleCoursesChange}>
                <SelectTrigger id="courses">
                  <SelectValue placeholder="Sélectionnez des cours" />
                </SelectTrigger>
                <SelectContent>
                  {allCourses.map((cours) => (
                    <SelectItem key={cours.id} value={cours.id}>
                      {cours.matiere} - {cours.niveau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCourses.length > 0 && (
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedCourses.length} cours sélectionnés
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                type="number"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={generateReceipt}>Générer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReceiptGenerator;
