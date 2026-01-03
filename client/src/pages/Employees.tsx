import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { Download, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";

const employeesData = [
  {
    id: 1,
    name: "김철수",
    email: "chulsoo@company.com",
    department: "개발팀",
    role: "팀장",
    status: "근무중",
    checkIn: "08:55",
    workTime: "4시간 30분",
  },
  {
    id: 2,
    name: "이영희",
    email: "younghee@company.com",
    department: "디자인팀",
    role: "사원",
    status: "근무중",
    checkIn: "09:00",
    workTime: "4시간 25분",
  },
  {
    id: 3,
    name: "박지민",
    email: "jimin@company.com",
    department: "마케팅팀",
    role: "대리",
    status: "휴식중",
    checkIn: "08:45",
    workTime: "4시간 40분",
  },
  {
    id: 4,
    name: "최민수",
    email: "minsoo@company.com",
    department: "인사팀",
    role: "과장",
    status: "퇴근",
    checkIn: "08:30",
    workTime: "9시간 00분",
  },
  {
    id: 5,
    name: "정수진",
    email: "sujin@company.com",
    department: "개발팀",
    role: "사원",
    status: "결근",
    checkIn: "-",
    workTime: "-",
  },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">직원 관리</h1>
          <p className="text-muted-foreground">직원 목록을 조회하고 근태 현황을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> 직원 추가
          </Button>
          <Button variant="outline" className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" /> 엑셀 다운로드
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle>직원 목록 ({filteredEmployees.length}명)</CardTitle>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="이름 또는 이메일 검색"
                  className="pl-10 rounded-xl bg-secondary/50 border-transparent focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[140px] rounded-xl bg-secondary/50 border-transparent focus:bg-white">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  <SelectItem value="개발팀">개발팀</SelectItem>
                  <SelectItem value="디자인팀">디자인팀</SelectItem>
                  <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                  <SelectItem value="인사팀">인사팀</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="w-[250px]">직원 정보</TableHead>
                  <TableHead>부서 / 직급</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>출근 시간</TableHead>
                  <TableHead>실근무 시간</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.department}</span>
                        <span className="text-xs text-muted-foreground">{employee.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          employee.status === "근무중"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : employee.status === "휴식중"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : employee.status === "퇴근"
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">{employee.checkIn}</TableCell>
                    <TableCell className="font-medium tabular-nums">{employee.workTime}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="mr-2">
                            <DollarSign className="w-4 h-4 mr-1" /> 급여 설정
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{employee.name}님의 급여 정보 설정</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>계약 형태</Label>
                              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <option value="salary">연봉제</option>
                                <option value="hourly">시급제</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>기본급 (원)</Label>
                              <Input type="number" placeholder="3000000" />
                            </div>
                            <div className="space-y-2">
                              <Label>식대 (원)</Label>
                              <Input type="number" placeholder="200000" />
                            </div>
                            <div className="space-y-2">
                              <Label>주 소정 근로시간 (시간)</Label>
                              <Input type="number" placeholder="40" defaultValue="40" />
                              <p className="text-xs text-muted-foreground">주 15시간 미만인 경우 주휴수당이 발생하지 않습니다.</p>
                            </div>
                            <div className="space-y-2">
                              <Label>초과근무 수당 (시급)</Label>
                              <Input type="number" placeholder="15000" />
                            </div>
                            <Button className="w-full mt-4">저장하기</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
