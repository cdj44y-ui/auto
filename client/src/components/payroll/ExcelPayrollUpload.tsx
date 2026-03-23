import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { calculateMonthlyEstimatedSalary } from "@/lib/salaryCalculator";

interface ParsedPayrollData {
  id: number;
  name: string;
  workDays: number;
  totalWorkHours: number;
  hourlyRate: number;
  baseSalary: number;
  overtimePay: number;
  nightPay: number;
  holidayPay: number;
  weeklyHolidayPay: number; // 주휴수당
  totalPay: number;
  note?: string;
}

export default function ExcelPayrollUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedPayrollData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCalculating(true);
    
    // 엑셀 파싱 및 급여 계산 시뮬레이션
    // 실제로는 FileReader와 XLSX 라이브러리를 사용하여 데이터를 읽어와야 함
    setTimeout(() => {
      try {
        // 시뮬레이션 데이터 생성
        const mockData: ParsedPayrollData[] = [
          {
            id: 1,
            name: "박지민",
            workDays: 20,
            totalWorkHours: 160,
            hourlyRate: 15000,
            baseSalary: 2400000,
            overtimePay: 150000,
            nightPay: 0,
            holidayPay: 0,
            weeklyHolidayPay: 480000, // 주휴수당 포함
            totalPay: 3030000,
            note: "정상 근무"
          },
          {
            id: 2,
            name: "최민수",
            workDays: 12,
            totalWorkHours: 48, // 주 15시간 미만 가정 (4주 기준 주 12시간)
            hourlyRate: 12000,
            baseSalary: 576000,
            overtimePay: 0,
            nightPay: 0,
            holidayPay: 0,
            weeklyHolidayPay: 0, // 주 15시간 미만이라 주휴수당 0
            totalPay: 576000,
            note: "주 15시간 미만 (주휴수당 제외)"
          },
          {
            id: 3,
            name: "정수진",
            workDays: 22,
            totalWorkHours: 176,
            hourlyRate: 13000,
            baseSalary: 2288000,
            overtimePay: 300000,
            nightPay: 50000,
            holidayPay: 100000,
            weeklyHolidayPay: 416000,
            totalPay: 3154000,
            note: "야간/휴일 근무 포함"
          }
        ];
        
        setParsedData(mockData);
        toast.success(`${file.name} 파일 분석 완료: 3명의 급여가 계산되었습니다.`);
      } catch (error) {
        toast.error("파일 처리 중 오류가 발생했습니다.");
      } finally {
        setIsCalculating(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast.success("급여 계산용 엑셀 템플릿이 다운로드되었습니다.");
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-stone-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                엑셀 파일로 급여 일괄 계산
              </h3>
              <p className="text-sm text-muted-foreground">
                근무 기록이 담긴 엑셀 파일을 업로드하면, 통상시급과 근로기준법 로직을 적용해 급여를 자동으로 계산합니다.<br/>
                <span className="text-primary font-medium">* 주 15시간 미만 근무자는 주휴수당이 자동으로 제외됩니다.</span>
              </p>
            </div>
            <div className="flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
              />
              <Button variant="outline" onClick={handleDownloadTemplate} className="bg-white">
                <Download className="w-4 h-4 mr-2" /> 템플릿 다운로드
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700 text-white">
                <Upload className="w-4 h-4 mr-2" /> 엑셀 업로드 및 계산
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isCalculating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">데이터 분석 및 급여 계산 중...</p>
        </div>
      )}

      {!isCalculating && parsedData.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>계산 결과 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead className="text-right">근무일수</TableHead>
                  <TableHead className="text-right">총 근무시간</TableHead>
                  <TableHead className="text-right">시급</TableHead>
                  <TableHead className="text-right">기본급</TableHead>
                  <TableHead className="text-right">주휴수당</TableHead>
                  <TableHead className="text-right">초과/야간/휴일</TableHead>
                  <TableHead className="text-right font-bold">총 지급액</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.workDays}일</TableCell>
                    <TableCell className="text-right">{item.totalWorkHours}시간</TableCell>
                    <TableCell className="text-right tabular-nums">{item.hourlyRate.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className={`text-right tabular-nums ${item.weeklyHolidayPay === 0 ? "text-red-500 font-medium" : "text-primary"}`}>
                      {item.weeklyHolidayPay.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {(item.overtimePay + item.nightPay + item.holidayPay).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-bold text-lg">
                      {item.totalPay.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.weeklyHolidayPay === 0 && item.totalWorkHours < 60 && (
                        <div className="flex items-center text-xs text-red-500">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          주휴수당 제외
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">{item.note}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-6">
              <Button className="bg-primary hover:bg-orange-800 text-white">
                급여 대장에 반영하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
