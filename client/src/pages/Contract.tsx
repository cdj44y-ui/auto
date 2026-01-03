import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Download, PenTool, Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Contract() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setIsSigned(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handleSubmit = () => {
    if (!isSigned) {
      toast.error("서명이 필요합니다.");
      return;
    }
    toast.success("근로계약서 서명이 완료되었습니다.");
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">전자 근로계약서</h1>
          <p className="text-muted-foreground">근로 조건을 확인하고 서명합니다.</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <Download className="w-4 h-4 mr-2" /> PDF 다운로드
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>표준 근로계약서</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="bg-white p-8 rounded-xl border border-border min-h-[600px] text-sm leading-relaxed">
              <h2 className="text-center text-xl font-bold mb-8">표준 근로계약서</h2>
              <p className="mb-4">
                <strong>(주)우리회사</strong>(이하 "갑"이라 함)와 <strong>홍길동</strong>(이하 "을"이라 함)은 다음과 같이 근로계약을 체결한다.
              </p>
              
              <h3 className="font-bold mt-6 mb-2">1. 근로계약기간</h3>
              <p>2026년 1월 3일부터 기간의 정함이 없는 근로계약으로 한다.</p>

              <h3 className="font-bold mt-6 mb-2">2. 근무장소 및 업무내용</h3>
              <p>○ 근무장소: (주)우리회사 본사 및 지정된 근무지</p>
              <p>○ 업무내용: 소프트웨어 개발 및 유지보수</p>

              <h3 className="font-bold mt-6 mb-2">3. 근로시간 및 휴게시간</h3>
              <p>○ 근로시간: 09:00부터 18:00까지 (휴게시간: 12:00부터 13:00까지)</p>

              <h3 className="font-bold mt-6 mb-2">4. 임금</h3>
              <p>○ 월급: 3,000,000원 (세전)</p>
              <p>○ 지급일: 매월 25일</p>

              <h3 className="font-bold mt-6 mb-2">5. 연차유급휴가</h3>
              <p>○ 근로기준법에서 정하는 바에 따른다.</p>

              <div className="mt-12 text-center">
                <p className="mb-2">2026년 1월 3일</p>
                <div className="flex justify-between px-12 mt-8">
                  <div>
                    <p className="font-bold mb-2">(갑) 사용자</p>
                    <p>(주)우리회사 대표이사 김대표 (인)</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">(을) 근로자</p>
                    <p>홍길동 (인)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>서명란</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>성명 정자</Label>
                  <Input value="홍길동" readOnly className="bg-secondary/20" />
                </div>
                
                <div className="space-y-2">
                  <Label>전자 서명</Label>
                  <div className="border rounded-xl bg-white overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={150}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    {!isSigned && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/30">
                        <PenTool className="w-8 h-8 mr-2" />
                        <span>여기에 서명하세요</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearSignature} className="text-xs text-muted-foreground">
                      서명 초기화
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  onClick={handleSubmit}
                  disabled={!isSigned}
                >
                  <Send className="w-4 h-4 mr-2" /> 계약서 제출 및 서명 완료
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">법적 효력 안내</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    본 전자 근로계약서는 근로기준법 제17조에 의거하여 서면 계약과 동일한 법적 효력을 가집니다. 서명 완료 후 PDF 사본이 이메일로 발송됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
