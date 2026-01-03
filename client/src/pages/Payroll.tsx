import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateComprehensiveSalary } from "@/lib/comprehensiveSalary";
import { Download, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 초기 데이터 (시뮬레이션용)
const initialPayrollData = [
  {
    id: 1,
    name: "이영희",
    department: "개발팀",
    position: "대리",
    // 포괄임금제 설정
    calculationMethod: "comprehensive",
    totalContractSalary: 3200000, // 월 총액 320만원
    mealAllowance: 200000,
    includedOvertimeHours: 20, // 연장 20시간 포함
    includedNightHours: 0,
    includedHolidayHours: 0,
    // 계산된 결과 (초기값은 0, 렌더링 시 계산)
    baseSalary: 0,
    overtimePay: 0,
    nightPay: 0,
    holidayPay: 0,
    tax: 350000,
    status: "pending",
    email: "lee@example.com"
  },
  {
    id: 2,
    name: "김철수",
    department: "디자인팀",
    position: "사원",
    // 시급제 설정
    calculationMethod: "auto",
    totalContractSalary: 0,
    mealAllowance: 200000,
    includedOvertimeHours: 0,
    includedNightHours: 0,
    includedHolidayHours: 0,
    // 계산된 결과
    baseSalary: 2500000,
    overtimePay: 50000,
    nightPay: 0,
    holidayPay: 0,
    tax: 300000,
    status: "sent",
    email: "kim@example.com"
  }
];

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  
  // 데이터 로드 시 포괄임금제 직원 급여 자동 계산
  const [payrollData, setPayrollData] = useState(() => {
    return initialPayrollData.map(employee => {
      if (employee.calculationMethod === "comprehensive") {
        const result = calculateComprehensiveSalary({
          totalSalary: employee.totalContractSalary,
          nonTaxableAmount: employee.mealAllowance,
          weeklyWorkHours: 40,
          includedOvertimeHours: employee.includedOvertimeHours,
          includedNightHours: employee.includedNightHours,
          includedHolidayHours: employee.includedHolidayHours,
          isSmallBusiness: false
        });
        
        return {
          ...employee,
          baseSalary: result.baseSalary,
          overtimePay: result.overtimeAllowance,
          nightPay: result.nightAllowance,
          holidayPay: result.holidayAllowance,
        };
      }
      return employee;
    });
  });

  const handleSendAll = () => {
    toast.success(`${selectedMonth} 급여 명세서가 일괄 발송되었습니다.`);
    setPayrollData(prev => prev.map(p => ({ ...p, status: "sent" })));
  };

  const handleSendOne = (id: number, name: string) => {
    toast.success(`${name}님에게 급여 명세서를 발송했습니다.`);
    setPayrollData(prev => prev.map(p => p.id === id ? { ...p, status: "sent" } : p));
  };

  // 총 지급액 계산
  const totalPayout = payrollData.reduce((sum, item) => 
    sum + item.baseSalary + item.overtimePay + item.nightPay + item.holidayPay + item.mealAllowance - item.tax, 0
  );

  const sentCount = payrollData.filter(p => p.status === "sent").length;

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">급여 관리</h1>
          <p className="text-muted-foreground">포괄임금 역산 및 근태 기록을 바탕으로 급여를 정산합니다.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button onClick={handleSendAll} className="rounded-xl shadow-lg shadow-primary/20">
            <Send className="w-4 h-4 mr-2" /> 전체 발송
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-blue-600 mb-1">총 실지급액</p>
            <h3 className="text-2xl font-bold text-blue-900">₩ {totalPayout.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-green-600 mb-1">발송 완료</p>
            <h3 className="text-2xl font-bold text-green-900">{sentCount} / {payrollData.length} 명</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-orange-600 mb-1">발송 대기</p>
            <h3 className="text-2xl font-bold text-orange-900">{payrollData.length - sentCount} / {payrollData.length} 명</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>급여 대장 ({selectedMonth})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">연장/야간/휴일</TableHead>
                <TableHead className="text-right">식대</TableHead>
                <TableHead className="text-right">공제액</TableHead>
                <TableHead className="text-right font-bold">실지급액</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item) => {
                const totalAllowances = item.overtimePay + item.nightPay + item.holidayPay;
                const netPay = item.baseSalary + totalAllowances + item.mealAllowance - item.tax;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {item.calculationMethod === "comprehensive" && (
                        <Badge variant="outline" className="ml-2 text-[10px] h-5">포괄</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.department}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-blue-600">+{totalAllowances.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-blue-600">+{item.mealAllowance.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-red-500">-{item.tax.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-bold">{netPay.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={
                        item.status === "sent" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }>
                        {item.status === "sent" ? "발송됨" : "대기중"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>급여 명세서 미리보기</DialogTitle>
                              <DialogDescription>{selectedMonth} 귀속분 급여 명세서입니다.</DialogDescription>
                            </DialogHeader>
                            <div className="border rounded-lg p-6 mt-4 bg-white text-sm">
                              <div className="text-center mb-8 border-b pb-4">
                                <h2 className="text-xl font-bold mb-2">2026년 1월 급여 명세서</h2>
                                <p className="text-muted-foreground">수신자: {item.name} ({item.department})</p>
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                <div>
                                  <h3 className="font-bold mb-4 border-b pb-2">지급 내역</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between"><span>기본급</span><span>{item.baseSalary.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>연장근로수당</span><span>{item.overtimePay.toLocaleString()}</span></div>
                                    {item.nightPay > 0 && <div className="flex justify-between"><span>야간근로수당</span><span>{item.nightPay.toLocaleString()}</span></div>}
                                    {item.holidayPay > 0 && <div className="flex justify-between"><span>휴일근로수당</span><span>{item.holidayPay.toLocaleString()}</span></div>}
                                    <div className="flex justify-between"><span>식대</span><span>{item.mealAllowance.toLocaleString()}</span></div>
                                    <div className="flex justify-between pt-2 border-t font-semibold"><span>지급 합계</span><span>{(item.baseSalary + totalAllowances + item.mealAllowance).toLocaleString()}</span></div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-bold mb-4 border-b pb-2">공제 내역</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between"><span>소득세/4대보험</span><span>{item.tax.toLocaleString()}</span></div>
                                    <div className="flex justify-between pt-2 border-t font-semibold"><span>공제 합계</span><span>{item.tax.toLocaleString()}</span></div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-8 pt-4 border-t flex justify-between items-center font-bold text-lg">
                                <span>실 수령액</span>
                                <span className="text-primary">{netPay.toLocaleString()} 원</span>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button onClick={() => handleSendOne(item.id, item.name)}>
                                <Mail className="w-4 h-4 mr-2" /> 이메일 발송
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleSendOne(item.id, item.name)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
