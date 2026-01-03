import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { memo } from "react";
import * as ReactWindow from "react-window";

// @ts-ignore
const List = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList;

interface PayrollItem {
  id: number;
  name: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "sent" | "pending";
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: PayrollItem[];
}

// 렌더링 성능 최적화를 위해 memo 사용
const Row = memo(({ index, style, data }: RowProps) => {
  const item = data[index];
  
  return (
    <div style={style} className="flex items-center border-b hover:bg-slate-50 transition-colors px-4 text-sm">
      <div className="w-[100px] font-medium truncate">{item.name}</div>
      <div className="w-[120px] text-muted-foreground truncate">{item.department}</div>
      <div className="w-[120px] text-right tabular-nums">{item.baseSalary.toLocaleString()}</div>
      <div className="w-[120px] text-right tabular-nums text-blue-600">+{item.allowances.toLocaleString()}</div>
      <div className="w-[120px] text-right tabular-nums text-red-500">-{item.deductions.toLocaleString()}</div>
      <div className="w-[120px] text-right tabular-nums font-bold">{item.netPay.toLocaleString()}</div>
      <div className="w-[100px] text-center">
        <Badge variant="secondary" className={
          item.status === "sent" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
        }>
          {item.status === "sent" ? "발송됨" : "대기중"}
        </Badge>
      </div>
      <div className="flex-1 flex justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
          <Mail className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

interface VirtualPayrollTableProps {
  data: PayrollItem[];
  height?: number;
}

export default function VirtualPayrollTable({ data, height = 500 }: VirtualPayrollTableProps) {
  return (
    <div className="border rounded-md bg-white">
      {/* 헤더 */}
      <div className="flex items-center border-b bg-slate-50 px-4 h-10 text-xs font-medium text-muted-foreground">
        <div className="w-[100px]">이름</div>
        <div className="w-[120px]">부서</div>
        <div className="w-[120px] text-right">기본급</div>
        <div className="w-[120px] text-right">수당</div>
        <div className="w-[120px] text-right">공제</div>
        <div className="w-[120px] text-right">실지급액</div>
        <div className="w-[100px] text-center">상태</div>
        <div className="flex-1 text-right">관리</div>
      </div>

      {/* 가상 스크롤 리스트 */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={50} // 행 높이
        width="100%"
        itemData={data}
      >
        {Row}
      </List>
    </div>
  );
}
