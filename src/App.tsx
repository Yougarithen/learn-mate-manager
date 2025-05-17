
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Routes des professeurs
import Professeurs from "@/pages/professeurs/Professeurs";
import AjouterProfesseur from "@/pages/professeurs/AjouterProfesseur";
import ModifierProfesseur from "@/pages/professeurs/ModifierProfesseur";
import DetailsProfesseur from "@/pages/professeurs/DetailsProfesseur";

// Routes des cours
import Cours from "@/pages/cours/Cours";
import AjouterCours from "@/pages/cours/AjouterCours";
import ModifierCours from "@/pages/cours/ModifierCours";
import DetailsCours from "@/pages/cours/DetailsCours";

// Routes des élèves
import Eleves from "@/pages/eleves/Eleves";
import AjouterEleve from "@/pages/eleves/AjouterEleve";
import ModifierEleve from "@/pages/eleves/ModifierEleve";
import DetailsEleve from "@/pages/eleves/DetailsEleve";

// Routes des salles
import Salles from "@/pages/salles/Salles";
import AjouterSalle from "@/pages/salles/AjouterSalle";
import ModifierSalle from "@/pages/salles/ModifierSalle";
import DetailsSalle from "@/pages/salles/DetailsSalle";

// Route des finances
import Finance from "@/pages/finance/Finance";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Routes professeurs */}
            <Route path="/professeurs" element={<Professeurs />} />
            <Route path="/professeurs/ajouter" element={<AjouterProfesseur />} />
            <Route path="/professeurs/modifier/:id" element={<ModifierProfesseur />} />
            <Route path="/professeurs/:id" element={<DetailsProfesseur />} />
            
            {/* Routes cours */}
            <Route path="/cours" element={<Cours />} />
            <Route path="/cours/ajouter" element={<AjouterCours />} />
            <Route path="/cours/modifier/:id" element={<ModifierCours />} />
            <Route path="/cours/:id" element={<DetailsCours />} />
            
            {/* Routes élèves */}
            <Route path="/eleves" element={<Eleves />} />
            <Route path="/eleves/ajouter" element={<AjouterEleve />} />
            <Route path="/eleves/modifier/:id" element={<ModifierEleve />} />
            <Route path="/eleves/:id" element={<DetailsEleve />} />
            
            {/* Routes salles */}
            <Route path="/salles" element={<Salles />} />
            <Route path="/salles/ajouter" element={<AjouterSalle />} />
            <Route path="/salles/modifier/:id" element={<ModifierSalle />} />
            <Route path="/salles/:id" element={<DetailsSalle />} />
            
            {/* Routes finances */}
            <Route path="/finance" element={<Finance />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
