
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptForm from "@/components/finance/ReceiptForm";
import ReceiptHistory from "@/components/finance/ReceiptHistory";
import { useEffect } from "react";

const Finance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "historique" ? "historique" : "nouveau-recu";
  const preselectedEleveId = searchParams.get("eleveId");

  const handleTabChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === "nouveau-recu") {
        newParams.delete("tab");
      } else {
        newParams.set("tab", value);
      }
      return newParams;
    });
  };
  
  // Si on revient à l'onglet de l'historique, on supprime l'ID d'élève de l'URL
  useEffect(() => {
    if (defaultTab === "historique" && preselectedEleveId) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("eleveId");
        return newParams;
      });
    }
  }, [defaultTab, preselectedEleveId, setSearchParams]);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <p className="text-muted-foreground">
          Gérez les paiements et les reçus pour les élèves
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="nouveau-recu">Nouveau Reçu</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="nouveau-recu">
          <ReceiptForm preselectedEleveId={preselectedEleveId} />
        </TabsContent>
        <TabsContent value="historique">
          <ReceiptHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
