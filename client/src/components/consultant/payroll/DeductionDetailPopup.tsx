import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface DeductionItem {
  name: string;
  amount: number;
  rate: string; // 요율 (예: "4.5%")
  baseAmount: number; // 기준소득월액
  formula: string; // 계산식 설명
}

interface DeductionDetailPopupProps {
  workerName: string;
  totalSalary: number; // 과세 대상 급여
  deductions: {
    pension: number;
    health: number;
    care: number;
    employment: number;
    incomeTax: number;
    localTax: number;
  };
}

export default function DeductionDetailPopup({ workerName, totalSalary, deductions }: DeductionDetailPopupProps) {
  // 2026년 가정 요율 (추후 InsuranceRateManager에서 동적 로딩 가능)
  const rates = {
    pension: 0.045, // 4.5%
    health: 0.03545, // 3.545%
    care: 0.1295, // 건강보험료의 12.95%
    employment: 0.009, // 0.9%
  };

  const items: DeductionItem[] = [
    {
      name: "국민연금",
      amount: deductions.pension,
      rate: "4.5%",
      baseAmount: totalSalary,
      formula: `기준소득월액(${totalSalary.toLocaleString()}) × 4.5%`
    },
    {
      name: "건강보험",
      amount: deductions.health,
      rate: "3.545%",
      baseAmount: totalSalary,
      formula: `보수월액(${totalSalary.toLocaleString()}) × 3.545%`
    },
    {
      name: "장기요양보험",
      amount: deductions.care,
      rate: "12.95%",
      baseAmount: deductions.health,
      formula: `건강보험료(${deductions.health.toLocaleString()}) × 12.95%`
    },
    {
      name: "고용보험",
      amount: deductions.employment,
      rate: "0.9%",
      baseAmount: totalSalary,
      formula: `보수월액(${totalSalary.toLocaleString()}) × 0.9%`
    },
    {
      name: "소득세 (간이세액)",
      amount: deductions.incomeTax,
      rate: "-",
      baseAmount: totalSalary,
      formula: "국세청 근로소득 간이세액표 적용"
    },
    {
      name: "지방소득세",
      amount: deductions.localTax,
      rate: "10%",
      baseAmount: deductions.incomeTax,
      formula: `소득세(${deductions.incomeTax.toLocaleString()}) × 10%`
    }
  ];

  const totalDeduction = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-indigo-600">
          <Info className="w-3 h-3 mr-1" /> 공제산출근거
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{workerName}님 공제 상세 내역</DialogTitle>
          <DialogDescription>
            2026년 귀속분 4대보험 요율 및 간이세액표에 따른 산출 근거입니다.
          </DialogDescription>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead>항목</TableHead>
              <TableHead className="text-right">공제액</TableHead>
              <TableHead className="text-right">적용요율</TableHead>
              <TableHead className="text-xs text-muted-foreground">산출식</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right font-bold">{item.amount.toLocaleString()}원</TableCell>
                <TableCell className="text-right text-xs">{item.rate}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.formula}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/50">
              <TableCell colSpan={1} className="font-bold">공제 계</TableCell>
              <TableCell className="text-right font-bold text-red-600 text-lg">
                {totalDeduction.toLocaleString()}원
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 mt-2">
          <p>※ 국민연금 기준소득월액 상한액(617만원) 및 하한액(39만원) 적용 여부를 확인하세요.</p>
          <p>※ 고용보험은 실업급여 요율(0.9%)만 근로자 부담이며, 고용안정/직업능력개발사업 요율은 사업주 전액 부담입니다.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
