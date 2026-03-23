import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Moon, 
  Sun,
  Bell,
  Shield,
  Briefcase,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import PayrollManager from "@/components/admin/PayrollManager";
import AttendanceCorrection from "@/components/admin/AttendanceCorrection";
import FlexibleWorkPolicyManager from "@/components/flexible-work/FlexibleWorkPolicyManager";
import FlexibleWorkApprovalList from "@/components/flexible-work/FlexibleWorkApprovalList";
import CoreTimeSettings from "@/components/flexible-work/CoreTimeSettings";
import AnnualLeaveLedger from "@/components/admin/AnnualLeaveLedger";
import TeamLeaveCalendar from "@/components/calendar/TeamLeaveCalendar";
import ShiftScheduler from "@/components/admin/ShiftScheduler";
import IpAccessManager from "@/components/admin/IpAccessManager";
import WorkHoursMonitor from "@/components/admin/WorkHoursMonitor";
import OvertimeReport from "@/components/admin/OvertimeReport";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { WorkflowSettings } from "@/components/admin/WorkflowSettings";
import { IntegrationCenter } from "@/components/settings/IntegrationCenter";

// Role-based tab configuration
type TabConfig = {
  id: string;
  label: string;
  roles: string[]; // Which roles can see this tab
};

/** P-01: 6단계 권한 체계에 맞는 탭 구성 */
const TAB_CONFIG: TabConfig[] = [
  { id: "dashboard", label: "대시보드", roles: ["super_admin", "company_admin", "company_hr", "company_finance"] },
  { id: "employees", label: "직원 관리", roles: ["super_admin", "company_admin", "company_hr"] },
  { id: "payroll", label: "급여 관리", roles: ["super_admin", "company_admin", "company_finance"] },
  { id: "attendance", label: "근태 관리", roles: ["super_admin", "company_admin", "company_hr"] },
  { id: "calendar", label: "휴가 캘린더", roles: ["super_admin", "company_admin", "company_hr", "company_finance"] },
  { id: "flexible", label: "유연근무", roles: ["super_admin", "company_admin", "company_hr"] },
  { id: "leave", label: "연차 관리", roles: ["super_admin", "company_admin", "company_hr"] },
  { id: "shift", label: "교대 근무", roles: ["super_admin", "company_admin", "company_hr"] },
  { id: "work-hours", label: "주 52시간", roles: ["super_admin", "company_admin", "company_hr", "company_finance"] },
  { id: "security", label: "보안 및 감사", roles: ["super_admin"] },
  { id: "integration", label: "외부 연동", roles: ["super_admin"] },
];

// Role display info
/** P-01: 6단계 권한 체계 레이블 */
const ROLE_INFO: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  super_admin: { label: "최고관리자", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Shield },
  consultant: { label: "노무사", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400", icon: Briefcase },
  company_admin: { label: "회사관리자", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: Shield },
  company_hr: { label: "인사담당", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Users },
  company_finance: { label: "재무담당", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: DollarSign },
  employee: { label: "직원", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: Briefcase },
};

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Get user role (default to 'user' if not set)
  const userRole = user?.role || "user";
  
  // Filter tabs based on user role
  const visibleTabs = useMemo(() => {
    return TAB_CONFIG.filter(tab => tab.roles.includes(userRole));
  }, [userRole]);

  // Get role display info
  const roleInfo = ROLE_INFO[userRole] || ROLE_INFO.user;
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* 헤더 */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg dark:text-slate-100">관리자 대시보드</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Badge className={`${roleInfo.color} border-0 gap-1`}>
                <RoleIcon className="w-3 h-3" />
                {roleInfo.label}
              </Badge>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.name || "사용자"}
              </span>
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => toast.info("알림 기능은 준비 중입니다.")}>
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button variant="ghost" size="icon" onClick={logout} title="로그아웃">
              <LogOut className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto bg-white dark:bg-slate-900 h-auto p-1 gap-1 no-scrollbar">
            {visibleTabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="py-2 min-w-[80px] flex-shrink-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">총 직원 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-slate-100">142명</div>
                  <p className="text-xs text-green-500 mt-1">+2명 (전월 대비)</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">오늘 출근율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-slate-100">94.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">휴가 5명, 출장 3명</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">이번 달 급여 지급액</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-slate-100">₩452,000,000</div>
                  <p className="text-xs text-muted-foreground mt-1">지급 예정일: 25일</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FlexibleWorkApprovalList />
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>최근 근태 이상 내역</CardTitle>
                  <CardDescription>지각, 조퇴, 결근 등 확인이 필요한 내역입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "김철수", dept: "개발팀", type: "지각", time: "09:15", date: "2026-01-26" },
                      { name: "이영희", dept: "디자인팀", type: "결근", time: "-", date: "2026-01-25" },
                      { name: "박지민", dept: "마케팅팀", type: "조퇴", time: "16:00", date: "2026-01-24" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === '지각' ? 'bg-orange-500' : 
                            item.type === '결근' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <p className="font-medium text-sm dark:text-slate-200">{item.name} ({item.dept})</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            item.type === '지각' ? 'bg-orange-100 text-orange-700' : 
                            item.type === '결근' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.type}
                          </span>
                          <p className="text-xs font-mono mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role-based access notice */}
            {userRole !== 'super_admin' && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <RoleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">권한 안내</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        현재 <strong>{roleInfo.label}</strong> 권한으로 로그인되어 있습니다. 
                        {userRole === 'company_hr' && " 직원 관리, 근태 관리, 휴가 관리 메뉴에 접근할 수 있습니다."}
                        {userRole === 'company_finance' && " 급여 관리, 주 52시간 관리 메뉴에 접근할 수 있습니다."}
                        {userRole === 'employee' && " 대시보드와 휴가 캘린더를 확인할 수 있습니다."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollManager />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceCorrection />
          </TabsContent>

          <TabsContent value="calendar">
            <TeamLeaveCalendar isAdmin={true} />
          </TabsContent>

          <TabsContent value="flexible">
            <div className="space-y-6">
              <CoreTimeSettings />
              <FlexibleWorkPolicyManager />
              <FlexibleWorkApprovalList />
            </div>
          </TabsContent>

          <TabsContent value="leave">
            <AnnualLeaveLedger />
          </TabsContent>

          <TabsContent value="shift">
            <div className="space-y-6">
              <ShiftScheduler />
              <IpAccessManager />
            </div>
          </TabsContent>

          <TabsContent value="work-hours">
            <div className="space-y-8">
              <WorkHoursMonitor />
              <OvertimeReport />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-8">
              <AuditLogViewer />
              <WorkflowSettings />
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <IntegrationCenter />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
