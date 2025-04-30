
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Professeurs from "@/pages/professeurs/Professeurs";
import AjouterProfesseur from "@/pages/professeurs/AjouterProfesseur";
import ModifierProfesseur from "@/pages/professeurs/ModifierProfesseur";
import DetailsProfesseur from "@/pages/professeurs/DetailsProfesseur";
import Eleves from "@/pages/eleves/Eleves";
import AjouterEleve from "@/pages/eleves/AjouterEleve";
import ModifierEleve from "@/pages/eleves/ModifierEleve";
import DetailsEleve from "@/pages/eleves/DetailsEleve";
import Cours from "@/pages/cours/Cours";
import AjouterCours from "@/pages/cours/AjouterCours";
import ModifierCours from "@/pages/cours/ModifierCours";
import DetailsCours from "@/pages/cours/DetailsCours";
import Salles from "@/pages/salles/Salles";
import AjouterSalle from "@/pages/salles/AjouterSalle";
import ModifierSalle from "@/pages/salles/ModifierSalle";
import DetailsSalle from "@/pages/salles/DetailsSalle";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées dans MainLayout */}
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            
            {/* Routes pour les professeurs */}
            <Route path="/professeurs" element={<MainLayout><Professeurs /></MainLayout>} />
            <Route path="/professeurs/ajouter" element={<MainLayout><AjouterProfesseur /></MainLayout>} />
            <Route path="/professeurs/modifier/:id" element={<MainLayout><ModifierProfesseur /></MainLayout>} />
            <Route path="/professeurs/:id" element={<MainLayout><DetailsProfesseur /></MainLayout>} />
            
            {/* Routes pour les élèves */}
            <Route path="/eleves" element={<MainLayout><Eleves /></MainLayout>} />
            <Route path="/eleves/ajouter" element={<MainLayout><AjouterEleve /></MainLayout>} />
            <Route path="/eleves/modifier/:id" element={<MainLayout><ModifierEleve /></MainLayout>} />
            <Route path="/eleves/:id" element={<MainLayout><DetailsEleve /></MainLayout>} />
            
            {/* Routes pour les cours */}
            <Route path="/cours" element={<MainLayout><Cours /></MainLayout>} />
            <Route path="/cours/ajouter" element={<MainLayout><AjouterCours /></MainLayout>} />
            <Route path="/cours/modifier/:id" element={<MainLayout><ModifierCours /></MainLayout>} />
            <Route path="/cours/:id" element={<MainLayout><DetailsCours /></MainLayout>} />
            
            {/* Routes pour les salles */}
            <Route path="/salles" element={<MainLayout><Salles /></MainLayout>} />
            <Route path="/salles/ajouter" element={<MainLayout><AjouterSalle /></MainLayout>} />
            <Route path="/salles/modifier/:id" element={<MainLayout><ModifierSalle /></MainLayout>} />
            <Route path="/salles/:id" element={<MainLayout><DetailsSalle /></MainLayout>} />
            
            {/* Route par défaut -> Redirection vers dashboard */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
