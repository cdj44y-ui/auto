import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, CreditCard, Loader2 } from "lucide-react";

export interface EmployeeFormData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  bankAccount?: string;
  bankName?: string;
  status: "active" | "inactive" | "pending";
}

interface EmployeeDetailFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: EmployeeFormData | null;
  onSave: (data: EmployeeFormData) => Promise<void>;
  mode: "create" | "edit";
}

const departments = [
  "경영지원팀",
  "인사팀",
  "재무팀",
  "개발팀",
  "마케팅팀",
  "영업팀",
  "디자인팀",
  "기획팀",
  "CS팀",
];

const positions = [
  "사원",
  "주임",
  "대리",
  "과장",
  "차장",
  "부장",
  "이사",
  "상무",
  "전무",
  "대표이사",
];

const banks = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "SC제일은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
];

const initialFormData: EmployeeFormData = {
  name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  hireDate: new Date().toISOString().split("T")[0],
  salary: 0,
  bankAccount: "",
  bankName: "",
  status: "active",
};

export default function EmployeeDetailForm({
  open,
  onOpenChange,
  employee,
  onSave,
  mode,
}: EmployeeDetailFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee && mode === "edit") {
      setFormData(employee);
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [employee, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요";
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ""))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다";
    }

    if (!formData.department) {
      newErrors.department = "부서를 선택해주세요";
    }

    if (!formData.position) {
      newErrors.position = "직급을 선택해주세요";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "입사일을 입력해주세요";
    }

    if (formData.salary <= 0) {
      newErrors.salary = "급여를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("입력 정보를 확인해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success(mode === "create" ? "직원이 등록되었습니다" : "직원 정보가 수정되었습니다");
      onOpenChange(false);
    } catch (error) {
      toast.error("저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {mode === "create" ? "신규 직원 등록" : "직원 정보 수정"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "새로운 직원의 정보를 입력해주세요. * 표시는 필수 항목입니다."
              : "직원 정보를 수정할 수 있습니다. * 표시는 필수 항목입니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  이름 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  이메일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hong@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  전화번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                  className={errors.phone ? "border-destructive" : ""}
                  maxLength={13}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              {/* 입사일 */}
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  입사일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className={errors.hireDate ? "border-destructive" : ""}
                />
                {errors.hireDate && <p className="text-xs text-destructive">{errors.hireDate}</p>}
              </div>
            </div>
          </div>

          {/* 소속 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">소속 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 부서 */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  부서 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                    <SelectValue placeholder="부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>

              {/* 직급 */}
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  직급 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger className={errors.position ? "border-destructive" : ""}>
                    <SelectValue placeholder="직급 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-xs text-destructive">{errors.position}</p>}
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-1">
                  상태
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "pending") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">재직</SelectItem>
                    <SelectItem value="inactive">퇴직</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 급여 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">급여 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 기본급 */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  기본급 (월) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="salary"
                    type="text"
                    placeholder="3,000,000"
                    value={formData.salary > 0 ? formatSalary(formData.salary) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      setFormData({ ...formData, salary: parseInt(value) || 0 });
                    }}
                    className={`pr-8 ${errors.salary ? "border-destructive" : ""}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    원
                  </span>
                </div>
                {errors.salary && <p className="text-xs text-destructive">{errors.salary}</p>}
              </div>

              {/* 은행 */}
              <div className="space-y-2">
                <Label htmlFor="bankName" className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  급여 은행
                </Label>
                <Select
                  value={formData.bankName || ""}
                  onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="은행 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 계좌번호 */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bankAccount" className="flex items-center gap-1">
                  계좌번호
                </Label>
                <Input
                  id="bankAccount"
                  placeholder="123-456-789012"
                  value={formData.bankAccount || ""}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                mode === "create" ? "등록하기" : "저장하기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
