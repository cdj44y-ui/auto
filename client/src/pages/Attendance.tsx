import Layout from "@/components/Layout";
import { MapView } from "@/components/Map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar as CalendarIcon, MapPin, Search } from "lucide-react";
import { useState } from "react";

const attendanceHistory = [
  {
    id: 1,
    date: "2026-01-03",
    checkIn: "08:55:12",
    checkOut: "18:05:30",
    status: "정상",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
  },
  {
    id: 2,
    date: "2026-01-02",
    checkIn: "09:02:15",
    checkOut: "18:00:00",
    status: "지각",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
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
  },
  {
    id: 4,
    date: "2025-12-31",
    checkIn: "08:45:00",
    checkOut: "15:00:00",
    status: "조퇴",
    location: "서울시 강남구 테헤란로 123",
    lat: 37.4979,
    lng: 127.0276,
  },
];

export default function Attendance() {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">근태 관리</h1>
          <p className="text-muted-foreground">나의 출퇴근 기록과 위치 정보를 확인합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="date" 
              className="pl-10 rounded-xl bg-white border-none shadow-sm w-[160px]"
            />
          </div>
          <Button variant="outline" className="rounded-xl bg-white border-none shadow-sm hover:bg-gray-50">
            <Search className="w-4 h-4 mr-2" /> 조회
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>근태 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>출근 시간</TableHead>
                  <TableHead>퇴근 시간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>위치 정보</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell className="tabular-nums">{record.checkIn}</TableCell>
                    <TableCell className="tabular-nums">{record.checkOut}</TableCell>
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
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
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
