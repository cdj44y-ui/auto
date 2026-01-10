import { useState } from "react";
import { 
  NotificationRule, 
  DEFAULT_NOTIFICATION_RULES, 
  NotificationChannel, 
  NotificationTarget 
} from "@/types/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Slack, 
  Clock, 
  User, 
  Users, 
  Plus, 
  Trash2,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [rules, setRules] = useState<NotificationRule[]>(DEFAULT_NOTIFICATION_RULES);

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success("알림 상태가 변경되었습니다.");
  };

  const handleSave = () => {
    // 실제로는 API 호출
    toast.success("알림 설정이 저장되었습니다.");
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case "email": return <Mail className="h-4 w-4" />;
      case "kakao": return <MessageCircle className="h-4 w-4" />;
      case "slack": return <Slack className="h-4 w-4" />;
      case "sms": return <Smartphone className="h-4 w-4" />;
      case "push": return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelLabel = (channel: NotificationChannel) => {
    switch (channel) {
      case "email": return "이메일";
      case "kakao": return "알림톡";
      case "slack": return "슬랙";
      case "sms": return "문자";
      case "push": return "앱 푸시";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">알림 설정 센터</h2>
          <p className="text-muted-foreground">
            근태 이상 발생 시 발송될 알림 규칙과 채널을 설정합니다.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          설정 저장
        </Button>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => (
          <Card key={rule.id} className={`transition-all ${!rule.isActive ? 'opacity-60 bg-slate-50' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {rule.triggerType === "late_checkin" && `출근 시간 ${rule.conditionMinutes}분 경과 시 발송`}
                      {rule.triggerType === "absent" && `${rule.conditionTime}까지 미출근 시 발송`}
                      {rule.triggerType === "overtime" && "연장근무 신청 즉시 발송"}
                      {rule.triggerType === "insurance_status" && "신고 상태 변경(접수/처리중/완료) 시 발송"}
                    </CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={rule.isActive}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                />
              </div>
            </CardHeader>
            
            {rule.isActive && (
              <CardContent className="grid md:grid-cols-2 gap-6 pt-0">
                <div className="space-y-4 border-r pr-6">
                  <div className="space-y-2">
                    <Label>발송 채널</Label>
                    <div className="flex flex-wrap gap-2">
                      {rule.channels.map(channel => (
                        <Badge key={channel} variant="secondary" className="gap-1 px-3 py-1">
                          {getChannelIcon(channel)}
                          {getChannelLabel(channel)}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6 text-xs rounded-full">
                        <Plus className="h-3 w-3 mr-1" /> 추가
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>수신 대상</Label>
                    <div className="flex gap-2">
                      {rule.targets.map(target => (
                        <Badge key={target} variant="outline" className="gap-1">
                          {target === "self" ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                          {target === "self" ? "본인" : target === "manager" ? "부서장" : "관리자"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>메시지 템플릿 미리보기</Label>
                  <div className="bg-slate-100 p-4 rounded-md text-sm text-slate-700 relative group">
                    <p className="whitespace-pre-wrap">{rule.template}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 text-xs"
                    >
                      수정
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => toast.info(`'${rule.name}' 테스트 알림을 발송했습니다.`)}>
                      테스트 발송
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        <Button variant="outline" className="w-full border-dashed py-8 text-muted-foreground hover:text-primary">
          <Plus className="h-4 w-4 mr-2" />
          새로운 알림 규칙 추가하기
        </Button>
      </div>
    </div>
  );
}
