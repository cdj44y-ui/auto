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
  Users,
  FileSignature,
  FileText,
  DollarSign,
  Bell,
  CheckCircle2,
  BrainCircuit,
  Building2,
  ClipboardList,
  Wallet,
  Shield,
  X
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
import { useBranding } from "@/contexts/BrandingContext";
import { Link, useLocation } from "wouter";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const allMenuItems = [
  { icon: Clock, label: "대시보드", path: "/admin-dashboard", roles: ["admin"] as UserRole[] },
  { icon: Clock, label: "대시보드", path: "/consultant-dashboard", roles: ["consultant"] as UserRole[] },
  { icon: Clock, label: "대시보드", path: "/employee-dashboard", roles: ["employee"] as UserRole[] },
  { icon: Clock, label: "대시보드", path: "/developer-dashboard", roles: ["developer"] as UserRole[] },
  { icon: Building2, label: "고객사 관리", path: "/clients", roles: ["admin", "consultant"] as UserRole[] },
  { icon: ClipboardList, label: "자문 이력", path: "/consultations", roles: ["admin", "consultant"] as UserRole[] },
  { icon: Users, label: "직원 관리", path: "/employees", roles: ["admin", "consultant"] as UserRole[] },
  { icon: Calendar, label: "근태 관리", path: "/attendance", roles: ["admin", "consultant"] as UserRole[] },
  { icon: CheckCircle2, label: "승인 관리", path: "/approvals", roles: ["admin"] as UserRole[] },
  { icon: FileSignature, label: "전자 근로계약서", path: "/contract", roles: ["admin"] as UserRole[] },
  { icon: FileText, label: "전자 결재", path: "/workflow", roles: ["admin"] as UserRole[] },
  { icon: DollarSign, label: "급여 관리", path: "/payroll", roles: ["admin", "consultant"] as UserRole[] },
  { icon: BarChart3, label: "통계 보고서", path: "/reports", roles: ["admin", "consultant"] as UserRole[] },
  { icon: BrainCircuit, label: "AI 인사이트", path: "/insights", roles: ["admin"] as UserRole[] },
  { icon: Clock, label: "내 근태", path: "/employee-dashboard", roles: ["employee"] as UserRole[] },
  { icon: Wallet, label: "내 급여", path: "/employee-dashboard", roles: ["employee"] as UserRole[] },
  { icon: Settings, label: "설정", path: "/settings", roles: ["admin"] as UserRole[] },
];

const roleLabels: Record<string, string> = {
  admin: "최고관리자",
  consultant: "노무사",
  employee: "직원",
  developer: "개발자",
};

const roleBadgeColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  consultant: "bg-blue-100 text-blue-700",
  employee: "bg-gray-100 text-gray-600",
  developer: "bg-purple-100 text-purple-700",
};

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { branding } = useBranding();
  const { user, logout } = useAuth();

  const userRole = user?.role || "employee";
  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl fixed h-full z-30">
        <div className="p-6 flex items-center gap-3">
          {branding.logoUrl ? (
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
              {branding.companyName.charAt(0)}
            </div>
          )}
          <span className="font-bold text-xl tracking-tight truncate" title={branding.companyName}>
            {branding.companyName}
          </span>
        </div>

        <ScrollArea className="flex-1 px-4 py-2">
          <nav className="space-y-1">
            {filteredMenuItems.map((item, idx) => (
              <Link key={`${item.path}-${idx}`} href={item.path}>
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

          {/* D-3: 사용자 정보 + 역할 배지 */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border">
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663276387564/TsUJ6Yw3YnqZMgGDEG5xKg/profile-placeholder_20e3dd66.jpg" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || "사용자"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-bold",
                    roleBadgeColors[userRole] || "bg-gray-100 text-gray-600"
                  )}>
                    {roleLabels[userRole] || "사용자"}
                  </span>
                </div>
              </div>
              <button onClick={logout} className="p-1 rounded hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {branding.logoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm">
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
              {branding.companyName.charAt(0)}
            </div>
          )}
          <span className="font-bold text-lg truncate max-w-[200px]">{branding.companyName}</span>
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
              <X className="w-6 h-6" />
            </Button>
          </div>
          <nav className="p-4 space-y-2 flex-1">
            {filteredMenuItems.map((item, idx) => (
              <Link key={`${item.path}-mobile-${idx}`} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
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
          {/* Mobile user info */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border">
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663276387564/TsUJ6Yw3YnqZMgGDEG5xKg/profile-placeholder_20e3dd66.jpg" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || "사용자"}</p>
                <span className={cn(
                  "inline-block px-2 py-0.5 rounded text-xs font-bold mt-1",
                  roleBadgeColors[userRole] || "bg-gray-100 text-gray-600"
                )}>
                  {roleLabels[userRole] || "사용자"}
                </span>
              </div>
              <button onClick={logout} className="p-2 rounded hover:bg-destructive/10">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
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
