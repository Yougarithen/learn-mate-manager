
import { BarChart, UsersRound, GraduationCap, BookOpen, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Lun", professeurs: 3, eleves: 24, cours: 8 },
  { name: "Mar", professeurs: 4, eleves: 27, cours: 10 },
  { name: "Mer", professeurs: 5, eleves: 30, cours: 12 },
  { name: "Jeu", professeurs: 4, eleves: 29, cours: 11 },
  { name: "Ven", professeurs: 6, eleves: 35, cours: 15 },
  { name: "Sam", professeurs: 8, eleves: 42, cours: 20 },
  { name: "Dim", professeurs: 2, eleves: 15, cours: 6 },
];

const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre panneau d'administration de l'école.
        </p>
      </div>

      <div className="dashboard-stats">
        <StatCard 
          icon={<UsersRound className="h-5 w-5" />} 
          iconColor="bg-blue-500" 
          title="Professeurs" 
          value="12" 
          trend="+2 ce mois" 
        />
        <StatCard 
          icon={<GraduationCap className="h-5 w-5" />} 
          iconColor="bg-green-500" 
          title="Élèves" 
          value="184" 
          trend="+8 cette semaine" 
        />
        <StatCard 
          icon={<BookOpen className="h-5 w-5" />} 
          iconColor="bg-purple-500" 
          title="Cours" 
          value="57" 
          trend="12 aujourd'hui" 
        />
        <StatCard 
          icon={<Building className="h-5 w-5" />} 
          iconColor="bg-amber-500" 
          title="Salles" 
          value="8" 
          trend="87% d'occupation" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Vue d'ensemble de la semaine</CardTitle>
            <CardDescription>
              Activité des professeurs, élèves et cours
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="professeurs" fill="#3B82F6" name="Professeurs" />
                  <Bar dataKey="eleves" fill="#10B981" name="Élèves" />
                  <Bar dataKey="cours" fill="#8B5CF6" name="Cours" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cours à venir</CardTitle>
            <CardDescription>
              Cours planifiés aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UpcomingCourseItem 
                time="08:30 - 10:00" 
                title="Mathématiques" 
                salle="Salle 103" 
                prof="Marie Laurent" 
              />
              <UpcomingCourseItem 
                time="10:15 - 11:45" 
                title="Physique" 
                salle="Salle 203" 
                prof="Pierre Durand" 
              />
              <UpcomingCourseItem 
                time="13:00 - 14:30" 
                title="Français" 
                salle="Salle 105" 
                prof="Sophie Martin" 
              />
              <UpcomingCourseItem 
                time="14:45 - 16:15" 
                title="Histoire" 
                salle="Salle 201" 
                prof="Thomas Dubois" 
              />
            </div>
          </CardContent>
        </Card>
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
    <div className="dashboard-stat-card">
      <div className={`dashboard-icon ${iconColor}`}>
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

interface UpcomingCourseItemProps {
  time: string;
  title: string;
  salle: string;
  prof: string;
}

const UpcomingCourseItem = ({ time, title, salle, prof }: UpcomingCourseItemProps) => {
  return (
    <div className="flex items-center space-x-3 border-b pb-3 last:border-0 last:pb-0">
      <div className="text-sm font-medium min-w-[100px]">{time}</div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {salle} • {prof}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
