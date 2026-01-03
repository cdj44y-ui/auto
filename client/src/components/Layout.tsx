import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Clock,
  LogOut,
  Menu,
  Settings,
  User,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Clock, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Attendance", path: "/attendance" },
    { icon: Users, label: "Employees", path: "/employees" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl fixed h-full z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
            A
          </div>
          <span className="font-bold text-xl tracking-tight">Attendance</span>
        </div>

        <ScrollArea className="flex-1 px-4 py-2">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-200",
                    location === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border">
              <img 
                src="/images/profile-placeholder.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Alex Morgan</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
            A
          </div>
          <span className="font-bold text-lg">Attendance</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden flex flex-col animate-in slide-in-from-top-10 duration-200">
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <span className="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="w-6 h-6 rotate-45" /> {/* Close icon hack */}
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-lg h-12",
                    location === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen transition-all duration-300 ease-in-out">
        <div className="container py-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
