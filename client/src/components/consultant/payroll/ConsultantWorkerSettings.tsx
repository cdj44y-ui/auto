import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Save, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import ComprehensiveWageDetail from "./ComprehensiveWageDetail";

// 2025년 최저임금
const MINIMUM_WAGE_2025 = 10030;

export default function ConsultantWorkerSettings({ companyId }: { companyId?: string }) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  
  // 급여 설정 상태
  const [salaryType, setSalaryType] = useState("monthly"); // monthly, hourly
  const [totalMonthlySalary, setTotalMonthlySalary] = useState<number>(3200000);
  
  // 근로시간 설정
  const [weeklyWorkHours, setWeeklyWorkHours] = useState<number>(40);
  const [weeklyRestHours, setWeeklyRestHours] = useState<number>(8); // 주휴시간 (통상 8시간)
  
  // 포괄임금제 세부 설정 (분리됨)
  const [fixedOvertimeHours, setFixedOvertimeHours] = useState<number>(20); // 연장
  const [fixedNightHours, setFixedNightHours] = useState<number>(20);    // 야간
  const [fixedHolidayHours, setFixedHolidayHours] = useState<number>(30);  // 휴일

  // 계산된 결과 상태
  const [calculationResult, setCalculationResult] = useState<{
    baseHourlyRate: number;
    baseSalary: number;
    overtimeAllowance: number;
    nightAllowance: number;
    holidayAllowance: number;
    totalCalculated: number;
    isMinimumWageViolation: boolean;
  } | null>(null);

  // 역산 시뮬레이션 로직
  const calculateReverseSalary = () => {
    // 1. 월 소정근로시간 산출 (209시간 기준)
    // (주40시간 + 주휴8시간) * 4.345주 = 208.57 => 209시간
    const monthlyBaseHours = (weeklyWorkHours + weeklyRestHours) * 4.345; 
    
    // 2. 가산 수당 환산 시간 산출
    // 연장근로: 1.5배
    const overtimeWeightedHours = fixedOvertimeHours * 1.5;
    // 야간근로: 0.5배 (연장과 중복 시) 또는 1.5배 (단독). 통상 포괄에서는 0.5배 가산분만 별도 책정하거나 1.5배로 책정.
    // 여기서는 통상적인 포괄임금 설계에 따라 야간수당(0.5배 가산)으로 계산 (기본급에 시간 포함 가정 시)
    // 하지만 명확한 분리를 위해 야간근로수당을 별도 항목(0.5배)으로 계산
    const nightWeightedHours = fixedNightHours * 0.5;
    // 휴일근로: 1.5배 (8시간 이내), 2.0배 (8시간 초과). 여기서는 1.5배로 단순화하여 적용
    const holidayWeightedHours = fixedHolidayHours * 1.5;

    // 3. 총 유급 인정 시간 (분모)
    // 주의: 포괄임금 역산 시, 월 총액을 (기본시간 + 가산환산시간)으로 나누어 통상시급을 구함
    const totalWeightedHours = Math.round(monthlyBaseHours) + overtimeWeightedHours + nightWeightedHours + holidayWeightedHours;

    // 4. 통상시급 산출
    const calculatedHourlyRate = Math.floor(totalMonthlySalary / totalWeightedHours);

    // 5. 각 항목별 금액 산출 (원단위 절사)
    const baseSalary = Math.floor(calculatedHourlyRate * Math.round(monthlyBaseHours) / 10) * 10;
    const overtimeAllowance = Math.floor(calculatedHourlyRate * overtimeWeightedHours / 10) * 10;
    const nightAllowance = Math.floor(calculatedHourlyRate * nightWeightedHours / 10) * 10;
    const holidayAllowance = Math.floor(calculatedHourlyRate * holidayWeightedHours / 10) * 10;

    // 6. 합계 검증 및 보정 (차액은 기본급에 반영하거나 별도 조정)
    const currentTotal = baseSalary + overtimeAllowance + nightAllowance + holidayAllowance;
    const diff = totalMonthlySalary - currentTotal;

    setCalculationResult({
      baseHourlyRate: calculatedHourlyRate,
      baseSalary: baseSalary + diff, // 차액 보정
      overtimeAllowance,
      nightAllowance,
      holidayAllowance,
      totalCalculated: totalMonthlySalary,
      isMinimumWageViolation: calculatedHourlyRate < MINIMUM_WAGE_2025
    });

    toast.success("급여 역산 시뮬레이션이 완료되었습니다.");
  };

  // 값이 변경될 때마다 자동 계산 (선택 사항)
  useEffect(() => {
    calculateReverseSalary();
  }, [totalMonthlySalary, fixedOvertimeHours, fixedNightHours, fixedHolidayHours, weeklyWorkHours]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 좌측: 설정 입력 패널 */}
        <Card className="border-t-4 border-t-blue-600 shadow-sm">
          <CardHeader>
            <CardTitle>근로자 급여 및 근로시간 설정</CardTitle>
            <CardDescription>
              포괄임금제 적용 시 고정 연장/야간/휴일 근로시간을 각각 설정하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>대상 회사</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="회사 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heeyeon">희연푸드</SelectItem>
                    <SelectItem value="techcorp">테크코퍼레이션</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>대상 근로자</Label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder="근로자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kim">김철수 (조리팀)</SelectItem>
                    <SelectItem value="lee">이영희 (서빙팀)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4" /> 임금 총액 설정
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>임금 유형</Label>
                  <Select value={salaryType} onValueChange={setSalaryType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">월급제 (포괄)</SelectItem>
                      <SelectItem value="hourly">시급제</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>월 급여 총액 (세전)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={totalMonthlySalary} 
                      onChange={(e) => setTotalMonthlySalary(Number(e.target.value))}
                      className="pl-8 font-bold text-lg"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-500">₩</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" /> 포괄임금 구성 (월 단위)
                </h3>
                <span className="text-xs text-muted-foreground">단위: 시간</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">고정 연장근로</Label>
                  <Input 
                    type="number" 
                    value={fixedOvertimeHours} 
                    onChange={(e) => setFixedOvertimeHours(Number(e.target.value))}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">고정 야간근로</Label>
                  <Input 
                    type="number" 
                    value={fixedNightHours} 
                    onChange={(e) => setFixedNightHours(Number(e.target.value))}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">고정 휴일근로</Label>
                  <Input 
                    type="number" 
                    value={fixedHolidayHours} 
                    onChange={(e) => setFixedHolidayHours(Number(e.target.value))}
                    className="text-right"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                * 연장(1.5배), 야간(0.5배 가산), 휴일(1.5배) 가중치가 적용되어 역산됩니다.
              </p>
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={calculateReverseSalary}>
              <Calculator className="w-4 h-4 mr-2" /> 급여 역산 시뮬레이션 실행
            </Button>
          </CardContent>
        </Card>

        {/* 우측: 계산 결과 및 검증 패널 */}
        <div className="space-y-6">
          {calculationResult && (
            <>
              {/* 최저임금 위반 체크 카드 */}
              <Card className={`border-l-4 shadow-sm ${
                calculationResult.isMinimumWageViolation 
                  ? "border-l-red-500 bg-red-50 dark:bg-red-900/20" 
                  : "border-l-green-500 bg-green-50 dark:bg-green-900/20"
              }`}>
                <CardContent className="pt-6 flex items-start gap-4">
                  {calculationResult.isMinimumWageViolation ? (
                    <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                  )}
                  <div>
                    <h3 className={`font-bold text-lg ${
                      calculationResult.isMinimumWageViolation ? "text-red-700" : "text-green-700"
                    }`}>
                      {calculationResult.isMinimumWageViolation 
                        ? "최저임금법 위반 위험" 
                        : "최저임금법 준수"}
                    </h3>
                    <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">
                      산출된 통상시급: <strong>{calculationResult.baseHourlyRate.toLocaleString()}원</strong> 
                      (2025년 최저시급 {MINIMUM_WAGE_2025.toLocaleString()}원 {calculationResult.isMinimumWageViolation ? "미달" : "이상"})
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 상세 분해 내역 컴포넌트 */}
              <ComprehensiveWageDetail 
                baseSalary={calculationResult.baseSalary}
                overtimeAllowance={calculationResult.overtimeAllowance}
                nightAllowance={calculationResult.nightAllowance}
                holidayAllowance={calculationResult.holidayAllowance}
                baseHourlyRate={calculationResult.baseHourlyRate}
                fixedOvertimeHours={fixedOvertimeHours}
                fixedNightHours={fixedNightHours}
                fixedHolidayHours={fixedHolidayHours}
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline">초기화</Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" /> 설정 저장 및 적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
