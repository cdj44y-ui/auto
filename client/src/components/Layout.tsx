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
  Users,
  FileSignature,
  FileText,
  DollarSign,
  Bell,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Clock, label: "대시보드", path: "/" },
    { icon: Calendar, label: "근태 관리", path: "/attendance" },
    { icon: Users, label: "직원 관리", path: "/employees" },
    { icon: CheckCircle2, label: "승인 관리", path: "/approvals" },
    { icon: FileSignature, label: "전자 근로계약서", path: "/contract" },
    { icon: FileText, label: "전자 결재", path: "/workflow" },
    { icon: DollarSign, label: "급여 관리", path: "/payroll" },
    { icon: BarChart3, label: "통계 보고서", path: "/reports" },
    { icon: Settings, label: "설정", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl fixed h-full z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
            A
          </div>
          <span className="font-bold text-xl tracking-tight">근태관리 시스템</span>
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

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between rounded-xl border-border/50 bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>알림</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200 border-none">3</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[240px] md:w-[320px] mb-2">
                <DropdownMenuLabel className="flex justify-between items-center">
                  알림 센터
                  <Badge variant="outline" className="text-[10px]">3 new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex justify-between w-full">
                      <span className="font-semibold text-xs">결재 승인 완료</span>
                      <span className="text-[10px] text-muted-foreground">방금 전</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      신청하신 '1월 10일 연차' 결재가 승인되었습니다.
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex justify-between w-full">
                      <span className="font-semibold text-xs">급여 명세서 도착</span>
                      <span className="text-[10px] text-muted-foreground">1시간 전</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      2026년 1월 급여 명세서가 발송되었습니다.
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex justify-between w-full">
                      <span className="font-semibold text-xs">신규 가입 요청</span>
                      <span className="text-[10px] text-muted-foreground">2시간 전</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      '박신입'님의 가입 승인 요청이 있습니다.
                    </p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border">
              <img 
                src="/images/profile-placeholder.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">김관리</p>
              <p className="text-xs text-muted-foreground truncate">관리자</p>
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
          <span className="font-bold text-lg">근태관리 시스템</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden flex flex-col animate-in slide-in-from-top-10 duration-200">
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <span className="font-bold text-lg">메뉴</span>
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
