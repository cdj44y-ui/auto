import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function EmployeeSignup() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    password: "",
    confirmPassword: ""
  });
  const [generatedId, setGeneratedId] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const generateEmployeeId = () => {
    // 사번 자동 생성 로직: 연도(2자리) + 부서코드(2자리) + 랜덤(4자리)
    // 실제로는 백엔드에서 시퀀스 관리 필요
    const year = new Date().getFullYear().toString().slice(2);
    const deptCode = formData.department === "개발팀" ? "01" : 
                     formData.department === "인사팀" ? "02" : 
                     formData.department === "영업팀" ? "03" : "99";
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `${year}${deptCode}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 사번 생성 및 다음 단계로 이동
    const newId = generateEmployeeId();
    setGeneratedId(newId);
    setStep(2);
    
    // TODO: 실제 API 호출하여 회원가입 요청 전송
    console.log("Signup Request:", { ...formData, employeeId: newId });
  };

  const handleFinalize = () => {
    toast.success("회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.");
    setLocation("/login-gateway");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setLocation("/login-gateway")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-xl">직원 회원가입</CardTitle>
          </div>
          <CardDescription>
            {step === 1 ? "기본 정보를 입력하여 계정을 생성합니다." : "발급된 사번을 확인해주세요."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input 
                  id="name" 
                  placeholder="홍길동" 
                  required 
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>부서</Label>
                  <Select onValueChange={(v) => handleInputChange("department", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="개발팀">개발팀</SelectItem>
                      <SelectItem value="인사팀">인사팀</SelectItem>
                      <SelectItem value="영업팀">영업팀</SelectItem>
                      <SelectItem value="경영지원팀">경영지원팀</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>직급</Label>
                  <Select onValueChange={(v) => handleInputChange("position", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사원">사원</SelectItem>
                      <SelectItem value="대리">대리</SelectItem>
                      <SelectItem value="과장">과장</SelectItem>
                      <SelectItem value="팀장">팀장</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@company.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input 
                  id="phone" 
                  placeholder="010-1234-5678" 
                  required 
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4">
                <UserPlus className="w-4 h-4 mr-2" /> 가입 신청하기
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold">가입 신청이 접수되었습니다</h3>
                <p className="text-muted-foreground text-sm">
                  관리자 승인 후 아래 사번으로 로그인하실 수 있습니다.
                </p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-muted-foreground mb-1">발급된 사번</p>
                <p className="text-3xl font-mono font-bold text-indigo-600 tracking-wider">{generatedId}</p>
              </div>

              <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded text-left">
                ※ 사번은 로그인 아이디로 사용되므로 반드시 메모해두시기 바랍니다.
                분실 시 관리자에게 문의해주세요.
              </div>

              <Button onClick={handleFinalize} className="w-full">
                로그인 화면으로 이동
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
