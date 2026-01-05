export enum FlexibleWorkType {
  SELECTIVE_WORKING_HOURS = 'selective_working_hours',      // 선택적 근로시간제
  FLEXIBLE_WORKING_HOURS = 'flexible_working_hours',        // 탄력적 근로시간제
  STAGGERED_COMMUTE = 'staggered_commute',                  // 시차출퇴근제
  DISCRETIONARY_WORK = 'discretionary_work',                // 재량근로시간제
  DEEMED_WORKING_HOURS = 'deemed_working_hours',            // 간주근로시간제
}

export enum ApprovalStatus {
  DRAFT = 'draft',                    // 임시저장
  PENDING = 'pending',                // 승인대기
  HR_REVIEW = 'hr_review',            // 인사팀 검토중
  APPROVED = 'approved',              // 승인완료
  REJECTED = 'rejected',              // 반려
  CANCELLED = 'cancelled',            // 취소
}

export interface FlexibleWorkPolicy {
  policy_id: string;
  client_id: string;
  policy_type: FlexibleWorkType;
  policy_name: string;
  
  legal_requirements: {
    selective?: {
      core_time_required: boolean;
      core_time_start: string;
      core_time_end: string;
      flexible_time_start: string;
      flexible_time_end: string;
      daily_standard_hours: number;
      requires_labor_agreement: boolean;
      labor_agreement_file_url?: string;
    };
    flexible?: {
      unit_period_weeks: number;
      unit_period_type: '2weeks' | '3months';
      weekly_standard_hours: number;
      max_daily_hours: number;
      max_weekly_hours: number;
      requires_labor_agreement: boolean;
      labor_agreement_file_url?: string;
      special_provisions?: string;
    };
    staggered?: {
      shift_patterns: Array<{
        shift_id: string;
        shift_name: string;
        work_start_time: string;
        work_end_time: string;
        break_duration_minutes: number;
        daily_work_hours: number;
      }>;
      rotation_cycle_days?: number;
      requires_notice_period_days: number;
    };
  };
  
  eligibility_criteria: {
    eligible_departments?: string[];
    eligible_job_levels?: string[];
    min_tenure_months?: number;
    excluded_positions?: string[];
  };
  
  effective_start_date: string; // Date string
  effective_end_date: string;   // Date string
  
  approval_workflow: {
    requires_manager_approval: boolean;
    requires_hr_approval: boolean;
    requires_executive_approval: boolean;
    auto_approve_conditions?: object;
  };
  
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FlexibleWorkApplication {
  application_id: string;
  client_id: string;
  policy_id: string;
  
  applicant_user_id: string;
  applicant_name: string;
  applicant_employee_number: string;
  applicant_department: string;
  applicant_position: string;
  
  application_type: FlexibleWorkType;
  application_period: {
    start_date: string;
    end_date: string;
    is_permanent: boolean;
  };
  
  details: {
    selective?: {
      preferred_start_time: string;
      preferred_end_time: string;
      daily_work_hours: number;
      reason: string;
    };
    flexible?: {
      weekly_schedule: Array<{
        week_number: number;
        daily_schedules: Array<{
          day_of_week: number;
          work_hours: number;
          start_time?: string;
          end_time?: string;
        }>;
        total_weekly_hours: number;
      }>;
      reason: string;
    };
    staggered?: {
      selected_shift_id: string;
      shift_name: string;
      work_start_time: string;
      work_end_time: string;
      reason: string;
    };
  };
  
  attachments: Array<{
    file_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
  }>;
  
  status: ApprovalStatus;
  current_approver_id?: string;
  
  approval_history: Array<{
    step: number;
    approver_id: string;
    approver_name: string;
    approver_role: string;
    action: 'approved' | 'rejected' | 'returned';
    comments?: string;
    actioned_at: string;
  }>;
  
  rejection_reason?: string;
  rejection_at?: string;
  
  approved_at?: string;
  approved_by?: string;
  
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}
