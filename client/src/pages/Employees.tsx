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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DollarSign, Upload, FileText, Edit, Trash2, User, Mail, Building2, Briefcase, Phone, Calendar } from "lucide-react";
import { Plus, Search } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  checkIn: string;
  workTime: string;
  phone?: string;
  hireDate?: string;
}

const initialEmployeesData: Employee[] = [
  {
    id: 1,
    name: "김철수",
    email: "chulsoo@company.com",
    department: "개발팀",
    role: "팀장",
    status: "근무중",
    checkIn: "08:55",
    workTime: "4시간 30분",
    phone: "010-1234-5678",
    hireDate: "2020-03-15",
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
    phone: "010-2345-6789",
    hireDate: "2021-06-01",
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
    phone: "010-3456-7890",
    hireDate: "2019-09-20",
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
    phone: "010-4567-8901",
    hireDate: "2018-01-10",
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
    phone: "010-5678-9012",
    hireDate: "2022-11-01",
  },
];

const departments = ["개발팀", "디자인팀", "마케팅팀", "인사팀", "영업팀", "재무팀", "경영지원팀"];
const roles = ["사원", "대리", "과장", "차장", "부장", "팀장", "이사"];

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  role: string;
  phone: string;
  hireDate: string;
}

const initialFormData: EmployeeFormData = {
  name: "",
  email: "",
  department: "",
  role: "",
  phone: "",
  hireDate: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 직원 추가/수정 Dialog 상태
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<EmployeeFormData>>({});

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // 엑셀 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        toast.success(`${file.name} 파일에서 3명의 직원 정보를 불러왔습니다.`);
        
        const newEmployees: Employee[] = [
          {
            id: employees.length + 1,
            name: "신규입사자1",
            email: "new1@company.com",
            department: "영업팀",
            role: "사원",
            status: "대기",
            checkIn: "-",
            workTime: "-",
            phone: "010-0000-0001",
            hireDate: new Date().toISOString().split('T')[0],
          },
          {
            id: employees.length + 2,
            name: "신규입사자2",
            email: "new2@company.com",
            department: "영업팀",
            role: "대리",
            status: "대기",
            checkIn: "-",
            workTime: "-",
            phone: "010-0000-0002",
            hireDate: new Date().toISOString().split('T')[0],
          },
          {
            id: employees.length + 3,
            name: "신규입사자3",
            email: "new3@company.com",
            department: "인사팀",
            role: "사원",
            status: "대기",
            checkIn: "-",
            workTime: "-",
            phone: "010-0000-0003",
            hireDate: new Date().toISOString().split('T')[0],
          }
        ];
        setEmployees([...employees, ...newEmployees]);
      } catch (error) {
        toast.error("엑셀 파일 처리 중 오류가 발생했습니다.");
      }
    };
    reader.readAsBinaryString(file);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = () => {
    toast.success("직원 일괄 등록 템플릿이 다운로드되었습니다.");
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const errors: Partial<EmployeeFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = "이름을 입력해주세요.";
    }
    
    if (!formData.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
    } else {
      // 중복 이메일 체크 (수정 시 자기 자신 제외)
      const isDuplicate = employees.some(
        emp => emp.email === formData.email && emp.id !== editingEmployee?.id
      );
      if (isDuplicate) {
        errors.email = "이미 등록된 이메일입니다.";
      }
    }
    
    if (!formData.department) {
      errors.department = "부서를 선택해주세요.";
    }
    
    if (!formData.role) {
      errors.role = "직급을 선택해주세요.";
    }
    
    if (formData.phone && !/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      errors.phone = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 직원 추가 Dialog 열기
  const handleOpenAddDialog = () => {
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormDialogOpen(true);
  };

  // 직원 수정 Dialog 열기
  const handleOpenEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      phone: employee.phone || "",
      hireDate: employee.hireDate || "",
    });
    setFormErrors({});
    setIsFormDialogOpen(true);
  };

  // 폼 제출 처리
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (editingEmployee) {
      // 수정 모드
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp, 
              name: formData.name,
              email: formData.email,
              department: formData.department,
              role: formData.role,
              phone: formData.phone,
              hireDate: formData.hireDate,
            } 
          : emp
      ));
      toast.success(`${formData.name}님의 정보가 수정되었습니다.`);
    } else {
      // 추가 모드
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        status: "대기",
        checkIn: "-",
        workTime: "-",
        phone: formData.phone,
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      };
      setEmployees([...employees, newEmployee]);
      toast.success(`${formData.name}님이 등록되었습니다.`);
    }
    
    setIsFormDialogOpen(false);
    setFormData(initialFormData);
    setEditingEmployee(null);
  };

  // 직원 삭제
  const handleDelete = (employee: Employee) => {
    if (window.confirm(`${employee.name}님을 삭제하시겠습니까?`)) {
      setEmployees(employees.filter(emp => emp.id !== employee.id));
      toast.success(`${employee.name}님이 삭제되었습니다.`);
    }
  };

  // 폼 입력 변경 처리
  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 제거
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">직원 관리</h1>
          <p className="text-muted-foreground">직원 목록을 조회하고 근태 현황을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload}
          />
          <Button variant="outline" onClick={handleDownloadTemplate} className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <FileText className="w-4 h-4 mr-2" /> 템플릿
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <Upload className="w-4 h-4 mr-2" /> 엑셀 업로드
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={handleOpenAddDialog}>
            <Plus className="w-4 h-4 mr-2" /> 직원 추가
          </Button>
        </div>
      </div>

      {/* 직원 추가/수정 Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {editingEmployee ? "직원 정보 수정" : "신규 직원 등록"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee 
                ? "직원의 정보를 수정합니다. 변경 후 저장 버튼을 클릭하세요."
                : "새로운 직원을 등록합니다. 필수 항목(*)을 모두 입력해주세요."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* 이름 */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                <User className="w-4 h-4" /> 이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* 이메일 */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> 이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* 부서 & 직급 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department" className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" /> 부서 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className={formErrors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.department && (
                  <p className="text-sm text-red-500">{formErrors.department}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role" className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> 직급 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="직급 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.role && (
                  <p className="text-sm text-red-500">{formErrors.role}</p>
                )}
              </div>
            </div>

            {/* 전화번호 */}
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> 전화번호
              </Label>
              <Input
                id="phone"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>

            {/* 입사일 */}
            <div className="grid gap-2">
              <Label htmlFor="hireDate" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> 입사일
              </Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingEmployee ? "저장" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <SelectItem value="영업팀">영업팀</SelectItem>
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
                            : employee.status === "결근"
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">{employee.checkIn}</TableCell>
                    <TableCell className="font-medium tabular-nums">{employee.workTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* 수정 버튼 */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEditDialog(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {/* 삭제 버튼 */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(employee)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        {/* 급여 설정 Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <DollarSign className="w-4 h-4 mr-1" /> 급여
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
                                  <option value="comprehensive">포괄임금제</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>기본급/총액 (원)</Label>
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
                              <Button className="w-full mt-4">저장하기</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
