import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Plus, Trash2, Calculator, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface WorkLog {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  breakTime: number; // 분 단위
  workHours: number;
}

export default function ManualWorkLogCalculator() {
  const [hourlyRate, setHourlyRate] = useState(9860); // 2024년 최저시급
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "18:00",
    breakTime: 60
  });

  // 근무 시간 계산 함수
  const calculateHours = (start: string, end: string, breakMinutes: number) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    
    let diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // 시간 단위
    if (diff < 0) diff += 24; // 자정을 넘긴 경우
    
    const breakHours = breakMinutes / 60;
    return Math.max(0, diff - breakHours);
  };

  const handleAddLog = () => {
    const hours = calculateHours(newLog.startTime, newLog.endTime, newLog.breakTime);
    
    const log: WorkLog = {
      id: Date.now(),
      date: newLog.date,
      startTime: newLog.startTime,
      endTime: newLog.endTime,
      breakTime: newLog.breakTime,
      workHours: Number(hours.toFixed(2))
    };

    setWorkLogs([...workLogs, log].sort((a, b) => a.date.localeCompare(b.date)));
    toast.success("근무 기록이 추가되었습니다.");
  };

  const handleDeleteLog = (id: number) => {
    setWorkLogs(workLogs.filter(log => log.id !== id));
  };

  // 급여 계산 로직
  const totalWorkHours = workLogs.reduce((sum, log) => sum + log.workHours, 0);
  const weeklyHours = totalWorkHours / 4; // 대략적인 주 평균 (실제로는 주차별 계산 필요하지만 여기선 단순화)
  const isWeeklyHolidayEligible = weeklyHours >= 15;
  
  const baseSalary = Math.floor(totalWorkHours * hourlyRate);
  // 주휴수당: 주 15시간 이상 시 (주평균시간 / 40 * 8 * 시급 * 4주) 약식 계산
  // 정확히는: (총근로시간 / 4) / 40 * 8 * 시급 * 4 (월 기준)
  // 더 단순하게: 1주 만근 시 하루치 유급휴일 -> 비례 계산
  const weeklyHolidayPay = isWeeklyHolidayEligible 
    ? Math.floor((totalWorkHours / 20) * 8 * hourlyRate) // 대략 20일 근무 기준 비율 (약식)
    : 0;
    
  const totalSalary = baseSalary + weeklyHolidayPay;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-sm bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              일별 근무 기록 입력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 items-end">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label>날짜</Label>
                <Input 
                  type="date" 
                  value={newLog.date}
                  onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>출근 시간</Label>
                <Input 
                  type="time" 
                  value={newLog.startTime}
                  onChange={(e) => setNewLog({...newLog, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>퇴근 시간</Label>
                <Input 
                  type="time" 
                  value={newLog.endTime}
                  onChange={(e) => setNewLog({...newLog, endTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>휴게 (분)</Label>
                <Input 
                  type="number" 
                  value={newLog.breakTime}
                  onChange={(e) => setNewLog({...newLog, breakTime: Number(e.target.value)})}
                />
              </div>
              <Button onClick={handleAddLog} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" /> 추가
              </Button>
            </div>

            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead className="text-right">휴게시간</TableHead>
                    <TableHead className="text-right">인정근무</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        근무 기록을 추가해주세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.startTime} ~ {log.endTime}</TableCell>
                        <TableCell className="text-right">{log.breakTime}분</TableCell>
                        <TableCell className="text-right font-medium">{log.workHours}시간</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm sticky top-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              실시간 급여 계산
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>적용 시급 (원)</Label>
              <Input 
                type="number" 
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="text-right font-bold text-lg"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">총 근무 시간</span>
                <span className="font-bold text-lg">{totalWorkHours.toFixed(1)} 시간</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">주 평균 근무</span>
                <span className={`font-bold ${isWeeklyHolidayEligible ? "text-blue-600" : "text-red-500"}`}>
                  약 {weeklyHours.toFixed(1)} 시간
                </span>
              </div>

              {!isWeeklyHolidayEligible && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong>주휴수당 미발생</strong><br/>
                    주 15시간 미만 근무 시 주휴수당이 발생하지 않습니다.
                  </div>
                </div>
              )}

              {isWeeklyHolidayEligible && (
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong>주휴수당 적용 대상</strong><br/>
                    주 15시간 이상 근무하여 주휴수당이 포함됩니다.
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>기본급</span>
                  <span>{baseSalary.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>주휴수당 (예상)</span>
                  <span>+{weeklyHolidayPay.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-xl mt-2">
                  <span>예상 급여</span>
                  <span>{totalSalary.toLocaleString()} 원</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-lg">
              급여 대장에 저장하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
