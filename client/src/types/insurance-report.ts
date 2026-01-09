export type InsuranceType = "national_pension" | "health_insurance" | "employment_insurance" | "workers_compensation";
export type ReportType = "acquisition" | "loss"; // 취득 | 상실
export type ReportStatus = "draft" | "pending" | "submitted" | "completed" | "rejected";

export interface InsuranceReport {
  id: string;
  employeeId: string;
  employeeName: string;
  residentNumber: string; // 주민등록번호 (masked)
  reportType: ReportType;
  targetInsurances: InsuranceType[];
  
  // 취득 신고 정보
  acquisitionDate?: string; // 자격취득일
  monthlyIncome?: number; // 월평균보수월액
  jobType?: string; // 직종부호
  
  // 상실 신고 정보
  lossDate?: string; // 상실일 (퇴사일 다음날)
  lossReasonCode?: string; // 상실사유코드 (예: 11. 개인사정)
  lossReasonDetail?: string; // 구체적 사유
  
  status: ReportStatus;
  submittedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
}

export const MOCK_INSURANCE_REPORTS: InsuranceReport[] = [
  {
    id: "rep-001",
    employeeId: "emp-001",
    employeeName: "김철수",
    residentNumber: "800101-1******",
    reportType: "acquisition",
    targetInsurances: ["national_pension", "health_insurance", "employment_insurance", "workers_compensation"],
    acquisitionDate: "2024-01-02",
    monthlyIncome: 3500000,
    jobType: "경영지원 사무원",
    status: "completed",
    submittedAt: "2024-01-05",
    completedAt: "2024-01-07"
  },
  {
    id: "rep-002",
    employeeId: "emp-005",
    employeeName: "이영희",
    residentNumber: "920505-2******",
    reportType: "loss",
    targetInsurances: ["national_pension", "health_insurance", "employment_insurance", "workers_compensation"],
    lossDate: "2024-02-01",
    lossReasonCode: "11",
    lossReasonDetail: "개인 사정으로 인한 자진 퇴사",
    status: "pending",
    submittedAt: "2024-02-02"
  },
  {
    id: "rep-003",
    employeeId: "emp-012",
    employeeName: "박지성",
    residentNumber: "880301-1******",
    reportType: "acquisition",
    targetInsurances: ["employment_insurance"],
    acquisitionDate: "2024-03-01",
    monthlyIncome: 4200000,
    jobType: "소프트웨어 개발자",
    status: "draft"
  }
];
