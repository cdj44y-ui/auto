import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Calculator, 
  FileSpreadsheet, 
  Settings, 
  CalendarClock, 
  Download, 
  Upload,
  Search,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";

// 하위 컴포넌트 (추후 분리 가능)
import ConsultantWorkerSettings from "./payroll/ConsultantWorkerSettings";
import ConsultantWorkRecordGrid from "./payroll/ConsultantWorkRecordGrid";
import ConsultantPayrollRegister from "./payroll/ConsultantPayrollRegister";
import ConsultantBulkUpload from "./payroll/ConsultantBulkUpload";

// 모의 데이터: 관리 중인 회사 목록
const managedCompanies = [
  { id: "1", name: "(주)테크스타트업", employees: 45, type: "IT/소프트웨어", status: "active" },
  { id: "2", name: "글로벌무역상사", employees: 12, type: "도소매/유통", status: "warning" },
  { id: "3", name: "퓨처디자인랩", employees: 8, type: "디자인/광고", status: "active" },
  { id: "4", name: "스마트제조", employees: 120, type: "제조업", status: "active" },
];

export default function ConsultantPayrollManager() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("records");

  const selectedCompany = managedCompanies.find(c => c.id === selectedCompanyId);

  if (!selectedCompanyId) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">전문가 급여정산</h2>
          <p className="text-muted-foreground">
            급여 정산을 진행할 고객사를 선택해주세요. 회사별로 독립적인 급여 정책과 데이터를 관리할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managedCompanies.map((company) => (
            <Card 
              key={company.id} 
              className="cursor-pointer hover:border-indigo-500 transition-all hover:shadow-md group"
              onClick={() => setSelectedCompanyId(company.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {company.status === 'warning' && (
                    <Badge variant="destructive">확인 필요</Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-lg">{company.name}</CardTitle>
                <CardDescription>{company.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>직원 {company.employees}명</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>관리하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 헤더: 회사 정보 및 변경 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {selectedCompany?.name}
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                {selectedCompany?.type}
              </Badge>
            </h2>
            <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
              <Users className="w-4 h-4" /> 총 직원 {selectedCompany?.employees}명
              <span className="text-slate-300">|</span>
              2026년 1월 귀속분 작업 중
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setSelectedCompanyId(null)}>
            다른 회사 선택
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Calculator className="w-4 h-4 mr-2" /> 급여 마감 및 확정
          </Button>
        </div>
      </div>

      {/* 메인 작업 영역 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px] bg-white dark:bg-slate-900 h-12 p-1">
          <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 h-10">
            <Settings className="w-4 h-4 mr-2" /> 급여/계약 설정
          </TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 h-10">
            <CalendarClock className="w-4 h-4 mr-2" /> 근무기록 관리
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 h-10">
            <Calculator className="w-4 h-4 mr-2" /> 급여대장 산출
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 h-10">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> 엑셀 일괄처리
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="settings" className="mt-0">
            <ConsultantWorkerSettings companyId={selectedCompanyId} />
          </TabsContent>
          
          <TabsContent value="records" className="mt-0">
            <ConsultantWorkRecordGrid companyId={selectedCompanyId} />
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <ConsultantPayrollRegister companyId={selectedCompanyId} />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0">
            <ConsultantBulkUpload companyId={selectedCompanyId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
