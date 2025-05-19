
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { Printer } from "lucide-react";

const formSchema = z.object({
  eleveId: z.string().min(1, {
    message: "Veuillez sélectionner un élève.",
  }),
  coursIds: z.array(z.string()).min(1, {
    message: "Veuillez sélectionner au moins un cours.",
  }),
  montant: z.coerce.number().min(1, {
    message: "Le montant doit être supérieur à 0 DA.",
  }),
  methode: z.string().min(1, {
    message: "Veuillez sélectionner une méthode de paiement.",
  }),
  reference: z.string().optional(),
});

interface ReceiptFormProps {
  preselectedEleveId: string | null;
}

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  niveau: string;
}

interface Cours {
  id: string;
  matiere: string;
  niveau: string;
  salaireParHeure: number;
}

interface ReceiptData {
  id: string;
  eleve: Eleve;
  cours: Cours[];
  montant: number;
  methode: string;
  reference: string;
  date: string;
}

const ReceiptForm = ({ preselectedEleveId }: ReceiptFormProps) => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [coursDisponibles, setCoursDisponibles] = useState<Cours[]>([]);
  const [selectedCoursIds, setSelectedCoursIds] = useState<string[]>([]);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [total, setTotal] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eleveId: preselectedEleveId || "",
      coursIds: [],
      montant: 0,
      methode: "espèces",
      reference: "",
    },
  });

  const watchEleveId = form.watch("eleveId");
  
  // Quand l'élève change, mettre à jour la liste des cours disponibles
  useEffect(() => {
    if (watchEleveId) {
      // Récupérer les cours de l'élève via l'API
      axios.get(`http://localhost:3000/api/cours/eleve/${watchEleveId}`)
        .then(response => {
          setCoursDisponibles(response.data);
          form.setValue("coursIds", []);
          setSelectedCoursIds([]);
          setTotal(0);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des cours:", error);
          setCoursDisponibles([]);
        });
    } else {
      setCoursDisponibles([]);
    }
  }, [watchEleveId, form]);

  // Initialiser avec les élèves depuis la base de données
  useEffect(() => {
    // Charger la liste des élèves
    axios.get('http://localhost:3000/api/eleves')
      .then(response => {
        setEleves(response.data);
        
        // Si un élève est préselectionné, charger ses cours
        if (preselectedEleveId) {
          axios.get(`http://localhost:3000/api/cours/eleve/${preselectedEleveId}`)
            .then(coursResponse => {
              setCoursDisponibles(coursResponse.data);
            })
            .catch(error => {
              console.error("Erreur lors de la récupération des cours:", error);
            });
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des élèves:", error);
        toast.error("Erreur de connexion", {
          description: "Impossible de charger la liste des élèves."
        });
      });
  }, [preselectedEleveId]);

  const handleSelectCours = (coursId: string) => {
    const isSelected = selectedCoursIds.includes(coursId);
    let newSelectedCours: string[];
    
    if (isSelected) {
      newSelectedCours = selectedCoursIds.filter(id => id !== coursId);
    } else {
      newSelectedCours = [...selectedCoursIds, coursId];
    }
    
    setSelectedCoursIds(newSelectedCours);
    form.setValue("coursIds", newSelectedCours);
    
    // Calculer le total
    const newTotal = newSelectedCours.reduce((sum, id) => {
      const cours = coursDisponibles.find(c => c.id === id);
      return sum + (cours ? cours.salaireParHeure : 0);
    }, 0);
    
    setTotal(newTotal);
    form.setValue("montant", newTotal);
  };

  const printReceipt = () => {
    if (!receiptData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression", {
        description: "Veuillez autoriser les popups pour ce site"
      });
      return;
    }

    const coursesText = receiptData.cours.map(c => `${c.matiere} (${c.niveau})`).join(", ");
    
    printWindow.document.write(`
      <html>
      <head>
        <title>Reçu de Paiement - ${receiptData.eleve.prenom} ${receiptData.eleve.nom}</title>
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
            <div class="reference">N° ${receiptData.reference}</div>
          </div>
          
          <div class="info">
            <div class="info-row"><span class="label">Date:</span> <span class="value">${receiptData.date}</span></div>
            <div class="info-row"><span class="label">Élève:</span> <span class="value">${receiptData.eleve.prenom} ${receiptData.eleve.nom}</span></div>
            <div class="info-row"><span class="label">Niveau:</span> <span class="value">${receiptData.eleve.niveau}</span></div>
          </div>
          
          <div class="payment-details">
            <div class="label">Détails du paiement:</div>
            <div class="info-row"><span class="label">Mode de paiement:</span> <span class="value">${receiptData.methode}</span></div>
          </div>
          
          <div class="courses">
            <div class="label">Cours:</div>
            <div class="value">${coursesText}</div>
          </div>
          
          <div class="total">
            Total: ${receiptData.montant.toFixed(2)} DA
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Appeler l'API pour créer un reçu de paiement
      const response = await axios.post('http://localhost:3000/api/recuPaiements', {
        eleveId: data.eleveId,
        coursIds: data.coursIds,
        montant: data.montant,
        methode: data.methode,
        reference: data.reference,
        date: new Date().toISOString()
      });
      
      // Récupérer l'élève et les cours pour afficher le reçu
      const eleve = eleves.find(e => e.id === data.eleveId);
      const coursSelected = data.coursIds.map(id => coursDisponibles.find(c => c.id === id)).filter(Boolean) as Cours[];
      
      // Préparer les données du reçu
      setReceiptData({
        id: response.data.id,
        eleve: eleve as Eleve,
        cours: coursSelected,
        montant: data.montant,
        methode: data.methode,
        reference: response.data.reference || `REF-${Date.now()}`,
        date: format(new Date(), "PPP", { locale: fr })
      });
      
      toast.success("Paiement enregistré", {
        description: `Reçu créé pour ${eleve?.prenom} ${eleve?.nom}`
      });
    } catch (error) {
      console.error("Erreur lors de la création du reçu:", error);
      toast.error("Erreur lors de la création du reçu", {
        description: "Une erreur s'est produite. Veuillez réessayer."
      });
    }
  };

  return (
    <div className="space-y-6">
      {receiptData ? (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReceiptData(null)}>
              Nouveau paiement
            </Button>
            <Button onClick={printReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer le reçu
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Reçu de paiement</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Élève</p>
                    <p>{receiptData.eleve.prenom} {receiptData.eleve.nom}</p>
                    <p className="text-sm text-muted-foreground">{receiptData.eleve.niveau}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Date</p>
                    <p>{receiptData.date}</p>
                    <p className="text-sm text-muted-foreground">Réf: {receiptData.reference}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-semibold mb-2">Cours</p>
                  <ul className="space-y-1">
                    {receiptData.cours.map(cours => (
                      <li key={cours.id} className="flex justify-between">
                        <span>{cours.matiere} ({cours.niveau})</span>
                        <span>{cours.salaireParHeure} DA</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">Méthode de paiement</p>
                    <p className="capitalize">{receiptData.methode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Total</p>
                    <p className="text-xl font-bold">{receiptData.montant} DA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eleveId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Élève</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un élève" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eleves.map((eleve) => (
                              <SelectItem key={eleve.id} value={eleve.id}>
                                {eleve.prenom} {eleve.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {watchEleveId && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="coursIds"
                        render={() => (
                          <FormItem>
                            <FormLabel>Cours</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {coursDisponibles.length === 0 ? (
                                <p className="text-sm text-muted-foreground col-span-2">
                                  Cet élève n'est inscrit à aucun cours
                                </p>
                              ) : (
                                coursDisponibles.map((cours) => (
                                  <div
                                    key={cours.id}
                                    onClick={() => handleSelectCours(cours.id)}
                                    className={`p-3 border rounded-md cursor-pointer ${
                                      selectedCoursIds.includes(cours.id)
                                        ? "border-primary bg-primary/10"
                                        : "border-input hover:border-primary/50"
                                    }`}
                                  >
                                    <div className="font-medium">{cours.matiere}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {cours.niveau} - {cours.salaireParHeure} DA
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="montant"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} />
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                                  DA
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">{total} DA</span>
                      </div>

                      <Separator />

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
                                  <SelectValue placeholder="Sélectionner une méthode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="espèces">Espèces</SelectItem>
                                <SelectItem value="carte">Carte bancaire</SelectItem>
                                <SelectItem value="virement">Virement bancaire</SelectItem>
                                <SelectItem value="chèque">Chèque</SelectItem>
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
                            <FormLabel>
                              Référence (facultatif)
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!watchEleveId || selectedCoursIds.length === 0}
              >
                Créer le reçu
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ReceiptForm;
