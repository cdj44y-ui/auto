import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FlexibleWorkType, FlexibleWorkPolicy } from "@/types/flexible-work";
import { Plus, Clock, Calendar, FileText, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const MOCK_POLICIES: FlexibleWorkPolicy[] = [
  {
    policy_id: "pol_001",
    client_id: "client_001",
    policy_type: FlexibleWorkType.STAGGERED_COMMUTE,
    policy_name: "2026년 시차출퇴근제 (A/B/C조)",
    legal_requirements: {
      staggered: {
        shift_patterns: [
          { shift_id: "A", shift_name: "Early Bird (08:00-17:00)", work_start_time: "08:00", work_end_time: "17:00", break_duration_minutes: 60, daily_work_hours: 8 },
          { shift_id: "B", shift_name: "Standard (09:00-18:00)", work_start_time: "09:00", work_end_time: "18:00", break_duration_minutes: 60, daily_work_hours: 8 },
          { shift_id: "C", shift_name: "Late Riser (10:00-19:00)", work_start_time: "10:00", work_end_time: "19:00", break_duration_minutes: 60, daily_work_hours: 8 },
        ],
        requires_notice_period_days: 7
      }
    },
    eligibility_criteria: {
      eligible_departments: ["ALL"],
      min_tenure_months: 3
    },
    effective_start_date: "2026-01-01",
    effective_end_date: "2026-12-31",
    approval_workflow: {
      requires_manager_approval: true,
      requires_hr_approval: false,
      requires_executive_approval: false
    },
    is_active: true,
    created_by: "admin_001",
    created_at: "2025-12-20",
    updated_at: "2025-12-20"
  },
  {
    policy_id: "pol_002",
    client_id: "client_001",
    policy_type: FlexibleWorkType.SELECTIVE_WORKING_HOURS,
    policy_name: "R&D센터 선택적 근로시간제",
    legal_requirements: {
      selective: {
        core_time_required: true,
        core_time_start: "11:00",
        core_time_end: "15:00",
        flexible_time_start: "07:00",
        flexible_time_end: "22:00",
        daily_standard_hours: 8,
        requires_labor_agreement: true,
        labor_agreement_file_url: "/docs/agreement_rnd_2026.pdf"
      }
    },
    eligibility_criteria: {
      eligible_departments: ["R&D", "Design"],
      min_tenure_months: 6
    },
    effective_start_date: "2026-02-01",
    effective_end_date: "2026-07-31",
    approval_workflow: {
      requires_manager_approval: true,
      requires_hr_approval: true,
      requires_executive_approval: false
    },
    is_active: true,
    created_by: "admin_001",
    created_at: "2026-01-10",
    updated_at: "2026-01-10"
  }
];

export default function FlexibleWorkPolicyManager() {
  const [policies, setPolicies] = useState<FlexibleWorkPolicy[]>(MOCK_POLICIES);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getPolicyTypeName = (type: FlexibleWorkType) => {
    switch (type) {
      case FlexibleWorkType.SELECTIVE_WORKING_HOURS: return "선택적 근로시간제";
      case FlexibleWorkType.FLEXIBLE_WORKING_HOURS: return "탄력적 근로시간제";
      case FlexibleWorkType.STAGGERED_COMMUTE: return "시차출퇴근제";
      case FlexibleWorkType.DISCRETIONARY_WORK: return "재량근로시간제";
      case FlexibleWorkType.DEEMED_WORKING_HOURS: return "간주근로시간제";
      default: return type;
    }
  };

  const getPolicyIcon = (type: FlexibleWorkType) => {
    switch (type) {
      case FlexibleWorkType.SELECTIVE_WORKING_HOURS: return <Clock className="w-5 h-5 text-blue-500" />;
      case FlexibleWorkType.FLEXIBLE_WORKING_HOURS: return <Calendar className="w-5 h-5 text-green-500" />;
      case FlexibleWorkType.STAGGERED_COMMUTE: return <Users className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-slate-100">유연근무제 정책 관리</h2>
          <p className="text-muted-foreground">회사별 유연근무제 유형 및 운영 규칙을 설정합니다.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> 새 정책 만들기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 유연근무제 정책 생성</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>정책 명칭</Label>
                  <Input placeholder="예: 2026년 상반기 시차출퇴근제" />
                </div>
                <div className="space-y-2">
                  <Label>근무제 유형</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FlexibleWorkType.STAGGERED_COMMUTE}>시차출퇴근제</SelectItem>
                      <SelectItem value={FlexibleWorkType.SELECTIVE_WORKING_HOURS}>선택적 근로시간제</SelectItem>
                      <SelectItem value={FlexibleWorkType.FLEXIBLE_WORKING_HOURS}>탄력적 근로시간제</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>적용 대상 부서</Label>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="cursor-pointer">전사 공통</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">R&D 센터</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">영업본부</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시행 시작일</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>시행 종료일</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="space-y-0.5">
                  <Label className="text-base">근로자대표 서면합의 필요</Label>
                  <p className="text-sm text-muted-foreground">선택적/탄력적 근로시간제는 서면합의가 필수입니다.</p>
                </div>
                <Switch />
              </div>

              <Button className="w-full mt-4" onClick={() => {
                toast.success("새로운 유연근무 정책이 생성되었습니다.");
                setIsCreateDialogOpen(false);
              }}>
                정책 생성 및 설정 저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <Card key={policy.policy_id} className="hover:border-indigo-500 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {getPolicyIcon(policy.policy_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold dark:text-slate-100">{policy.policy_name}</CardTitle>
                    <CardDescription>{getPolicyTypeName(policy.policy_type)}</CardDescription>
                  </div>
                </div>
                <Badge variant={policy.is_active ? "default" : "secondary"}>
                  {policy.is_active ? "운영중" : "종료됨"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">운영 기간</p>
                    <p className="font-medium dark:text-slate-200">
                      {policy.effective_start_date} ~ {policy.effective_end_date}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">적용 대상</p>
                    <p className="font-medium dark:text-slate-200">
                      {policy.eligibility_criteria.eligible_departments?.join(", ") || "전사"}
                      {policy.eligibility_criteria.min_tenure_months ? ` (근속 ${policy.eligibility_criteria.min_tenure_months}개월↑)` : ""}
                    </p>
                  </div>
                </div>

                {policy.policy_type === FlexibleWorkType.STAGGERED_COMMUTE && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">운영 근무조</p>
                    <div className="flex flex-wrap gap-2">
                      {policy.legal_requirements.staggered?.shift_patterns.map(shift => (
                        <Badge key={shift.shift_id} variant="outline" className="bg-white dark:bg-slate-800">
                          {shift.shift_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {policy.policy_type === FlexibleWorkType.SELECTIVE_WORKING_HOURS && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">의무 근로시간(Core Time)</span>
                      <span className="font-medium dark:text-slate-200">
                        {policy.legal_requirements.selective?.core_time_start} ~ {policy.legal_requirements.selective?.core_time_end}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">선택 가능시간</span>
                      <span className="font-medium dark:text-slate-200">
                        {policy.legal_requirements.selective?.flexible_time_start} ~ {policy.legal_requirements.selective?.flexible_time_end}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {policy.legal_requirements.selective?.requires_labor_agreement || policy.legal_requirements.flexible?.requires_labor_agreement 
                      ? "근로자대표 서면합의 완료" 
                      : "취업규칙 반영 완료"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
