
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Cours, Professeur, Salle, getProfesseurs, getSalles } from "@/data/database";
import niveauxScolaires from "@/data/niveauxScolaires.json";
import matieres from "@/data/matieres.json";
import { useEffect, useState } from "react";

const formSchema = z.object({
  matiere: z.string().min(2, {
    message: "La matière doit contenir au moins 2 caractères.",
  }),
  niveau: z.string().min(2, {
    message: "Le niveau doit être spécifié.",
  }),
  salaireParHeure: z.coerce.number().min(10, {
    message: "Le salaire horaire doit être d'au moins 10 DA.",
  }),
  description: z.string().optional(),
  professeurId: z.string().min(1, {
    message: "Veuillez sélectionner un professeur.",
  }),
  salleId: z.string().min(1, {
    message: "Veuillez sélectionner une salle.",
  }),
});

export type CoursFormData = z.infer<typeof formSchema>;

interface CoursFormProps {
  onSubmit: (data: CoursFormData) => void;
  defaultValues?: Partial<CoursFormData>;
  mode: "create" | "update";
}

const CoursForm = ({ onSubmit, defaultValues, mode }: CoursFormProps) => {
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  useEffect(() => {
    // Charger les professeurs et les salles depuis la base de données
    setProfesseurs(getProfesseurs().filter(p => p.status === "actif"));
    setSalles(getSalles().filter(s => s.status === "disponible"));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matiere: defaultValues?.matiere || "",
      niveau: defaultValues?.niveau || "",
      salaireParHeure: defaultValues?.salaireParHeure || 2500,
      description: defaultValues?.description || "",
      professeurId: defaultValues?.professeurId || "",
      salleId: defaultValues?.salleId || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="matiere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matière</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une matière" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {matieres.map((matiere) => (
                      <SelectItem key={matiere} value={matiere}>
                        {matiere}
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
            name="niveau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {niveauxScolaires.map((niveau) => (
                      <SelectItem key={niveau} value={niveau}>
                        {niveau}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="professeurId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professeur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un professeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professeurs.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.prenom} {prof.nom} - {prof.specialite}
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
            name="salleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une salle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {salles.map((salle) => (
                      <SelectItem key={salle.id} value={salle.id}>
                        {salle.nom} (Capacité: {salle.capacite})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="salaireParHeure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire horaire (DA)</FormLabel>
              <FormControl>
                <Input type="number" min="10" step="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cours de mathématiques pour les lycéens (Seconde à Terminale)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit">
            {mode === "create" ? "Ajouter le cours" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CoursForm;
