import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FlexibleWorkType } from "@/types/flexible-work";
import { Calendar as CalendarIcon, Clock, Check, ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { toast } from "sonner";

interface WizardStepProps {
  onNext: () => void;
  onBack?: () => void;
  data: any;
  updateData: (key: string, value: any) => void;
}

// Step 1: 근무제 유형 선택
function StepTypeSelection({ onNext, data, updateData }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">신청할 유연근무제 유형을 선택해주세요.</Label>
        <RadioGroup 
          value={data.type} 
          onValueChange={(val) => updateData('type', val)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${data.type === FlexibleWorkType.STAGGERED_COMMUTE ? 'border-primary bg-orange-50/30 dark:bg-stone-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-900'}`}>
            <RadioGroupItem value={FlexibleWorkType.STAGGERED_COMMUTE} id="staggered" className="mt-1" />
            <div className="grid gap-1.5 cursor-pointer" onClick={() => updateData('type', FlexibleWorkType.STAGGERED_COMMUTE)}>
              <Label htmlFor="staggered" className="font-bold cursor-pointer">시차출퇴근제</Label>
              <p className="text-sm text-muted-foreground">
                기존 9-6 근무 대신, 8-5, 10-7 등 회사가 정한 근무조 중 하나를 선택하여 근무합니다.
              </p>
            </div>
          </div>

          <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${data.type === FlexibleWorkType.SELECTIVE_WORKING_HOURS ? 'border-primary bg-orange-50/30 dark:bg-stone-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-900'}`}>
            <RadioGroupItem value={FlexibleWorkType.SELECTIVE_WORKING_HOURS} id="selective" className="mt-1" />
            <div className="grid gap-1.5 cursor-pointer" onClick={() => updateData('type', FlexibleWorkType.SELECTIVE_WORKING_HOURS)}>
              <Label htmlFor="selective" className="font-bold cursor-pointer">선택적 근로시간제</Label>
              <p className="text-sm text-muted-foreground">
                의무 근로시간(Core Time)을 준수하며, 출퇴근 시간을 자율적으로 조정합니다. (1개월 정산)
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!data.type}>
          다음 단계 <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step 2: 상세 스케줄 설정
function StepSchedule({ onNext, onBack, data, updateData }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>적용 시작일</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9" value={data.startDate} onChange={(e) => updateData('startDate', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>적용 종료일</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9" value={data.endDate} onChange={(e) => updateData('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      {data.type === FlexibleWorkType.STAGGERED_COMMUTE && (
        <div className="space-y-4 border p-4 rounded-lg bg-stone-50 dark:bg-stone-900">
          <Label>근무조 선택</Label>
          <Select value={data.shiftId} onValueChange={(val) => updateData('shiftId', val)}>
            <SelectTrigger>
              <SelectValue placeholder="근무조를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A조 (08:00 - 17:00)</SelectItem>
              <SelectItem value="B">B조 (09:00 - 18:00)</SelectItem>
              <SelectItem value="C">C조 (10:00 - 19:00)</SelectItem>
            </SelectContent>
          </Select>
          {data.shiftId && (
            <div className="text-sm text-primary dark:text-orange-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              선택하신 근무조는 휴게시간 1시간을 포함하여 하루 9시간 체류합니다.
            </div>
          )}
        </div>
      )}

      {data.type === FlexibleWorkType.SELECTIVE_WORKING_HOURS && (
        <div className="space-y-4 border p-4 rounded-lg bg-stone-50 dark:bg-stone-900">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>희망 출근시간</Label>
              <Input type="time" value={data.startTime} onChange={(e) => updateData('startTime', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>희망 퇴근시간</Label>
              <Input type="time" value={data.endTime} onChange={(e) => updateData('endTime', e.target.value)} />
            </div>
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400 flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5" />
            <span>
              필수 근무시간(Core Time: 11:00~15:00)은 반드시 준수해야 하며,<br/>
              월 평균 주 40시간 근무를 충족해야 합니다.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>신청 사유</Label>
        <Textarea 
          placeholder="유연근무 신청 사유를 구체적으로 입력해주세요. (예: 육아, 자기개발, 원거리 통근 등)" 
          className="h-24"
          value={data.reason}
          onChange={(e) => updateData('reason', e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> 이전 단계
        </Button>
        <Button onClick={onNext} disabled={!data.startDate || !data.endDate || !data.reason}>
          다음 단계 <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step 3: 최종 검토 및 제출
function StepReview({ onBack, data }: WizardStepProps) {
  const handleSubmit = () => {
    toast.success("유연근무 신청이 완료되었습니다.", {
      description: "관리자 승인 후 적용됩니다."
    });
    // 실제로는 여기서 API 호출
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-lg border-b pb-2 dark:border-stone-800">신청 내용 요약</h3>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-muted-foreground">신청 유형</div>
          <div className="col-span-2 font-medium dark:text-stone-200">
            {data.type === FlexibleWorkType.STAGGERED_COMMUTE ? "시차출퇴근제" : "선택적 근로시간제"}
          </div>

          <div className="text-muted-foreground">적용 기간</div>
          <div className="col-span-2 font-medium dark:text-stone-200">
            {data.startDate} ~ {data.endDate}
          </div>

          {data.type === FlexibleWorkType.STAGGERED_COMMUTE && (
            <>
              <div className="text-muted-foreground">선택 근무조</div>
              <div className="col-span-2 font-medium dark:text-stone-200">{data.shiftId}조</div>
            </>
          )}

          {data.type === FlexibleWorkType.SELECTIVE_WORKING_HOURS && (
            <>
              <div className="text-muted-foreground">희망 근무시간</div>
              <div className="col-span-2 font-medium dark:text-stone-200">
                {data.startTime} ~ {data.endTime}
              </div>
            </>
          )}

          <div className="text-muted-foreground">신청 사유</div>
          <div className="col-span-2 font-medium dark:text-stone-200 whitespace-pre-wrap">
            {data.reason}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 border border-orange-200/30 bg-orange-50/30 dark:bg-stone-800/30 dark:border-stone-700 rounded-lg text-sm text-orange-800 dark:text-orange-300">
        <Check className="w-5 h-5 flex-shrink-0" />
        <p>
          위 내용으로 유연근무제를 신청하며, 회사의 유연근무 운영 규정을 준수할 것을 서약합니다.
          승인 완료 시 근태 시스템에 즉시 반영됩니다.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> 이전 단계
        </Button>
        <Button className="bg-primary hover:bg-orange-800" onClick={handleSubmit}>
          신청서 제출하기
        </Button>
      </div>
    </div>
  );
}

export default function FlexibleWorkApplicationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    shiftId: "",
    startTime: "",
    endTime: "",
    reason: ""
  });

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <Card className="w-full max-w-3xl mx-auto border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">유연근무제 신청</CardTitle>
        <CardDescription>
          나에게 맞는 근무 형태를 선택하고 신청하세요. 승인 절차는 약 1-2일 소요됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-stone-200 text-stone-500 dark:bg-stone-800'}`}>
                {s}
              </div>
              <span className={`text-xs mt-2 ${step >= s ? 'text-primary font-medium' : 'text-stone-400'}`}>
                {s === 1 ? "유형 선택" : s === 2 ? "스케줄 설정" : "최종 검토"}
              </span>
            </div>
          ))}
          <div className="absolute top-[105px] left-[15%] w-[70%] h-[2px] bg-stone-200 dark:bg-stone-800 -z-0">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && <StepTypeSelection onNext={nextStep} data={formData} updateData={updateData} />}
        {step === 2 && <StepSchedule onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
        {step === 3 && <StepReview onNext={() => {}} onBack={prevStep} data={formData} updateData={updateData} />}
      </CardContent>
    </Card>
  );
}
