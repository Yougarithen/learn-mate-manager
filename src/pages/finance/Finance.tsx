
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptForm from "@/components/finance/ReceiptForm";
import ReceiptHistory from "@/components/finance/ReceiptHistory";

const Finance = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <p className="text-muted-foreground">
          Gérez les paiements et les reçus pour les élèves
        </p>
      </div>

      <Tabs defaultValue="nouveau-recu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nouveau-recu">Nouveau Reçu</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="nouveau-recu">
          <ReceiptForm />
        </TabsContent>
        <TabsContent value="historique">
          <ReceiptHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
