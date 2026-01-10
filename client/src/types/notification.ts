export type NotificationChannel = "email" | "kakao" | "slack" | "sms" | "push" | "phone";
export type NotificationTarget = "self" | "manager" | "admin";
export type NotificationTriggerType = "late_checkin" | "absent" | "overtime" | "leave_request" | "contract_sign" | "insurance_status";

export interface NotificationRule {
  id: string;
  name: string;
  triggerType: NotificationTriggerType;
  conditionMinutes?: number; // 예: 10분 지각 시
  conditionTime?: string;    // 예: 11:00까지 미출근 시
  channels: NotificationChannel[];
  targets: NotificationTarget[];
  isActive: boolean;
  template: string;
}

export const DEFAULT_NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: "rule-1",
    name: "출근 미체크 알림 (본인)",
    triggerType: "late_checkin",
    conditionMinutes: 10,
    channels: ["push", "kakao"],
    targets: ["self"],
    isActive: true,
    template: "{{name}}님, 출근 시간이 {{minutes}}분 지났습니다. 출근 체크를 잊으셨나요?"
  },
  {
    id: "rule-2",
    name: "장기 미출근 알림 (관리자)",
    triggerType: "absent",
    conditionTime: "11:00",
    channels: ["slack", "email"],
    targets: ["manager"],
    isActive: true,
    template: "{{team}} {{name}}님이 11시까지 출근하지 않았습니다. 확인이 필요합니다."
  },
  {
    id: "rule-3",
    name: "연장근무 신청 알림",
    triggerType: "overtime",
    channels: ["push"],
    targets: ["manager"],
    isActive: true,
    template: "{{name}}님이 연장근무를 신청했습니다. 승인해주세요."
  },
  {
    id: "rule-4",
    name: "4대보험 신고 상태 변경 알림",
    triggerType: "insurance_status",
    channels: ["kakao", "email"],
    targets: ["manager", "admin"],
    isActive: true,
    template: "[{{company}}] {{name}}님의 {{type}} 처리가 '{{status}}' 상태로 변경되었습니다."
  }
];
