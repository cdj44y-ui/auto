import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertCircle, FileText, Upload, Download, Send } from "lucide-react";
import { toast } from "sonner";

// Mock Data for Insurance Tasks
const INSURANCE_TASKS = [
  { id: 1, type: "취득신고", company: "(주)테크스타트업", employee: "김신입", ssn: "950101-1******", joinDate: "2026-01-02", status: "pending", date: "2026-01-27" },
  { id: 2, type: "상실신고", company: "글로벌무역상사", employee: "이퇴사", ssn: "880505-1******", leaveDate: "2026-01-20", status: "completed", date: "2026-01-25" },
  { id: 3, type: "보수월액변경", company: "퓨처디자인랩", employee: "박승진", ssn: "901212-1******", changeDate: "2026-01-01", status: "processing", date: "2026-01-26" },
  { id: 4, type: "취득신고", company: "희연푸드", employee: "최인턴", ssn: "000303-3******", joinDate: "2026-01-15", status: "pending", date: "2026-01-28" },
];

export default function InsuranceReportingCenter() {
  const [tasks, setTasks] = useState(INSURANCE_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = (id: number, newStatus: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    // 상태 변경에 따른 알림 메시지 생성
    let statusText = "";
    if (newStatus === 'processing') statusText = "처리중(공단 전송)";
    else if (newStatus === 'completed') statusText = "신고완료";
    else statusText = "접수대기";

    // 알림 발송 시뮬레이션
    if (task) {
      toast.success(`상태가 변경되었습니다. 담당자에게 알림이 발송되었습니다.\n[${task.company}] ${task.employee}님 ${task.type} -> ${statusText}`);
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">접수대기</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">처리중</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">신고완료</Badge>;
      default: return <Badge variant="outline">미정</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">4대보험 신고센터</h2>
          <p className="text-muted-foreground">
            고객사의 4대보험 취득/상실 신고 업무를 통합 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> 신고서식 다운로드
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" /> EDI 파일 일괄 업로드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">처리 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}건
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">공단 전송 중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'processing').length}건
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">금월 처리 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}건
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>신고 업무 현황</CardTitle>
          <CardDescription>최근 접수된 4대보험 신고 요청 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>구분</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>대상자</TableHead>
                <TableHead>주민등록번호</TableHead>
                <TableHead>사유발생일</TableHead>
                <TableHead>접수일자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Badge variant="secondary">{task.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{task.company}</TableCell>
                  <TableCell>{task.employee}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{task.ssn}</TableCell>
                  <TableCell>{task.joinDate || task.leaveDate || task.changeDate}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isDialogOpen && selectedTask?.id === task.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedTask(task);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">상세보기</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>4대보험 신고 상세 처리</DialogTitle>
                          <DialogDescription>
                            {task.company} - {task.employee} 님의 {task.type} 건입니다.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>신고 유형</Label>
                              <Input value={task.type} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>대상자 성명</Label>
                              <Input value={task.employee} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>주민등록번호</Label>
                              <Input value={task.ssn} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>사유발생일</Label>
                              <Input value={task.joinDate || task.leaveDate || task.changeDate} readOnly />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>처리 상태 변경</Label>
                            <Select 
                              defaultValue={task.status} 
                              onValueChange={(val) => handleStatusChange(task.id, val)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">접수대기 (서류 검토 전)</SelectItem>
                                <SelectItem value="processing">처리중 (공단 전송 완료)</SelectItem>
                                <SelectItem value="completed">신고완료 (처리 결과 확인)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg border text-sm space-y-2">
                            <p className="font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4" /> 자동 생성된 신고서 미리보기
                            </p>
                            <p className="text-muted-foreground">
                              시스템이 근로자 정보를 바탕으로 공단 표준 서식을 자동 생성했습니다.
                            </p>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              <Download className="h-3 w-3 mr-2" /> PDF 다운로드
                            </Button>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>닫기</Button>
                          <Button onClick={() => {
                            toast.success("공단으로 신고서가 전송되었습니다.");
                            handleStatusChange(task.id, 'processing');
                          }}>
                            <Send className="h-4 w-4 mr-2" /> 공단 전송
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
