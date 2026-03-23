import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SeveranceAndTransfer() {
  // 퇴직금 계산 상태
  const [joinDate, setJoinDate] = useState("");
  const [retireDate, setRetireDate] = useState("");
  const [avgWage, setAvgWage] = useState("");
  const [severancePay, setSeverancePay] = useState<number | null>(null);

  // 퇴직금 계산 로직 (근로자퇴직급여 보장법 기준)
  const calculateSeverance = () => {
    if (!joinDate || !retireDate || !avgWage) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }

    const start = new Date(joinDate);
    const end = new Date(retireDate);
    
    // 근속일수 계산
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 365) {
      toast.error("근속기간이 1년 미만인 경우 퇴직금이 발생하지 않습니다.");
      setSeverancePay(0);
      return;
    }

    // 퇴직금 = 1일 평균임금 * 30일 * (재직일수 / 365)
    // 여기서는 편의상 '최근 3개월 월 평균임금'을 입력받았다고 가정
    const monthlyWage = parseInt(avgWage.replace(/,/g, ""));
    const estimatedSeverance = Math.floor(monthlyWage * (diffDays / 365));

    setSeverancePay(estimatedSeverance);
    toast.success("퇴직금 계산이 완료되었습니다.");
  };

  // 급여 이체 파일 생성 로직
  const downloadTransferFile = (bank: "shinhan" | "woori" | "kb") => {
    const mockData = `
      01,20260125,급여이체,100000000,주식회사테스트
      02,110123456789,홍길동,3500000,급여
      02,100298765432,김철수,4200000,급여
    `.trim();

    const blob = new Blob([mockData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salary_transfer_${bank}_20260125.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`${bank === "shinhan" ? "신한" : bank === "woori" ? "우리" : "국민"}은행 이체 파일이 생성되었습니다.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 퇴직금 계산기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            퇴직금 예상 조회
          </CardTitle>
          <CardDescription>입사일과 퇴사 예정일을 입력하여 예상 퇴직금을 산출합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>입사일</Label>
              <Input type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>퇴사 예정일</Label>
              <Input type="date" value={retireDate} onChange={(e) => setRetireDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>최근 3개월 월 평균 급여 (세전)</Label>
            <Input 
              type="number" 
              placeholder="예: 3000000" 
              value={avgWage} 
              onChange={(e) => setAvgWage(e.target.value)} 
            />
          </div>
          
          {severancePay !== null && (
            <div className="p-4 bg-stone-50 rounded-lg text-center border">
              <p className="text-sm text-muted-foreground mb-1">예상 퇴직금 (세전)</p>
              <p className="text-2xl font-bold text-orange-700">₩ {severancePay.toLocaleString()}</p>
            </div>
          )}

          <Button className="w-full" onClick={calculateSeverance}>계산하기</Button>
        </CardContent>
      </Card>

      {/* 급여 이체 파일 생성 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            급여 이체 파일 생성
          </CardTitle>
          <CardDescription>은행별 인터넷 뱅킹 업로드용 파일을 생성합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shinhan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="shinhan">신한은행</TabsTrigger>
              <TabsTrigger value="woori">우리은행</TabsTrigger>
              <TabsTrigger value="kb">국민은행</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shinhan" className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-lg border text-sm text-muted-foreground">
                <p className="font-medium text-stone-900 mb-2">신한은행 대량 이체 규격</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>파일 형식: Text (.txt)</li>
                  <li>구분자: 콤마(,) 또는 탭</li>
                  <li>인코딩: EUC-KR 권장</li>
                </ul>
              </div>
              <Button className="w-full bg-primary hover:bg-orange-800" onClick={() => downloadTransferFile("shinhan")}>
                <Download className="w-4 h-4 mr-2" /> 이체 파일 다운로드
              </Button>
            </TabsContent>

            <TabsContent value="woori" className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-lg border text-sm text-muted-foreground">
                <p className="font-medium text-stone-900 mb-2">우리은행 대량 이체 규격</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>파일 형식: Excel (.xls, .xlsx)</li>
                  <li>헤더: 예금주, 계좌번호, 금액 필수</li>
                  <li>암호화: 선택 사항</li>
                </ul>
              </div>
              <Button className="w-full bg-orange-50/300 hover:bg-primary" onClick={() => downloadTransferFile("woori")}>
                <Download className="w-4 h-4 mr-2" /> 이체 파일 다운로드
              </Button>
            </TabsContent>

            <TabsContent value="kb" className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-lg border text-sm text-muted-foreground">
                <p className="font-medium text-stone-900 mb-2">국민은행 대량 이체 규격</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>파일 형식: Text (.txt)</li>
                  <li>전문 양식: 고정 길이 방식</li>
                  <li>특이사항: 은행 영업점 사전 등록 필요</li>
                </ul>
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => downloadTransferFile("kb")}>
                <Download className="w-4 h-4 mr-2" /> 이체 파일 다운로드
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
