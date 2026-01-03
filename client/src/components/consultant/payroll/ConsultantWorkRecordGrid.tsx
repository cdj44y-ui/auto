import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Save, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// 모의 근무 기록 데이터 (1월 1일 ~ 1월 7일)
const initialRecords = [
  { id: 1, date: "2026-01-01", day: "목", type: "holiday", worker: "김철수", startTime: "-", endTime: "-", breakTime: 0, workHours: 0, overtime: 0, night: 0, holiday: 8, status: "confirmed" },
  { id: 2, date: "2026-01-02", day: "금", type: "workday", worker: "김철수", startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, overtime: 0, night: 0, holiday: 0, status: "confirmed" },
  { id: 3, date: "2026-01-03", day: "토", type: "weekend", worker: "김철수", startTime: "13:00", endTime: "17:00", breakTime: 0, workHours: 4, overtime: 4, night: 0, holiday: 0, status: "pending" }, // 토요일 근무는 연장으로 간주 (설정에 따라 다름)
  { id: 4, date: "2026-01-04", day: "일", type: "weekend", worker: "김철수", startTime: "-", endTime: "-", breakTime: 0, workHours: 0, overtime: 0, night: 0, holiday: 0, status: "confirmed" },
  { id: 5, date: "2026-01-05", day: "월", type: "workday", worker: "김철수", startTime: "09:00", endTime: "21:00", breakTime: 60, workHours: 11, overtime: 3, night: 0, holiday: 0, status: "warning" }, // 52시간 경고 등
  { id: 6, date: "2026-01-06", day: "화", type: "workday", worker: "김철수", startTime: "09:00", endTime: "23:00", breakTime: 60, workHours: 13, overtime: 5, night: 1, holiday: 0, status: "confirmed" }, // 야간 1시간 포함
];

export default function ConsultantWorkRecordGrid({ companyId }: { companyId: string | null }) {
  const [records, setRecords] = useState(initialRecords);
  const [selectedWorker, setSelectedWorker] = useState("김철수");

  const handleTimeChange = (id: number, field: string, value: string) => {
    // 실제 구현 시에는 시간 변경에 따라 workHours, overtime, night 등을 재계산하는 로직 필요
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, status: "pending" } : r));
  };

  const handleRecalculate = () => {
    toast.success("근무 시간 및 수당이 재계산되었습니다.");
    // 재계산 로직 시뮬레이션: pending 상태를 confirmed로 변경
    setRecords(records.map(r => ({ ...r, status: "confirmed" })));
  };

  const handleSave = () => {
    toast.success("근무 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedWorker} onValueChange={setSelectedWorker}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="근로자 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="김철수">김철수 (개발팀)</SelectItem>
              <SelectItem value="이영희">이영희 (디자인팀)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" /> 2026년 1월 귀속분
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRecalculate}>
            <RefreshCw className="w-4 h-4 mr-2" /> 수당 재계산
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" /> 변경사항 저장
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900">
                <TableHead className="w-[120px]">날짜/요일</TableHead>
                <TableHead>근무 유형</TableHead>
                <TableHead>출근 시간</TableHead>
                <TableHead>퇴근 시간</TableHead>
                <TableHead>휴게(분)</TableHead>
                <TableHead className="text-blue-600 font-bold">총 근로</TableHead>
                <TableHead className="text-orange-600 font-bold">연장</TableHead>
                <TableHead className="text-purple-600 font-bold">야간</TableHead>
                <TableHead className="text-red-600 font-bold">휴일</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className={record.day === '일' ? 'bg-red-50/30' : record.day === '토' ? 'bg-blue-50/30' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        record.day === '일' ? 'text-red-500' : 
                        record.day === '토' ? 'text-blue-500' : ''
                      }`}>
                        {record.date} ({record.day})
                      </span>
                      {record.date === '2026-01-01' && <Badge variant="destructive" className="text-[10px] px-1 py-0">신정</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={record.type}>
                      <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workday">소정근로</SelectItem>
                        <SelectItem value="weekend">휴무일</SelectItem>
                        <SelectItem value="holiday">유급휴일</SelectItem>
                        <SelectItem value="off">무급휴무</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8 w-24" 
                      value={record.startTime} 
                      onChange={(e) => handleTimeChange(record.id, 'startTime', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8 w-24" 
                      value={record.endTime} 
                      onChange={(e) => handleTimeChange(record.id, 'endTime', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="h-8 w-16" 
                      value={record.breakTime} 
                      onChange={(e) => handleTimeChange(record.id, 'breakTime', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="font-bold">{record.workHours}h</TableCell>
                  <TableCell className="text-orange-600">{record.overtime > 0 ? `${record.overtime}h` : '-'}</TableCell>
                  <TableCell className="text-purple-600">{record.night > 0 ? `${record.night}h` : '-'}</TableCell>
                  <TableCell className="text-red-600">{record.holiday > 0 ? `${record.holiday}h` : '-'}</TableCell>
                  <TableCell>
                    {record.status === 'warning' ? (
                      <div className="flex items-center text-orange-500 text-xs font-bold">
                        <AlertTriangle className="w-3 h-3 mr-1" /> 확인필요
                      </div>
                    ) : record.status === 'pending' ? (
                      <Badge variant="outline" className="text-xs">계산대기</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">확정</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {/* 합계 행 */}
              <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
                <TableCell colSpan={5} className="text-center">월 합계</TableCell>
                <TableCell>36h</TableCell>
                <TableCell className="text-orange-600">12h</TableCell>
                <TableCell className="text-purple-600">1h</TableCell>
                <TableCell className="text-red-600">8h</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold">전문가 검토 가이드</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>1월 5일 근무시간이 11시간으로, 1일 최대 연장근로 한도(12시간)에 근접했습니다.</li>
            <li>1월 6일 22:00 이후 야간근로(1시간)가 발생하여 0.5배 가산수당이 적용되었습니다.</li>
            <li>토요일 근무는 취업규칙에 따라 '무급휴무일'의 연장근로로 처리되었습니다. (1.5배)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
