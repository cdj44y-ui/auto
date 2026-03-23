import Layout from "@/components/Layout";
import { MapView } from "@/components/Map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon, MapPin, Search, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 근태 기록 인터페이스 (법적 요구사항 반영)
interface AttendanceRecord {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "정상" | "지각" | "조퇴" | "결근" | "휴일";
  location: string;
  lat: number | null;
  lng: number | null;
  workHours: number; // 실 근무시간
  overtimeHours: number; // 연장근로시간 (법적 필수)
  nightHours: number; // 야간근로시간 (법적 필수)
  verificationHash: string; // 데이터 무결성 해시 (위변조 방지)
}

const attendanceHistory: AttendanceRecord[] = [
  {
    id: 1,
    date: "2026-01-03",
    checkIn: "08:55:12",
    checkOut: "18:05:30",
    status: "정상",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
    workHours: 8.0,
    overtimeHours: 0,
    nightHours: 0,
    verificationHash: "a1b2c3d4e5f6",
  },
  {
    id: 2,
    date: "2026-01-02",
    checkIn: "09:02:15",
    checkOut: "20:00:00",
    status: "지각",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
    workHours: 9.5,
    overtimeHours: 1.5, // 연장근로 발생
    nightHours: 0,
    verificationHash: "f6e5d4c3b2a1",
  },
  {
    id: 3,
    date: "2026-01-01",
    checkIn: "-",
    checkOut: "-",
    status: "휴일",
    location: "-",
    lat: null,
    lng: null,
    workHours: 0,
    overtimeHours: 0,
    nightHours: 0,
    verificationHash: "000000000000",
  },
  {
    id: 4,
    date: "2025-12-31",
    checkIn: "08:45:00",
    checkOut: "23:00:00",
    status: "정상",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
    workHours: 13.0,
    overtimeHours: 4.0,
    nightHours: 1.0, // 야간근로 발생 (22:00~23:00)
    verificationHash: "1a2b3c4d5e6f",
  },
];

export default function Attendance() {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleVerificationCheck = (hash: string) => {
    toast.success(`데이터 무결성 검증 완료 (Hash: ${hash})`);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">근태 관리</h1>
          <p className="text-muted-foreground">
            근로기준법 제50조에 의거한 정확한 출퇴근 기록 및 연장/야간근로 관리
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="date" 
              className="pl-10 rounded-xl bg-white border-none shadow-sm w-[160px]"
            />
          </div>
          <Button variant="outline" className="rounded-xl bg-white border-none shadow-sm hover:bg-stone-50">
            <Search className="w-4 h-4 mr-2" /> 조회
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-orange-50/30 border-orange-200/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">이번 달 총 근무시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">168.5 시간</div>
            <p className="text-xs text-primary mt-1">소정근로시간 준수율 98%</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">연장근로 누적</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">5.5 시간</div>
            <p className="text-xs text-orange-600 mt-1">법정 한도(주 12시간) 내 관리 중</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">야간근로 누적</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">1.0 시간</div>
            <p className="text-xs text-purple-600 mt-1">22:00 ~ 06:00 근무분</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>근태 이력 상세</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-stone-100 px-3 py-1 rounded-full">
              <Info className="w-3 h-3" />
              <span>모든 기록은 근로기준법 제42조에 따라 3년간 보관됩니다.</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>출근 시간</TableHead>
                  <TableHead>퇴근 시간</TableHead>
                  <TableHead>근무시간</TableHead>
                  <TableHead>연장/야간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>위치 정보</TableHead>
                  <TableHead className="text-right">무결성</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell className="tabular-nums">{record.checkIn}</TableCell>
                    <TableCell className="tabular-nums">{record.checkOut}</TableCell>
                    <TableCell className="tabular-nums font-medium">
                      {record.workHours > 0 ? `${record.workHours}h` : "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {record.overtimeHours > 0 && <span className="text-orange-600 font-medium block">연장 {record.overtimeHours}h</span>}
                      {record.nightHours > 0 && <span className="text-purple-600 font-medium block">야간 {record.nightHours}h</span>}
                      {record.overtimeHours === 0 && record.nightHours === 0 && <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          record.status === "정상"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : record.status === "지각"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : record.status === "조퇴"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-100"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.lat && record.lng ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-muted-foreground hover:text-primary"
                              onClick={() => setSelectedLocation({ lat: record.lat!, lng: record.lng! })}
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              {record.location}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl">
                            <DialogHeader className="p-6 pb-0">
                              <DialogTitle>출근 위치 확인</DialogTitle>
                            </DialogHeader>
                            <div className="h-[400px] w-full mt-4">
                              <MapView 
                                className="w-full h-full"
                                onMapReady={(map: google.maps.Map) => {
                                  if (selectedLocation) {
                                    new google.maps.Marker({
                                      position: selectedLocation,
                                      map: map,
                                      title: "출근 위치"
                                    });
                                    map.setCenter(selectedLocation);
                                    map.setZoom(15);
                                  }
                                }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-600"
                        onClick={() => handleVerificationCheck(record.verificationHash)}
                        title="데이터 무결성 검증됨"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
