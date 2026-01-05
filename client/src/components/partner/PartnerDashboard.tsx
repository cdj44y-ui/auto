import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Building2, 
  Users, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from "lucide-react";
import { Client, ClientStatus, SubscriptionPlan } from "@/types/saas";

// Mock Data
const MOCK_CLIENTS: Client[] = [
  {
    client_id: "c1",
    partner_id: "p1",
    company_name: "(주)희연푸드",
    business_registration_number: "123-45-67890",
    industry_type: "음식점업",
    employee_count: 45,
    representative_name: "김희연",
    contact_person: "이매니저",
    contact_phone: "010-1234-5678",
    contact_email: "manager@heeyeon.com",
    subscription_plan: "standard",
    subscription_start_date: "2025-01-01",
    subscription_end_date: "2025-12-31",
    status: "active",
    created_at: "2024-12-15",
    updated_at: "2025-01-01",
    assigned_modules: ["attendance", "payroll", "contract"],
    feature_flags: { gps_tracking: true },
    usage_limits: { max_users: 50 }
  },
  {
    client_id: "c2",
    partner_id: "p1",
    company_name: "테크스타트업",
    business_registration_number: "222-33-44444",
    industry_type: "소프트웨어 개발",
    employee_count: 12,
    representative_name: "박대표",
    contact_person: "최인사",
    contact_phone: "010-9876-5432",
    contact_email: "hr@techstart.io",
    subscription_plan: "basic",
    subscription_start_date: "2025-02-01",
    subscription_end_date: "2026-01-31",
    status: "trial",
    created_at: "2025-02-01",
    updated_at: "2025-02-01",
    assigned_modules: ["attendance"],
    feature_flags: { gps_tracking: false },
    usage_limits: { max_users: 20 }
  }
];

export default function PartnerDashboard() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> 활성</Badge>;
      case "trial":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200"><Clock className="w-3 h-3 mr-1" /> 체험판</Badge>;
      case "expired":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> 만료됨</Badge>;
      case "suspended":
        return <Badge variant="outline" className="text-gray-500">정지됨</Badge>;
    }
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "premium":
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Premium</Badge>;
      case "standard":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Standard</Badge>;
      case "basic":
        return <Badge variant="outline" className="border-gray-400 text-gray-600">Basic</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">고객사 관리 (Partner Center)</h2>
          <p className="text-muted-foreground">
            관리 중인 고객사의 구독 상태와 모듈 권한을 제어합니다.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          신규 고객사 등록
        </Button>
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 고객사</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">전월 대비 +2개사 증가</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 구독</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">98% 갱신율 유지 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 관리 직원</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.reduce((acc, curr) => acc + curr.employee_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">라이선스 한도 85% 사용</p>
          </CardContent>
        </Card>
      </div>

      {/* 고객사 목록 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>고객사 목록</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="회사명 또는 대표자 검색..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>회사명</TableHead>
                <TableHead>구독 플랜</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>직원 수</TableHead>
                <TableHead>구독 기간</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.client_id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{client.company_name}</span>
                      <span className="text-xs text-muted-foreground">{client.business_registration_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(client.subscription_plan)}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>{client.employee_count}명</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {client.subscription_start_date} ~ {client.subscription_end_date}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{client.contact_person}</span>
                      <span className="text-xs text-muted-foreground">{client.contact_phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
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
