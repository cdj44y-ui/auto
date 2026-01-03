import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { TableVirtuoso } from "react-virtuoso";

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

interface VirtualPayrollTableProps {
  data: PayrollItem[];
  height?: number;
}

export default function VirtualPayrollTable({ data, height = 500 }: VirtualPayrollTableProps) {
  return (
    <div className="border rounded-md bg-white">
      <TableVirtuoso
        style={{ height: height }}
        data={data}
        fixedHeaderContent={() => (
          <tr className="bg-slate-50 h-10 text-xs font-medium text-muted-foreground border-b">
            <th className="w-[100px] px-4 text-left">이름</th>
            <th className="w-[120px] px-4 text-left">부서</th>
            <th className="w-[120px] px-4 text-right">기본급</th>
            <th className="w-[120px] px-4 text-right">수당</th>
            <th className="w-[120px] px-4 text-right">공제</th>
            <th className="w-[120px] px-4 text-right">실지급액</th>
            <th className="w-[100px] px-4 text-center">상태</th>
            <th className="px-4 text-right">관리</th>
          </tr>
        )}
        itemContent={(index, item) => (
          <>
            <td className="px-4 py-3 border-b font-medium truncate">{item.name}</td>
            <td className="px-4 py-3 border-b text-muted-foreground truncate">{item.department}</td>
            <td className="px-4 py-3 border-b text-right tabular-nums">{item.baseSalary.toLocaleString()}</td>
            <td className="px-4 py-3 border-b text-right tabular-nums text-blue-600">+{item.allowances.toLocaleString()}</td>
            <td className="px-4 py-3 border-b text-right tabular-nums text-red-500">-{item.deductions.toLocaleString()}</td>
            <td className="px-4 py-3 border-b text-right tabular-nums font-bold">{item.netPay.toLocaleString()}</td>
            <td className="px-4 py-3 border-b text-center">
              <Badge variant="secondary" className={
                item.status === "sent" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }>
                {item.status === "sent" ? "발송됨" : "대기중"}
              </Badge>
            </td>
            <td className="px-4 py-3 border-b text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
