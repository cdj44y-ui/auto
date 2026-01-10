import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Bell, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock Data for Employee Work Hours
const EMPLOYEE_HOURS = [
  { id: 1, name: "김철수", dept: "개발팀", current: 48, max: 52, status: "danger" },
  { id: 2, name: "이영희", dept: "디자인팀", current: 45, max: 52, status: "warning" },
  { id: 3, name: "박지성", dept: "영업팀", current: 40, max: 52, status: "safe" },
  { id: 4, name: "손흥민", dept: "마케팅팀", current: 38, max: 52, status: "safe" },
  { id: 5, name: "황희찬", dept: "인사팀", current: 51, max: 52, status: "danger" },
];

export default function WorkHoursMonitor() {
  const handleSendAlert = (name: string) => {
    toast.success(`${name}님에게 근무시간 주의 알림을 발송했습니다.`);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>주 52시간 근무제 모니터링</CardTitle>
            <CardDescription>
              이번 주 누적 근무시간이 법정 한도에 근접한 직원을 관리합니다.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="직원 검색..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> 엑셀 다운로드
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">위험 (50시간 이상)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {EMPLOYEE_HOURS.filter(e => e.status === 'danger').length}명
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">주의 (45시간 이상)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {EMPLOYEE_HOURS.filter(e => e.status === 'warning').length}명
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">정상</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {EMPLOYEE_HOURS.filter(e => e.status === 'safe').length}명
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>부서</TableHead>
              <TableHead className="w-[300px]">누적 근무시간 현황</TableHead>
              <TableHead>잔여 시간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EMPLOYEE_HOURS.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell>{emp.dept}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{emp.current}h</span>
                      <span className="text-muted-foreground">/ {emp.max}h</span>
                    </div>
                    <Progress 
                      value={(emp.current / emp.max) * 100} 
                      className={`h-2 ${
                        emp.status === 'danger' ? '[&>div]:bg-red-500' : 
                        emp.status === 'warning' ? '[&>div]:bg-orange-500' : 
                        '[&>div]:bg-blue-600'
                      }`} 
                    />
                  </div>
                </TableCell>
                <TableCell className="font-mono">{emp.max - emp.current}h</TableCell>
                <TableCell>
                  {emp.status === 'danger' && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" /> 위험
                    </Badge>
                  )}
                  {emp.status === 'warning' && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 gap-1">
                      <AlertTriangle className="w-3 h-3" /> 주의
                    </Badge>
                  )}
                  {emp.status === 'safe' && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      정상
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {emp.status !== 'safe' && (
                    <Button size="sm" variant="ghost" onClick={() => handleSendAlert(emp.name)}>
                      <Bell className="w-4 h-4 mr-2" /> 알림 발송
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
