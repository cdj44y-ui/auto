import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateComprehensiveSalary } from "@/lib/comprehensiveSalary";
import { Send, Settings, Briefcase } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import ExcelPayrollUpload from "@/components/payroll/ExcelPayrollUpload";
import ManualWorkLogCalculator from "@/components/payroll/ManualWorkLogCalculator";
import PayrollSettings from "@/components/payroll/PayrollSettings";
import VirtualPayrollTable from "@/components/payroll/VirtualPayrollTable";
import SeveranceAndTransfer from "@/components/payroll/SeveranceAndTransfer";
import { calculateTaxes } from "@/lib/taxEngine";

// 대용량 데이터 생성 (시뮬레이션: 10,000명)
const generateLargeData = () => {
  return Array.from({ length: 10000 }, (_, i) => {
    const baseSalary = 2500000 + Math.floor(Math.random() * 3000000);
    const allowances = Math.floor(Math.random() * 500000);
    const taxResult = calculateTaxes(baseSalary + allowances);
    
    return {
      id: i + 1,
      name: `직원${i + 1}`,
      department: ["개발팀", "디자인팀", "영업팀", "인사팀"][Math.floor(Math.random() * 4)],
      baseSalary,
      allowances,
      deductions: taxResult.totalDeduction,
      netPay: baseSalary + allowances - taxResult.totalDeduction,
      status: Math.random() > 0.3 ? "sent" : "pending" as "sent" | "pending"
    };
  });
};

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [activeTab, setActiveTab] = useState("system");
  
  // 대용량 데이터 메모이제이션
  const payrollData = useMemo(() => generateLargeData(), []);

  const handleSendAll = () => {
    toast.success(`${selectedMonth} 급여 명세서가 일괄 발송되었습니다. (대상: ${payrollData.length}명)`);
  };

  // 총 지급액 계산
  const totalPayout = useMemo(() => 
    payrollData.reduce((sum, item) => sum + item.netPay, 0), 
    [payrollData]
  );

  const sentCount = useMemo(() => 
    payrollData.filter(p => p.status === "sent").length, 
    [payrollData]
  );

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">급여 관리</h1>
          <p className="text-muted-foreground">
            엔터프라이즈급 대용량 급여 처리 및 정밀 세무 정산 시스템
          </p>
        </div>
        <div className="flex gap-3">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="system">시스템 정산</TabsTrigger>
          <TabsTrigger value="excel">엑셀 일괄</TabsTrigger>
          <TabsTrigger value="manual">간편 수동</TabsTrigger>
          <TabsTrigger value="severance" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> 퇴직금/이체
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> 환경 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
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
                <h3 className="text-2xl font-bold text-green-900">{sentCount.toLocaleString()} 명</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-orange-50">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-orange-600 mb-1">발송 대기</p>
                <h3 className="text-2xl font-bold text-orange-900">{(payrollData.length - sentCount).toLocaleString()} 명</h3>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              총 <span className="font-bold text-foreground">{payrollData.length.toLocaleString()}</span>명의 급여 데이터가 로드되었습니다.
            </div>
            <Button onClick={handleSendAll} className="rounded-xl shadow-lg shadow-primary/20">
              <Send className="w-4 h-4 mr-2" /> 전체 발송
            </Button>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>급여 대장 ({selectedMonth})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* 가상 스크롤 테이블 적용 */}
              <VirtualPayrollTable data={payrollData} height={600} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="excel">
          <ExcelPayrollUpload />
        </TabsContent>

        <TabsContent value="manual">
          <ManualWorkLogCalculator />
        </TabsContent>

        <TabsContent value="severance">
          <SeveranceAndTransfer />
        </TabsContent>

        <TabsContent value="settings">
          <PayrollSettings />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
