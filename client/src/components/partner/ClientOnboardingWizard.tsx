import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronRight, ChevronLeft, Building, CreditCard, UserPlus, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface WizardStepProps {
  onNext: () => void;
  onBack: () => void;
  data: any;
  updateData: (key: string, value: any) => void;
}

// Step 1: 기본 정보 입력
function Step1BasicInfo({ onNext, data, updateData }: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">회사명 (법인명)</Label>
          <Input 
            id="company_name" 
            placeholder="(주)예시컴퍼니" 
            value={data.company_name || ""}
            onChange={(e) => updateData("company_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="biz_num">사업자등록번호</Label>
          <Input 
            id="biz_num" 
            placeholder="000-00-00000" 
            value={data.business_registration_number || ""}
            onChange={(e) => updateData("business_registration_number", e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rep_name">대표자명</Label>
          <Input 
            id="rep_name" 
            placeholder="홍길동" 
            value={data.representative_name || ""}
            onChange={(e) => updateData("representative_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">업종</Label>
          <Select onValueChange={(val) => updateData("industry_type", val)} value={data.industry_type}>
            <SelectTrigger>
              <SelectValue placeholder="업종 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">IT/소프트웨어</SelectItem>
              <SelectItem value="manufacturing">제조업</SelectItem>
              <SelectItem value="service">서비스업</SelectItem>
              <SelectItem value="retail">도소매업</SelectItem>
              <SelectItem value="food">음식점업</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>담당자 정보</Label>
        <div className="grid grid-cols-3 gap-4">
          <Input 
            placeholder="담당자명" 
            value={data.contact_person || ""}
            onChange={(e) => updateData("contact_person", e.target.value)}
          />
          <Input 
            placeholder="연락처" 
            value={data.contact_phone || ""}
            onChange={(e) => updateData("contact_phone", e.target.value)}
          />
          <Input 
            placeholder="이메일" 
            type="email"
            value={data.contact_email || ""}
            onChange={(e) => updateData("contact_email", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext}>다음 단계 <ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

// Step 2: 구독 및 모듈 설정
function Step2Subscription({ onNext, onBack, data, updateData }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">구독 플랜 선택</Label>
        <RadioGroup 
          value={data.subscription_plan || "standard"} 
          onValueChange={(val) => updateData("subscription_plan", val)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="basic" id="basic" className="peer sr-only" />
            <Label
              htmlFor="basic"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-bold">Basic</span>
              <span className="text-sm text-muted-foreground">월 50,000원</span>
              <ul className="mt-2 text-xs list-disc list-inside text-left w-full">
                <li>직원 20명 제한</li>
                <li>기본 근태관리</li>
              </ul>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
            <Label
              htmlFor="standard"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-bold">Standard</span>
              <span className="text-sm text-muted-foreground">월 150,000원</span>
              <ul className="mt-2 text-xs list-disc list-inside text-left w-full">
                <li>직원 100명 제한</li>
                <li>급여정산 포함</li>
              </ul>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="premium" id="premium" className="peer sr-only" />
            <Label
              htmlFor="premium"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-bold">Premium</span>
              <span className="text-sm text-muted-foreground">월 300,000원</span>
              <ul className="mt-2 text-xs list-disc list-inside text-left w-full">
                <li>무제한 직원</li>
                <li>전용 API 제공</li>
              </ul>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base">추가 모듈 설정</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox id="mod_gps" defaultChecked />
            <Label htmlFor="mod_gps">GPS 위치 기반 출퇴근</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox id="mod_face" />
            <Label htmlFor="mod_face">안면인식 로그인 (Premium)</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox id="mod_contract" defaultChecked />
            <Label htmlFor="mod_contract">전자근로계약서</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox id="mod_api" disabled={data.subscription_plan !== 'premium'} />
            <Label htmlFor="mod_api" className={data.subscription_plan !== 'premium' ? "text-muted-foreground" : ""}>
              Open API 연동
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-2" /> 이전 단계</Button>
        <Button onClick={onNext}>다음 단계 <ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

// Step 3: 관리자 계정 생성
function Step3AdminAccount({ onNext, onBack, data, updateData }: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50/30 p-4 rounded-md text-sm text-orange-800 mb-4">
        <p>고객사의 최초 최고관리자(Super Admin) 계정을 생성합니다. 이 계정으로 모든 설정이 가능합니다.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin_email">관리자 이메일 (ID)</Label>
        <Input 
          id="admin_email" 
          type="email" 
          placeholder="admin@company.com" 
          value={data.admin_email || ""}
          onChange={(e) => updateData("admin_email", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin_name">관리자 성명</Label>
          <Input 
            id="admin_name" 
            placeholder="관리자명" 
            value={data.admin_name || ""}
            onChange={(e) => updateData("admin_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_phone">휴대전화</Label>
          <Input 
            id="admin_phone" 
            placeholder="010-0000-0000" 
            value={data.admin_phone || ""}
            onChange={(e) => updateData("admin_phone", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="temp_pw">임시 비밀번호</Label>
        <Input id="temp_pw" value="Welcome123!" readOnly className="bg-stone-100" />
        <p className="text-xs text-muted-foreground">최초 로그인 시 비밀번호 변경이 요구됩니다.</p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-2" /> 이전 단계</Button>
        <Button onClick={onNext}>다음 단계 <ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

// Step 4: 최종 확인
function Step4Review({ onNext, onBack, data }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">회사명:</span>
            <span className="font-medium ml-2">{data.company_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">사업자번호:</span>
            <span className="font-medium ml-2">{data.business_registration_number}</span>
          </div>
          <div>
            <span className="text-muted-foreground">구독 플랜:</span>
            <span className="font-medium ml-2 uppercase text-primary">{data.subscription_plan}</span>
          </div>
          <div>
            <span className="text-muted-foreground">관리자:</span>
            <span className="font-medium ml-2">{data.admin_name} ({data.admin_email})</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-md flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="text-sm text-green-800">
          <p className="font-bold mb-1">프로비저닝 준비 완료</p>
          <p>
            '등록 완료' 버튼을 누르면 고객사 환경이 자동 생성되고, 
            관리자에게 초대 메일이 발송됩니다. 예상 소요 시간은 약 30초입니다.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-2" /> 이전 단계</Button>
        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
          <FileCheck className="w-4 h-4 mr-2" /> 
          등록 및 프로비저닝 시작
        </Button>
      </div>
    </div>
  );
}

export default function ClientOnboardingWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    subscription_plan: "standard",
    industry_type: "service"
  });

  const updateData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Final Submit
      toast.success("고객사 등록이 완료되었습니다.", {
        description: `${formData.company_name}의 환경이 생성되었습니다.`
      });
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle>신규 고객사 등록 (Onboarding)</CardTitle>
        <CardDescription>
          Step {step} of 4: 
          {step === 1 && " 기본 정보 입력"}
          {step === 2 && " 구독 및 모듈 설정"}
          {step === 3 && " 관리자 계정 생성"}
          {step === 4 && " 최종 확인"}
        </CardDescription>
        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-2 rounded-full mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && <Step1BasicInfo onNext={handleNext} onBack={handleBack} data={formData} updateData={updateData} />}
        {step === 2 && <Step2Subscription onNext={handleNext} onBack={handleBack} data={formData} updateData={updateData} />}
        {step === 3 && <Step3AdminAccount onNext={handleNext} onBack={handleBack} data={formData} updateData={updateData} />}
        {step === 4 && <Step4Review onNext={handleNext} onBack={handleBack} data={formData} updateData={updateData} />}
      </CardContent>
    </Card>
  );
}
