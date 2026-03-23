import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, Clock, Coffee, LogIn, LogOut, Users, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AttendanceCorrection from "@/components/admin/AttendanceCorrection";
import FlexibleWorkApplicationWizard from "@/components/flexible-work/FlexibleWorkApplicationWizard";
import TeamLeaveCalendar from "@/components/calendar/TeamLeaveCalendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isFlexibleWorkDialogOpen, setIsFlexibleWorkDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-stone-50 border border-white/50 shadow-sm mb-8">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <img 
            src="/images/dashboard-hero-white.jpg" 
            alt="Hero" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              안녕하세요, 김관리님
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              {formatDate(currentTime)}
            </p>
            <div className="text-6xl md:text-7xl font-bold text-primary tracking-tighter tabular-nums my-4">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-orange-200/30 text-orange-700">
                현재 근무제: 시차출퇴근제 (A조 08:00-17:00)
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Button 
              size="lg" 
              className={cn(
                "h-16 px-8 text-xl rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                isCheckedIn 
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
              onClick={() => setIsCheckedIn(!isCheckedIn)}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="mr-3 w-6 h-6" /> 퇴근하기
                </>
              ) : (
                <>
                  <LogIn className="mr-3 w-6 h-6" /> 출근하기
                </>
              )}
            </Button>
            
            {isCheckedIn && (
              <Button variant="outline" size="lg" className="h-14 rounded-2xl border-2 hover:bg-secondary/50">
                <Coffee className="mr-2 w-5 h-5 text-orange-500" /> 휴식 시작
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm w-full md:w-auto grid grid-cols-3 md:inline-flex">
            <TabsTrigger value="dashboard" className="rounded-lg">대시보드</TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg">팀 휴가 캘린더</TabsTrigger>
            <TabsTrigger value="correction" className="rounded-lg">근태 수정/보완</TabsTrigger>
          </TabsList>

          <Dialog open={isFlexibleWorkDialogOpen} onOpenChange={setIsFlexibleWorkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white hover:bg-stone-50 border-orange-200/30 text-orange-700">
                <Briefcase className="w-4 h-4 mr-2" /> 유연근무제 신청
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
              <FlexibleWorkApplicationWizard />
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "총 직원", value: "142명", icon: Users, color: "text-orange-500", bg: "bg-orange-50/30" },
          { title: "정상 출근", value: "128명", icon: Clock, color: "text-green-500", bg: "bg-green-50" },
          { title: "지각", value: "12명", icon: ArrowUpRight, color: "text-orange-500", bg: "bg-orange-50" },
          { title: "결근", value: "2명", icon: LogOut, color: "text-red-500", bg: "bg-red-50" },
        ].map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              </div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "이영희", action: "출근 완료", time: "08:58", status: "정상", img: "bg-pink-100" },
                { name: "김철수", action: "출근 완료", time: "09:02", status: "지각", img: "bg-orange-100/30" },
                { name: "박지민", action: "휴식 시작", time: "10:30", status: "휴식", img: "bg-green-100" },
                { name: "최민수", action: "퇴근 완료", time: "18:00", status: "초과근무", img: "bg-yellow-100" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group hover:bg-secondary/50 p-2 rounded-xl transition-colors -mx-2">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-stone-600", item.img)}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">{item.time}</p>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      item.status === "정상" ? "bg-green-100 text-green-700" :
                      item.status === "지각" ? "bg-orange-100 text-orange-700" :
                      "bg-stone-100 text-stone-700"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader>
            <CardTitle>주간 요약</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">출석률</span>
                <span className="font-bold">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">정시 출근율</span>
                <span className="font-bold">88%</span>
              </div>
              <Progress value={88} className="h-2 bg-secondary [&>div]:bg-green-500" />
            </div>

            <div className="pt-6">
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-white/50">
                <h4 className="font-semibold mb-2">다가오는 휴일</h4>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>신정 - 1월 1일</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="calendar">
          <TeamLeaveCalendar />
        </TabsContent>

        <TabsContent value="correction">
          <AttendanceCorrection />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
