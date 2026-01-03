import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit2, Calculator, Save } from "lucide-react";
import { toast } from "sonner";

// 포괄임금제 역산 계산 로직 (간소화 버전)
const calculateReverseSalary = (totalSalary: number, weeklyHours: number = 40, overtimeHours: number = 0) => {
  // 2026년 최저임금 가정: 10,350원
  const minWage = 10350;
  
  // 월 소정근로시간 (주 40시간 기준 209시간)
  const baseHours = 209;
  
  // 고정 연장근로시간 환산 (1.5배)
  const overtimeRate = 1.5;
  const monthlyOvertimeHours = overtimeHours * 4.345 * overtimeRate;
  
  // 통상시급 역산
  const totalRateHours = baseHours + monthlyOvertimeHours;
  const hourlyRate = Math.round(totalSalary / totalRateHours);
  
  return {
    hourlyRate,
    baseSalary: hourlyRate * baseHours,
    fixedOvertimeAllowance: hourlyRate * monthlyOvertimeHours,
    isMinWageViolation: hourlyRate < minWage
  };
};

export default function ConsultantWorkerSettings({ companyId }: { companyId: string | null }) {
  const [workers, setWorkers] = useState([
    { id: 1, name: "김철수", department: "개발팀", type: "regular", contractType: "comprehensive", totalSalary: 3500000, baseSalary: 2800000, fixedOvertime: 700000 },
    { id: 2, name: "이영희", department: "디자인팀", type: "regular", contractType: "salary", totalSalary: 3200000, baseSalary: 3200000, fixedOvertime: 0 },
    { id: 3, name: "박지민", department: "마케팅팀", type: "contract", contractType: "hourly", totalSalary: 0, baseSalary: 0, fixedOvertime: 0, hourlyRate: 15000 },
    { id: 4, name: "최단기", department: "물류팀", type: "part-time", contractType: "hourly", totalSalary: 0, baseSalary: 0, fixedOvertime: 0, hourlyRate: 11000 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any>(null);
  
  // 역산 시뮬레이션 상태
  const [simTotalSalary, setSimTotalSalary] = useState(3000000);
  const [simOvertimeHours, setSimOvertimeHours] = useState(10); // 주당 고정연장시간
  const [simResult, setSimResult] = useState<any>(null);

  const handleSimulate = () => {
    const result = calculateReverseSalary(simTotalSalary, 40, simOvertimeHours);
    setSimResult(result);
  };

  const handleSaveWorker = () => {
    toast.success("근로자 급여 설정이 저장되었습니다.");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">근로자별 급여/계약 설정</h3>
          <p className="text-sm text-muted-foreground">포괄임금제 역산 설계 및 근로 형태별 맞춤 설정을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="이름 또는 부서 검색" className="pl-10" />
          </div>
          <Button onClick={() => { setEditingWorker(null); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> 신규 근로자 등록
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름/부서</TableHead>
                <TableHead>근로 형태</TableHead>
                <TableHead>계약 유형</TableHead>
                <TableHead>임금 구성 (월)</TableHead>
                <TableHead>통상시급</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-xs text-muted-foreground">{worker.department}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      worker.type === 'regular' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      worker.type === 'part-time' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-slate-50 text-slate-700'
                    }>
                      {worker.type === 'regular' ? '정규직' : worker.type === 'part-time' ? '단시간' : '계약직'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {worker.contractType === 'comprehensive' ? '포괄임금제' : 
                     worker.contractType === 'salary' ? '통상연봉제' : '시급제'}
                  </TableCell>
                  <TableCell>
                    {worker.contractType === 'hourly' ? (
                      <span className="text-sm">시급 {worker.hourlyRate?.toLocaleString()}원</span>
                    ) : (
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between w-40">
                          <span className="text-muted-foreground">기본급:</span>
                          <span>{worker.baseSalary.toLocaleString()}</span>
                        </div>
                        {worker.fixedOvertime > 0 && (
                          <div className="flex justify-between w-40 text-blue-600">
                            <span>고정OT:</span>
                            <span>{worker.fixedOvertime.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {worker.contractType === 'hourly' 
                      ? worker.hourlyRate?.toLocaleString() 
                      : Math.round(worker.baseSalary / 209).toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingWorker(worker); setIsDialogOpen(true); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 근로자 설정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWorker ? `${editingWorker.name} 급여 상세 설정` : "신규 근로자 급여 설계"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>기본 정보</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="이름" defaultValue={editingWorker?.name} />
                  <Input placeholder="부서" defaultValue={editingWorker?.department} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>근로 형태</Label>
                <Select defaultValue={editingWorker?.type || "regular"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">정규직 (통상 근로자)</SelectItem>
                    <SelectItem value="contract">계약직</SelectItem>
                    <SelectItem value="part-time">단시간 근로자 (아르바이트)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>임금 계약 유형</Label>
                <Select defaultValue={editingWorker?.contractType || "comprehensive"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">포괄임금제 (고정OT 포함)</SelectItem>
                    <SelectItem value="salary">통상연봉제 (OT 별도)</SelectItem>
                    <SelectItem value="hourly">시급제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-4 border">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm">포괄임금 역산 시뮬레이션</h4>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">월 지급 총액 (세전)</Label>
                <Input 
                  type="number" 
                  value={simTotalSalary} 
                  onChange={(e) => setSimTotalSalary(Number(e.target.value))}
                  className="bg-white h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">주당 고정 연장시간 (시간)</Label>
                <Input 
                  type="number" 
                  value={simOvertimeHours} 
                  onChange={(e) => setSimOvertimeHours(Number(e.target.value))}
                  className="bg-white h-8"
                />
              </div>

              <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSimulate}>
                역산 계산하기
              </Button>

              {simResult && (
                <div className="mt-4 space-y-2 text-sm border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">통상시급</span>
                    <span className="font-bold">{simResult.hourlyRate.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기본급(209h)</span>
                    <span>{simResult.baseSalary.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span className="text-muted-foreground">고정연장수당</span>
                    <span>{simResult.fixedOvertimeAllowance.toLocaleString()}원</span>
                  </div>
                  {simResult.isMinWageViolation && (
                    <div className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> 최저임금 미달 (2026년 10,350원)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
            <Button onClick={handleSaveWorker}>
              <Save className="w-4 h-4 mr-2" /> 설정 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
