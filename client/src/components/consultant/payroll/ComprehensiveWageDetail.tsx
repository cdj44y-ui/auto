import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WageComponent {
  name: string;
  hours: number;
  rate: number; // 시급
  multiplier: number; // 가산율 (1.0, 1.5, 0.5 등)
  amount: number;
  note: string;
}

interface ComprehensiveWageDetailProps {
  baseSalary: number; // 월 급여 총액 (비과세 제외)
  fixedOvertimeHours: number; // 월 고정 연장근로시간
  fixedNightHours?: number; // 월 고정 야간근로시간
  fixedHolidayHours?: number; // 월 고정 휴일근로시간
  hourlyRate: number; // 통상시급
}

export default function ComprehensiveWageDetail({ 
  baseSalary, 
  fixedOvertimeHours, 
  fixedNightHours = 0, 
  fixedHolidayHours = 0,
  hourlyRate 
}: ComprehensiveWageDetailProps) {
  
  // 1. 기본급 (주 40시간 -> 월 209시간)
  const baseComponent: WageComponent = {
    name: "기본급 (Base Salary)",
    hours: 209,
    rate: hourlyRate,
    multiplier: 1.0,
    amount: hourlyRate * 209,
    note: "주 40시간 기준 (주휴 포함)"
  };

  // 2. 고정 연장수당
  const overtimeComponent: WageComponent = {
    name: "고정 연장수당",
    hours: fixedOvertimeHours,
    rate: hourlyRate,
    multiplier: 1.5,
    amount: Math.round(hourlyRate * fixedOvertimeHours * 1.5),
    note: `월 ${fixedOvertimeHours}시간 × 1.5배`
  };

  // 3. 고정 야간수당
  const nightComponent: WageComponent = {
    name: "고정 야간수당",
    hours: fixedNightHours,
    rate: hourlyRate,
    multiplier: 0.5,
    amount: Math.round(hourlyRate * fixedNightHours * 0.5),
    note: `월 ${fixedNightHours}시간 × 0.5배 (가산분)`
  };

  // 4. 고정 휴일수당
  const holidayComponent: WageComponent = {
    name: "고정 휴일수당",
    hours: fixedHolidayHours,
    rate: hourlyRate,
    multiplier: 1.5,
    amount: Math.round(hourlyRate * fixedHolidayHours * 1.5),
    note: `월 ${fixedHolidayHours}시간 × 1.5배`
  };

  const components = [baseComponent, overtimeComponent, nightComponent, holidayComponent].filter(c => c.amount > 0);
  const totalAmount = components.reduce((sum, c) => sum + c.amount, 0);

  return (
    <Card className="border shadow-sm bg-white dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <span>포괄임금 구성 상세</span>
          <Badge variant="outline" className="font-normal">통상시급: {hourlyRate.toLocaleString()}원</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead className="w-[140px]">항목</TableHead>
              <TableHead className="text-right">산정시간</TableHead>
              <TableHead className="text-right">가산율</TableHead>
              <TableHead className="text-right">계산금액</TableHead>
              <TableHead className="text-xs text-muted-foreground">산출근거</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((comp, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{comp.name}</TableCell>
                <TableCell className="text-right">{comp.hours}h</TableCell>
                <TableCell className="text-right">×{comp.multiplier}</TableCell>
                <TableCell className="text-right font-bold">{comp.amount.toLocaleString()}원</TableCell>
                <TableCell className="text-xs text-muted-foreground">{comp.note}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-slate-200 dark:border-slate-700">
              <TableCell colSpan={3} className="font-bold text-center">합계 (세전)</TableCell>
              <TableCell className="text-right font-bold text-indigo-600 text-lg">
                {totalAmount.toLocaleString()}원
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-muted-foreground space-y-1">
          <p>• <strong>기본급:</strong> 209시간 = (주 40시간 + 주휴 8시간) × 4.345주</p>
          <p>• <strong>연장근로:</strong> 통상임금의 1.5배 가산 적용 (근로기준법 제56조)</p>
          <p>• <strong>야간근로:</strong> 22:00~06:00 근로 시 통상임금의 0.5배 추가 가산</p>
        </div>
      </CardContent>
    </Card>
  );
}
