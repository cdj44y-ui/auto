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
    overtimeAllowance: 431788,
    totalSalary: 3200000,
    payDay: "10",
    hourlyRate: 15000, // 시급 추가
    isSmallBusiness: false, // 5인 미만 여부
    weeklyWorkHours: 40, // 주 소정 근로시간
    calculationMethod: "auto", // 'auto' | 'comprehensive'
    includedOvertimeHours: 0,
    includedNightHours: 0,
    includedHolidayHours: 0,
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
        overtimeAllowance: result.overtimeAllowance + result.nightAllowance + result.holidayAllowance,
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
        overtimeAllowance: result.overtimePay + result.nightPay + result.holidayPay,
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
            <div className="bg-white p-8 rounded-xl border border-border min-h-[600px] text-sm leading-relaxed">
              <h2 className="text-center text-xl font-bold mb-8">근 로 계 약 서</h2>
              
              <p className="mb-4">
                {isEditing ? (
                  <Input 
                    value={contractData.companyName} 
                    onChange={(e) => setContractData({...contractData, companyName: e.target.value})}
                    className="inline-block w-32 mx-1 h-8" 
                  />
                ) : (
                  <strong>{contractData.companyName}</strong>
                )}
                (대표 {isEditing ? (
                  <Input 
                    value={contractData.representative} 
                    onChange={(e) => setContractData({...contractData, representative: e.target.value})}
                    className="inline-block w-24 mx-1 h-8" 
                  />
                ) : contractData.representative}, 이하 "사업주"이라 한다)과 
                {isEditing ? (
                  <Input 
                    value={contractData.employeeName} 
                    onChange={(e) => setContractData({...contractData, employeeName: e.target.value})}
                    className="inline-block w-24 mx-1 h-8" 
                  />
                ) : <strong> {contractData.employeeName}</strong>}
                (이하 "직원"이라 한다)은(는) 다음과 같이 근로계약을 체결하고 이를 상호 성실히 이행할 것을 약정한다.
              </p>

              <h3 className="font-bold mt-6 mb-2">제1조 【목적】</h3>
              <p>본 계약은 "사업주"의 사업장에서 "직원"이 근로를 제공함에 따라 필요한 제반 근로조건에 관한 사항을 정함을 목적으로 한다.</p>

              <h3 className="font-bold mt-6 mb-2">제2조 【계약기간 및 수습】</h3>
              <p>
                ① 계약기간은 {isEditing ? (
                  <Input type="date" value={contractData.contractStart} onChange={(e) => setContractData({...contractData, contractStart: e.target.value})} className="inline-block w-36 mx-1 h-8" />
                ) : contractData.contractStart} ~ {isEditing ? (
                  <Input type="date" value={contractData.contractEnd} onChange={(e) => setContractData({...contractData, contractEnd: e.target.value})} className="inline-block w-36 mx-1 h-8" />
                ) : contractData.contractEnd} 로 한다.<br/>
                ② 입사 후 3개월은 수습기간으로 하며, 수습기간 중 업무태도, 업무능력 등을 종합적으로 고려하여 본 채용을 거절할 수 있다.
              </p>

              <h3 className="font-bold mt-6 mb-2">제3조 【근무장소 및 업무】</h3>
              <p>
                ① 근무장소 : {isEditing ? (
                  <Input value={contractData.workPlace} onChange={(e) => setContractData({...contractData, workPlace: e.target.value})} className="inline-block w-48 mx-1 h-8" />
                ) : contractData.workPlace}<br/>
                ② 담당업무 : {isEditing ? (
                  <Input value={contractData.workTask} onChange={(e) => setContractData({...contractData, workTask: e.target.value})} className="inline-block w-48 mx-1 h-8" />
                ) : contractData.workTask}
              </p>

              <h3 className="font-bold mt-6 mb-2">제4조 【근로시간 및 휴게】</h3>
              <p>
                ① 근무일: {isEditing ? <Input value={contractData.workDays} onChange={(e) => setContractData({...contractData, workDays: e.target.value})} className="inline-block w-32 mx-1 h-8" /> : contractData.workDays}<br/>
                ② 근로시간: {isEditing ? <Input type="time" value={contractData.workTimeStart} onChange={(e) => setContractData({...contractData, workTimeStart: e.target.value})} className="inline-block w-24 mx-1 h-8" /> : contractData.workTimeStart} ~ {isEditing ? <Input type="time" value={contractData.workTimeEnd} onChange={(e) => setContractData({...contractData, workTimeEnd: e.target.value})} className="inline-block w-24 mx-1 h-8" /> : contractData.workTimeEnd}<br/>
                ③ 휴게시간: {isEditing ? <Input type="time" value={contractData.breakTimeStart} onChange={(e) => setContractData({...contractData, breakTimeStart: e.target.value})} className="inline-block w-24 mx-1 h-8" /> : contractData.breakTimeStart} ~ {isEditing ? <Input type="time" value={contractData.breakTimeEnd} onChange={(e) => setContractData({...contractData, breakTimeEnd: e.target.value})} className="inline-block w-24 mx-1 h-8" /> : contractData.breakTimeEnd}
              </p>

              <h3 className="font-bold mt-6 mb-2">제5조 【임금】</h3>
              <div className="border rounded-lg p-4 bg-gray-50 my-2">
                {isEditing && (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
                    <h4 className="font-semibold mb-2 text-blue-800">급여 계산 방식 설정</h4>
                    
                    <div className="flex space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="calc-auto" 
                          name="calcMethod"
                          checked={contractData.calculationMethod === "auto"}
                          onChange={() => setContractData({...contractData, calculationMethod: "auto"})}
                        />
                        <Label htmlFor="calc-auto" className="text-sm">시급 기준 계산</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="calc-comp" 
                          name="calcMethod"
                          checked={contractData.calculationMethod === "comprehensive"}
                          onChange={() => setContractData({...contractData, calculationMethod: "comprehensive"})}
                        />
                        <Label htmlFor="calc-comp" className="text-sm">포괄임금 역산 (총액 기준)</Label>
                      </div>
                    </div>

                    {contractData.calculationMethod === "comprehensive" ? (
                      <div className="space-y-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">월 총 급여 (원)</Label>
                            <Input 
                              type="number" 
                              value={contractData.totalSalary}
                              onChange={(e) => setContractData({...contractData, totalSalary: parseInt(e.target.value)})}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">비과세 수당 (식대 등)</Label>
                            <Input 
                              type="number" 
                              value={contractData.mealAllowance}
                              onChange={(e) => setContractData({...contractData, mealAllowance: parseInt(e.target.value)})}
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">포함 연장(시간)</Label>
                            <Input 
                              type="number" 
                              value={contractData.includedOvertimeHours}
                              onChange={(e) => setContractData({...contractData, includedOvertimeHours: Number(e.target.value)})}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">포함 야간(시간)</Label>
                            <Input 
                              type="number" 
                              value={contractData.includedNightHours}
                              onChange={(e) => setContractData({...contractData, includedNightHours: Number(e.target.value)})}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">포함 휴일(시간)</Label>
                            <Input 
                              type="number" 
                              value={contractData.includedHolidayHours}
                              onChange={(e) => setContractData({...contractData, includedHolidayHours: Number(e.target.value)})}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="space-y-1">
                          <Label className="text-xs">시급 (원)</Label>
                          <Input 
                            type="number" 
                            value={contractData.hourlyRate}
                            onChange={(e) => setContractData({...contractData, hourlyRate: parseInt(e.target.value)})}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">주 소정 근로시간</Label>
                          <Input 
                            type="number" 
                            value={contractData.weeklyWorkHours}
                            onChange={(e) => setContractData({...contractData, weeklyWorkHours: parseInt(e.target.value)})}
                            className="h-8"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 mb-3">
                      <input 
                        type="checkbox" 
                        id="smallBusiness"
                        checked={contractData.isSmallBusiness}
                        onChange={(e) => setContractData({...contractData, isSmallBusiness: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="smallBusiness" className="text-xs">5인 미만 사업장 (가산수당 미적용)</Label>
                    </div>
                    <Button onClick={handleCalculateSalary} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <DollarSign className="w-3 h-3 mr-1" /> {contractData.calculationMethod === "comprehensive" ? "포괄임금 역산 실행" : "예상 급여 자동 계산"}
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <span>기본급</span>
                  <span className="text-right font-medium">
                    {isEditing ? <Input type="number" value={contractData.baseSalary} onChange={(e) => setContractData({...contractData, baseSalary: Number(e.target.value)})} className="inline-block w-32 h-8 text-right" /> : contractData.baseSalary.toLocaleString()} 원
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <span>식대</span>
                  <span className="text-right font-medium">
                    {isEditing ? <Input type="number" value={contractData.mealAllowance} onChange={(e) => setContractData({...contractData, mealAllowance: Number(e.target.value)})} className="inline-block w-32 h-8 text-right" /> : contractData.mealAllowance.toLocaleString()} 원
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <span>고정 연장근로수당</span>
                  <span className="text-right font-medium">
                    {isEditing ? <Input type="number" value={contractData.overtimeAllowance} onChange={(e) => setContractData({...contractData, overtimeAllowance: Number(e.target.value)})} className="inline-block w-32 h-8 text-right" /> : contractData.overtimeAllowance.toLocaleString()} 원
                  </span>
                </div>
                <div className="border-t pt-2 mt-2 grid grid-cols-2 gap-2 font-bold text-lg">
                  <span>합계 (월급)</span>
                  <span className="text-right text-primary">
                    {(contractData.baseSalary + contractData.mealAllowance + contractData.overtimeAllowance).toLocaleString()} 원
                  </span>
                </div>
              </div>
              <p>
                ② "사업주"는 "직원"에게 매월 {isEditing ? <Input value={contractData.payDay} onChange={(e) => setContractData({...contractData, payDay: e.target.value})} className="inline-block w-12 mx-1 h-8 text-center" /> : contractData.payDay}일에 직원이 설정한 급여계좌로 월급을 지급한다.
              </p>

              <div className="mt-12 text-center">
                <p className="mb-2">2024년 1월 1일</p>
                <div className="flex justify-between px-4 md:px-12 mt-8">
                  <div>
                    <p className="font-bold mb-2">(사업주)</p>
                    <p>{contractData.companyName} 대표 {contractData.representative} (인)</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">(직원)</p>
                    <p>{contractData.employeeName} (인)</p>
                  </div>
                </div>
              </div>
            </div>
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
