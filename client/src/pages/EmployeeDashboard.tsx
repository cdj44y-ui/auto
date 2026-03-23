import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LogOut, User, Clock, Sun, Moon, 
  Calendar, CheckCircle2, AlertCircle, 
  Briefcase, Coffee, Plane
} from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import WeeklyWorkHoursWidget from "@/components/employee/WeeklyWorkHoursWidget";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// macOS Style Layout Component
function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--macos-bg)] transition-colors duration-300 font-sans pb-24 md:pb-0">
      {/* Header (Desktop Only) */}
      <header className="hidden md:block bg-[var(--macos-card)]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-stone-700 rounded-[12px] flex items-center justify-center text-white font-bold shadow-lg shadow-stone-500/20">
              A
            </div>
            <span className="font-semibold text-xl tracking-tight text-[var(--macos-text-primary)]">AES</span>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-black/10 dark:border-white/10">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-sm text-[var(--macos-text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--macos-text-secondary)]">{user?.department}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-50 text-stone-400 hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[var(--macos-bg)] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-stone-700 rounded-[10px] flex items-center justify-center text-white font-bold shadow-md">
            A
          </div>
          <span className="font-semibold text-lg text-[var(--macos-text-primary)]">AES</span>
        </div>
        <NotificationCenter />
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-4 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--macos-card)]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-primary">
            <Clock className="w-6 h-6" />
            <span className="text-[10px] font-medium">근태</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--macos-text-secondary)]">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">일정</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--macos-text-secondary)]">
            <Briefcase className="w-6 h-6" />
            <span className="text-[10px] font-medium">휴가</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-[var(--macos-text-secondary)]" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            <span className="text-[10px] font-medium">테마</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workLog, setWorkLog] = useState<{
    clockIn: Date | null;
    clockOut: Date | null;
    status: "working" | "off" | "break";
  }>({ clockIn: null, clockOut: null, status: "off" });

  // Request Form State
  const [requestType, setRequestType] = useState("vacation");
  const [requestDate, setRequestDate] = useState("");
  const [requestReason, setRequestReason] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setWorkLog({ ...workLog, clockIn: new Date(), status: "working" });
    toast.success("출근 처리가 완료되었습니다.");
  };

  const handleClockOut = () => {
    setWorkLog({ ...workLog, clockOut: new Date(), status: "off" });
    toast.success("퇴근 처리가 완료되었습니다.");
  };

  const handleRequestSubmit = () => {
    if (!requestDate || !requestReason) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }
    toast.success("결재가 상신되었습니다.");
    setRequestDate("");
    setRequestReason("");
  };

  return (
    <EmployeeLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--macos-text-primary)] tracking-tight">
          반가워요, {user?.name}님
        </h1>
        <p className="text-[var(--macos-text-secondary)] mt-1 text-lg">오늘도 생산적인 하루 되세요.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Request Form (30%) */}
        <motion.div 
          className="col-span-12 lg:col-span-4 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="macos-card h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">근태 신청</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--macos-text-secondary)]">신청 유형</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger className="macos-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">🏖 연차 휴가</SelectItem>
                    <SelectItem value="half_am">🌅 오전 반차</SelectItem>
                    <SelectItem value="half_pm">🌇 오후 반차</SelectItem>
                    <SelectItem value="overtime">🔥 연장 근무</SelectItem>
                    <SelectItem value="remote">🏠 재택 근무</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--macos-text-secondary)]">날짜 선택</Label>
                <Input 
                  type="date" 
                  className="macos-input"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--macos-text-secondary)]">사유</Label>
                <Textarea 
                  placeholder="상세 사유를 입력하세요" 
                  className="bg-[#F5F5F7] dark:bg-[#2C2C2E] border-none rounded-[12px] p-4 min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="macos-btn-primary w-full mt-4" onClick={handleRequestSubmit}>
                  결재 상신하기
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Dashboard Widgets (70%) */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Time & Attendance Card */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="macos-card p-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center gap-2 text-[var(--macos-text-secondary)] justify-center md:justify-start">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 className="text-big tabular-nums">
                {currentTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </h2>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${workLog.status === 'working' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-stone-300'}`}></span>
                <span className="font-medium text-[var(--macos-text-secondary)]">
                  {workLog.status === 'working' ? '업무 중' : '업무 종료'}
                </span>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {!workLog.clockIn ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                  <Button 
                    onClick={handleClockIn}
                    className="w-full md:w-40 h-14 rounded-[16px] bg-primary hover:bg-orange-800 text-white text-lg font-semibold shadow-lg shadow-stone-500/20"
                  >
                    출근하기
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                  <Button 
                    onClick={handleClockOut}
                    disabled={!!workLog.clockOut}
                    className="w-full md:w-40 h-14 rounded-[16px] bg-stone-100 hover:bg-stone-200 text-stone-900 text-lg font-semibold"
                  >
                    {workLog.clockOut ? "퇴근완료" : "퇴근하기"}
                  </Button>
                </motion.div>
              )}
            </div>
            </Card>
          </motion.div>

          {/* Weekly Work Hours Widget */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <WeeklyWorkHoursWidget currentHours={38} overtimeHours={4} />
          </motion.div>

          {/* Recent Requests List */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="macos-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">최근 신청 내역</CardTitle>
              <Button variant="ghost" className="text-primary hover:bg-orange-50/30">전체보기</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: "연차", date: "2026.01.20", status: "승인완료", icon: Plane, color: "bg-orange-100/30 text-primary" },
                { type: "반차", date: "2026.01.15", status: "대기중", icon: Coffee, color: "bg-orange-100 text-orange-600" },
                { type: "연장", date: "2026.01.10", status: "반려", icon: Briefcase, color: "bg-red-100 text-red-600" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-[16px] hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--macos-text-primary)]">{item.type}</p>
                      <p className="text-sm text-[var(--macos-text-secondary)]">{item.date}</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium border-none ${
                    item.status === '승인완료' ? 'bg-green-100 text-green-700' :
                    item.status === '대기중' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          </motion.div>

        </div>
      </div>
    </EmployeeLayout>
  );
}
