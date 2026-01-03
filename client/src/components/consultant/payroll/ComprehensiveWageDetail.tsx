import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComprehensiveWageDetailProps {
  baseSalary: number;
  overtimeAllowance: number;
  nightAllowance: number;
  holidayAllowance: number;
  baseHourlyRate: number;
  fixedOvertimeHours: number;
  fixedNightHours: number;
  fixedHolidayHours: number;
}

export default function ComprehensiveWageDetail({
  baseSalary,
  overtimeAllowance,
  nightAllowance,
  holidayAllowance,
  baseHourlyRate,
  fixedOvertimeHours,
  fixedNightHours,
  fixedHolidayHours
}: ComprehensiveWageDetailProps) {
  const totalSalary = baseSalary + overtimeAllowance + nightAllowance + holidayAllowance;

  return (
    <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold flex justify-between items-center">
          <span>포괄임금 상세 구성표</span>
          <span className="text-lg text-indigo-600">총액: {totalSalary.toLocaleString()}원</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">항목</TableHead>
              <TableHead className="text-right">산출 시간</TableHead>
              <TableHead className="text-right">산출 식</TableHead>
              <TableHead className="text-right">금액 (원)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">기본급</TableCell>
              <TableCell className="text-right">209시간</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {baseHourlyRate.toLocaleString()}원 × 209
              </TableCell>
              <TableCell className="text-right font-bold">{baseSalary.toLocaleString()}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium text-blue-600">연장근로수당</TableCell>
              <TableCell className="text-right">{fixedOvertimeHours}시간</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {baseHourlyRate.toLocaleString()}원 × {fixedOvertimeHours} × 1.5
              </TableCell>
              <TableCell className="text-right font-bold text-blue-600">{overtimeAllowance.toLocaleString()}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium text-purple-600">야간근로수당</TableCell>
              <TableCell className="text-right">{fixedNightHours}시간</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {baseHourlyRate.toLocaleString()}원 × {fixedNightHours} × 0.5
              </TableCell>
              <TableCell className="text-right font-bold text-purple-600">{nightAllowance.toLocaleString()}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium text-orange-600">휴일근로수당</TableCell>
              <TableCell className="text-right">{fixedHolidayHours}시간</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {baseHourlyRate.toLocaleString()}원 × {fixedHolidayHours} × 1.5
              </TableCell>
              <TableCell className="text-right font-bold text-orange-600">{holidayAllowance.toLocaleString()}</TableCell>
            </TableRow>

            <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
              <TableCell colSpan={3} className="text-center">합계</TableCell>
              <TableCell className="text-right">{totalSalary.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>* 통상시급: {baseHourlyRate.toLocaleString()}원 (2025년 최저시급 10,030원 이상 준수)</p>
          <p>* 야간수당은 연장근로와 중복 시 0.5배 가산분만 별도 표기된 금액입니다.</p>
        </div>
      </CardContent>
    </Card>
  );
}
