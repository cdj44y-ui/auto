import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, BarChart3, TrendingUp, Users, Search, Filter } from "lucide-react";
import { MaskedData } from "@/components/ui/MaskedData";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, isWithinInterval, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 0, 31),
  });
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchName, setSearchName] = useState("");

  // 필터링 로직
  const filteredData = useMemo(() => {
    return DETAILED_REPORT.filter(item => {
      const itemDate = parseISO(item.date);
      const matchDate = dateRange?.from && dateRange?.to 
        ? isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })
        : true;
      const matchDept = selectedDept === "all" || item.dept === selectedDept;
      const matchName = item.name.includes(searchName);
      return matchDate && matchDept && matchName;
    });
  }, [dateRange, selectedDept, searchName]);

  // 필터링된 데이터 기반 통계 재계산
  const stats = useMemo(() => {
    const total = filteredData.reduce((acc, curr) => acc + curr.hours, 0);
    const avg = filteredData.length > 0 ? (total / filteredData.length).toFixed(1) : 0;
    return { total, avg };
  }, [filteredData]);

  // 차트 데이터 생성 (부서별 집계)
  const chartData = useMemo(() => {
    const deptMap = filteredData.reduce((acc, curr) => {
      acc[curr.dept] = (acc[curr.dept] || 0) + curr.hours;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptMap).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const handleDownload = () => {
    // 실제 CSV 다운로드 로직 구현
    const headers = ["일자", "이름", "부서", "시간", "사유"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => 
        [row.date, row.name, row.dept, row.hours, `"${row.reason}"`].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `overtime_report_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`연장근무 리포트(${filteredData.length}건)가 다운로드되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">연장근무 통계 및 리포트</h3>
          <p className="text-sm text-muted-foreground">월별 연장근무 추이를 분석하고 상세 내역을 다운로드합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="부서 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 부서</SelectItem>
              <SelectItem value="개발팀">개발팀</SelectItem>
              <SelectItem value="디자인팀">디자인팀</SelectItem>
              <SelectItem value="영업팀">영업팀</SelectItem>
              <SelectItem value="마케팅팀">마케팅팀</SelectItem>
              <SelectItem value="인사팀">인사팀</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-[160px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="이름 검색" 
              className="pl-8" 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> 다운로드
          </Button>
        </div>
      </div>

      {/* 통계 카드 및 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 연장근무 시간</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}시간</div>
              <p className="text-xs text-muted-foreground">선택된 조건 기준 합계</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 연장근무</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avg}시간</div>
              <p className="text-xs text-muted-foreground">선택된 인원 평균</p>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>부서별 연장근무 현황</CardTitle>
            <CardDescription>선택된 기간 동안의 부서별 누적 연장근무 시간입니다.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}h`} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="currentColor" 
                    radius={[4, 4, 0, 0]} 
                    className="fill-primary" 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                <TableHead>예상 수당</TableHead>
                <TableHead>사유</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.dept}</TableCell>
                    <TableCell>
                      <MaskedData 
                        value={String(item.hours * 15000)} // 임시 시급 1.5만원 가정
                        type="salary" 
                        label="연장수당" 
                        employeeName={item.name} 
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    조건에 맞는 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
