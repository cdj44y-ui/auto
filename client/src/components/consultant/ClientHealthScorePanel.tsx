/**
 * P-10: 고객사 헬스스코어 패널
 * 자문사 대시보드의 헬스스코어 탭에서 사용
 */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";

function HealthBadge({ grade }: { grade: string }) {
  if (grade === "healthy") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">양호</Badge>;
  if (grade === "at_risk") return <Badge className="bg-amber-100 text-amber-700 border-amber-200">주의</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200">위험</Badge>;
}

export default function ClientHealthScorePanel() {
  const dashboardQuery = trpc.analytics.consultantDashboard.useQuery();
  const data = dashboardQuery.data;

  if (dashboardQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse border-none shadow-sm">
              <CardContent className="p-6"><div className="h-16 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50/30 dark:bg-stone-800/30 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">관리 고객사</p>
              <p className="text-2xl font-bold">{data?.activeClients ?? 0}<span className="text-sm font-normal text-muted-foreground ml-1">개</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">양호</p>
              <p className="text-2xl font-bold">{data?.healthyCount ?? 0}<span className="text-sm font-normal text-muted-foreground ml-1">개</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">주의</p>
              <p className="text-2xl font-bold">{data?.atRiskCount ?? 0}<span className="text-sm font-normal text-muted-foreground ml-1">개</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">위험</p>
              <p className="text-2xl font-bold">{data?.criticalCount ?? 0}<span className="text-sm font-normal text-muted-foreground ml-1">개</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 평균 헬스스코어 */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            평균 헬스스코어
          </CardTitle>
          <CardDescription>전체 고객사의 노무 리스크 평균 점수입니다. 100점에 가까울수록 양호합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{data?.avgHealthScore ?? 0}</span>
            <span className="text-xl text-muted-foreground">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* 고객사별 헬스스코어 */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>고객사별 헬스스코어</CardTitle>
          <CardDescription>각 고객사의 노무 리스크 현황을 한눈에 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.recentScores && data.recentScores.length > 0 ? (
            <div className="space-y-3">
              {data.recentScores.map((score: any) => (
                <div key={score.clientId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{score.companyName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono tabular-nums">{score.score}점</span>
                    <HealthBadge grade={score.grade} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>등록된 고객사가 없습니다.</p>
              <p className="text-sm mt-1">파트너 관리 탭에서 고객사를 등록해 주세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
