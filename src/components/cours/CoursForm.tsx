
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
import { Textarea } from "@/components/ui/textarea";
import { Cours } from "@/data/database";

const formSchema = z.object({
  matiere: z.string().min(2, {
    message: "La matière doit contenir au moins 2 caractères.",
  }),
  niveau: z.string().min(2, {
    message: "Le niveau doit être spécifié.",
  }),
  salaireParHeure: z.coerce.number().min(10, {
    message: "Le salaire horaire doit être d'au moins 10€.",
  }),
  description: z.string().optional(),
});

interface CoursFormProps {
  onSubmit: (data: Omit<Cours, "id">) => void;
  defaultValues?: Omit<Cours, "id">;
  mode: "create" | "update";
}

const CoursForm = ({ onSubmit, defaultValues, mode }: CoursFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      matiere: "",
      niveau: "",
      salaireParHeure: 25,
      description: "",
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
                <FormControl>
                  <Input placeholder="Mathématiques" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Lycée" {...field} />
                </FormControl>
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
              <FormLabel>Salaire horaire (€)</FormLabel>
              <FormControl>
                <Input type="number" min="10" step="0.5" {...field} />
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
