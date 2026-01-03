import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, 
  Server, 
  Database, 
  Activity, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  Terminal
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 개발자용 레이아웃
function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-500" />
            <span className="font-mono font-bold text-lg">System Master Console</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <LogOut className="w-4 h-4 mr-2" /> Exit Console
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default function DeveloperDashboard() {
  const [companies, setCompanies] = useState([
    { id: 1, name: "(주)테크스타트업", status: "pending", users: 12, plan: "Enterprise" },
    { id: 2, name: "글로벌유통", status: "active", users: 156, plan: "Standard" },
    { id: 3, name: "퓨처디자인", status: "active", users: 45, plan: "Standard" },
    { id: 4, name: "스마트솔루션", status: "suspended", users: 8, plan: "Basic" },
  ]);

  const handleApprove = (id: number) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: "active" } : c));
    toast.success("회사 승인 처리가 완료되었습니다.");
  };

  const handleSuspend = (id: number) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: "suspended" } : c));
    toast.warning("해당 회사의 서비스 이용이 정지되었습니다.");
  };

  return (
    <DeveloperLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-green-500 mt-1">+5.4% active now</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">System Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">42%</div>
            <p className="text-xs text-slate-500 mt-1">CPU Usage</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">0.01%</div>
            <p className="text-xs text-slate-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="companies" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">회사 승인 관리</TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">시스템 모니터링</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">오류 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card className="bg-slate-900 border-slate-800 text-slate-50">
            <CardHeader>
              <CardTitle>회사 가입 승인 대기</CardTitle>
              <CardDescription className="text-slate-400">신규 가입 요청한 회사의 승인 여부를 결정합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        company.status === 'active' ? 'bg-green-900/30 text-green-500' :
                        company.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500' :
                        'bg-red-900/30 text-red-500'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{company.name}</h3>
                          <Badge variant="outline" className={`
                            ${company.status === 'active' ? 'border-green-800 text-green-500' :
                              company.status === 'pending' ? 'border-yellow-800 text-yellow-500' :
                              'border-red-800 text-red-500'}
                          `}>
                            {company.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">사용자 {company.users}명 • {company.plan} 플랜</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {company.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(company.id)}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> 승인
                        </Button>
                      )}
                      {company.status !== 'suspended' && (
                        <Button size="sm" variant="destructive" onClick={() => handleSuspend(company.id)}>
                          <XCircle className="w-4 h-4 mr-2" /> 정지
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800 text-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" /> API Server Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Instance #1 (ap-northeast-2a)</span>
                    <Badge className="bg-green-900 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Instance #2 (ap-northeast-2c)</span>
                    <Badge className="bg-green-900 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Worker Node #1</span>
                    <Badge className="bg-green-900 text-green-400">Processing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800 text-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" /> Database Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Connection Pool</span>
                      <span>85/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[85%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>1.2TB / 5TB</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[24%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DeveloperLayout>
  );
}

import { Building2 } from "lucide-react";
