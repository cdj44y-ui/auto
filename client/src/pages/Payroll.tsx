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
import { Download, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const payrollData = [
  { id: 1, name: "이영희", department: "개발팀", baseSalary: 3000000, overtimePay: 150000, mealAllowance: 200000, tax: 350000, total: 3000000, status: "sent" },
  { id: 2, name: "김철수", department: "디자인팀", baseSalary: 2800000, overtimePay: 50000, mealAllowance: 200000, tax: 300000, total: 2750000, status: "pending" },
  { id: 3, name: "박신입", department: "개발팀", baseSalary: 2500000, overtimePay: 300000, mealAllowance: 200000, tax: 280000, total: 2720000, status: "pending" },
];

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("2026-01");

  const handleSendAll = () => {
    toast.success(`${selectedMonth} 급여 명세서가 일괄 발송되었습니다.`);
  };

  const handleSendOne = (name: string) => {
    toast.success(`${name}님에게 급여 명세서를 발송했습니다.`);
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">급여 관리</h1>
          <p className="text-muted-foreground">근태 기록을 바탕으로 급여를 정산하고 명세서를 발송합니다.</p>
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
            <p className="text-sm font-medium text-blue-600 mb-1">총 지급액</p>
            <h3 className="text-2xl font-bold text-blue-900">₩ 8,470,000</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-green-600 mb-1">발송 완료</p>
            <h3 className="text-2xl font-bold text-green-900">1 / 3 명</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-orange-600 mb-1">발송 대기</p>
            <h3 className="text-2xl font-bold text-orange-900">2 / 3 명</h3>
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
                <TableHead className="text-right">초과근무수당</TableHead>
                <TableHead className="text-right">식대</TableHead>
                <TableHead className="text-right">공제액(세금 등)</TableHead>
                <TableHead className="text-right font-bold">실지급액</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.department}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums text-blue-600">+{item.overtimePay.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums text-blue-600">+{item.mealAllowance.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums text-red-500">-{item.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold">{item.total.toLocaleString()}</TableCell>
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
                                  <div className="flex justify-between"><span>초과근무수당</span><span>{item.overtimePay.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>식대</span><span>{item.mealAllowance.toLocaleString()}</span></div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold mb-4 border-b pb-2">공제 내역</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between"><span>소득세/4대보험</span><span>{item.tax.toLocaleString()}</span></div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-8 pt-4 border-t flex justify-between items-center font-bold text-lg">
                              <span>실 수령액</span>
                              <span className="text-primary">{item.total.toLocaleString()} 원</span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button onClick={() => handleSendOne(item.name)}>
                              <Mail className="w-4 h-4 mr-2" /> 이메일 발송
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleSendOne(item.name)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
