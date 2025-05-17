
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCoursById, getCours, getEleveById, getEleves, addPaiement, addRecuPaiement, Cours, Eleve, Paiement, RecuPaiement } from "@/data/database";

const formSchema = z.object({
  eleveId: z.string().min(1, { message: "Veuillez sélectionner un élève" }),
  coursIds: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un cours" }),
  duree: z.string().min(1, { message: "Veuillez sélectionner une durée" }),
  methode: z.string().min(1, { message: "Veuillez sélectionner une méthode de paiement" }),
  reference: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReceiptForm = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [cours, setCours] = useState<Cours[]>([]);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [totalMontant, setTotalMontant] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eleveId: "",
      coursIds: [],
      duree: "",
      methode: "especes",
      reference: "",
    },
  });

  useEffect(() => {
    setEleves(getEleves());
    setCours(getCours());
  }, []);

  useEffect(() => {
    const eleveId = form.watch("eleveId");
    if (eleveId) {
      const eleve = getEleveById(eleveId);
      setSelectedEleve(eleve || null);
    } else {
      setSelectedEleve(null);
    }
  }, [form.watch("eleveId")]);

  // Calculer le montant total en fonction des cours et de la durée sélectionnés
  useEffect(() => {
    const selectedCoursIds = form.watch("coursIds");
    const duree = form.watch("duree");
    
    if (selectedCoursIds.length > 0 && duree) {
      let montant = 0;
      selectedCoursIds.forEach(coursId => {
        const cours = getCoursById(coursId);
        if (cours) {
          // Calculer en fonction de la durée
          switch (duree) {
            case "1":
              montant += cours.salaireParHeure; // 1 séance
              break;
            case "4":
              montant += cours.salaireParHeure * 4; // 1 mois (4 séances)
              break;
            case "12":
              montant += cours.salaireParHeure * 12 * 0.9; // 3 mois (12 séances) avec 10% de réduction
              break;
            case "36":
              montant += cours.salaireParHeure * 36 * 0.8; // 9 mois (36 séances) avec 20% de réduction
              break;
          }
        }
      });
      setTotalMontant(montant);
    } else {
      setTotalMontant(0);
    }
  }, [form.watch("coursIds"), form.watch("duree")]);

  const onSubmit = (data: FormValues) => {
    // Créer un nouveau paiement
    const paiement: Omit<Paiement, "id"> = {
      montant: totalMontant,
      date: new Date().toISOString(),
      methode: data.methode,
      reference: data.reference || `REF-${Date.now()}`
    };

    const newPaiement = addPaiement(paiement);
    
    // Créer un reçu de paiement
    const recuPaiement: Omit<RecuPaiement, "id"> = {
      eleveId: data.eleveId,
      paiementId: newPaiement.id,
      coursIds: data.coursIds,
      date: new Date().toISOString()
    };
    
    const newRecu = addRecuPaiement(recuPaiement);
    
    if (newRecu) {
      toast.success("Reçu généré avec succès", {
        description: `Un reçu de ${totalMontant} € a été généré pour ${selectedEleve?.prenom} ${selectedEleve?.nom}`
      });
      
      // Imprimer le reçu
      printReceipt(newRecu);
      
      // Réinitialiser le formulaire
      form.reset();
    }
  };

  const printReceipt = (recu: RecuPaiement) => {
    const eleve = getEleveById(recu.eleveId);
    if (!eleve) return;
    
    // Préparer le contenu du reçu pour l'impression
    const coursList = recu.coursIds.map(id => {
      const cours = getCoursById(id);
      return cours ? cours.matiere + " (" + cours.niveau + ")" : "";
    }).join(", ");
    
    const dureeText = (() => {
      const duree = form.getValues("duree");
      switch (duree) {
        case "1": return "1 séance";
        case "4": return "1 mois (4 séances)";
        case "12": return "3 mois (12 séances)";
        case "36": return "Année scolaire (36 séances)";
        default: return "";
      }
    })();
    
    const paiement = totalMontant.toFixed(2) + " €";
    const dateStr = format(new Date(), "dd/MM/yyyy");
    
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
            <div class="info-row"><span class="label">Durée:</span> <span class="value">${dureeText}</span></div>
          </div>
          
          <div class="courses">
            <div class="label">Cours:</div>
            <div class="value">${coursList}</div>
          </div>
          
          <div class="total">
            Total: ${paiement}
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Générer un reçu de paiement</CardTitle>
        <CardDescription>
          Sélectionnez l'élève, les cours et la durée pour générer un reçu de paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eleveId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Élève</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un élève" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eleves.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id}>
                          {eleve.prenom} {eleve.nom} ({eleve.niveau})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coursIds"
              render={() => (
                <FormItem>
                  <FormLabel>Cours</FormLabel>
                  <div className="space-y-2">
                    {cours.map((cours) => (
                      <div key={cours.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cours-${cours.id}`}
                          value={cours.id}
                          onChange={(e) => {
                            const coursIds = form.getValues("coursIds") || [];
                            if (e.target.checked) {
                              form.setValue("coursIds", [...coursIds, cours.id]);
                            } else {
                              form.setValue(
                                "coursIds",
                                coursIds.filter((id) => id !== cours.id)
                              );
                            }
                          }}
                        />
                        <label htmlFor={`cours-${cours.id}`}>
                          {cours.matiere} ({cours.niveau}) - {cours.salaireParHeure} €/h
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une durée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 séance</SelectItem>
                      <SelectItem value="4">1 mois (4 séances)</SelectItem>
                      <SelectItem value="12">3 mois (12 séances) - 10% réduction</SelectItem>
                      <SelectItem value="36">Année scolaire (36 séances) - 20% réduction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="methode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une méthode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="virement">Virement bancaire</SelectItem>
                      <SelectItem value="carte">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence du paiement (optionnel)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Chèque #1234" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-muted p-4 rounded-md">
              <div className="text-lg font-semibold">Total à payer: {totalMontant.toFixed(2)} €</div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit">
                <Receipt className="mr-2 h-4 w-4" />
                Générer le reçu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReceiptForm;
