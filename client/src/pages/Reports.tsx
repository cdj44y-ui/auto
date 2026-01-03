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
  { name: "Jan", attendance: 95, late: 5 },
  { name: "Feb", attendance: 92, late: 8 },
  { name: "Mar", attendance: 96, late: 4 },
  { name: "Apr", attendance: 94, late: 6 },
  { name: "May", attendance: 98, late: 2 },
  { name: "Jun", attendance: 91, late: 9 },
];

const departmentData = [
  { name: "Engineering", value: 45, color: "#007AFF" },
  { name: "Design", value: 25, color: "#5E5CE6" },
  { name: "Marketing", value: 20, color: "#FF9500" },
  { name: "HR", value: 10, color: "#34C759" },
];

const weeklyTrendData = [
  { day: "Mon", present: 138, absent: 4 },
  { day: "Tue", present: 140, absent: 2 },
  { day: "Wed", present: 135, absent: 7 },
  { day: "Thu", present: 141, absent: 1 },
  { day: "Fri", present: 130, absent: 12 },
];

export default function Reports() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Visualize trends and export data.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this_month">
            <SelectTrigger className="w-[180px] bg-white rounded-xl border-none shadow-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Attendance Trend */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
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
            <CardTitle>Department Distribution</CardTitle>
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
          <CardTitle>Weekly Breakdown</CardTitle>
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
                <Bar dataKey="present" name="Present" fill="#34C759" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#FF3B30" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
