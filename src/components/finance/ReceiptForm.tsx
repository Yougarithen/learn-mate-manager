
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
import { getEleves, getCours, getProgrammationsForEleve, addPaiement, addRecuPaiement, getCoursById } from "@/data/database";
import ReceiptGenerator from "@/components/eleves/ReceiptGenerator";

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

const ReceiptForm = ({ preselectedEleveId }: ReceiptFormProps) => {
  const [eleves, setEleves] = useState<any[]>([]);
  const [coursDisponibles, setCoursDisponibles] = useState<any[]>([]);
  const [selectedCoursIds, setSelectedCoursIds] = useState<string[]>([]);
  const [receiptData, setReceiptData] = useState<any | null>(null);
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
      // Récupérer les programmations de l'élève
      const programmations = getProgrammationsForEleve(watchEleveId);
      
      // Extraire les IDs de cours uniques
      const coursIds = new Set<string>();
      programmations.forEach(prog => coursIds.add(prog.coursId));
      
      // Récupérer les détails des cours
      const coursEleve = Array.from(coursIds)
        .map(id => getCoursById(id))
        .filter(cours => cours !== undefined);
      
      setCoursDisponibles(coursEleve as any[]);
      form.setValue("coursIds", []);
      setSelectedCoursIds([]);
      setTotal(0);
    } else {
      setCoursDisponibles([]);
    }
  }, [watchEleveId, form]);

  // Initialiser avec les élèves depuis la base de données
  useEffect(() => {
    setEleves(getEleves());
    
    // Si un élève est préselectionné, charger ses cours
    if (preselectedEleveId) {
      const programmations = getProgrammationsForEleve(preselectedEleveId);
      const coursIds = new Set<string>();
      programmations.forEach(prog => coursIds.add(prog.coursId));
      const coursEleve = Array.from(coursIds)
        .map(id => getCoursById(id))
        .filter(cours => cours !== undefined);
      setCoursDisponibles(coursEleve as any[]);
    }
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Créer un paiement
    const paiement = addPaiement({
      montant: data.montant,
      date: new Date().toISOString(),
      methode: data.methode,
      reference: data.reference || `REF-${Date.now()}`
    });
    
    // Créer un reçu de paiement
    const recu = addRecuPaiement({
      eleveId: data.eleveId,
      paiementId: paiement.id,
      coursIds: data.coursIds,
      date: new Date().toISOString()
    });
    
    // Préparer les données pour le reçu
    const eleve = eleves.find(e => e.id === data.eleveId);
    const coursPaies = data.coursIds.map(id => coursDisponibles.find(c => c.id === id));
    
    setReceiptData({
      eleve,
      cours: coursPaies,
      montant: data.montant,
      methode: data.methode,
      reference: paiement.reference,
      date: format(new Date(), "PPP", { locale: fr }),
      numero: recu.id
    });
    
    toast.success("Paiement enregistré", {
      description: `Reçu créé pour ${eleve?.prenom} ${eleve?.nom}`
    });
  };

  return (
    <div className="space-y-6">
      {receiptData ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setReceiptData(null)}>
              Nouveau paiement
            </Button>
          </div>
          <ReceiptGenerator data={receiptData} />
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
