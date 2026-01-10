import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LogOut, 
  User, 
  Clock, 
  FileText, 
  CreditCard, 
  Calendar, 
  CheckCircle2,
  Moon,
  Sun,
  Briefcase,
  Plane,
  Coffee,
  AlertCircle
} from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import RequestCenter from "@/components/employee/RequestCenter";
import WeeklyWorkHoursWidget from "@/components/employee/WeeklyWorkHoursWidget";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

// 직원용 레이아웃 컴포넌트
function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 상단 네비게이션 */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg hidden md:block dark:text-slate-100">근태관리 시스템 (직원용)</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 알림 센터 */}
            <NotificationCenter />

            {/* 다크 모드 토글 */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-500 dark:text-slate-400"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="hidden md:block text-right">
                <p className="font-medium dark:text-slate-200">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.department} {user?.position}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="로그아웃">
              <LogOut className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 근무 기록 상태
  const [workLog, setWorkLog] = useState<{
    clockIn: Date | null;
    clockOut: Date | null;
    status: "working" | "off" | "break";
  }>({
    clockIn: null,
    clockOut: null,
    status: "off"
  });

  // 근태 신청 상태
  const [requestType, setRequestType] = useState("vacation");
  const [requestDate, setRequestDate] = useState("");
  const [requestReason, setRequestReason] = useState("");

  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setWorkLog({ ...workLog, clockIn: new Date(), status: "working" });
    toast.success("출근 처리가 완료되었습니다.");
  };

  const handleClockOut = () => {
    setWorkLog({ ...workLog, clockOut: new Date(), status: "off" });
    toast.success("퇴근 처리가 완료되었습니다.");
  };

  const handleRequestSubmit = () => {
    if (!requestDate || !requestReason) {
      toast.error("날짜와 사유를 입력해주세요.");
      return;
    }
    toast.success("근태 신청이 상신되었습니다. 관리자 승인 대기 중입니다.");
    setRequestDate("");
    setRequestReason("");
  };

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">안녕하세요, {user?.name}님 👋</h1>
        <p className="text-muted-foreground">오늘도 활기찬 하루 되세요!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 주간 근무시간 위젯 (모바일에서는 상단, 데스크탑에서는 우측 배치 고려) */}
        <div className="md:col-span-1 md:order-2">
          <WeeklyWorkHoursWidget currentHours={38} overtimeHours={4} />
        </div>

        {/* 출퇴근 및 타임라인 카드 */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 md:col-span-2 md:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-slate-100">
              <Clock className="w-5 h-5 text-blue-600" />
              오늘의 근무 기록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">현재 시간</p>
                <h2 className="text-4xl font-bold tabular-nums tracking-tight dark:text-slate-100">
                  {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
                </h2>
                <p className={`text-sm mt-2 font-medium ${
                  workLog.status === "working" ? "text-green-600" : "text-slate-500"
                }`}>
                  {workLog.status === "working" ? "● 근무 중" : "○ 근무 전/종료"}
                </p>
              </div>

              {/* 타임라인 시각화 */}
              <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex justify-around items-center">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">출근 시간</p>
                  <p className="font-bold text-lg dark:text-slate-200">
                    {workLog.clockIn ? workLog.clockIn.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">퇴근 시간</p>
                  <p className="font-bold text-lg dark:text-slate-200">
                    {workLog.clockOut ? workLog.clockOut.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">총 근무</p>
                  <p className="font-bold text-lg text-blue-600">
                    {workLog.clockIn && workLog.clockOut 
                      ? `${Math.floor((workLog.clockOut.getTime() - workLog.clockIn.getTime()) / (1000 * 60 * 60))}시간` 
                      : workLog.clockIn 
                        ? "측정 중..." 
                        : "--"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                {!workLog.clockIn ? (
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleClockIn}>
                    출근하기
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20" onClick={handleClockOut} disabled={!!workLog.clockOut}>
                    {workLog.clockOut ? "퇴근 완료" : "퇴근하기"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 근태 신청 퀵 메뉴 (RequestCenter로 대체) */}
        <div className="md:col-span-3">
          <RequestCenter />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="attendance">내 근태 현황</TabsTrigger>
          <TabsTrigger value="salary">급여명세서</TabsTrigger>
          <TabsTrigger value="contract">근로계약서</TabsTrigger>
          <TabsTrigger value="vacation">휴가/연차</TabsTrigger>
        </TabsList>

        {/* 내 근태 탭 */}
        <TabsContent value="attendance">
          <Card className="border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">이번 달 근태 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">총 근무일</p>
                    <p className="text-2xl font-bold dark:text-slate-100">18일</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">지각</p>
                    <p className="text-2xl font-bold text-orange-500">0회</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">연장근무</p>
                    <p className="text-2xl font-bold text-blue-600">2.5시간</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">잔여 연차</p>
                    <p className="text-2xl font-bold text-green-600">12일</p>
                  </div>
                </div>
                
                {/* 신청 내역 리스트 */}
                <div>
                  <h3 className="font-medium mb-4 dark:text-slate-200">최근 신청 내역</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600">
                          <Plane className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-slate-200">부산 지사 출장</p>
                          <p className="text-sm text-muted-foreground">2026.01.15 - 2026.01.16</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">승인완료</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-slate-200">오후 반차</p>
                          <p className="text-sm text-muted-foreground">2026.01.20 (14:00 - 18:00)</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-slate-500 border-slate-200 dark:text-slate-400 dark:border-slate-700">결재 대기</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 급여명세서 탭 */}
        <TabsContent value="salary">
          <Card className="border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">급여 명세서 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold dark:text-slate-200">2026년 {i}월 급여명세서</p>
                        <p className="text-sm text-muted-foreground">지급일: 2026.0{i}.25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" /> 상세보기
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 근로계약서 탭 */}
        <TabsContent value="contract">
          <Card className="border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">전자 근로계약서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* 서명 대기 중인 계약서 */}
                <div className="p-6 border-2 border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">서명이 필요한 계약서가 있습니다</h3>
                    <p className="text-indigo-600 dark:text-indigo-400">2026년 연봉계약서 (미서명)</p>
                  </div>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setLocation("/contract-signing")}
                  >
                    <FileText className="w-4 h-4 mr-2" /> 계약서 확인 및 서명하기
                  </Button>
                </div>

                {/* 지난 계약서 내역 */}
                <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-center space-y-4 opacity-60">
                  <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-bold dark:text-slate-200">2025년 근로계약서</h3>
                    <p className="text-muted-foreground">2025.01.02 서명 완료</p>
                  </div>
                  <Button variant="outline" disabled>
                    <FileText className="w-4 h-4 mr-2" /> 보기 (만료됨)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 연차 관리 탭 */}
        <TabsContent value="vacation">
          <Card className="border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">연차 사용 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium text-blue-900 dark:text-blue-300">총 발생 연차: 15일</span>
                  <span className="font-medium text-blue-900 dark:text-blue-300">사용: 3일</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">잔여: 12일</span>
                </div>
                <div className="border rounded-lg divide-y dark:border-slate-800 dark:divide-slate-800">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium dark:text-slate-200">개인 사유 연차</p>
                      <p className="text-sm text-muted-foreground">2026.02.14 (1일)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">승인완료</Badge>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium dark:text-slate-200">설 연휴 연차</p>
                      <p className="text-sm text-muted-foreground">2026.01.27 (1일)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">승인완료</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployeeLayout>
  );
}
