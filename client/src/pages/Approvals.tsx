import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const pendingCompanies = [
  { id: 1, name: "(주)테크스타트", admin: "김대표", email: "ceo@techstart.com", date: "2026-01-03" },
  { id: 2, name: "디자인랩", admin: "이디자", email: "lee@designlab.kr", date: "2026-01-02" },
];

const pendingEmployees = [
  { id: 1, name: "박신입", email: "park@company.com", department: "개발팀", date: "2026-01-03" },
  { id: 2, name: "최인턴", email: "choi@company.com", department: "마케팅팀", date: "2026-01-03" },
];

export default function Approvals() {
  const handleApprove = (name: string, type: string) => {
    toast.success(`${name}님의 ${type} 승인이 완료되었습니다.`);
  };

  const handleReject = (name: string, type: string) => {
    toast.error(`${name}님의 ${type} 승인이 거절되었습니다.`);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">승인 관리</h1>
        <p className="text-muted-foreground">가입 신청 및 요청 사항을 승인합니다.</p>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm">
          <TabsTrigger value="employees" className="rounded-lg">직원 가입 요청</TabsTrigger>
          <TabsTrigger value="companies" className="rounded-lg">회사 가입 요청 (슈퍼관리자)</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>승인 대기 중인 직원 ({pendingEmployees.length}명)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email} • {employee.department}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => handleReject(employee.name, "가입")}
                      >
                        <X className="w-4 h-4 mr-1" /> 거절
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleApprove(employee.name, "가입")}
                      >
                        <Check className="w-4 h-4 mr-1" /> 승인
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>승인 대기 중인 회사 ({pendingCompanies.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{company.name}</p>
                          <Badge variant="outline" className="text-xs">신규 신청</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">대표: {company.admin} • {company.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => handleReject(company.name, "입점")}
                      >
                        <X className="w-4 h-4 mr-1" /> 거절
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleApprove(company.name, "입점")}
                      >
                        <Check className="w-4 h-4 mr-1" /> 승인
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
