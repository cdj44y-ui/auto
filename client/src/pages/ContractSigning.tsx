import { useRef, useState } from "react";
import { useLocation } from "wouter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, PenTool, ArrowLeft, Loader2 } from "lucide-react";
import ContractTemplate from "@/components/consultant/ContractTemplate";
import SignaturePad from "@/components/SignaturePad";

export default function ContractSigning() {
  const [, setLocation] = useLocation();
  const contractRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 모의 계약 데이터 (실제로는 API에서 가져와야 함)
  const contractData = {
    companyName: "희연푸드",
    representative: "정재중",
    employeeName: "김철수",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    position: "조리팀 사원",
    baseSalary: 2568212,
    fixedOvertimeAllowance: 431788,
    fixedNightAllowance: 0,
    fixedHolidayAllowance: 0,
    mealAllowance: 200000,
    totalSalary: 3200000
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignature(dataUrl);
    setIsDialogOpen(false);
    toast.success("서명이 완료되었습니다. PDF 다운로드가 가능합니다.");
  };

  const handleDownloadPDF = async () => {
    if (!contractRef.current) return;
    
    try {
      setIsGenerating(true);
      toast.info("PDF 생성 중입니다...");

      const canvas = await html2canvas(contractRef.current, {
        scale: 2, // 고해상도
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${contractData.employeeName}_근로계약서.pdf`);
      
      toast.success("PDF 다운로드가 완료되었습니다.");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setLocation("/employee-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 돌아가기
          </Button>
          <h1 className="text-2xl font-bold">전자근로계약서 서명</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        <div className="relative" ref={contractRef}>
          <ContractTemplate {...contractData} />
          
          {/* 서명 오버레이 (계약서 하단 직원 서명란 위치에 배치) */}
          {signature && (
            <div className="absolute bottom-[105px] right-[140px] w-24 h-12 z-10">
              <img src={signature} alt="서명" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        <Card className="sticky bottom-4 z-50 shadow-xl border-t-4 border-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {signature 
                ? "서명이 완료되었습니다. 계약서를 다운로드하세요." 
                : "계약서 내용을 확인 후 서명을 진행해주세요."}
            </div>
            <div className="flex gap-3">
              {!signature ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <PenTool className="w-4 h-4 mr-2" /> 서명하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>서명 입력</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <SignaturePad onSave={handleSignatureSave} />
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSignature(null)}>
                    서명 다시하기
                  </Button>
                  <Button onClick={handleDownloadPDF} disabled={isGenerating} className="bg-green-600 hover:bg-green-700">
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    PDF 다운로드
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
