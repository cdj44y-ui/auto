import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FlexibleWorkType, ApprovalStatus } from "@/types/flexible-work";
import { CheckCircle2, XCircle, Clock, FileText, User } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const MOCK_APPLICATIONS = [
  {
    id: "app_001",
    applicant: "김철수",
    department: "개발팀",
    type: FlexibleWorkType.STAGGERED_COMMUTE,
    period: "2026.02.01 ~ 2026.07.31",
    detail: "A조 (08:00 - 17:00)",
    reason: "자녀 등하원 문제로 인한 출근 시간 조정 요청",
    status: ApprovalStatus.PENDING,
    submittedAt: "2026-01-25"
  },
  {
    id: "app_002",
    applicant: "이영희",
    department: "디자인팀",
    type: FlexibleWorkType.SELECTIVE_WORKING_HOURS,
    period: "2026.02.01 ~ 2026.02.28",
    detail: "Core Time (11:00 - 15:00)",
    reason: "개인 건강 관리 및 병원 진료",
    status: ApprovalStatus.PENDING,
    submittedAt: "2026-01-26"
  },
  {
    id: "app_003",
    applicant: "박지민",
    department: "마케팅팀",
    type: FlexibleWorkType.STAGGERED_COMMUTE,
    period: "2026.01.01 ~ 2026.06.30",
    detail: "C조 (10:00 - 19:00)",
    reason: "원거리 통근으로 인한 출근 시간 조정",
    status: ApprovalStatus.APPROVED,
    submittedAt: "2025-12-20"
  }
];

export default function FlexibleWorkApprovalList() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: ApprovalStatus.APPROVED } : app
    ));
    toast.success("승인 처리가 완료되었습니다.");
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    if (!rejectReason) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: ApprovalStatus.REJECTED } : app
    ));
    toast.success("반려 처리가 완료되었습니다.");
    setSelectedApp(null);
    setRejectReason("");
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">승인 대기</Badge>;
      case ApprovalStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">승인 완료</Badge>;
      case ApprovalStatus.REJECTED:
        return <Badge variant="destructive">반려됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>유연근무 신청 내역 관리</CardTitle>
        <CardDescription>직원들이 신청한 유연근무 내역을 검토하고 승인합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">승인 대기 ({applications.filter(a => a.status === ApprovalStatus.PENDING).length})</TabsTrigger>
            <TabsTrigger value="history">전체 이력</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {applications.filter(a => a.status === ApprovalStatus.PENDING).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                대기 중인 승인 요청이 없습니다.
              </div>
            ) : (
              applications.filter(a => a.status === ApprovalStatus.PENDING).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-stone-950 dark:border-stone-800">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full mt-1">
                      <User className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold dark:text-stone-200">{app.applicant}</span>
                        <span className="text-sm text-muted-foreground">({app.department})</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm font-medium dark:text-stone-300 mb-1">
                        {app.type === FlexibleWorkType.STAGGERED_COMMUTE ? "시차출퇴근제" : "선택적 근로시간제"} - {app.detail}
                      </p>
                      <p className="text-xs text-muted-foreground">신청일: {app.submittedAt} | 기간: {app.period}</p>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedApp(app)}>상세 검토</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>유연근무 신청 상세</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-muted-foreground">신청자</div>
                          <div className="font-medium">{app.applicant} ({app.department})</div>
                          
                          <div className="text-muted-foreground">신청 유형</div>
                          <div className="font-medium">
                            {app.type === FlexibleWorkType.STAGGERED_COMMUTE ? "시차출퇴근제" : "선택적 근로시간제"}
                          </div>

                          <div className="text-muted-foreground">상세 내용</div>
                          <div className="font-medium">{app.detail}</div>

                          <div className="text-muted-foreground">적용 기간</div>
                          <div className="font-medium">{app.period}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">신청 사유</div>
                          <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-md text-sm">
                            {app.reason}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">반려 사유 (반려 시 입력)</div>
                          <Textarea 
                            placeholder="반려 사유를 입력하세요." 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="destructive" onClick={() => handleReject(app.id)}>반려</Button>
                        <Button className="bg-primary hover:bg-orange-800" onClick={() => handleApprove(app.id)}>승인</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-stone-50 dark:bg-stone-900 dark:border-stone-800 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white dark:bg-stone-800 rounded-full mt-1 border">
                    <FileText className="w-4 h-4 text-stone-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold dark:text-stone-200">{app.applicant}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {app.type === FlexibleWorkType.STAGGERED_COMMUTE ? "시차출퇴근제" : "선택적 근로시간제"} | {app.period}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {app.submittedAt}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
