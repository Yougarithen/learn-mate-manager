
import { useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  Home,
  Building,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isMobile?: boolean;
  onClick?: () => void;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ href, icon: Icon, title, isMobile, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        isMobile ? "w-full justify-start" : ""
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  );
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/dashboard", icon: Home, title: "Tableau de bord" },
    { href: "/professeurs", icon: Users, title: "Professeurs" },
    { href: "/cours", icon: BookOpen, title: "Cours" },
    { href: "/eleves", icon: GraduationCap, title: "Élèves" },
    { href: "/salles", icon: Building, title: "Salles" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar pour desktop */}
      {!isMobile && (
        <aside className="w-64 bg-card border-r flex flex-col">
          <div className="p-6 border-b">
            <h1 className="font-semibold text-xl">Gestion École</h1>
          </div>
          <ScrollArea className="flex-1 p-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                />
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </aside>
      )}

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col">
        {/* Header pour mobile */}
        {isMobile && (
          <header className="border-b p-4 flex items-center justify-between bg-card">
            <h1 className="font-semibold text-lg">Gestion École</h1>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-xl">Gestion École</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeMobileMenu}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 px-6 py-4">
                  <nav className="grid gap-1">
                    {navItems.map((item) => (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                        isMobile={true}
                        onClick={closeMobileMenu}
                      />
                    ))}
                  </nav>
                </ScrollArea>
                <div className="p-6 border-t mt-auto">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </header>
        )}

        {/* Contenu de la page */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
