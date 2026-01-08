import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { calculateFiscalYearLeave, calculateJoinDateLeave, LeaveCalculationMethod } from "@/lib/annual-leave";
import { Download, Search, Calendar, Calculator, Mail, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';

// Mock Employee Data
const MOCK_EMPLOYEES = [
  { id: "EMP001", name: "김철수", department: "개발팀", joinDate: "2020-03-01", position: "과장", email: "kim@company.com" },
  { id: "EMP002", name: "이영희", department: "디자인팀", joinDate: "2023-07-15", position: "대리", email: "lee@company.com" },
  { id: "EMP003", name: "박지민", department: "마케팅팀", joinDate: "2025-01-01", position: "사원", email: "park@company.com" },
  { id: "EMP004", name: "최민수", department: "영업팀", joinDate: "2018-11-20", position: "차장", email: "choi@company.com" },
  { id: "EMP005", name: "정수진", department: "인사팀", joinDate: "2024-05-10", position: "사원", email: "jung@company.com" },
];

// Mock Usage Data (월별 사용일수 - 소수점 지원)
const MOCK_USAGE = {
  "EMP001": { 1: 1.5, 2: 0, 3: 2.25, 4: 1, 5: 0, 6: 3, 7: 2, 8: 5, 9: 0, 10: 1, 11: 0, 12: 2 },
  "EMP002": { 1: 0, 2: 1, 3: 0, 4: 0.5, 5: 1, 6: 0, 7: 2, 8: 3, 9: 1, 10: 0, 11: 0, 12: 1 },
  "EMP003": { 1: 0, 2: 1, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, // 1년 미만
  "EMP004": { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2 },
  "EMP005": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
};

// Mock Substitute Holiday Data (대체휴무 적립)
const MOCK_SUBSTITUTE = {
  "EMP001": 1.5,
  "EMP004": 2.0,
};

export default function AnnualLeaveLedger() {
  const [method, setMethod] = useState<LeaveCalculationMethod>('fiscal_year');
  const [baseDate, setBaseDate] = useState(`${new Date().getFullYear()}-12-31`);
  const [searchTerm, setSearchTerm] = useState("");
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const ledgerData = useMemo(() => {
    return MOCK_EMPLOYEES.map((emp, index) => {
      let leaveInfo;
      if (method === 'fiscal_year') {
        leaveInfo = calculateFiscalYearLeave(emp.joinDate, baseDate);
      } else {
        leaveInfo = calculateJoinDateLeave(emp.joinDate, baseDate);
      }

      const substitute = MOCK_SUBSTITUTE[emp.id as keyof typeof MOCK_SUBSTITUTE] || 0;
      const totalGenerated = leaveInfo.annual + leaveInfo.monthly + substitute;
      const usage = MOCK_USAGE[emp.id as keyof typeof MOCK_USAGE] || {};
      const totalUsed = Object.values(usage).reduce((a, b) => a + b, 0);
      const remaining = totalGenerated - totalUsed;

      return {
        no: index + 1,
        ...emp,
        yearsOfService: leaveInfo.years,
        prevRemaining: 0, // 전년도 잔여 (Mock)
        generated: leaveInfo.annual + leaveInfo.monthly,
        substitute,
        total: totalGenerated, // + 전년도 잔여
        usage,
        totalUsed,
        remaining
      };
    }).filter(emp => 
      emp.name.includes(searchTerm) || 
      emp.department.includes(searchTerm)
    );
  }, [method, baseDate, searchTerm]);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ledgerData.map(item => ({
      "연번": item.no,
      "성명": item.name,
      "부서": item.department,
      "직급": item.position,
      "입사일": item.joinDate,
      "근속년수": item.yearsOfService,
      "발생연차": item.generated,
      "대체휴무": item.substitute,
      "총발생": item.total,
      "총사용일수": item.totalUsed,
      "잔여일수": item.remaining,
      ...Object.fromEntries(Object.entries(item.usage).map(([k, v]) => [`${k}월`, v]))
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "연차관리대장");
    XLSX.writeFile(wb, `연차관리대장_${method === 'fiscal_year' ? '회계연도' : '입사일'}_${baseDate}.xlsx`);
  };

  const handlePromotion = () => {
    // 실제로는 이메일 발송 API 호출
    alert(`${selectedEmployees.length}명에게 연차 사용 촉진 통지서를 발송했습니다.`);
    setPromotionDialogOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">연차유급휴가 관리대장</CardTitle>
            <CardDescription>
              전 직원의 연차 발생, 사용(반차/반반차 포함), 잔여 현황을 통합 관리합니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                  <Mail className="w-4 h-4 mr-2" /> 연차 촉진 통지
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>연차 사용 촉진 통지서 발송</DialogTitle>
                  <DialogDescription>
                    근로기준법 제61조에 의거하여 미사용 연차에 대한 사용 촉진 통지서를 발송합니다.
                    <br />
                    대상자는 잔여 연차가 남아있는 직원들입니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="bg-slate-50 p-4 rounded-lg border mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" /> 발송 대상자 (잔여 연차 보유자)
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {ledgerData.filter(emp => emp.remaining > 0).map(emp => (
                        <div key={emp.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                          <span>{emp.name} ({emp.department})</span>
                          <span className="font-medium text-orange-600">잔여: {emp.remaining}일</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    * 통지서는 이메일과 카카오 알림톡으로 동시 발송됩니다.
                    <br />
                    * 직원은 수신 후 10일 이내에 사용 시기를 지정하여 회신해야 합니다.
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPromotionDialogOpen(false)}>취소</Button>
                  <Button onClick={handlePromotion} className="bg-orange-600 hover:bg-orange-700">
                    일괄 발송하기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" /> 엑셀 다운로드
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">계산 기준 선택</label>
              <Tabs value={method} onValueChange={(v) => setMethod(v as LeaveCalculationMethod)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fiscal_year">회계연도 기준 (매년 1.1)</TabsTrigger>
                  <TabsTrigger value="join_date">입사일 기준 (개인별)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" /> 기준일자
              </label>
              <Input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
            </div>

            <div className="w-full md:w-64 space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Search className="w-4 h-4" /> 직원 검색
              </label>
              <Input 
                placeholder="이름 또는 부서 검색" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-[50px] text-center fixed-col bg-slate-100 dark:bg-slate-800 z-10">No</TableHead>
                  <TableHead className="w-[100px] text-center fixed-col-2 bg-slate-100 dark:bg-slate-800 z-10">성명</TableHead>
                  <TableHead className="w-[100px] text-center">입사일</TableHead>
                  <TableHead className="w-[80px] text-center">근속년수</TableHead>
                  <TableHead className="w-[80px] text-center bg-blue-50 dark:bg-blue-900/20">기본발생</TableHead>
                  <TableHead className="w-[80px] text-center bg-purple-50 dark:bg-purple-900/20">대체휴무</TableHead>
                  <TableHead className="w-[80px] text-center bg-blue-100 dark:bg-blue-900/40 font-bold">총계</TableHead>
                  {Array.from({ length: 12 }, (_, i) => (
                    <TableHead key={i} className="w-[50px] text-center text-xs text-muted-foreground">{i + 1}월</TableHead>
                  ))}
                  <TableHead className="w-[80px] text-center bg-orange-50 dark:bg-orange-900/20">사용일수</TableHead>
                  <TableHead className="w-[80px] text-center bg-green-50 dark:bg-green-900/20 font-bold">잔여일수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <TableCell className="text-center font-medium fixed-col bg-white dark:bg-slate-950">{row.no}</TableCell>
                    <TableCell className="text-center font-medium fixed-col-2 bg-white dark:bg-slate-950">
                      <div>{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.position}</div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{row.joinDate}</TableCell>
                    <TableCell className="text-center">{row.yearsOfService}년</TableCell>
                    <TableCell className="text-center text-blue-600 dark:text-blue-400 bg-blue-50/30">{row.generated}</TableCell>
                    <TableCell className="text-center text-purple-600 dark:text-purple-400 bg-purple-50/30">
                      {row.substitute > 0 ? `+${row.substitute}` : '-'}
                    </TableCell>
                    <TableCell className="text-center font-bold bg-blue-100/30">{row.total}</TableCell>
                    
                    {/* Monthly Usage */}
                    {Array.from({ length: 12 }, (_, i) => (
                      <TableCell key={i} className="text-center text-xs text-muted-foreground">
                        {row.usage[i + 1] > 0 ? (
                          <span className="text-slate-900 dark:text-slate-100 font-medium">{row.usage[i + 1]}</span>
                        ) : "-"}
                      </TableCell>
                    ))}

                    <TableCell className="text-center font-bold text-orange-600 dark:text-orange-400 bg-orange-50/30">{row.totalUsed}</TableCell>
                    <TableCell className="text-center font-bold text-green-600 dark:text-green-400 bg-green-50/30">{row.remaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <Calculator className="w-4 h-4" />
            <span>
              <strong>계산 로직 안내:</strong> 
              {method === 'fiscal_year' 
                ? " 회계연도 기준은 매년 1월 1일 기준으로 근속년수를 산정하며, 1년 미만자는 입사일로부터 12월 31일까지의 기간에 비례하여 연차를 부여합니다." 
                : " 입사일 기준은 직원의 개별 입사일로부터 1년이 되는 시점마다 법정 연차가 발생합니다."}
              <br />
              * 반차(0.5일), 반반차(0.25일) 사용 및 대체휴무 적립분이 포함된 내역입니다.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
