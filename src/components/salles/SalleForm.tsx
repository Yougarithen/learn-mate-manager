
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
import { Input } from "@/components/ui/input";
import { Salle } from "@/data/database";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  capacite: z.coerce.number().min(1, {
    message: "La capacité doit être d'au moins 1 place.",
  }),
  adresse: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  equipement: z.string().optional(),
  status: z.enum(["disponible", "indisponible"]),
});

interface SalleFormProps {
  onSubmit: (data: Omit<Salle, "id">) => void;
  defaultValues?: Omit<Salle, "id">;
  mode: "create" | "update";
}

const SalleForm = ({ onSubmit, defaultValues, mode }: SalleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      nom: "",
      capacite: 1,
      adresse: "",
      equipement: "",
      status: "disponible",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la salle</FormLabel>
                <FormControl>
                  <Input placeholder="Salle A1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="12 Rue de l'École, 75005 Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipement</FormLabel>
              <FormControl>
                <Input placeholder="Tableau blanc, projecteur, 8 pupitres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="indisponible">Indisponible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit">
            {mode === "create" ? "Ajouter la salle" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SalleForm;
