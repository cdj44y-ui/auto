import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { GitMerge, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { addAuditLog } from '@/lib/audit-service';

interface ApprovalStep {
  id: string;
  role: string; // TEAM_LEADER, DEPT_HEAD, CEO, HR_MANAGER
  label: string;
}

interface WorkflowRule {
  id: string;
  name: string;
  conditionType: 'LEAVE_DAYS' | 'LEAVE_TYPE' | 'OVERTIME_HOURS';
  operator: 'GREATER_THAN' | 'EQUALS';
  value: string | number;
  steps: ApprovalStep[];
  isActive: boolean;
}

const ROLE_OPTIONS = [
  { value: 'TEAM_LEADER', label: '팀장' },
  { value: 'DEPT_HEAD', label: '본부장' },
  { value: 'HR_MANAGER', label: '인사담당자' },
  { value: 'CEO', label: '대표이사' },
];

export function WorkflowSettings() {
  const [rules, setRules] = useState<WorkflowRule[]>([
    {
      id: 'rule-1',
      name: '단기 휴가 (1일 이하)',
      conditionType: 'LEAVE_DAYS',
      operator: 'EQUALS',
      value: 1,
      steps: [{ id: 's1', role: 'TEAM_LEADER', label: '팀장' }],
      isActive: true
    },
    {
      id: 'rule-2',
      name: '장기 휴가 (3일 이상)',
      conditionType: 'LEAVE_DAYS',
      operator: 'GREATER_THAN',
      value: 3,
      steps: [
        { id: 's2-1', role: 'TEAM_LEADER', label: '팀장' },
        { id: 's2-2', role: 'DEPT_HEAD', label: '본부장' }
      ],
      isActive: true
    },
    {
      id: 'rule-3',
      name: '경조사 휴가',
      conditionType: 'LEAVE_TYPE',
      operator: 'EQUALS',
      value: 'FAMILY_EVENT',
      steps: [
        { id: 's3-1', role: 'TEAM_LEADER', label: '팀장' },
        { id: 's3-2', role: 'HR_MANAGER', label: '인사담당자' }
      ],
      isActive: true
    }
  ]);

  const handleToggleRule = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setRules(rules.map(r => r.id === id ? { ...r, isActive: newStatus } : r));
    
    await addAuditLog({
      actorId: 'current-user',
      actorName: '현재 사용자',
      actorRole: 'ADMIN',
      action: 'UPDATE',
      targetType: 'SETTINGS',
      details: `결재 규칙 '${rules.find(r => r.id === id)?.name}' ${newStatus ? '활성화' : '비활성화'}`,
    });
  };

  const getConditionText = (rule: WorkflowRule) => {
    if (rule.conditionType === 'LEAVE_DAYS') {
      return `휴가 일수 ${rule.operator === 'GREATER_THAN' ? '>' : '='} ${rule.value}일`;
    } else if (rule.conditionType === 'LEAVE_TYPE') {
      return `휴가 유형 = ${rule.value === 'FAMILY_EVENT' ? '경조사' : rule.value}`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-primary" />
                지능형 결재 워크플로우 (Intelligent Workflow)
              </CardTitle>
              <CardDescription>
                조건에 따라 결재 라인이 자동으로 변경되는 규칙을 설정합니다.
              </CardDescription>
            </div>
            <Button className="bg-primary hover:bg-orange-800">
              <Plus className="h-4 w-4 mr-2" /> 새 규칙 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${rule.isActive ? 'bg-orange-100/30 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                      <GitMerge className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{rule.name}</h3>
                      <p className="text-sm text-stone-500">{getConditionText(rule)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`switch-${rule.id}`} className="text-sm text-stone-600">
                        {rule.isActive ? '사용 중' : '사용 안함'}
                      </Label>
                      <Switch 
                        id={`switch-${rule.id}`}
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule.id, rule.isActive)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-stone-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  <Badge variant="outline" className="bg-stone-50 text-stone-600 border-stone-200 px-3 py-1">
                    신청자
                  </Badge>
                  
                  {rule.steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="h-px w-8 bg-stone-300 relative">
                        <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-stone-300 rotate-45"></div>
                      </div>
                      <Badge className="bg-orange-50/30 text-orange-700 border-orange-200/30 hover:bg-orange-100/30 px-3 py-1">
                        {index + 1}. {step.label}
                      </Badge>
                    </React.Fragment>
                  ))}
                  
                  <div className="h-px w-8 bg-stone-300 relative">
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-stone-300 rotate-45"></div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> 최종 승인
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            자동 반려 규칙 (Auto-Rejection)
          </CardTitle>
          <CardDescription>
            특정 조건 충족 시 관리자 개입 없이 시스템이 자동으로 반려 처리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-stone-50">
              <div>
                <h4 className="font-medium text-sm">잔여 연차 초과 신청</h4>
                <p className="text-xs text-stone-500">보유한 연차 일수보다 많은 기간을 신청할 경우</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-stone-50">
              <div>
                <h4 className="font-medium text-sm">과거 날짜 신청 제한</h4>
                <p className="text-xs text-stone-500">이미 지난 날짜에 대해 휴가/근태 신청 시 (소명 신청 제외)</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-stone-50">
              <div>
                <h4 className="font-medium text-sm">중복 일정 차단</h4>
                <p className="text-xs text-stone-500">이미 승인된 휴가/출장 기간과 겹치는 신청 시</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
