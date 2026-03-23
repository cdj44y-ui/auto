import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Save, Building2, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TAX_RATES_2025 } from "@/lib/taxEngine";

export default function PayrollSettings() {
  const [settings, setSettings] = useState({
    companyName: "주식회사 예시",
    isSmallBusiness: false, // 5인 미만 사업장 여부
    standardWorkHours: 209, // 월 통상임금 산정 기준 시간
    applyIncomeTax: true, // 소득세 적용 여부
    apply4Ins: true, // 4대보험 적용 여부
    taxRates: { ...TAX_RATES_2025 }
  });

  const handleSave = () => {
    // 실제로는 API 호출로 저장해야 함
    toast.success("사업장 급여 설정이 저장되었습니다.");
  };

  const handleDownloadTemplate = () => {
    // 엑셀 템플릿 생성 및 다운로드 로직 (시뮬레이션)
    // 실제로는 xlsx-js-style 등을 사용하여 스타일이 적용된 엑셀 파일 생성
    toast.success("급여 대장 표준 엑셀 양식이 다운로드되었습니다.");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            사업장 기본 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>회사명</Label>
            <Input 
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base">5인 미만 사업장</Label>
              <p className="text-xs text-muted-foreground">
                체크 시 연장/야간/휴일 근로 가산수당(1.5배)이 적용되지 않습니다.<br/>
                (근로기준법 제56조 적용 제외)
              </p>
            </div>
            <Switch 
              checked={settings.isSmallBusiness}
              onCheckedChange={(checked) => setSettings({...settings, isSmallBusiness: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label>월 통상임금 산정 기준 시간</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={settings.standardWorkHours}
                onChange={(e) => setSettings({...settings, standardWorkHours: Number(e.target.value)})}
              />
              <span className="text-sm text-muted-foreground">시간 (기본 209시간)</span>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-orange-800 text-white">
            <Save className="w-4 h-4 mr-2" /> 설정 저장
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              대용량 처리 표준 양식
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 space-y-2">
              <p className="font-semibold">💡 10만 명 규모 데이터 처리 최적화</p>
              <p>
                대규모 인원의 급여 처리를 위해 반드시 제공된 표준 엑셀 양식을 사용해주세요.
                표준 양식은 시스템이 가장 빠르게 처리할 수 있는 구조로 설계되었습니다.
              </p>
            </div>
            <Button onClick={handleDownloadTemplate} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
              <Download className="w-4 h-4 mr-2" /> 표준 엑셀 템플릿 다운로드 (.xlsx)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">4대보험 요율 설정 (2025년 기준)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">국민연금 (%)</Label>
                <Input 
                  type="number" 
                  value={settings.taxRates.pension * 100}
                  onChange={(e) => setSettings({
                    ...settings, 
                    taxRates: { ...settings.taxRates, pension: Number(e.target.value) / 100 }
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">건강보험 (%)</Label>
                <Input 
                  type="number" 
                  value={settings.taxRates.health * 100}
                  onChange={(e) => setSettings({
                    ...settings, 
                    taxRates: { ...settings.taxRates, health: Number(e.target.value) / 100 }
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">장기요양 (건보료의 %)</Label>
                <Input 
                  type="number" 
                  value={settings.taxRates.care * 100}
                  onChange={(e) => setSettings({
                    ...settings, 
                    taxRates: { ...settings.taxRates, care: Number(e.target.value) / 100 }
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">고용보험 (%)</Label>
                <Input 
                  type="number" 
                  value={settings.taxRates.employment * 100}
                  onChange={(e) => setSettings({
                    ...settings, 
                    taxRates: { ...settings.taxRates, employment: Number(e.target.value) / 100 }
                  })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              * 근로자 부담분 기준 요율입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
