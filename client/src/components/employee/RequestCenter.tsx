import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plane, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function RequestCenter() {
  const [requestType, setRequestType] = useState("vacation");
  
  // 모의 신청 내역 데이터
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: "vacation",
      title: "연차 신청",
      date: "2026-01-27",
      status: "approved",
      reason: "설 연휴 연차",
      createdAt: "2026-01-10"
    },
    {
      id: 2,
      type: "business_trip",
      title: "부산 지사 출장",
      date: "2026-01-15 ~ 2026-01-16",
      status: "approved",
      reason: "지사 정기 점검 및 미팅",
      createdAt: "2026-01-12"
    },
    {
      id: 3,
      type: "overtime",
      title: "야간 연장 근무",
      date: "2026-01-20",
      status: "pending",
      reason: "프로젝트 마감으로 인한 연장 근무",
      createdAt: "2026-01-20"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">승인완료</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">반려됨</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-500 border-slate-200 dark:text-slate-400 dark:border-slate-700">결재 대기</Badge>;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vacation": return <Calendar className="w-5 h-5 text-green-600" />;
      case "overtime": return <Clock className="w-5 h-5 text-orange-600" />;
      case "business_trip": return <Plane className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 신청 폼 */}
      <Card className="lg:col-span-1 border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">새 근태 신청</CardTitle>
          <CardDescription>연차, 출장, 시간외 근무 등을 신청합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>신청 유형</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">연차/반차</SelectItem>
                  <SelectItem value="overtime">시간외 근무</SelectItem>
                  <SelectItem value="business_trip">출장</SelectItem>
                  <SelectItem value="remote">재택 근무</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>기간/일시</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" />
                {requestType === "business_trip" && <Input type="date" placeholder="종료일" />}
              </div>
            </div>

            {requestType === "overtime" && (
              <div className="space-y-2">
                <Label>예상 시간</Label>
                <div className="flex items-center gap-2">
                  <Input type="time" />
                  <span>~</span>
                  <Input type="time" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>사유</Label>
              <Textarea placeholder="상세 사유를 입력해주세요." className="resize-none h-24" />
            </div>

            <div className="pt-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("결재가 상신되었습니다.")}>
                결재 상신하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 신청 내역 리스트 */}
      <Card className="lg:col-span-2 border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">나의 신청 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-800 gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    req.type === 'vacation' ? 'bg-green-100 dark:bg-green-900/30' :
                    req.type === 'overtime' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {getIcon(req.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold dark:text-slate-200">{req.title}</p>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{req.date}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded inline-block">
                      사유: {req.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground sm:self-start">
                  신청일: {req.createdAt}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
