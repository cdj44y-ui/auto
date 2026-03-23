import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, Briefcase, Building2, DollarSign, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function UnifiedLogin() {
  const { login, isLoading } = useAuth();
  const { branding } = useBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // 데모용 역할 선택 상태 (실제 운영 시에는 제거하거나 관리자용 백도어로 숨김)
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>("employee");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 실제 인증 로직 대신 데모용 역할 로그인 호출
    // 실제 구현 시에는 서버에 email/password를 보내고 토큰과 역할을 받아와야 함
    login(selectedDemoRole);
  };

  const handleDemoRoleSelect = (role: UserRole) => {
    setSelectedDemoRole(role);
    // 역할에 따른 데모 계정 자동 입력
    if (role === "employee") setEmail("employee@company.com");
    else if (role === "super_admin") setEmail("admin@company.com");
    else if (role === "consultant") setEmail("consultant@partner.com");
    else if (role === "company_admin") setEmail("companyadmin@company.com");
    else if (role === "company_hr") setEmail("hr@company.com");
    else if (role === "company_finance") setEmail("finance@company.com");
    
    setPassword("password123");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* 좌측 브랜딩 영역 (데스크탑) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 text-white overflow-hidden">
        {branding.loginBackgroundUrl ? (
          <>
            <img 
              src={branding.loginBackgroundUrl} 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        )}
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <div>
            {branding.logoUrl ? (
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 mb-8 shadow-lg">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-bold text-xl text-white">A</span>
                </div>
                <span className="font-bold text-xl tracking-tight">AES</span>
              </div>
            )}
            
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              {branding.welcomeMessage}
            </h1>
            <p className="text-lg text-stone-300 max-w-md leading-relaxed">
              스마트한 근태관리와 급여 정산, <br/>
              이제 하나의 플랫폼에서 효율적으로 관리하세요.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold mb-1">통합 관리</h3>
                <p className="text-sm text-stone-300">근태, 휴가, 급여를 한 곳에서</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold mb-1">법적 준수</h3>
                <p className="text-sm text-stone-300">최신 노동법 자동 반영</p>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              © 2026 {branding.companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* 우측 로그인 폼 영역 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-stone-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            {branding.logoUrl && (
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 mx-auto mb-6 shadow-sm border">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {branding.welcomeMessage}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              계정에 로그인하여 서비스를 이용하세요.
            </p>
          </div>

          <Card className="border-0 shadow-xl ring-1 ring-stone-200/50">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
              <CardDescription className="text-center">
                이메일과 비밀번호를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      placeholder="name@company.com" 
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <Button variant="link" className="p-0 h-auto text-xs font-normal" type="button" onClick={() => toast.info("관리자에게 비밀번호 초기화를 요청하세요.")}>
                      비밀번호 찾기
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    로그인 상태 유지
                  </Label>
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              {/* P-02-SEC: 데모용 역할 선택기 — 개발 모드에서만 노출 */}
              {import.meta.env.DEV && <div className="mt-8 pt-6 border-t">
                <p className="text-xs text-center text-muted-foreground mb-4">
                  [테스트용] 로그인할 역할을 선택하세요 (자동 입력)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedDemoRole === "super_admin" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("super_admin")}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px]">최고관리자</span>
                  </Button>
                  <Button 
                    variant={selectedDemoRole === "consultant" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("consultant")}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span className="text-[10px]">노무사</span>
                  </Button>
                  <Button 
                    variant={selectedDemoRole === "company_admin" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("company_admin")}
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="text-[10px]">회사관리자</span>
                  </Button>
                  <Button 
                    variant={selectedDemoRole === "company_hr" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("company_hr")}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-[10px]">인사담당</span>
                  </Button>
                  <Button 
                    variant={selectedDemoRole === "company_finance" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("company_finance")}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="text-[10px]">재무담당</span>
                  </Button>
                  <Button 
                    variant={selectedDemoRole === "employee" ? "default" : "outline"} 
                    size="sm" 
                    className="h-auto py-2 flex flex-col gap-1"
                    onClick={() => handleDemoRoleSelect("employee")}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-[10px]">직원</span>
                  </Button>
                </div>
              </div>}
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-stone-50/50 py-4">
              <p className="text-xs text-muted-foreground">
                계정이 없으신가요?{" "}
                <Button variant="link" className="p-0 h-auto text-xs" onClick={() => toast.info("관리자에게 계정 생성을 요청하세요.")}>
                  관리자에게 문의하기
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
