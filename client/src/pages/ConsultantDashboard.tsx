import { useState } from "react";
import ConsultantPayrollManager from "@/components/consultant/ConsultantPayrollManager";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  LogOut, 
  Briefcase, 
  FileText, 
  Calculator, 
  Users, 
  Building, 
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  MessageSquare,
  Bell,
  Download,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import ConsultationChat from "@/components/consultant/ConsultationChat";
import BulkContractManager from "@/components/consultant/BulkContractManager";
import LegalAlertSystem from "@/components/consultant/LegalAlertSystem";
import PartnerDashboard from "@/components/partner/PartnerDashboard";
import ClientOnboardingWizard from "@/components/partner/ClientOnboardingWizard";
import PermissionMatrixEditor from "@/components/partner/PermissionMatrixEditor";
import FlexibleWorkPolicyManager from "@/components/flexible-work/FlexibleWorkPolicyManager";
import AnnualLeaveLedger from "@/components/admin/AnnualLeaveLedger";

export default function ConsultantDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // 모의 4대보험 신고 건수
  const insuranceTasks = [
    { id: 1, type: "취득신고", company: "(주)테크스타트업", target: "김신입", status: "pending", date: "2026-01-27" },
    { id: 2, type: "상실신고", company: "글로벌무역상사", target: "이퇴사", status: "completed", date: "2026-01-25" },
    { id: 3, type: "보수월액변경", company: "퓨처디자인랩", target: "박승진", status: "processing", date: "2026-01-26" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* 헤더 */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg dark:text-slate-100">자문사 파트너 센터</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {user?.department} | {user?.name} {user?.position}
              </span>
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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
            <TabsTrigger value="dashboard" className="py-2">통합 대시보드</TabsTrigger>
            <TabsTrigger value="partner" className="py-2">파트너 관리</TabsTrigger>
            <TabsTrigger value="clients" className="py-2">고객사 현황</TabsTrigger>
            <TabsTrigger value="payroll" className="py-2">전문가 급여정산</TabsTrigger>
            <TabsTrigger value="flexible" className="py-2">유연근무 컨설팅</TabsTrigger>
            <TabsTrigger value="leave" className="py-2">연차 관리</TabsTrigger>
            <TabsTrigger value="insurance" className="py-2">4대보험 신고</TabsTrigger>
          </TabsList>

          {/* 통합 대시보드 탭 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <LegalAlertSystem />
                <BulkContractManager />
              </div>
              <div className="lg:col-span-1">
                <ConsultationChat />
              </div>
            </div>
          </TabsContent>

          {/* 파트너 관리 탭 */}
          <TabsContent value="partner" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" /> 신규 고객사 등록 (Onboarding)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <ClientOnboardingWizard onClose={() => setIsOnboardingOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <PartnerDashboard />
            <div className="mt-8">
              <PermissionMatrixEditor />
            </div>
          </TabsContent>

          {/* 전문가 급여정산 탭 */}
          <TabsContent value="payroll">
            <ConsultantPayrollManager />
          </TabsContent>

          {/* 유연근무 컨설팅 탭 */}
          <TabsContent value="flexible">
            <FlexibleWorkPolicyManager />
          </TabsContent>

          {/* 연차 관리 탭 */}
          <TabsContent value="leave">
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800 flex items-start gap-3">
                <Calculator className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">연차 관리 서비스 가이드</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    고객사의 연차 발생 및 사용 내역을 모니터링하고, 법적 분쟁 예방을 위해 연차 사용 촉진 제도를 적시에 안내하세요.
                    회계연도 기준과 입사일 기준을 모두 지원하며, 대체휴무 적립 내역도 통합 관리됩니다.
                  </p>
                </div>
              </div>
              <AnnualLeaveLedger />
            </div>
          </TabsContent>

          {/* 고객사 현황 탭 */}
          <TabsContent value="clients">
            <Card className="border-none shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">고객사 리스크 모니터링</CardTitle>
                <CardDescription>계약된 고객사의 노무 리스크 및 계약 상태를 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  파트너 관리 탭에서 더 상세한 정보를 확인할 수 있습니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4대보험 신고 탭 */}
          <TabsContent value="insurance">
            <Card className="border-none shadow-sm dark:bg-slate-900">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-slate-100">4대보험 신고 업무</CardTitle>
                    <CardDescription>취득/상실/보수월액 변경 신고를 처리합니다.</CardDescription>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="w-4 h-4 mr-2" /> EDI 파일 업로드
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.type}
                        </Badge>
                        <div>
                          <p className="font-medium dark:text-slate-200">{task.company} - {task.target}</p>
                          <p className="text-sm text-muted-foreground">접수일: {task.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'pending' ? (
                          <Button size="sm" onClick={() => toast.success("신고 처리가 완료되었습니다.")}>신고 전송</Button>
                        ) : (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> 처리완료
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
