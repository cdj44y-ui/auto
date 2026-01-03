import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Share2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const monthlyData = [
  { name: "1월", attendance: 95, late: 5 },
  { name: "2월", attendance: 92, late: 8 },
  { name: "3월", attendance: 96, late: 4 },
  { name: "4월", attendance: 94, late: 6 },
  { name: "5월", attendance: 98, late: 2 },
  { name: "6월", attendance: 91, late: 9 },
];

const departmentData = [
  { name: "개발팀", value: 45, color: "#007AFF" },
  { name: "디자인팀", value: 25, color: "#5E5CE6" },
  { name: "마케팅팀", value: 20, color: "#FF9500" },
  { name: "인사팀", value: 10, color: "#34C759" },
];

const weeklyTrendData = [
  { day: "월", present: 138, absent: 4 },
  { day: "화", present: 140, absent: 2 },
  { day: "수", present: 135, absent: 7 },
  { day: "목", present: 141, absent: 1 },
  { day: "금", present: 130, absent: 12 },
];

export default function Reports() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">통계 및 보고서</h1>
          <p className="text-muted-foreground">근태 추세를 시각화하고 데이터를 내보냅니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this_month">
            <SelectTrigger className="w-[180px] bg-white rounded-xl border-none shadow-sm">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">이번 주</SelectItem>
              <SelectItem value="this_month">이번 달</SelectItem>
              <SelectItem value="last_month">지난 달</SelectItem>
              <SelectItem value="this_year">올해</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <Share2 className="w-4 h-4 mr-2" /> 공유
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Download className="w-4 h-4 mr-2" /> PDF 내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Attendance Trend */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>월별 근태 추세</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#007AFF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAttendance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>부서별 인원 분포</CardTitle>
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
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Breakdown */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>주간 상세 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData} barSize={40}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                <Tooltip 
                  cursor={{ fill: '#f5f5f7' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="present" name="출석" fill="#34C759" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" name="결석" fill="#FF3B30" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
