import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Clock, Save } from "lucide-react";
import { toast } from "sonner";

// Mock Data for Shift Types
const SHIFT_TYPES = [
  { id: "D", name: "Day", time: "07:00 - 15:00", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { id: "E", name: "Evening", time: "15:00 - 23:00", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "N", name: "Night", time: "23:00 - 07:00", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "O", name: "Off", time: "휴무", color: "bg-slate-100 text-slate-500 border-slate-200" },
];

// Mock Data for Employees
const EMPLOYEES = [
  { id: "emp1", name: "김철수", team: "생산 1팀" },
  { id: "emp2", name: "이영희", team: "생산 1팀" },
  { id: "emp3", name: "박지성", team: "생산 1팀" },
  { id: "emp4", name: "손흥민", team: "생산 2팀" },
  { id: "emp5", name: "황희찬", team: "생산 2팀" },
];

export default function ShiftScheduler() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState("all");
  
  // 7일치 스케줄 데이터 (Mock)
  const [schedule, setSchedule] = useState<Record<string, string[]>>({
    "emp1": ["D", "D", "E", "E", "N", "N", "O"],
    "emp2": ["E", "E", "N", "N", "O", "O", "D"],
    "emp3": ["N", "N", "O", "O", "D", "D", "E"],
    "emp4": ["D", "D", "D", "D", "D", "O", "O"],
    "emp5": ["O", "O", "E", "E", "E", "E", "E"],
  });

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const dates = Array.from({ length: 7 }, (_, i) => i + 1); // 1일 ~ 7일

  const handleShiftChange = (empId: string, dayIndex: number) => {
    const currentShift = schedule[empId][dayIndex];
    const shiftOrder = ["D", "E", "N", "O"];
    const nextShiftIndex = (shiftOrder.indexOf(currentShift) + 1) % shiftOrder.length;
    const nextShift = shiftOrder[nextShiftIndex];

    setSchedule(prev => ({
      ...prev,
      [empId]: prev[empId].map((s, i) => i === dayIndex ? nextShift : s)
    }));
  };

  const getShiftStyle = (typeId: string) => {
    return SHIFT_TYPES.find(t => t.id === typeId)?.color || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">교대 근무 스케줄링</h2>
          <p className="text-muted-foreground">
            생산직/현장직을 위한 근무표를 편성합니다. 클릭하여 근무조를 변경하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("엑셀로 다운로드되었습니다.")}>
            엑셀 다운로드
          </Button>
          <Button onClick={() => toast.success("근무표가 저장되고 직원들에게 알림이 발송되었습니다.")}>
            <Save className="h-4 w-4 mr-2" />
            게시 및 알림
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            2026년 1월 1주차
          </h3>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {SHIFT_TYPES.map(type => (
              <div key={type.id} className="flex items-center gap-1 text-xs">
                <span className={`w-3 h-3 rounded-full ${type.color.split(' ')[0]}`}></span>
                <span>{type.name}</span>
              </div>
            ))}
          </div>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="팀 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 보기</SelectItem>
              <SelectItem value="team1">생산 1팀</SelectItem>
              <SelectItem value="team2">생산 2팀</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3 font-medium w-[150px]">직원</th>
                {days.map((day, i) => (
                  <th key={day} className={`px-4 py-3 font-medium text-center ${day === '토' ? 'text-blue-500' : day === '일' ? 'text-red-500' : ''}`}>
                    {dates[i]}일 ({day})
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-center w-[100px]">주간 합계</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {EMPLOYEES.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-xs text-muted-foreground">{emp.team}</div>
                  </td>
                  {schedule[emp.id].map((shift, i) => (
                    <td key={i} className="px-2 py-2 text-center">
                      <button 
                        onClick={() => handleShiftChange(emp.id, i)}
                        className={`w-full py-2 rounded-md font-medium text-xs border transition-all hover:scale-105 ${getShiftStyle(shift)}`}
                      >
                        {shift}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-medium text-slate-600">
                    {schedule[emp.id].filter(s => s !== 'O').length * 8}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Day (주간) 근무자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(schedule).flat().filter(s => s === 'D').length}명
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evening (석간) 근무자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(schedule).flat().filter(s => s === 'E').length}명
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Night (야간) 근무자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(schedule).flat().filter(s => s === 'N').length}명
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
