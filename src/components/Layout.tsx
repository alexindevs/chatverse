
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Users, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navLinks = [
    { href: "/characters", label: "Characters", icon: <Users className="mr-2 h-4 w-4" /> },
    { href: "/conversations", label: "Conversations", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
    { href: "/profile", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated && !["/login", "/signup", "/"].includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled ? "glass shadow-md py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-slow overflow-hidden">
              <div className="absolute inset-0 rounded-full border border-white/20 backdrop-blur-sm"></div>
            </div>
            <span className="text-xl font-display font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI Characters
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && !isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={isActive(link.href) ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all ${
                    isActive(link.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-foreground"
                  }`}
                  asChild
                >
                  <Link to={link.href} className="flex items-center">
                    {link.icon}
                    {link.label}
                  </Link>
                </Button>
              ))}
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="md:hidden"
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          )}

          {/* Auth buttons for non-authenticated users */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isAuthenticated && isMobile && (
        <div 
          className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMenu}></div>
          <div 
            className={`absolute top-0 right-0 w-64 h-full glass-dark shadow-xl transition-transform duration-300 ease-in-out ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col p-4">
              <div className="text-lg font-medium mb-4">Menu</div>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant={isActive(link.href) ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start ${
                      isActive(link.href) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-white/10 text-foreground"
                    }`}
                    asChild
                  >
                    <Link to={link.href} className="flex items-center">
                      {link.icon}
                      {link.label}
                    </Link>
                  </Button>
                ))}
                
                <Separator className="my-2" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} AI Characters. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
