import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationCenter() {
  const notifications = [
    {
      id: 1,
      title: "연차 승인 완료",
      message: "1월 27일 연차 신청이 승인되었습니다.",
      time: "방금 전",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "급여명세서 도착",
      message: "2026년 1월 급여명세서가 발송되었습니다.",
      time: "1시간 전",
      type: "info",
      read: false
    },
    {
      id: 3,
      title: "근태 미입력 알림",
      message: "어제 퇴근 기록이 확인되지 않습니다.",
      time: "어제",
      type: "warning",
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 dark:text-slate-400">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="p-4 border-b bg-slate-50 dark:bg-slate-900 dark:border-slate-800 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold dark:text-slate-100">알림 센터</h4>
            <span className="text-xs text-muted-foreground">{unreadCount}개의 읽지 않은 알림</span>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="divide-y dark:divide-slate-800">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 shrink-0 ${
                    notification.type === 'success' ? 'text-green-500' :
                    notification.type === 'warning' ? 'text-orange-500' :
                    'text-blue-500'
                  }`}>
                    {notification.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {notification.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                    {notification.type === 'info' && <FileText className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none dark:text-slate-200">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-lg text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full h-8">
            모두 읽음 처리
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
