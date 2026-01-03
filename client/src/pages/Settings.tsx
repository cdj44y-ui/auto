import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [workStartTime, setWorkStartTime] = useState("09:00");
  const [workEndTime, setWorkEndTime] = useState("18:00");
  const [breakStartTime, setBreakStartTime] = useState("12:00");
  const [breakEndTime, setBreakEndTime] = useState("13:00");
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [officeLat, setOfficeLat] = useState("37.5665");
  const [officeLng, setOfficeLng] = useState("126.9780");
  const [radius, setRadius] = useState("100");

  const handleSave = () => {
    toast.success("설정이 저장되었습니다.");
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">시스템 환경설정 및 근무 정책을 관리합니다.</p>
      </div>

      <Tabs defaultValue="work-policy" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm">
          <TabsTrigger value="work-policy" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="w-4 h-4 mr-2" /> 근무 정책
          </TabsTrigger>
          <TabsTrigger value="location" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MapPin className="w-4 h-4 mr-2" /> 위치 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work-policy">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>근무 시간 설정</CardTitle>
              <CardDescription>회사의 표준 근무 시간을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>출근 시간</Label>
                  <Input 
                    type="time" 
                    value={workStartTime} 
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>퇴근 시간</Label>
                  <Input 
                    type="time" 
                    value={workEndTime} 
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>휴게 시작 시간</Label>
                  <Input 
                    type="time" 
                    value={breakStartTime} 
                    onChange={(e) => setBreakStartTime(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>휴게 종료 시간</Label>
                  <Input 
                    type="time" 
                    value={breakEndTime} 
                    onChange={(e) => setBreakEndTime(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base">유연 근무제 허용</Label>
                  <p className="text-sm text-muted-foreground">직원이 출퇴근 시간을 조정할 수 있도록 허용합니다.</p>
                </div>
                <Switch />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="rounded-xl shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" /> 저장하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>위치 기반 출퇴근 설정</CardTitle>
              <CardDescription>GPS 위치 인증 정책을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">GPS 위치 인증 필수</Label>
                  <p className="text-sm text-muted-foreground">출퇴근 시 반드시 위치 정보를 수집합니다.</p>
                </div>
                <Switch checked={gpsEnabled} onCheckedChange={setGpsEnabled} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>회사 위도 (Latitude)</Label>
                  <Input 
                    value={officeLat} 
                    onChange={(e) => setOfficeLat(e.target.value)}
                    className="rounded-xl"
                    disabled={!gpsEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>회사 경도 (Longitude)</Label>
                  <Input 
                    value={officeLng} 
                    onChange={(e) => setOfficeLng(e.target.value)}
                    className="rounded-xl"
                    disabled={!gpsEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>허용 반경 (미터)</Label>
                  <Input 
                    type="number"
                    value={radius} 
                    onChange={(e) => setRadius(e.target.value)}
                    className="rounded-xl"
                    disabled={!gpsEnabled}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="rounded-xl shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" /> 저장하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
