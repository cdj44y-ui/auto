/**
 * P-07: GPS 출퇴근 인증 컴포넌트
 * Geolocation API로 위치 획득 → 서버에 전송
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, LogIn, LogOut, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function GPSCheckIn() {
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const clockInMutation = trpc.attendance.clockIn.useMutation({
    onSuccess: () => toast.success("GPS 출근이 완료되었습니다."),
    onError: (err) => toast.error(err.message),
  });

  const clockOutMutation = trpc.attendance.clockOut.useMutation({
    onSuccess: () => toast.success("퇴근이 완료되었습니다."),
    onError: (err) => toast.error(err.message),
  });

  const todayQuery = trpc.attendance.today.useQuery();

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("GPS를 지원하지 않는 브라우저입니다."));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  };

  const handleGPSClockIn = async () => {
    setLocating(true);
    try {
      const position = await getLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoords({ lat, lng });

      clockInMutation.mutate({
        authMethod: "gps",
        latitude: lat.toString(),
        longitude: lng.toString(),
      });
    } catch (err) {
      toast.error("위치 정보를 가져올 수 없습니다. GPS 권한을 확인해 주세요.");
    } finally {
      setLocating(false);
    }
  };

  const isCheckedIn = todayQuery.data && !todayQuery.data.clockOut;
  const isPending = clockInMutation.isPending || clockOutMutation.isPending || locating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          GPS 출퇴근
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coords && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </Badge>
          </div>
        )}

        <div className="flex gap-3">
          {!isCheckedIn ? (
            <Button
              onClick={handleGPSClockIn}
              disabled={isPending}
              className="flex-1 h-12"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {locating ? "위치 확인 중..." : "GPS 출근"}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => clockOutMutation.mutate()}
              disabled={isPending}
              className="flex-1 h-12"
            >
              <LogOut className="w-4 h-4 mr-2" />
              퇴근
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
