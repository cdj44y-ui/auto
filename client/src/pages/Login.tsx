import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F7] relative overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/login-bg-white.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      </div>

      <Card className="w-full max-w-md mx-4 z-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-8 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30 mb-4">
              A
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="h-12 rounded-xl bg-white/50 border-transparent focus:bg-white transition-all duration-200"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 rounded-xl bg-white/50 border-transparent focus:bg-white transition-all duration-200"
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground mb-4">Quick Login</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-10 rounded-xl hover:bg-white hover:shadow-md transition-all" onClick={() => setLocation("/")}>
                Admin
              </Button>
              <Button variant="outline" className="h-10 rounded-xl hover:bg-white hover:shadow-md transition-all" onClick={() => setLocation("/")}>
                Employee
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
