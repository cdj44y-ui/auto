import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle, FileText, Mail, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Mock Payroll Data for display (since we need employees first)
const MOCK_PAYROLL = [
  { id: 1, employeeId: 1, name: "김철수", dept: "개발팀", email: "kim@tech.com", base: 4500000, overtime: 350000, bonus: 0, deductions: 500000, total: 4350000, status: "pending", slipSent: false },
  { id: 2, employeeId: 2, name: "이영희", dept: "디자인팀", email: "lee@tech.com", base: 3800000, overtime: 120000, bonus: 0, deductions: 420000, total: 3500000, status: "pending", slipSent: false },
  { id: 3, employeeId: 3, name: "박지민", dept: "마케팅팀", email: "park@global.com", base: 3200000, overtime: 0, bonus: 100000, deductions: 350000, total: 2950000, status: "pending", slipSent: false },
  { id: 4, employeeId: 4, name: "최민수", dept: "영업팀", email: "choi@global.com", base: 5100000, overtime: 550000, bonus: 200000, deductions: 600000, total: 5250000, status: "pending", slipSent: false },
  { id: 5, employeeId: 5, name: "정수진", dept: "인사팀", email: "jung@future.com", base: 3400000, overtime: 200000, bonus: 0, deductions: 380000, total: 3220000, status: "pending", slipSent: false },
];

export default function PayrollManager() {
  const [payrollData, setPayrollData] = useState(MOCK_PAYROLL);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("202601");

  // Bulk send mutation
  const bulkSendMutation = trpc.payroll.bulkSendPayslips.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.sent}명의 직원에게 급여 명세서가 발송되었습니다.`);
      if (data.failed > 0) {
        toast.warning(`${data.failed}명의 발송이 실패했습니다.`);
      }
    },
    onError: (error) => {
      toast.error(`발송 실패: ${error.message}`);
    },
  });

  const handleSendSlips = async () => {
    setIsSending(true);
    setProgress(0);
    setSentCount(0);

    const pendingItems = payrollData.filter(p => !p.slipSent);
    const total = pendingItems.length;

    if (total === 0) {
      toast.info("발송할 명세서가 없습니다.");
      setIsSending(false);
      return;
    }

    // Simulate progress for better UX
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      const percentage = Math.round((current / total) * 100);
      
      setProgress(percentage);
      setSentCount(current);
      
      // Update status of current item
      const itemToUpdate = pendingItems[current - 1];
      if (itemToUpdate) {
        setPayrollData(prev => prev.map(item => 
          item.id === itemToUpdate.id ? { ...item, slipSent: true, status: 'sent' } : item
        ));
      }

      if (current >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSending(false);
          toast.success(`${total}명의 직원에게 급여 명세서가 발송되었습니다.`);
        }, 500);
      }
    }, 600);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const totalAmount = useMemo(() => 
    payrollData.reduce((acc, curr) => acc + curr.total, 0), 
    [payrollData]
  );

  const periodOptions = [
    { value: "202601", label: "2026년 1월" },
    { value: "202512", label: "2025년 12월" },
    { value: "202511", label: "2025년 11월" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">급여 관리</h2>
          <p className="text-sm text-muted-foreground">급여 대장을 확정하고 명세서를 발송합니다.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.info("급여 대장 엑셀 다운로드 기능 준비 중")}>
            <FileText className="w-4 h-4 mr-2" /> 대장 다운로드
          </Button>
          <Button 
            onClick={handleSendSlips} 
            disabled={isSending || payrollData.every(p => p.slipSent)}
            className={isSending ? "w-[180px]" : ""}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 발송 중...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" /> 명세서 일괄 발송
              </>
            )}
          </Button>
        </div>
      </div>

      {isSending && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <CardContent className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-blue-700 dark:text-blue-300">명세서 발송 진행 중...</span>
              <span className="text-blue-600 dark:text-blue-400">{sentCount} / {payrollData.filter(p => !p.slipSent || p.status === 'sent').length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{periodOptions.find(p => p.value === selectedPeriod)?.label} 급여 대장</CardTitle>
          <CardDescription>총 지급액: {formatCurrency(totalAmount)}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">연장수당</TableHead>
                <TableHead className="text-right">공제액</TableHead>
                <TableHead className="text-right font-bold">실지급액</TableHead>
                <TableHead className="text-center">발송 상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.dept}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(item.base)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(item.overtime)}</TableCell>
                  <TableCell className="text-right text-red-500">-{formatCurrency(item.deductions)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                  <TableCell className="text-center">
                    {item.slipSent ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 발송완료
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground gap-1">
                        <AlertCircle className="w-3 h-3" /> 대기중
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">이메일 발송 안내</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                실제 이메일 발송을 위해서는 SMTP 서버 설정이 필요합니다. 
                현재는 발송 시뮬레이션 모드로 동작하며, 발송 기록은 데이터베이스에 저장됩니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
