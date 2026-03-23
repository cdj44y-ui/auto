import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Save, History, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// 연도별 요율 데이터 (실제로는 DB에서 관리)
const initialRates = {
  2025: {
    pension: 4.5,
    health: 3.545,
    care: 12.95, // 건강보험료 대비
    employment: 0.9,
    minWage: 10030
  },
  2026: {
    pension: 4.5,
    health: 3.545, // 동결 가정
    care: 13.05, // 인상 가정
    employment: 0.9,
    minWage: 10350
  }
};

export default function InsuranceRateManager() {
  const [year, setYear] = useState("2026");
  const [rates, setRates] = useState(initialRates[2026]);
  const [isAutoUpdate, setIsAutoUpdate] = useState(true);

  const handleRateChange = (field: string, value: string) => {
    setRates({ ...rates, [field]: parseFloat(value) });
    setIsAutoUpdate(false); // 수동 수정 시 자동 업데이트 해제
  };

  const handleAutoUpdate = () => {
    // API 호출 시뮬레이션
    setTimeout(() => {
      setRates(initialRates[2026]);
      setIsAutoUpdate(true);
      toast.success("최신 법정 요율로 업데이트되었습니다.");
    }, 800);
  };

  const handleSave = () => {
    toast.success(`${year}년도 보험요율 설정이 저장되었습니다.`);
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              4대보험 요율 관리
              {isAutoUpdate ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">자동 동기화 중</Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200">수동 설정됨</Badge>
              )}
            </CardTitle>
            <CardDescription>매년 변동되는 보험요율을 관리하고 급여 계산에 반영합니다.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={year} onValueChange={(v) => { setYear(v); setRates(initialRates[v as unknown as keyof typeof initialRates]); }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026년</SelectItem>
                <SelectItem value="2025">2025년</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleAutoUpdate}>
              <RefreshCw className="w-4 h-4 mr-2" /> 최신 요율 가져오기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">국민연금</Label>
                <p className="text-xs text-muted-foreground">근로자 부담분 (총 9%)</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={rates.pension} 
                  onChange={(e) => handleRateChange('pension', e.target.value)}
                  className="w-20 text-right" 
                />
                <span className="text-sm font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">건강보험</Label>
                <p className="text-xs text-muted-foreground">근로자 부담분 (총 7.09%)</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={rates.health} 
                  onChange={(e) => handleRateChange('health', e.target.value)}
                  className="w-20 text-right" 
                />
                <span className="text-sm font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">장기요양보험</Label>
                <p className="text-xs text-muted-foreground">건강보험료 대비 비율</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={rates.care} 
                  onChange={(e) => handleRateChange('care', e.target.value)}
                  className="w-20 text-right" 
                />
                <span className="text-sm font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">고용보험</Label>
                <p className="text-xs text-muted-foreground">실업급여 근로자 부담분</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={rates.employment} 
                  onChange={(e) => handleRateChange('employment', e.target.value)}
                  className="w-20 text-right" 
                />
                <span className="text-sm font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-500">최저임금 자동 체크 ({year}년)</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-600">
                현재 설정된 최저시급은 <strong>{rates.minWage.toLocaleString()}원</strong>입니다. 
                급여 계산 시 최저임금 미달 여부를 자동으로 검사합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" /> 설정 저장하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
