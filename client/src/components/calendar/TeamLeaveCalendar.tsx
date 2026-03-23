import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 휴가 유형 정의
type LeaveType = 'annual' | 'half_am' | 'half_pm' | 'sick' | 'vacation' | 'remote';

interface LeaveEvent {
  id: string;
  userId: string;
  userName: string;
  department: string;
  date: Date;
  type: LeaveType;
  description?: string;
}

// Mock Data
const MOCK_EVENTS: LeaveEvent[] = [
  { id: '1', userId: 'EMP001', userName: '김철수', department: '개발팀', date: new Date(2026, 0, 15), type: 'annual', description: '개인 사정' },
  { id: '2', userId: 'EMP002', userName: '이영희', department: '디자인팀', date: new Date(2026, 0, 16), type: 'half_pm', description: '병원 진료' },
  { id: '3', userId: 'EMP003', userName: '박지민', department: '마케팅팀', date: new Date(2026, 0, 20), type: 'sick', description: '감기 몸살' },
  { id: '4', userId: 'EMP004', userName: '최민수', department: '영업팀', date: new Date(2026, 0, 22), type: 'vacation', description: '제주도 여행' },
  { id: '5', userId: 'EMP004', userName: '최민수', department: '영업팀', date: new Date(2026, 0, 23), type: 'vacation', description: '제주도 여행' },
  { id: '6', userId: 'EMP005', userName: '정수진', department: '인사팀', date: new Date(2026, 0, 27), type: 'remote', description: '재택 근무' },
  // 2월 데이터
  { id: '7', userId: 'EMP001', userName: '김철수', department: '개발팀', date: new Date(2026, 1, 5), type: 'annual' },
  { id: '8', userId: 'EMP002', userName: '이영희', department: '디자인팀', date: new Date(2026, 1, 12), type: 'half_am' },
];

const LeaveTypeColors: Record<LeaveType, string> = {
  annual: "bg-orange-100/30 text-orange-700 border-orange-200/30 dark:bg-stone-800/30 dark:text-orange-300 dark:border-stone-700",
  half_am: "bg-orange-100/30 text-orange-700 border-orange-200/30 dark:bg-stone-900/30 dark:text-orange-300 dark:border-stone-700",
  half_pm: "bg-orange-100/30 text-orange-700 border-orange-200/30 dark:bg-stone-900/30 dark:text-orange-300 dark:border-stone-700",
  sick: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  vacation: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  remote: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
};

const LeaveTypeLabels: Record<LeaveType, string> = {
  annual: "연차",
  half_am: "오전반차",
  half_pm: "오후반차",
  sick: "병가",
  vacation: "휴가",
  remote: "재택",
};

export default function TeamLeaveCalendar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchName = event.userName.includes(searchTerm) || event.department.includes(searchTerm);
    const matchDept = selectedDept === "all" || event.department === selectedDept;
    return matchName && matchDept;
  });

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Section */}
      <Card className="flex-1 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              {isAdmin ? "전사 휴가 캘린더" : "팀 휴가 캘린더"}
            </CardTitle>
            <CardDescription>
              {format(currentDate, "yyyy년 M월", { locale: ko })}의 휴가 일정을 확인하세요.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>오늘</Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="직원 이름 검색..." 
                className="pl-9 bg-white dark:bg-stone-950" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="bg-white dark:bg-stone-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="부서 선택" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  <SelectItem value="개발팀">개발팀</SelectItem>
                  <SelectItem value="디자인팀">디자인팀</SelectItem>
                  <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                  <SelectItem value="영업팀">영업팀</SelectItem>
                  <SelectItem value="인사팀">인사팀</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`text-center text-sm font-medium py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 auto-rows-[minmax(100px,auto)]">
            {calendarDays.map((day, dayIdx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`
                    min-h-[100px] p-2 border rounded-lg transition-colors cursor-pointer
                    ${isCurrentMonth ? 'bg-white dark:bg-stone-900' : 'bg-stone-50 dark:bg-stone-950 text-muted-foreground'}
                    ${isTodayDate ? 'ring-2 ring-primary500 ring-offset-2' : ''}
                    ${selectedDate && isSameDay(day, selectedDate) ? 'border-primary bg-orange-50/30 dark:bg-stone-900/10' : 'border-stone-100 dark:border-stone-800 hover:border-orange-200/30'}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${!isCurrentMonth ? 'opacity-50' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] h-4 px-1">
                        {dayEvents.length}건
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${LeaveTypeColors[event.type]}`}>
                              {event.userName} ({LeaveTypeLabels[event.type]})
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{event.userName} - {LeaveTypeLabels[event.type]}</p>
                            <p className="text-xs text-muted-foreground">{event.department}</p>
                            {event.description && <p className="text-xs mt-1">"{event.description}"</p>}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">
                        + {dayEvents.length - 3}명 더보기
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar / Detail View */}
      <Card className="w-full lg:w-80 border-none shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? format(selectedDate, "M월 d일 (E)", { locale: ko }) : "날짜를 선택하세요"}
          </CardTitle>
          <CardDescription>상세 일정 목록</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="space-y-4">
              {getEventsForDay(selectedDate).length > 0 ? (
                getEventsForDay(selectedDate).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-stone-50 dark:bg-stone-900">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.userId}`} />
                      <AvatarFallback>{event.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{event.userName}</span>
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 ${LeaveTypeColors[event.type]}`}>
                          {LeaveTypeLabels[event.type]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.department} {event.description ? `· ${event.description}` : ''}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  등록된 휴가 일정이 없습니다.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              캘린더에서 날짜를 클릭하여<br />상세 일정을 확인하세요.
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">범례</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(LeaveTypeLabels).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-full ${LeaveTypeColors[type as LeaveType].split(' ')[0]}`}></div>
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
