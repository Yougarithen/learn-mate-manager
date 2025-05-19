
import { UsersRound, GraduationCap, BookOpen, Building } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfesseurs, getEleves, getCours, getSalles } from "@/data/database";

const Dashboard = () => {
  const [stats, setStats] = useState({
    professeurs: 0,
    eleves: 0,
    cours: 0,
    salles: 0,
    sallesOccupation: "0"
  });

  useEffect(() => {
    // Récupération des données depuis notre "base de données"
    const professeurs = getProfesseurs();
    const eleves = getEleves();
    const cours = getCours();
    const salles = getSalles();
    
    // Calcul du taux d'occupation des salles (simulation)
    const sallesDisponibles = salles.filter(salle => salle.status === "disponible").length;
    const tauxOccupation = salles.length > 0 
      ? Math.round(((salles.length - sallesDisponibles) / salles.length) * 100) 
      : 0;
    
    setStats({
      professeurs: professeurs.length,
      eleves: eleves.length,
      cours: cours.length,
      salles: salles.length,
      sallesOccupation: `${tauxOccupation}%`
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre panneau d'administration de l'école.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<UsersRound className="h-5 w-5" />} 
          iconColor="bg-blue-500" 
          title="Professeurs" 
          value={stats.professeurs.toString()} 
          trend={stats.professeurs > 0 ? `${stats.professeurs} actifs` : "Aucun professeur"} 
        />
        <StatCard 
          icon={<GraduationCap className="h-5 w-5" />} 
          iconColor="bg-green-500" 
          title="Élèves" 
          value={stats.eleves.toString()} 
          trend={stats.eleves > 0 ? `${Math.round(stats.eleves / 20)} classes` : "Aucun élève"} 
        />
        <StatCard 
          icon={<BookOpen className="h-5 w-5" />} 
          iconColor="bg-purple-500" 
          title="Cours" 
          value={stats.cours.toString()} 
          trend={`${Math.min(stats.cours, 4)} matières principales`} 
        />
        <StatCard 
          icon={<Building className="h-5 w-5" />} 
          iconColor="bg-amber-500" 
          title="Salles" 
          value={stats.salles.toString()} 
          trend={`${stats.sallesOccupation} d'occupation`} 
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  value: string;
  trend: string;
}

const StatCard = ({ icon, iconColor, title, value, trend }: StatCardProps) => {
  return (
    <div className="flex items-center p-4 border rounded-lg bg-card">
      <div className={`flex items-center justify-center p-2 rounded-lg mr-4 ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">{value}</p>
          <span className="ml-2 text-xs text-muted-foreground">{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
