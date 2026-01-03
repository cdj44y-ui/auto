import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Building2, Code2, User, ShieldCheck, Briefcase } from "lucide-react";

export default function LoginGateway() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleRoleSelect = (role: UserRole) => {
    if (role) login(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">근태관리 시스템 접속</h1>
          <p className="text-lg text-muted-foreground">접속하실 역할을 선택해주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 직원용 */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-500 group" onClick={() => handleRoleSelect("employee")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <User className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <CardTitle>직원용</CardTitle>
              <CardDescription>일반 임직원 접속</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>내 근태 현황 확인</li>
                <li>급여 명세서 조회</li>
                <li>전자 근로계약서 서명</li>
                <li>연차 사용 내역 조회</li>
              </ul>
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">직원 로그인</Button>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={(e) => { e.stopPropagation(); setLocation("/employee-signup"); }}
              >
                신규 입사자 회원가입
              </Button>
            </CardContent>
          </Card>

          {/* 관리자용 */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500 group" onClick={() => handleRoleSelect("admin")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-white" />
              </div>
              <CardTitle>관리자용</CardTitle>
              <CardDescription>인사/총무 담당자 접속</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>전사 근태 모니터링</li>
                <li>급여 정산 및 발송</li>
                <li>직원 정보 및 계약 관리</li>
                <li>휴가/연차 승인 처리</li>
              </ul>
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">관리자 로그인</Button>
            </CardContent>
          </Card>

          {/* 자문사용 */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-500 group" onClick={() => handleRoleSelect("consultant")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <Briefcase className="w-8 h-8 text-indigo-600 group-hover:text-white" />
              </div>
              <CardTitle>자문사용</CardTitle>
              <CardDescription>노무법인/세무사 접속</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>고객사 급여/4대보험 대행</li>
                <li>취업규칙/계약서 컨설팅</li>
                <li>노무 리스크 모니터링</li>
                <li>법정 의무 교육 관리</li>
              </ul>
              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">자문사 로그인</Button>
            </CardContent>
          </Card>

          {/* 개발자용 */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-500 group" onClick={() => handleRoleSelect("developer")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <Code2 className="w-8 h-8 text-purple-600 group-hover:text-white" />
              </div>
              <CardTitle>개발자용</CardTitle>
              <CardDescription>시스템 마스터 접속</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>전체 회사 승인/관리</li>
                <li>자문사 권한 관리</li>
                <li>데이터베이스 관리</li>
                <li>오류 로그 모니터링</li>
              </ul>
              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">개발자 로그인</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>© 2026 Attendance Enterprise System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
