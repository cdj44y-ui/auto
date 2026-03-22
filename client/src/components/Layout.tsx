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
  X,
  ChevronRight
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
  admin: "bg-indigo-400/20 text-indigo-200",
  consultant: "bg-sky-400/20 text-sky-200",
  employee: "bg-slate-400/20 text-slate-300",
  developer: "bg-violet-400/20 text-violet-200",
};

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { branding } = useBranding();
  const { user, logout } = useAuth();

  const userRole = user?.role || "employee";
  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ═══ P-2: Premium Dark Sidebar ═══ */}
      <aside className="hidden md:flex w-[260px] flex-col bg-slate-900 fixed h-full z-30">
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          {branding.logoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-600/30">
              {branding.companyName.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-[15px] text-white tracking-tight truncate" title={branding.companyName}>
            {branding.companyName}
          </span>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-1">
          <nav className="space-y-0.5">
            {filteredMenuItems.map((item, idx) => {
              const isActive = location === item.path;
              return (
                <Link key={`${item.path}-${idx}`} href={item.path}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400")} />
                    <span className="truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-500" />}
                  </button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom: Notification + User */}
        <div className="px-3 pb-4 space-y-3">
          {/* Notification Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
                <Bell className="w-[18px] h-[18px] text-slate-500" />
                <span>알림</span>
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">3</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-[320px] ml-2">
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
                  <p className="text-xs text-muted-foreground line-clamp-2">신청하신 '1월 10일 연차' 결재가 승인되었습니다.</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-semibold text-xs">급여 명세서 도착</span>
                    <span className="text-[10px] text-muted-foreground">1시간 전</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">2026년 1월 급여 명세서가 발송되었습니다.</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-semibold text-xs">신규 가입 요청</span>
                    <span className="text-[10px] text-muted-foreground">2시간 전</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">'박신입'님의 가입 승인 요청이 있습니다.</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <div className="border-t border-slate-700/50 pt-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden ring-2 ring-slate-600 flex-shrink-0">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663276387564/TsUJ6Yw3YnqZMgGDEG5xKg/profile-placeholder_20e3dd66.jpg"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-200 truncate">{user?.name || "사용자"}</p>
                <span className={cn(
                  "inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5",
                  roleBadgeColors[userRole] || "bg-slate-400/20 text-slate-300"
                )}>
                  {roleLabels[userRole] || "사용자"}
                </span>
              </div>
              <button onClick={logout} className="p-1.5 rounded-md hover:bg-white/10 transition-colors" title="로그아웃">
                <LogOut className="w-4 h-4 text-slate-500 hover:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ Mobile Header ═══ */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {branding.logoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {branding.companyName.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-[15px] text-slate-900 truncate max-w-[200px]">{branding.companyName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* ═══ Mobile Menu Overlay ═══ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900 md:hidden flex flex-col animate-in slide-in-from-top-10 duration-200">
          <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50">
            <span className="font-semibold text-[15px] text-white">메뉴</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
            {filteredMenuItems.map((item, idx) => (
              <Link key={`${item.path}-mobile-${idx}`} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium transition-all",
                    location === item.path
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", location === item.path ? "text-indigo-400" : "text-slate-500")} />
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-slate-600">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663276387564/TsUJ6Yw3YnqZMgGDEG5xKg/profile-placeholder_20e3dd66.jpg"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name || "사용자"}</p>
                <span className={cn(
                  "inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5",
                  roleBadgeColors[userRole] || "bg-slate-400/20 text-slate-300"
                )}>
                  {roleLabels[userRole] || "사용자"}
                </span>
              </div>
              <button onClick={logout} className="p-2 rounded-md hover:bg-white/10">
                <LogOut className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Main Content ═══ */}
      <main className="flex-1 md:pl-[260px] pt-14 md:pt-0 min-h-screen">
        <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
