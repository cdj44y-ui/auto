/**
 * P-07: QR 코드 출퇴근 인증 컴포넌트
 * 관리자: QR 생성 → 직원: QR 스캔하여 출근
 */
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, RefreshCw, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface QRCheckInProps {
  mode: "generate" | "scan";
}

export default function QRCheckIn({ mode }: QRCheckInProps) {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const generateMutation = trpc.attendance.generateQrToken.useMutation({
    onSuccess: (data) => {
      setQrToken(data.token);
      setExpiresAt(data.expiresAt);
    },
  });

  // 남은 시간 카운트다운
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setQrToken(null);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (mode === "generate") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR 출퇴근 인증
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {qrToken ? (
            <>
              <div className="p-4 bg-white rounded-xl shadow-inner">
                <QRCodeSVG value={qrToken} size={200} level="H" />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  남은 시간: <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</Badge>
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새 QR 생성
              </Button>
            </>
          ) : (
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="h-14 px-8"
            >
              <QrCode className="w-5 h-5 mr-2" />
              QR 코드 생성
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // scan mode - 직원용 (카메라 스캔은 모바일 앱에서 구현)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR 스캔 출근
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>모바일 앱에서 QR 코드를 스캔하여 출근하세요.</p>
        <p className="text-sm mt-2">카메라 기반 QR 스캔은 모바일 앱에서 지원됩니다.</p>
      </CardContent>
    </Card>
  );
}
