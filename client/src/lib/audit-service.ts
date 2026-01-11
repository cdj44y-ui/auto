import { AuditLog, AuditAction, AuditTargetType } from '@/types/audit';

// Mock data for demonstration
const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    actorId: 'admin-01',
    actorName: '김관리',
    actorRole: 'ADMIN',
    action: 'UPDATE',
    targetType: 'SALARY',
    targetId: 'emp-005',
    details: '홍길동 사원 급여 정보 수정',
    changes: [
      { field: 'baseSalary', oldValue: 3000000, newValue: 3200000 }
    ],
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    actorId: 'admin-01',
    actorName: '김관리',
    actorRole: 'ADMIN',
    action: 'APPROVE',
    targetType: 'LEAVE_REQUEST',
    targetId: 'leave-102',
    details: '이영희 연차 신청 승인',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    actorId: 'sys-auto',
    actorName: 'System',
    actorRole: 'SYSTEM',
    action: 'REJECT',
    targetType: 'LEAVE_REQUEST',
    targetId: 'leave-105',
    details: '박철수 연차 신청 자동 반려 (잔여 연차 부족)',
  },
  {
    id: 'log-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actorId: 'admin-02',
    actorName: '최인사',
    actorRole: 'ADMIN',
    action: 'ACCESS_SENSITIVE_DATA',
    targetType: 'EMPLOYEE',
    targetId: 'emp-003',
    details: '김민수 주민등록번호 조회',
    ipAddress: '10.0.0.5'
  },
  {
    id: 'log-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 1 day 1 hour ago
    actorId: 'admin-01',
    actorName: '김관리',
    actorRole: 'ADMIN',
    action: 'UPDATE',
    targetType: 'SETTINGS',
    details: '코어 타임 설정 변경 (10:00-16:00 -> 10:00-15:00)',
    changes: [
      { field: 'coreTimeEnd', oldValue: '16:00', newValue: '15:00' }
    ]
  }
];

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_LOGS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, 500);
  });
};

export const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  MOCK_LOGS.unshift(newLog);
  return newLog;
};
