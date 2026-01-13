import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Download, UserPlus, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Pencil, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import * as XLSX from 'xlsx';
import EmployeeDetailForm, { EmployeeFormData } from "./EmployeeDetailForm";
import { Input } from "@/components/ui/input";

export default function EmployeeManagement() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [detailFormOpen, setDetailFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeFormData | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch employees from database
  const { data: employees, isLoading, refetch } = trpc.employee.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Bulk create mutation
  const bulkCreateMutation = trpc.employee.bulkCreate.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count}명의 직원이 성공적으로 등록되었습니다.`);
      setUploadDialogOpen(false);
      setPreviewData([]);
      refetch();
    },
    onError: (error) => {
      toast.error(`등록 실패: ${error.message}`);
    },
  });

  // Create single employee mutation
  const createMutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      throw error;
    },
  });

  // Update employee mutation
  const updateMutation = trpc.employee.update.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      throw error;
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Validate and format data
      const formattedData = data.map((row: any, index) => {
        const name = row['이름'] || row['Name'] || '';
        const email = row['이메일'] || row['Email'] || '';
        const department = row['부서'] || row['Department'] || '';
        
        return {
          employeeId: `EMP${String(Date.now()).slice(-6)}${String(index + 1).padStart(3, '0')}`,
          name,
          department,
          position: row['직급'] || row['Position'] || '사원',
          email: email || undefined,
          phone: row['전화번호'] || row['Phone'] || undefined,
          joinDate: row['입사일'] || row['JoinDate'] ? new Date(row['입사일'] || row['JoinDate']) : undefined,
          isValid: !!name && !!department,
        };
      });

      setPreviewData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmUpload = () => {
    const validRows = previewData.filter(row => row.isValid);
    if (validRows.length === 0) {
      toast.error("등록할 수 있는 유효한 데이터가 없습니다.");
      return;
    }

    // Remove isValid field before sending to API
    const employeesToCreate = validRows.map(({ isValid, ...rest }) => rest);
    bulkCreateMutation.mutate(employeesToCreate);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 이름: "홍길동", 부서: "개발팀", 직급: "사원", 이메일: "hong@example.com", 전화번호: "010-1234-5678", 입사일: "2026-01-01" },
      { 이름: "김영희", 부서: "디자인팀", 직급: "대리", 이메일: "kim@example.com", 전화번호: "010-9876-5432", 입사일: "2026-02-01" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "직원등록양식");
    XLSX.writeFile(wb, "직원일괄등록_양식.xlsx");
  };

  const handleOpenCreateForm = () => {
    setSelectedEmployee(null);
    setFormMode("create");
    setDetailFormOpen(true);
  };

  const handleOpenEditForm = (emp: any) => {
    setSelectedEmployee({
      id: emp.id,
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      position: emp.position || "",
      hireDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split("T")[0] : "",
      salary: emp.salary || 0,
      bankAccount: emp.bankAccount || "",
      bankName: emp.bankName || "",
      status: emp.status === "active" ? "active" : emp.status === "leave" ? "inactive" : "pending",
    });
    setFormMode("edit");
    setDetailFormOpen(true);
  };

  const handleSaveEmployee = async (data: EmployeeFormData) => {
    if (formMode === "create") {
      await createMutation.mutateAsync({
        employeeId: `EMP${String(Date.now()).slice(-6)}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: data.name,
        department: data.department,
        position: data.position,
        email: data.email || undefined,
        phone: data.phone || undefined,
        joinDate: data.hireDate ? new Date(data.hireDate) : undefined,
        salary: data.salary,
        bankAccount: data.bankAccount || undefined,
        bankName: data.bankName || undefined,
        status: data.status === "active" ? "active" : data.status === "inactive" ? "leave" : "active",
      });
    } else if (data.id) {
      await updateMutation.mutateAsync({
        id: data.id,
        name: data.name,
        department: data.department,
        position: data.position,
        email: data.email || undefined,
        phone: data.phone || undefined,
        joinDate: data.hireDate ? new Date(data.hireDate) : undefined,
        salary: data.salary,
        bankAccount: data.bankAccount || undefined,
        bankName: data.bankName || undefined,
        status: data.status === "active" ? "active" : data.status === "inactive" ? "leave" : "active",
      });
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees?.filter((emp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(query) ||
      emp.employeeId?.toLowerCase().includes(query) ||
      emp.department?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">직원 관리</h2>
          <p className="text-sm text-muted-foreground">직원 정보를 조회하고 신규 입사자를 등록합니다.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="w-4 h-4" /> 엑셀 일괄 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>직원 일괄 등록</DialogTitle>
                <DialogDescription>
                  엑셀 파일을 업로드하여 여러 명의 직원을 한 번에 등록할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">엑셀 파일 업로드</p>
                      <p className="text-xs text-muted-foreground">.xlsx, .xls 형식 지원</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                      <Download className="w-3 h-3 mr-1" /> 양식 다운로드
                    </Button>
                    <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-3 h-3 mr-1" /> 파일 선택
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".xlsx, .xls" 
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {previewData.length > 0 && (
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">상태</TableHead>
                          <TableHead>이름</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>직급</TableHead>
                          <TableHead>이메일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, i) => (
                          <TableRow key={i} className={!row.isValid ? "bg-red-50 dark:bg-red-900/10" : ""}>
                            <TableCell>
                              {row.isValid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.department}</TableCell>
                            <TableCell>{row.position}</TableCell>
                            <TableCell>{row.email || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>취소</Button>
                <Button 
                  onClick={handleConfirmUpload} 
                  disabled={previewData.length === 0 || bulkCreateMutation.isPending}
                >
                  {bulkCreateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {previewData.filter(r => r.isValid).length}명 등록하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2" onClick={handleOpenCreateForm}>
            <UserPlus className="w-4 h-4" /> 신규 등록
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="이름, 사번, 부서, 이메일로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>입사일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees && filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.employeeId}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.position || '-'}</TableCell>
                    <TableCell>{emp.email || '-'}</TableCell>
                    <TableCell>{emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('ko-KR') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={emp.status === 'active' ? 'default' : 'secondary'} className={
                        emp.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-0' : ''
                      }>
                        {emp.status === 'active' ? '재직중' : emp.status === 'leave' ? '휴직' : '퇴사'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleOpenEditForm(emp)}
                      >
                        <Pencil className="w-3 h-3" /> 수정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery 
                      ? "검색 결과가 없습니다." 
                      : "등록된 직원이 없습니다. 신규 등록 또는 엑셀 일괄 등록을 통해 직원을 추가해 보세요."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Detail Form */}
      <EmployeeDetailForm
        open={detailFormOpen}
        onOpenChange={setDetailFormOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={formMode}
      />
    </div>
  );
}
