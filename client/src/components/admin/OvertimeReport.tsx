import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart3, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock Data for Monthly Statistics
const MONTHLY_STATS = [
  { month: "2025-08", totalOvertime: 145, avgPerPerson: 3.2, topDept: "개발팀" },
  { month: "2025-09", totalOvertime: 180, avgPerPerson: 4.1, topDept: "개발팀" },
  { month: "2025-10", totalOvertime: 120, avgPerPerson: 2.8, topDept: "영업팀" },
  { month: "2025-11", totalOvertime: 210, avgPerPerson: 4.8, topDept: "마케팅팀" },
  { month: "2025-12", totalOvertime: 250, avgPerPerson: 5.5, topDept: "인사팀" },
  { month: "2026-01", totalOvertime: 190, avgPerPerson: 4.2, topDept: "개발팀" },
];

// Mock Data for Detailed Report
const DETAILED_REPORT = [
  { id: 1, name: "김철수", dept: "개발팀", date: "2026-01-15", hours: 3, reason: "긴급 버그 수정" },
  { id: 2, name: "이영희", dept: "디자인팀", date: "2026-01-18", hours: 2, reason: "제안서 디자인 마감" },
  { id: 3, name: "박지성", dept: "영업팀", date: "2026-01-20", hours: 4, reason: "고객사 미팅 준비" },
  { id: 4, name: "손흥민", dept: "마케팅팀", date: "2026-01-22", hours: 2.5, reason: "캠페인 런칭 준비" },
  { id: 5, name: "황희찬", dept: "인사팀", date: "2026-01-25", hours: 5, reason: "연말정산 업무" },
];

export default function OvertimeReport() {
  const [selectedMonth, setSelectedMonth] = useState("2026-01");

  const handleDownload = () => {
    // 실제 구현 시에는 CSV 생성 로직이 들어감
    toast.success(`${selectedMonth} 연장근무 리포트가 다운로드되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">연장근무 통계 및 리포트</h3>
          <p className="text-sm text-muted-foreground">월별 연장근무 추이를 분석하고 상세 내역을 다운로드합니다.</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="월 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-01">2026년 1월</SelectItem>
              <SelectItem value="2025-12">2025년 12월</SelectItem>
              <SelectItem value="2025-11">2025년 11월</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> 엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 연장근무 시간</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">190시간</div>
            <p className="text-xs text-muted-foreground">전월 대비 -24% 감소</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">인당 평균 연장근무</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2시간</div>
            <p className="text-xs text-muted-foreground">전월 대비 -1.3시간 감소</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최다 발생 부서</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">개발팀</div>
            <p className="text-xs text-muted-foreground">총 85시간 (전체의 45%)</p>
          </CardContent>
        </Card>
      </div>

      {/* 상세 내역 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 내역 ({selectedMonth})</CardTitle>
          <CardDescription>해당 월의 연장근무 신청 및 승인 내역입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>일자</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>시간</TableHead>
                <TableHead>사유</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DETAILED_REPORT.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.dept}</TableCell>
                  <TableCell>{item.hours}h</TableCell>
                  <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
