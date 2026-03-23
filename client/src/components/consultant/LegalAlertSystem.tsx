import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, ChevronRight, ExternalLink } from "lucide-react";

export default function LegalAlertSystem() {
  const alerts = [
    {
      id: 1,
      type: "urgent",
      title: "2026년 최저임금 고시 확정",
      date: "2026-01-05",
      summary: "2026년도 최저임금이 시간급 10,530원으로 확정되었습니다. 모든 사업장은 1월 1일부터 인상된 최저임금을 반영하여 급여를 지급해야 합니다.",
      action: "급여대장 일괄 업데이트"
    },
    {
      id: 2,
      type: "info",
      title: "육아휴직 급여 상한액 인상 안내",
      date: "2026-01-10",
      summary: "육아휴직 급여 상한액이 월 250만원으로 인상되었습니다. 취업규칙 내 모성보호 관련 조항의 개정이 필요할 수 있습니다.",
      action: "취업규칙 가이드 확인"
    },
    {
      id: 3,
      type: "warning",
      title: "중대재해처벌법 적용 범위 확대",
      date: "2026-01-15",
      summary: "5인 이상 50인 미만 사업장에 대한 유예기간이 종료됨에 따라, 안전보건관리체계 구축 의무가 전면 적용됩니다.",
      action: "안전보건 체크리스트 배포"
    }
  ];

  return (
    <Card className="border-l-4 border-l-orange-500 bg-orange-50/30 dark:bg-orange-900/10 dark:border-l-orange-600">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-lg text-orange-900 dark:text-orange-100">최신 노동법령 이슈 알림</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/30">
            전체보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-stone-900 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {alert.type === 'urgent' && <Badge variant="destructive">긴급</Badge>}
                  {alert.type === 'warning' && <Badge className="bg-orange-500 hover:bg-orange-600">중요</Badge>}
                  {alert.type === 'info' && <Badge variant="secondary">안내</Badge>}
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">{alert.title}</h4>
                </div>
                <span className="text-xs text-stone-500">{alert.date}</span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
                {alert.summary}
              </p>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-xs h-8 border-orange-200/30 text-orange-700 hover:bg-orange-50/30 dark:border-stone-700 dark:text-orange-300 dark:hover:bg-stone-900/30">
                  {alert.action} <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
