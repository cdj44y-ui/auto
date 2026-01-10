import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Clock, CalendarDays, Save } from "lucide-react";

interface CoreTimeConfig {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: string[]; // 'Mon', 'Tue', etc.
}

export default function CoreTimeSettings() {
  const [config, setConfig] = useState<CoreTimeConfig>({
    enabled: true,
    startTime: "10:00",
    endTime: "16:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });

  const weekDays = [
    { id: "Mon", label: "월" },
    { id: "Tue", label: "화" },
    { id: "Wed", label: "수" },
    { id: "Thu", label: "목" },
    { id: "Fri", label: "금" },
    { id: "Sat", label: "토" },
    { id: "Sun", label: "일" },
  ];

  const toggleDay = (dayId: string) => {
    setConfig(prev => {
      const newDays = prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId];
      return { ...prev, days: newDays };
    });
  };

  const handleSave = () => {
    // 실제 API 호출 로직이 들어갈 곳
    console.log("Saving core time config:", config);
    toast.success("코어 근무시간 설정이 저장되었습니다.");
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <div>
              <CardTitle>코어 근무시간 설정</CardTitle>
              <CardDescription>선택적 근무제 대상자가 반드시 근무해야 하는 시간대입니다.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="core-time-enabled" className="text-sm font-medium">사용</Label>
            <Switch 
              id="core-time-enabled" 
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`space-y-6 transition-opacity duration-200 ${config.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">시작 시간</Label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={config.startTime}
                  onChange={(e) => setConfig(prev => ({ ...prev, startTime: e.target.value }))}
                  className="pl-10"
                />
                <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">종료 시간</Label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={config.endTime}
                  onChange={(e) => setConfig(prev => ({ ...prev, endTime: e.target.value }))}
                  className="pl-10"
                />
                <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              적용 요일
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`
                    w-10 h-10 rounded-full text-sm font-medium transition-all
                    ${config.days.includes(day.id)
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }
                  `}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * 선택된 요일의 해당 시간대에는 휴게시간을 제외하고 반드시 근무해야 합니다.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              설정 저장
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
