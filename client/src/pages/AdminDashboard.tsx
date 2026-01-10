import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Moon, 
  Sun,
  Bell,
  CalendarDays
} from "lucide-react";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import PayrollManager from "@/components/admin/PayrollManager";
import AttendanceCorrection from "@/components/admin/AttendanceCorrection";
import FlexibleWorkPolicyManager from "@/components/flexible-work/FlexibleWorkPolicyManager";
import FlexibleWorkApprovalList from "@/components/flexible-work/FlexibleWorkApprovalList";
import AnnualLeaveLedger from "@/components/admin/AnnualLeaveLedger";
import TeamLeaveCalendar from "@/components/calendar/TeamLeaveCalendar";
import ShiftScheduler from "@/components/admin/ShiftScheduler";
import IpAccessManager from "@/components/admin/IpAccessManager";
import WorkHoursMonitor from "@/components/admin/WorkHoursMonitor";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {user?.department} | {user?.name} {user?.position}
              </span>
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative">
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 lg:w-[1000px] bg-white dark:bg-slate-900 h-auto p-1">
            <TabsTrigger value="dashboard" className="py-2">대시보드</TabsTrigger>
            <TabsTrigger value="employees" className="py-2">직원 관리</TabsTrigger>
            <TabsTrigger value="payroll" className="py-2">급여 관리</TabsTrigger>
            <TabsTrigger value="attendance" className="py-2">근태 관리</TabsTrigger>
            <TabsTrigger value="calendar" className="py-2">휴가 캘린더</TabsTrigger>
            <TabsTrigger value="flexible" className="py-2">유연근무</TabsTrigger>
            <TabsTrigger value="leave" className="py-2">연차 관리</TabsTrigger>
            <TabsTrigger value="shift" className="py-2">교대 근무</TabsTrigger>
            <TabsTrigger value="work-hours" className="py-2">주 52시간</TabsTrigger>
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
            <WorkHoursMonitor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
