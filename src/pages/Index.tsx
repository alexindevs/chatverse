
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Sparkles, Users, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Intelligent Conversations",
      description: "Engage in deep, meaningful conversations with AI characters that understand context and respond naturally."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Diverse Characters",
      description: "Choose from a wide range of pre-made characters or create your own custom AI personalities."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Dynamic Adaptation",
      description: "Characters learn and adapt to your conversation style for increasingly personalized interactions."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description: "Your conversations are private and secure, with advanced encryption and privacy controls."
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 z-10 animate-slide-down">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">AI-Powered Conversations</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent leading-tight">
              Connect with Intelligent Characters
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Engage in meaningful conversations with AI personalities. Discover new perspectives, enjoy thoughtful discussions, and never feel alone again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-md font-medium"
                onClick={() => navigate(isAuthenticated ? "/characters" : "/signup")}
              >
                {isAuthenticated ? "Browse Characters" : "Get Started"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-md font-medium"
                onClick={() => navigate(isAuthenticated ? "/conversations" : "/login")}
              >
                {isAuthenticated ? "My Conversations" : "Login"}
              </Button>
            </div>
          </div>
        </div>

        {/* Down arrow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 flex items-center justify-center rounded-full glass cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Redefining Digital Conversations
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the next generation of AI interaction with our unique platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl glass hover:shadow-lg transition-all duration-300 animate-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 p-3 rounded-xl bg-background inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-accent/10 blur-[80px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Start Your AI Conversation Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of users exploring new conversational horizons with our AI characters.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-md font-medium"
                onClick={() => navigate(isAuthenticated ? "/characters" : "/signup")}
              >
                {isAuthenticated ? "Browse Characters" : "Create Account"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-md font-medium"
                onClick={() => navigate(isAuthenticated ? "/conversations" : "/login")}
              >
                {isAuthenticated ? "My Conversations" : "Learn More"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
