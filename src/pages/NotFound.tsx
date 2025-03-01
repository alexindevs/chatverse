
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-[120px]"></div>
      </div>

      <div className="max-w-md text-center z-10">
        <div className="glass p-8 rounded-2xl border border-white/20">
          <h1 className="text-9xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            404
          </h1>
          <p className="text-2xl font-medium mt-4 mb-6">Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to={isAuthenticated ? "/characters" : "/"}>
                {isAuthenticated ? "Browse Characters" : "Go to Home"}
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="outline" asChild>
                <Link to="/conversations">My Conversations</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
