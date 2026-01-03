import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, BrainCircuit, Calendar as CalendarIcon, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const overtimeData = [
  { name: "1주", hours: 12 },
  { name: "2주", hours: 18 },
  { name: "3주", hours: 15 },
  { name: "4주", hours: 24 },
];

const departmentData = [
  { name: "개발팀", value: 45, color: "#3b82f6" },
  { name: "디자인팀", value: 25, color: "#8b5cf6" },
  { name: "마케팅팀", value: 20, color: "#f97316" },
  { name: "경영지원", value: 10, color: "#10b981" },
];

export default function Insights() {
  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" /> AI 인사이트
          </h1>
          <p className="text-muted-foreground">근태 데이터를 분석하여 조직 관리 인사이트를 제공합니다.</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <CalendarIcon className="w-4 h-4 mr-2" /> 캘린더 연동 설정
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> 초과근무 예측
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 mb-1">주의 단계</div>
            <p className="text-xs text-muted-foreground mb-4">지난달 대비 15% 증가 추세입니다.</p>
            <Progress value={75} className="h-2 bg-purple-100 [&>div]:bg-purple-500" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <Users className="w-4 h-4" /> 적정 인원 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 mb-1">2명 부족</div>
            <p className="text-xs text-muted-foreground mb-4">개발팀 업무 부하가 높습니다.</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">채용 권장</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 번아웃 위험군
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 mb-1">3명 감지</div>
            <p className="text-xs text-muted-foreground mb-4">연속 야근자가 발생했습니다.</p>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-orange-700 hover:text-orange-800 hover:bg-orange-100">
              대상자 확인 &rarr;
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>주간 초과근무 추이</CardTitle>
            <CardDescription>최근 4주간의 초과근무 시간 변화를 분석합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overtimeData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>부서별 업무 부하도</CardTitle>
            <CardDescription>부서별 총 근무 시간 비중을 시각화합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {departmentData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
