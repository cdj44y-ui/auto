import { useState } from "react";
import { 
  InsuranceReport, 
  MOCK_INSURANCE_REPORTS, 
  ReportStatus, 
  ReportType 
} from "@/types/insurance-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Send, CheckCircle, AlertCircle, Plus, Download } from "lucide-react";
import { toast } from "sonner";

export default function InsuranceReportingCenter() {
  const [reports, setReports] = useState<InsuranceReport[]>(MOCK_INSURANCE_REPORTS);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newReportType, setNewReportType] = useState<ReportType>("acquisition");

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "draft": return <Badge variant="outline" className="text-stone-500">작성 중</Badge>;
      case "pending": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">접수 대기</Badge>;
      case "submitted": return <Badge variant="secondary" className="bg-orange-100/30 text-orange-700">공단 전송됨</Badge>;
      case "completed": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">처리 완료</Badge>;
      case "rejected": return <Badge variant="destructive">반려됨</Badge>;
    }
  };

  const handleCreateReport = () => {
    toast.success("신고서가 생성되었습니다.");
    setIsNewReportOpen(false);
    // 실제로는 여기에 데이터 추가 로직 구현
  };

  const handleSubmitToAgency = (id: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: "submitted", submittedAt: new Date().toISOString().split('T')[0] } : r));
    toast.success("공단으로 신고서가 전송되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">4대보험 신고 센터</h2>
          <p className="text-muted-foreground">
            자격 취득/상실 신고를 관리하고 공단에 전송합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                새 신고서 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>4대보험 신고서 작성</DialogTitle>
                <DialogDescription>
                  신규 입사자 취득 신고 또는 퇴사자 상실 신고를 작성합니다.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">신고 유형</Label>
                  <div className="col-span-3">
                    <Tabs value={newReportType} onValueChange={(v) => setNewReportType(v as ReportType)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="acquisition">자격 취득 신고</TabsTrigger>
                        <TabsTrigger value="loss">자격 상실 신고</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">대상 직원</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="직원을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp-new">신규 입사자 (직접 입력)</SelectItem>
                      <SelectItem value="emp-001">김철수 (경영지원팀)</SelectItem>
                      <SelectItem value="emp-002">이영희 (개발팀)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">신고 보험</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="np" defaultChecked />
                      <Label htmlFor="np">국민연금</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hi" defaultChecked />
                      <Label htmlFor="hi">건강보험</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ei" defaultChecked />
                      <Label htmlFor="ei">고용보험</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wc" defaultChecked />
                      <Label htmlFor="wc">산재보험</Label>
                    </div>
                  </div>
                </div>

                {newReportType === "acquisition" ? (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">취득일자</Label>
                      <Input type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">월 소득액</Label>
                      <Input type="number" placeholder="3,000,000" className="col-span-3" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">상실일자</Label>
                      <Input type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">상실사유</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="사유를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11">11. 개인사정으로 인한 자진퇴사</SelectItem>
                          <SelectItem value="23">23. 경영상 필요에 의한 권고사직</SelectItem>
                          <SelectItem value="32">32. 계약만료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewReportOpen(false)}>취소</Button>
                <Button onClick={handleCreateReport}>신고서 생성</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">접수 대기</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'draft' || r.status === 'pending').length}건</div>
            <p className="text-xs text-muted-foreground">작성 중이거나 전송 대기 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">처리 중</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'submitted').length}건</div>
            <p className="text-xs text-muted-foreground">공단 전송 완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">처리 완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'completed').length}건</div>
            <p className="text-xs text-muted-foreground">이번 달 처리 완료</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>신고 내역</CardTitle>
          <CardDescription>최근 4대보험 자격 취득/상실 신고 이력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>구분</TableHead>
                <TableHead>대상자</TableHead>
                <TableHead>주민번호</TableHead>
                <TableHead>신고일자</TableHead>
                <TableHead>신고내용</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="outline" className={report.reportType === 'acquisition' ? 'text-primary border-orange-200/30' : 'text-red-600 border-red-200'}>
                      {report.reportType === 'acquisition' ? '취득' : '상실'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.employeeName}</TableCell>
                  <TableCell>{report.residentNumber}</TableCell>
                  <TableCell>{report.reportType === 'acquisition' ? report.acquisitionDate : report.lossDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {report.targetInsurances.includes('national_pension') && <Badge variant="secondary" className="text-[10px] px-1">국민</Badge>}
                      {report.targetInsurances.includes('health_insurance') && <Badge variant="secondary" className="text-[10px] px-1">건강</Badge>}
                      {report.targetInsurances.includes('employment_insurance') && <Badge variant="secondary" className="text-[10px] px-1">고용</Badge>}
                      {report.targetInsurances.includes('workers_compensation') && <Badge variant="secondary" className="text-[10px] px-1">산재</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === 'pending' && (
                        <Button size="sm" onClick={() => handleSubmitToAgency(report.id)}>
                          공단 전송
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="신고서 다운로드">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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
