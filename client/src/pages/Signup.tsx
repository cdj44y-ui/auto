import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Signup() {
  const [_, setLocation] = useLocation();
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (role === "admin") {
        toast.success("관리자 가입 신청이 완료되었습니다. 플랫폼 승인 후 이용 가능합니다.");
      } else {
        toast.success("직원 가입 신청이 완료되었습니다. 회사 승인 후 이용 가능합니다.");
      }
      setLocation("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-8 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30 mb-4">
                A
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-center">회원가입</h1>
              <p className="text-muted-foreground text-center">근태관리 시스템에 오신 것을 환영합니다</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-3">
                <Label>가입 유형</Label>
                <RadioGroup defaultValue="employee" onValueChange={setRole} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label
                      htmlFor="admin"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <span className="text-sm font-semibold">회사 관리자</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="employee" id="employee" className="peer sr-only" />
                    <Label
                      htmlFor="employee"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <span className="text-sm font-semibold">직원</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="홍길동" required className="h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="name@company.com" required className="h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" placeholder="••••••••" required className="h-12 rounded-xl" />
              </div>

              {role === "admin" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="company">회사명</Label>
                  <Input id="company" placeholder="(주)우리회사" required className="h-12 rounded-xl" />
                </div>
              )}

              {role === "employee" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="company_code">회사 코드</Label>
                  <Input id="company_code" placeholder="관리자에게 받은 코드 입력" required className="h-12 rounded-xl" />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? "가입 신청 중..." : "가입 신청하기"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <span 
                  className="text-primary font-medium cursor-pointer hover:underline"
                  onClick={() => setLocation("/login")}
                >
                  로그인하기
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
