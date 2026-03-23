import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle2, Clock, FileText, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const myRequests = [
  { id: 1, type: "연차", date: "2026-01-10", duration: "1일", status: "pending", reason: "개인 사정" },
  { id: 2, type: "초과근무", date: "2026-01-05", duration: "2시간", status: "approved", reason: "프로젝트 마감" },
  { id: 3, type: "반차", date: "2025-12-24", duration: "4시간", status: "rejected", reason: "병원 진료" },
];

const pendingApprovals = [
  { id: 101, applicant: "박신입", type: "연차", date: "2026-01-15", duration: "1일", reason: "가족 행사" },
  { id: 102, applicant: "최인턴", type: "초과근무", date: "2026-01-08", duration: "3시간", reason: "긴급 이슈 대응" },
];

export default function Workflow() {
  const [requestType, setRequestType] = useState("vacation");

  const handleSubmit = () => {
    toast.success("결재 상신이 완료되었습니다.");
  };

  const handleApprove = (id: number) => {
    toast.success("결재가 승인되었습니다.");
  };

  const handleReject = (id: number) => {
    toast.error("결재가 반려되었습니다.");
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">전자 결재</h1>
          <p className="text-muted-foreground">휴가, 초과근무 등 근태 관련 사항을 신청하고 결재합니다.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> 새 결재 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 결재 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>결재 유형</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">휴가 신청</SelectItem>
                    <SelectItem value="overtime">초과근무 신청</SelectItem>
                    <SelectItem value="remote">재택근무 신청</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시작 일시</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>종료 일시</Label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>사유</Label>
                <Textarea placeholder="신청 사유를 상세히 입력해주세요." className="h-24 resize-none" />
              </div>

              <Button className="w-full" onClick={handleSubmit}>결재 상신</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-requests" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm">
          <TabsTrigger value="my-requests" className="rounded-lg">
            <FileText className="w-4 h-4 mr-2" /> 나의 신청 내역
          </TabsTrigger>
          <TabsTrigger value="approvals" className="rounded-lg">
            <CheckCircle2 className="w-4 h-4 mr-2" /> 결재 대기 문서
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
              {pendingApprovals.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-requests">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {myRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-transparent hover:border-border transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        req.type === "연차" ? "bg-orange-100/30 text-primary" :
                        req.type === "초과근무" ? "bg-orange-100 text-orange-600" : "bg-purple-100 text-purple-600"
                      }`}>
                        {req.type === "연차" ? <Calendar className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{req.type}</p>
                          <span className="text-sm text-muted-foreground">• {req.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.date} • {req.reason}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`
                      ${req.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : 
                        req.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : 
                        "bg-yellow-50 text-yellow-700 border-yellow-200"}
                    `}>
                      {req.status === "approved" ? "승인됨" : req.status === "rejected" ? "반려됨" : "결재 대기"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {pendingApprovals.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-600">
                        {req.applicant.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{req.applicant}</p>
                          <Badge variant="secondary" className="text-xs">{req.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.date} ({req.duration}) • {req.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleReject(req.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> 반려
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(req.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> 승인
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    대기 중인 결재 문서가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
