export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ACCESS_SENSITIVE_DATA';

export type AuditTargetType = 
  | 'EMPLOYEE'
  | 'SALARY'
  | 'LEAVE_REQUEST'
  | 'ATTENDANCE'
  | 'SETTINGS'
  | 'CONTRACT';

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  details: string;
  changes?: AuditChange[];
  ipAddress?: string;
  userAgent?: string;
}
