import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  expired:   "bg-stone-100 text-stone-500 border border-stone-200",
  completed: "bg-orange-50/30 text-orange-700 border border-orange-200/30",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
  "근무중":   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "미출근":   "bg-red-50 text-red-600 border border-red-200",
  "지각":     "bg-amber-50 text-amber-700 border border-amber-200",
  "정상":     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "퇴근":     "bg-stone-100 text-stone-500 border border-stone-200",
  "휴식":     "bg-sky-50 text-sky-700 border border-sky-200",
  "초과근무": "bg-orange-50 text-orange-700 border border-orange-200",
  "승인":     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "반려":     "bg-red-50 text-red-600 border border-red-200",
  "대기":     "bg-amber-50 text-amber-700 border border-amber-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-stone-100 text-stone-600 border border-stone-200";
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      style,
      className
    )}>
      {status}
    </span>
  );
}
