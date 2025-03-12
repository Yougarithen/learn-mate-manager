
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Utilisateur de test en dur pour la démo
const DEMO_USER: User = {
  id: '1',
  name: 'Admin',
  role: 'administrator',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const isAuthenticated = !!user;

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Dans une vraie application, ceci ferait un appel API
    // Pour la démo, on vérifie juste des valeurs en dur
    if (username === 'admin' && password === 'password') {
      setUser(DEMO_USER);
      localStorage.setItem('user', JSON.stringify(DEMO_USER));
      toast.success("Connexion réussie", {
        description: "Bienvenue dans le système de gestion d'école"
      });
      return true;
    } else {
      toast.error("Échec de la connexion", {
        description: "Identifiant ou mot de passe incorrect"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast.success("Déconnexion réussie");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
