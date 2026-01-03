import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  company: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  status: "online" | "offline";
}

export default function ConsultationChat() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState<number | null>(1);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 모의 채팅방 목록
  const chatRooms: ChatRoom[] = [
    { id: 1, name: "김인사 팀장", company: "(주)테크스타트업", avatar: "K", lastMessage: "네, 이번 주까지 처리하겠습니다.", unreadCount: 0, status: "online" },
    { id: 2, name: "이총무 대리", company: "글로벌무역상사", avatar: "L", lastMessage: "퇴직금 계산 관련 문의드립니다.", unreadCount: 2, status: "offline" },
    { id: 3, name: "박대표", company: "퓨처디자인랩", avatar: "P", lastMessage: "계약서 검토 부탁드립니다.", unreadCount: 0, status: "online" },
  ];

  // 모의 메시지 데이터
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "안녕하세요 노무사님, 이번에 채용하는 인턴 계약서 검토 부탁드려도 될까요?", timestamp: "오전 10:30", read: true },
    { id: 2, sender: "me", text: "네, 안녕하세요. 초안 보내주시면 검토 후 피드백 드리겠습니다.", timestamp: "오전 10:32", read: true },
    { id: 3, sender: "other", text: "메일로 발송해드렸습니다. 확인 부탁드립니다.", timestamp: "오전 10:35", read: true },
    { id: 4, sender: "me", text: "확인했습니다. 수습기간 조항이 약간 모호해서 수정이 필요해 보입니다.", timestamp: "오전 11:00", read: true },
    { id: 5, sender: "other", text: "아 그렇군요. 어떤 부분을 수정하면 좋을까요?", timestamp: "오전 11:05", read: true },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "me",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // 자동 응답 시뮬레이션
    setTimeout(() => {
      const reply: Message = {
        id: messages.length + 2,
        sender: "other",
        text: "네, 알겠습니다. 수정해서 다시 보내드리겠습니다.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white dark:bg-slate-950 dark:border-slate-800">
      {/* 채팅방 목록 (사이드바) */}
      <div className="w-80 border-r dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-lg dark:text-slate-100">상담 목록</h3>
        </div>
        <ScrollArea className="flex-1">
          {chatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${
                activeRoom === room.id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">{room.avatar}</AvatarFallback>
                </Avatar>
                {room.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium truncate dark:text-slate-200">{room.name}</span>
                  <span className="text-xs text-slate-500">{room.company}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{room.lastMessage}</p>
              </div>
              {room.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {room.unreadCount}
                </span>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 채팅 헤더 */}
        <div className="h-16 border-b dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-indigo-100 text-indigo-600">K</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold dark:text-slate-100">김인사 팀장</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> 온라인
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Phone className="w-5 h-5 text-slate-500" /></Button>
            <Button variant="ghost" size="icon"><Video className="w-5 h-5 text-slate-500" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5 text-slate-500" /></Button>
          </div>
        </div>

        {/* 메시지 리스트 */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    msg.sender === "me"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 dark:text-slate-100 border dark:border-slate-700 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-[10px] mt-1 flex items-center gap-1 ${
                    msg.sender === "me" ? "text-indigo-200 justify-end" : "text-slate-400"
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === "me" && (
                      <span>{msg.read ? "읽음" : "안읽음"}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
