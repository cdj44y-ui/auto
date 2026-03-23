import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";
import { useLocation } from "wouter";
import { Building2, User, ShieldCheck, Briefcase } from "lucide-react";

/**
 * P-01: 6단계 권한 체계에 맞는 로그인 게이트웨이
 * 직원 / 관리자(super_admin) / 자문사(consultant) 3가지 진입점
 * 회사 내부 역할(company_admin, company_hr, company_finance)은 관리자 로그인 후 서버에서 판별
 */
export default function LoginGateway() {
  const { login } = useAuth();
  const { branding } = useBranding();
  const [, setLocation] = useLocation();

  const handleRoleSelect = (role: UserRole) => {
    if (role) login(role);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden">
      {branding.loginBackgroundUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={branding.loginBackgroundUrl} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
      )}
      
      <div className="max-w-5xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-2">
          {branding.logoUrl && (
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
          <h1 className={`text-4xl font-bold tracking-tight ${branding.loginBackgroundUrl ? 'text-white drop-shadow-md' : 'text-stone-900'}`}>
            {branding.welcomeMessage}
          </h1>
          <p className={`text-lg ${branding.loginBackgroundUrl ? 'text-white/90 drop-shadow-sm' : 'text-muted-foreground'}`}>
            접속하실 역할을 선택해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 직원용 */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary group" onClick={() => handleRoleSelect("employee")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-orange-100/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <User className="w-8 h-8 text-primary group-hover:text-white" />
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
              <Button className="w-full mt-6 bg-primary hover:bg-orange-800">직원 로그인</Button>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-orange-200/30 text-orange-700 hover:bg-orange-50/30"
                onClick={(e) => { e.stopPropagation(); setLocation("/employee-signup"); }}
              >
                신규 입사자 회원가입
              </Button>
            </CardContent>
          </Card>

          {/* 관리자용 (super_admin → 서버에서 실제 역할 판별) */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500 group" onClick={() => handleRoleSelect("super_admin")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-white" />
              </div>
              <CardTitle>관리자용</CardTitle>
              <CardDescription>인사/총무/재무 담당자 접속</CardDescription>
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
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary group" onClick={() => handleRoleSelect("consultant")}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-orange-100/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Briefcase className="w-8 h-8 text-primary group-hover:text-white" />
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
              <Button className="w-full mt-6 bg-primary hover:bg-orange-800">자문사 로그인</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className={`text-center text-sm pt-8 ${branding.loginBackgroundUrl ? 'text-white/80' : 'text-muted-foreground'}`}>
          <p>© 2026 {branding.companyName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
