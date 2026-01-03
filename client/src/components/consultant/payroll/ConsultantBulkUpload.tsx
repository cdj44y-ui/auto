import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ConsultantBulkUpload({ companyId }: { companyId: string | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 업로드 시뮬레이션
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadResult({
            fileName: file.name,
            totalRows: 156,
            successRows: 152,
            errorRows: 4,
            errors: [
              { row: 12, worker: "박미정", reason: "근무시간 형식 오류 (25:00)" },
              { row: 45, worker: "최성훈", reason: "필수값 누락 (출근시간)" },
              { row: 88, worker: "김지수", reason: "존재하지 않는 사원번호" },
              { row: 102, worker: "이동현", reason: "중복된 날짜 기록" },
            ]
          });
          toast.success("파일 분석이 완료되었습니다.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 업로드 영역 */}
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">근무기록 엑셀 파일 업로드</h3>
              <p className="text-sm text-muted-foreground mt-1">
                고객사로부터 받은 근무기록 엑셀 파일을 드래그하거나 선택하세요.
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? "분석 중..." : "파일 선택하기"}
            </Button>
            <div className="flex gap-4 text-xs text-muted-foreground pt-4">
              <button className="flex items-center hover:text-indigo-600 transition-colors">
                <Download className="w-3 h-3 mr-1" /> 표준 양식 다운로드
              </button>
              <button className="flex items-center hover:text-indigo-600 transition-colors">
                <FileText className="w-3 h-3 mr-1" /> 작성 가이드
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 처리 현황 */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>처리 현황</CardTitle>
            <CardDescription>업로드된 파일의 유효성 검사 및 급여 계산 결과입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>데이터 분석 및 계산 중...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {!isUploading && !uploadResult && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <FileSpreadsheet className="w-12 h-12 mb-2 opacity-20" />
                <p>업로드된 파일이 없습니다.</p>
              </div>
            )}

            {uploadResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">총 데이터</p>
                    <p className="text-xl font-bold">{uploadResult.totalRows}건</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600">성공</p>
                    <p className="text-xl font-bold text-green-700">{uploadResult.successRows}건</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">오류</p>
                    <p className="text-xl font-bold text-red-700">{uploadResult.errorRows}건</p>
                  </div>
                </div>

                {uploadResult.errorRows > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-red-50 px-4 py-2 text-sm font-medium text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> 오류 내역 ({uploadResult.errorRows}건)
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <Table>
                        <TableBody>
                          {uploadResult.errors.map((err: any, idx: number) => (
                            <TableRow key={idx} className="hover:bg-red-50/50">
                              <TableCell className="w-16 text-center text-muted-foreground">Row {err.row}</TableCell>
                              <TableCell className="font-medium">{err.worker}</TableCell>
                              <TableCell className="text-red-600 text-sm">{err.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={uploadResult.errorRows > 0}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> 
                    {uploadResult.errorRows > 0 ? "오류 수정 필요" : "급여대장 반영하기"}
                  </Button>
                  {uploadResult.errorRows > 0 && (
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" /> 오류 리포트 다운로드
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
