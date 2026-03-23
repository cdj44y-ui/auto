import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WeeklyWorkHoursWidgetProps {
  currentHours: number; // 현재 누적 근무시간 (소정근로)
  overtimeHours: number; // 연장근무 시간
  maxHours?: number; // 최대 근무시간 (기본 52시간)
}

export default function WeeklyWorkHoursWidget({ 
  currentHours = 38, 
  overtimeHours = 4, 
  maxHours = 52 
}: WeeklyWorkHoursWidgetProps) {
  const totalHours = currentHours + overtimeHours;
  const remainingHours = maxHours - totalHours;
  const progressPercentage = (totalHours / maxHours) * 100;
  
  // 위험도 상태 결정
  let status: "safe" | "warning" | "danger" = "safe";
  if (totalHours >= 50) status = "danger";
  else if (totalHours >= 45) status = "warning";

  const getStatusColor = () => {
    switch (status) {
      case "danger": return "bg-red-500";
      case "warning": return "bg-orange-500";
      default: return "bg-primary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "danger": return "초과 위험";
      case "warning": return "주의 필요";
      default: return "정상";
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-stone-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold dark:text-stone-100">
            <Clock className="w-5 h-5 text-primary" />
            이번 주 근무 현황 (주 52시간)
          </CardTitle>
          <Badge variant={status === "safe" ? "outline" : "destructive"} className="gap-1">
            {status !== "safe" && <AlertTriangle className="w-3 h-3" />}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold tabular-nums dark:text-stone-100">{totalHours}</span>
              <span className="text-muted-foreground ml-1">/ {maxHours}시간</span>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              잔여 <span className="font-bold text-stone-900 dark:text-stone-100">{remainingHours}시간</span>
            </div>
          </div>

          <div className="relative pt-1">
            <Progress value={progressPercentage} className={`h-3 ${status === 'danger' ? '[&>div]:bg-red-500' : status === 'warning' ? '[&>div]:bg-orange-500' : '[&>div]:bg-primary'}`} />
            
            {/* 40시간, 52시간 마커 */}
            <div className="absolute top-0 left-[76.9%] h-full w-px bg-stone-300 dark:bg-stone-600 -translate-y-1">
              <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-stone-500">40h</span>
            </div>
            <div className="absolute top-0 right-0 h-full w-px bg-red-300 dark:bg-red-900 -translate-y-1">
              <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-red-500">52h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                소정근로
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>기본 근무시간 (최대 40시간)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-semibold dark:text-stone-200">{currentHours}h</p>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                연장근무
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>승인된 초과 근무시간 (최대 12시간)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className={`text-lg font-semibold ${overtimeHours > 10 ? 'text-red-500' : 'text-primary'}`}>
                {overtimeHours}h
              </p>
            </div>
          </div>
          
          {status === "danger" && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                주 52시간 초과 위험이 있습니다. 추가 연장근무 신청이 제한될 수 있습니다. 관리자와 상담하세요.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
