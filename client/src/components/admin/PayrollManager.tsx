import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle, FileText, Mail, Loader2 } from "lucide-react";

// Mock Payroll Data
const MOCK_PAYROLL = [
  { id: "PAY001", name: "김철수", dept: "개발팀", base: 4500000, overtime: 350000, total: 4850000, status: "pending" },
  { id: "PAY002", name: "이영희", dept: "디자인팀", base: 3800000, overtime: 120000, total: 3920000, status: "pending" },
  { id: "PAY003", name: "박지민", dept: "마케팅팀", base: 3200000, overtime: 0, total: 3200000, status: "pending" },
  { id: "PAY004", name: "최민수", dept: "영업팀", base: 5100000, overtime: 550000, total: 5650000, status: "pending" },
  { id: "PAY005", name: "정수진", dept: "인사팀", base: 3400000, overtime: 200000, total: 3600000, status: "pending" },
];

export default function PayrollManager() {
  const [payrollData, setPayrollData] = useState(MOCK_PAYROLL);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  const handleSendSlips = () => {
    setIsSending(true);
    setProgress(0);
    setSentCount(0);

    const total = payrollData.length;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      const percentage = Math.round((current / total) * 100);
      
      setProgress(percentage);
      setSentCount(current);
      
      // Update status of current item
      setPayrollData(prev => prev.map((item, idx) => 
        idx === current - 1 ? { ...item, status: 'sent' } : item
      ));

      if (current >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSending(false);
          toast.success(`${total}명의 직원에게 급여 명세서가 발송되었습니다.`);
        }, 500);
      }
    }, 800); // Simulate network delay per email
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">급여 관리</h2>
          <p className="text-sm text-muted-foreground">2026년 1월 급여 대장을 확정하고 명세서를 발송합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("급여 대장 엑셀 다운로드")}>
            <FileText className="w-4 h-4 mr-2" /> 대장 다운로드
          </Button>
          <Button 
            onClick={handleSendSlips} 
            disabled={isSending || payrollData.every(p => p.status === 'sent')}
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
              <span className="text-blue-600 dark:text-blue-400">{sentCount} / {payrollData.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>1월 급여 대장</CardTitle>
          <CardDescription>총 지급액: {formatCurrency(payrollData.reduce((acc, curr) => acc + curr.total, 0))}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">연장수당</TableHead>
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
                  <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                  <TableCell className="text-center">
                    {item.status === 'sent' ? (
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
    </div>
  );
}
