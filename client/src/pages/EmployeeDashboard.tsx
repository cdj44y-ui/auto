import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, 
  User, 
  Clock, 
  FileText, 
  CreditCard, 
  Calendar, 
  Bell,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 직원용 레이아웃 컴포넌트
function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 네비게이션 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg hidden md:block">근태관리 시스템 (직원용)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div className="hidden md:block text-right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.department} {user?.position}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="로그아웃">
              <LogOut className="w-5 h-5 text-slate-500" />
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

  const handleClockIn = () => {
    toast.success("출근 처리가 완료되었습니다. (09:00)");
  };

  const handleClockOut = () => {
    toast.success("퇴근 처리가 완료되었습니다. (18:00)");
  };

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">안녕하세요, {user?.name}님 👋</h1>
        <p className="text-muted-foreground">오늘도 활기찬 하루 되세요!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 출퇴근 카드 */}
        <Card className="border-none shadow-sm bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              오늘의 근태
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">현재 시간</p>
              <h2 className="text-4xl font-bold tabular-nums tracking-tight">14:23:05</h2>
              <p className="text-sm text-blue-600 mt-2 font-medium">정상 근무 중</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button size="lg" className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700" onClick={handleClockIn}>
                출근하기
              </Button>
              <Button size="lg" variant="outline" className="flex-1 md:flex-none" onClick={handleClockOut}>
                퇴근하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 공지사항 미니 카드 */}
        <Card className="border-none shadow-sm bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="w-5 h-5" />
              최신 공지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-sm flex items-start gap-2">
                <Badge variant="outline" className="bg-white text-orange-600 border-orange-200 shrink-0">필독</Badge>
                <span className="text-orange-900 line-clamp-1">2026년 설 연휴 대체공휴일 안내</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 shrink-0">일반</Badge>
                <span className="text-slate-700 line-clamp-1">1월 사내 보안 점검 실시</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="attendance">내 근태</TabsTrigger>
          <TabsTrigger value="salary">급여명세서</TabsTrigger>
          <TabsTrigger value="contract">근로계약서</TabsTrigger>
          <TabsTrigger value="vacation">연차 관리</TabsTrigger>
        </TabsList>

        {/* 내 근태 탭 */}
        <TabsContent value="attendance">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>이번 달 근태 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">총 근무일</p>
                    <p className="text-2xl font-bold">18일</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">지각</p>
                    <p className="text-2xl font-bold text-orange-500">0회</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">연장근무</p>
                    <p className="text-2xl font-bold text-blue-600">2.5시간</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">잔여 연차</p>
                    <p className="text-2xl font-bold text-green-600">12일</p>
                  </div>
                </div>
                {/* 캘린더 플레이스홀더 */}
                <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed">
                  근태 캘린더 영역 (구현 예정)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 급여명세서 탭 */}
        <TabsContent value="salary">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>급여 명세서 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">2026년 {i}월 급여명세서</p>
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
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>전자 근로계약서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 border rounded-lg bg-slate-50 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold">서명 완료된 계약서가 있습니다</h3>
                  <p className="text-muted-foreground">2026년 연봉계약서 (2026.01.02 서명)</p>
                </div>
                <Button>
                  <FileText className="w-4 h-4 mr-2" /> 계약서 보기 (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 연차 관리 탭 */}
        <TabsContent value="vacation">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>연차 사용 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">총 발생 연차: 15일</span>
                  <span className="font-medium text-blue-900">사용: 3일</span>
                  <span className="font-bold text-blue-600 text-lg">잔여: 12일</span>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">개인 사유 연차</p>
                      <p className="text-sm text-muted-foreground">2026.02.14 (1일)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">승인완료</Badge>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">설 연휴 연차</p>
                      <p className="text-sm text-muted-foreground">2026.01.27 (1일)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">승인완료</Badge>
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
