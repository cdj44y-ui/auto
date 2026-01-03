import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Search, Save, History } from "lucide-react";
import { toast } from "sonner";

// 모의 근태 데이터
const initialAttendance = [
  { id: 1, name: "김철수", date: "2026-01-27", checkIn: "08:55", checkOut: "18:05", status: "normal", note: "" },
  { id: 2, name: "이영희", date: "2026-01-27", checkIn: "09:10", checkOut: "18:00", status: "late", note: "지하철 연착" },
  { id: 3, name: "박민수", date: "2026-01-27", checkIn: "08:50", checkOut: "-", status: "missing_out", note: "" },
];

export default function AttendanceCorrection() {
  const [records, setRecords] = useState(initialAttendance);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editForm, setEditForm] = useState({ checkIn: "", checkOut: "", status: "", note: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (record: any) => {
    setSelectedRecord(record);
    setEditForm({
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      note: record.note
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedRecord) return;

    setRecords(records.map(r => 
      r.id === selectedRecord.id ? { ...r, ...editForm } : r
    ));
    
    toast.success(`${selectedRecord.name}님의 근태 기록이 수정되었습니다.`);
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>근태 기록 수정 및 보완</CardTitle>
            <CardDescription>직원의 출퇴근 기록 오류를 수정하고 사유를 관리합니다.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="이름 검색..." className="pl-8 w-[200px]" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead>이름</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>출근시간</TableHead>
              <TableHead>퇴근시간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>비고(수정사유)</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>
                  {record.status === "normal" && <Badge variant="outline" className="text-green-600 border-green-200">정상</Badge>}
                  {record.status === "late" && <Badge variant="outline" className="text-orange-600 border-orange-200">지각</Badge>}
                  {record.status === "missing_out" && <Badge variant="destructive">퇴근미체크</Badge>}
                  {record.status === "corrected" && <Badge variant="secondary" className="bg-blue-100 text-blue-700">수정됨</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {record.note || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => handleEditClick(record)}>
                    <Edit2 className="w-4 h-4 text-slate-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>근태 기록 수정</DialogTitle>
              <DialogDescription>
                {selectedRecord?.name}님의 {selectedRecord?.date} 근태 기록을 수정합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>출근 시간</Label>
                  <Input 
                    type="time" 
                    value={editForm.checkIn} 
                    onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>퇴근 시간</Label>
                  <Input 
                    type="time" 
                    value={editForm.checkOut} 
                    onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>상태 변경</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">정상</SelectItem>
                    <SelectItem value="late">지각</SelectItem>
                    <SelectItem value="early_leave">조퇴</SelectItem>
                    <SelectItem value="missing_out">퇴근미체크</SelectItem>
                    <SelectItem value="corrected">수정됨(정상처리)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>수정 사유 (필수)</Label>
                <Textarea 
                  placeholder="예: 기기 오류로 인한 미체크, 외근으로 인한 현지 퇴근 등"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
              <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 mr-2" /> 수정사항 저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
