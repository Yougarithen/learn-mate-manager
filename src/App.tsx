
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import Cours from "@/pages/cours/Cours";
import Salles from "@/pages/salles/Salles";
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
            
            {/* Routes pour les autres modules */}
            <Route path="/eleves" element={<MainLayout><Eleves /></MainLayout>} />
            <Route path="/cours" element={<MainLayout><Cours /></MainLayout>} />
            <Route path="/salles" element={<MainLayout><Salles /></MainLayout>} />
            
            {/* Route par défaut -> Redirection vers dashboard */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
