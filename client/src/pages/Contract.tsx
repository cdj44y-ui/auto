import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Download, PenTool, Send, Edit2, Save, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { calculateMonthlyEstimatedSalary } from "@/lib/salaryCalculator";
import { calculateComprehensiveSalary } from "@/lib/comprehensiveSalary";
import ContractTemplate from "@/components/consultant/ContractTemplate";

export default function Contract() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 계약서 기본 데이터 (희연푸드 양식 반영)
  const [contractData, setContractData] = useState({
    companyName: "희연푸드",
    representative: "정재중",
    employeeName: "홍길동",
    contractStart: "2024-01-01",
    contractEnd: "2024-12-31",
    workPlace: "희연푸드 본사",
    workTask: "조리 및 매장 관리",
    workDays: "월~일 중 5일",
    workTimeStart: "10:30",
    workTimeEnd: "20:00",
    breakTimeStart: "14:00",
    breakTimeEnd: "15:00",
    baseSalary: 2568212,
    mealAllowance: 200000,
    // 고정OT 분리
    fixedOvertimeAllowance: 355060,
    fixedNightAllowance: 76728,
    fixedHolidayAllowance: 0,
    totalSalary: 3200000,
    payDay: "10",
    hourlyRate: 15000, // 시급 추가
    isSmallBusiness: false, // 5인 미만 여부
    weeklyWorkHours: 40, // 주 소정 근로시간
    calculationMethod: "auto", // 'auto' | 'comprehensive'
    includedOvertimeHours: 20,
    includedNightHours: 20,
    includedHolidayHours: 30,
  });

  const handleCalculateSalary = () => {
    if (contractData.calculationMethod === "comprehensive") {
      // 포괄임금제 역산
      const result = calculateComprehensiveSalary({
        totalSalary: contractData.totalSalary,
        nonTaxableAmount: contractData.mealAllowance, // 식대 등 비과세
        weeklyWorkHours: contractData.weeklyWorkHours,
        includedOvertimeHours: contractData.includedOvertimeHours,
        includedNightHours: contractData.includedNightHours,
        includedHolidayHours: contractData.includedHolidayHours,
        isSmallBusiness: contractData.isSmallBusiness,
      });

      setContractData(prev => ({
        ...prev,
        hourlyRate: result.hourlyRate,
        baseSalary: result.baseSalary,
        fixedOvertimeAllowance: result.overtimeAllowance,
        fixedNightAllowance: result.nightAllowance,
        fixedHolidayAllowance: result.holidayAllowance,
      }));
      toast.success(`포괄임금 역산 완료: 시급 ${result.hourlyRate.toLocaleString()}원`);
    } else {
      // 기존 자동 계산 (시급 기준)
      const result = calculateMonthlyEstimatedSalary(
        {
          startTime: contractData.workTimeStart,
          endTime: contractData.workTimeEnd,
          breakStartTime: contractData.breakTimeStart,
          breakEndTime: contractData.breakTimeEnd,
        },
        {
          hourlyRate: contractData.hourlyRate,
          isSmallBusiness: contractData.isSmallBusiness,
          weeklyWorkHours: contractData.weeklyWorkHours,
        }
      );

      setContractData(prev => ({
        ...prev,
        baseSalary: result.basePay,
        fixedOvertimeAllowance: result.overtimePay,
        fixedNightAllowance: result.nightPay,
        fixedHolidayAllowance: result.holidayPay,
      }));
      toast.success("근무 조건에 따른 예상 급여가 계산되었습니다.");
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setIsSigned(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handleSubmit = () => {
    if (!isSigned) {
      toast.error("서명이 필요합니다.");
      return;
    }
    toast.success("근로계약서 서명이 완료되었습니다.");
  };

  const handleSaveContract = () => {
    setIsEditing(false);
    toast.success("계약서 내용이 수정되었습니다.");
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">전자 근로계약서</h1>
          <p className="text-muted-foreground">근로 조건을 확인하고 서명합니다.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSaveContract} className="rounded-xl bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" /> 저장하기
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-xl">
              <Edit2 className="w-4 h-4 mr-2" /> 내용 수정
            </Button>
          )}
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" /> PDF 다운로드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>표준 근로계약서</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            {/* 기존 하드코딩된 계약서 대신 ContractTemplate 컴포넌트 사용 */}
            <ContractTemplate 
              companyName={contractData.companyName}
              representative={contractData.representative}
              employeeName={contractData.employeeName}
              startDate={contractData.contractStart}
              endDate={contractData.contractEnd}
              position={contractData.workTask}
              baseSalary={contractData.baseSalary}
              fixedOvertimeAllowance={contractData.fixedOvertimeAllowance}
              fixedNightAllowance={contractData.fixedNightAllowance}
              fixedHolidayAllowance={contractData.fixedHolidayAllowance}
              mealAllowance={contractData.mealAllowance}
              totalSalary={contractData.totalSalary}
            />
            
            {/* 편집 모드일 때만 보이는 입력 폼 (계약서 하단에 배치하거나 모달로 띄울 수 있음) */}
            {isEditing && (
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4">계약 내용 수정</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>회사명</Label>
                    <Input value={contractData.companyName} onChange={(e) => setContractData({...contractData, companyName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>대표자</Label>
                    <Input value={contractData.representative} onChange={(e) => setContractData({...contractData, representative: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>직원명</Label>
                    <Input value={contractData.employeeName} onChange={(e) => setContractData({...contractData, employeeName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>업무내용</Label>
                    <Input value={contractData.workTask} onChange={(e) => setContractData({...contractData, workTask: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>계약시작일</Label>
                    <Input type="date" value={contractData.contractStart} onChange={(e) => setContractData({...contractData, contractStart: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>계약종료일</Label>
                    <Input type="date" value={contractData.contractEnd} onChange={(e) => setContractData({...contractData, contractEnd: e.target.value})} />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-bold mb-4">급여 상세 설정 (포괄임금 역산)</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>월 급여 총액</Label>
                      <Input type="number" value={contractData.totalSalary} onChange={(e) => setContractData({...contractData, totalSalary: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>비과세 식대</Label>
                      <Input type="number" value={contractData.mealAllowance} onChange={(e) => setContractData({...contractData, mealAllowance: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>고정 연장(시간)</Label>
                      <Input type="number" value={contractData.includedOvertimeHours} onChange={(e) => setContractData({...contractData, includedOvertimeHours: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>고정 야간(시간)</Label>
                      <Input type="number" value={contractData.includedNightHours} onChange={(e) => setContractData({...contractData, includedNightHours: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>고정 휴일(시간)</Label>
                      <Input type="number" value={contractData.includedHolidayHours} onChange={(e) => setContractData({...contractData, includedHolidayHours: Number(e.target.value)})} />
                    </div>
                  </div>
                  <Button onClick={() => {
                    setContractData({...contractData, calculationMethod: "comprehensive"});
                    handleCalculateSalary();
                  }} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                    <DollarSign className="w-4 h-4 mr-2" /> 급여 재계산 및 적용
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>서명란</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>성명 정자</Label>
                  <Input value={contractData.employeeName} readOnly className="bg-secondary/20" />
                </div>
                
                <div className="space-y-2">
                  <Label>전자 서명</Label>
                  <div className="border rounded-xl bg-white overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={150}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    {!isSigned && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/30">
                        <PenTool className="w-8 h-8 mr-2" />
                        <span>여기에 서명하세요</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearSignature} className="text-xs text-muted-foreground">
                      서명 초기화
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  onClick={handleSubmit}
                  disabled={!isSigned}
                >
                  <Send className="w-4 h-4 mr-2" /> 계약서 제출 및 서명 완료
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">법적 효력 안내</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    본 전자 근로계약서는 근로기준법 제17조에 의거하여 서면 계약과 동일한 법적 효력을 가집니다. 서명 완료 후 PDF 사본이 이메일로 발송됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
