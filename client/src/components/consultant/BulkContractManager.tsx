import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileSignature, 
  Send, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function BulkContractManager() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // 모의 계약 발송 대상 데이터
  const [contracts, setContracts] = useState([
    { id: 1, company: "(주)테크스타트업", employee: "김철수", type: "연봉계약서", status: "signed", sentDate: "2026-01-20" },
    { id: 2, company: "(주)테크스타트업", employee: "이영희", type: "연봉계약서", status: "pending", sentDate: "2026-01-25" },
    { id: 3, company: "글로벌무역상사", employee: "박지민", type: "수습계약서", status: "pending", sentDate: "2026-01-26" },
    { id: 4, company: "퓨처디자인랩", employee: "최민수", type: "프리랜서계약", status: "failed", sentDate: "2026-01-24" },
    { id: 5, company: "(주)테크스타트업", employee: "정수진", type: "연봉계약서", status: "signed", sentDate: "2026-01-21" },
  ]);

  const handleBulkSend = () => {
    setIsProcessing(true);
    setProgress(0);
    
    // 발송 시뮬레이션
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast.success("선택한 3건의 계약서가 발송되었습니다.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이번 달 발송</p>
              <p className="text-2xl font-bold dark:text-slate-100">142건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FileSignature className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">서명 완료율</p>
              <p className="text-2xl font-bold dark:text-slate-100">84%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">서명 대기중</p>
              <p className="text-2xl font-bold dark:text-slate-100">23건</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 대량 발송 액션 카드 */}
      <Card className="border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">전자계약 일괄 발송</CardTitle>
              <CardDescription>여러 고객사의 계약서를 한 번에 생성하고 발송합니다.</CardDescription>
            </div>
            <Button 
              onClick={handleBulkSend} 
              disabled={isProcessing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isProcessing ? "발송 중..." : "선택 항목 일괄 발송"}
            </Button>
          </div>
        </CardHeader>
        {isProcessing && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-indigo-600 dark:text-indigo-300">
                <span>발송 진행률</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* 계약 관리 테이블 */}
      <Card className="dark:bg-slate-900 border-none shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="dark:text-slate-100">계약 진행 현황</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="회사명 또는 직원명 검색" className="pl-8" />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" /> 엑셀 다운로드
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="p-4 w-10"><Checkbox /></th>
                  <th className="p-4">고객사</th>
                  <th className="p-4">직원명</th>
                  <th className="p-4">계약 유형</th>
                  <th className="p-4">발송일</th>
                  <th className="p-4">상태</th>
                  <th className="p-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4"><Checkbox /></td>
                    <td className="p-4 font-medium dark:text-slate-200">{contract.company}</td>
                    <td className="p-4 dark:text-slate-300">{contract.employee}</td>
                    <td className="p-4 dark:text-slate-300">{contract.type}</td>
                    <td className="p-4 text-slate-500">{contract.sentDate}</td>
                    <td className="p-4">
                      {contract.status === 'signed' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> 서명완료
                        </Badge>
                      )}
                      {contract.status === 'pending' && (
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3 h-3 mr-1" /> 서명대기
                        </Badge>
                      )}
                      {contract.status === 'failed' && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
                          <AlertCircle className="w-3 h-3 mr-1" /> 발송실패
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                        상세보기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
