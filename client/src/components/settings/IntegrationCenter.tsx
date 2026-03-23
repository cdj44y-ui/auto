import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  category: 'calendar' | 'messenger' | 'utility';
}

export function IntegrationCenter() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: '승인된 휴가 및 출장 일정을 구글 캘린더에 자동으로 등록합니다.',
      icon: <Calendar className="h-6 w-6 text-red-500" />,
      status: 'disconnected',
      category: 'calendar'
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      description: 'Microsoft Outlook 일정과 양방향으로 동기화합니다.',
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      status: 'disconnected',
      category: 'calendar'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: '근태 알림 및 결재 요청을 슬랙 채널로 전송합니다.',
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      status: 'connected',
      lastSync: '2026-01-27 14:30',
      category: 'messenger'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Teams 봇을 통해 근태 관리 기능을 채팅창에서 사용합니다.',
      icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
      status: 'disconnected',
      category: 'messenger'
    }
  ]);

  const [autoSync, setAutoSync] = useState(true);

  const handleConnect = (id: string) => {
    // Simulate connection process
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: '연동 설정을 진행 중입니다...',
        success: () => {
          setIntegrations(prev => prev.map(item => 
            item.id === id ? { ...item, status: 'connected', lastSync: new Date().toLocaleString() } : item
          ));
          return '성공적으로 연동되었습니다.';
        },
        error: '연동에 실패했습니다.'
      }
    );
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'disconnected', lastSync: undefined } : item
    ));
    toast.success('연동이 해제되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">외부 서비스 연동 (Integration Center)</h2>
          <p className="text-muted-foreground">
            캘린더, 메신저 등 업무에 사용하는 외부 도구와 근태관리 시스템을 연결하세요.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
          <Label htmlFor="auto-sync" className="text-sm font-medium cursor-pointer">자동 동기화</Label>
          <Switch 
            id="auto-sync" 
            checked={autoSync} 
            onCheckedChange={setAutoSync} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <Card key={item.id} className={`border-l-4 ${
            item.status === 'connected' ? 'border-l-green-500' : 'border-l-stone-300'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-50 dark:bg-stone-800 rounded-md">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={item.status === 'connected' ? 'default' : 'outline'} className={
                        item.status === 'connected' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-0' : ''
                      }>
                        {item.status === 'connected' ? '연동됨' : '미연동'}
                      </Badge>
                      {item.category === 'calendar' && (
                        <Badge variant="secondary" className="text-xs">Calendar</Badge>
                      )}
                      {item.category === 'messenger' && (
                        <Badge variant="secondary" className="text-xs">Messenger</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {item.status === 'connected' ? (
                  <Button variant="outline" size="sm" onClick={() => handleDisconnect(item.id)}>
                    해제
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(item.id)}>
                    연동하기
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {item.description}
              </CardDescription>
              
              {item.status === 'connected' && (
                <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-900 rounded-md text-xs flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    정상 작동 중
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    마지막 동기화: {item.lastSync}
                  </span>
                </div>
              )}
            </CardContent>
            {item.status === 'connected' && (
              <CardFooter className="pt-0 pb-4">
                <Button variant="link" className="px-0 text-xs h-auto text-muted-foreground hover:text-primary">
                  상세 설정 <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-orange-50/30 dark:bg-stone-800/30 border-orange-200/30 dark:border-stone-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-stone-800 dark:text-orange-100">캘린더 연동 안내</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Google Calendar 연동 시, '근태관리'라는 이름의 새 캘린더가 생성되며 승인된 휴가와 출장 일정만 동기화됩니다.
                개인 일정은 수집되지 않으니 안심하세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
