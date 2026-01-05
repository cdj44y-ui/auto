export type ServiceScope = 'labor_law' | 'safety' | 'hr_consulting' | 'integrated';
export type PartnerStatus = 'active' | 'inactive' | 'suspended';
export type AdminRole = 'super_admin' | 'admin' | 'viewer';
export type SubscriptionPlan = 'basic' | 'standard' | 'premium';
export type ClientStatus = 'active' | 'trial' | 'expired' | 'suspended';
export type ClientUserRole = 'client_admin' | 'hr_manager' | 'team_leader' | 'employee';

export interface Partner {
  partner_id: string; // UUID
  company_name: string;
  business_registration_number: string;
  representative_name: string;
  contact_phone: string;
  contact_email: string;
  office_address: string;
  service_scope: ServiceScope;
  contract_start_date: string;
  contract_end_date: string;
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  introduction?: string;
  specialized_fields?: string[];
  certifications?: string[];
}

export interface PartnerAdmin {
  admin_id: string; // UUID
  partner_id: string;
  user_id: string;
  role: AdminRole;
  permissions: PermissionMatrix;
  is_primary: boolean;
  status: 'active' | 'inactive';
  assigned_at: string;
  assigned_by: string;
  revoked_at?: string;
}

export interface PermissionMatrix {
  client_management: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  attendance_data: {
    view: boolean;
    export: boolean;
    modify: boolean;
  };
  system_settings: {
    access: boolean;
  };
  report_generation: {
    access: boolean;
    approve: boolean;
  };
  [key: string]: any; // 확장성
}

export interface Client {
  client_id: string; // UUID
  partner_id: string;
  company_name: string;
  business_registration_number: string;
  industry_type: string;
  employee_count: number;
  representative_name: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  subscription_plan: SubscriptionPlan;
  subscription_start_date: string;
  subscription_end_date: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  assigned_modules: string[];
  feature_flags: Record<string, boolean>;
  usage_limits: Record<string, number>;
}

export interface ClientUser {
  client_user_id: string; // UUID
  client_id: string;
  user_id: string;
  role: ClientUserRole;
  department: string;
  employee_number: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  activated_at: string;
  deactivated_at?: string;
}
