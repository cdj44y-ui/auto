import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Send, Printer, FileText } from "lucide-react";

// 모의 급여대장 데이터
const payrollData = [
  { id: 1, name: "김철수", department: "개발팀", baseSalary: 2800000, fixedOvertime: 700000, overtimePay: 150000, nightPay: 50000, holidayPay: 0, mealAllowance: 200000, totalPay: 3900000, tax: 350000, insurance: 320000, netPay: 3230000, status: "completed" },
  { id: 2, name: "이영희", department: "디자인팀", baseSalary: 3200000, fixedOvertime: 0, overtimePay: 0, nightPay: 0, holidayPay: 0, mealAllowance: 200000, totalPay: 3400000, tax: 280000, insurance: 290000, netPay: 2830000, status: "completed" },
  { id: 3, name: "박지민", department: "마케팅팀", baseSalary: 1800000, fixedOvertime: 0, overtimePay: 50000, nightPay: 0, holidayPay: 0, mealAllowance: 0, totalPay: 1850000, tax: 50000, insurance: 160000, netPay: 1640000, status: "pending" },
];

export default function ConsultantPayrollRegister({ companyId }: { companyId: string | null }) {
  const totalAmount = payrollData.reduce((sum, item) => sum + item.totalPay, 0);
  const totalNetPay = payrollData.reduce((sum, item) => sum + item.netPay, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">총 지급액 (세전)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">₩ {totalAmount.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">총 실지급액 (세후)</p>
            <h3 className="text-2xl font-bold text-indigo-600">₩ {totalNetPay.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">정산 인원</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{payrollData.length}명</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>2026년 1월 급여대장</CardTitle>
            <CardDescription>최종 산출된 급여 내역입니다. 확정 후 고객사에게 발송할 수 있습니다.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" /> 인쇄
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> 엑셀 다운로드
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 mr-2" /> 고객사 발송
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900">
                <TableHead>이름/부서</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">고정OT</TableHead>
                <TableHead className="text-right">변동수당(연장/야간)</TableHead>
                <TableHead className="text-right">식대/비과세</TableHead>
                <TableHead className="text-right font-bold text-blue-600">지급총액</TableHead>
                <TableHead className="text-right text-red-600">공제총액</TableHead>
                <TableHead className="text-right font-bold text-indigo-600">실지급액</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-center">명세서</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.department}</div>
                  </TableCell>
                  <TableCell className="text-right">{item.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.fixedOvertime.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(item.overtimePay + item.nightPay + item.holidayPay).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.mealAllowance.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{item.totalPay.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-red-600">{(item.tax + item.insurance).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-indigo-600">{item.netPay.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'} className={item.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {item.status === 'completed' ? '확정' : '검토중'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </Button>
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
