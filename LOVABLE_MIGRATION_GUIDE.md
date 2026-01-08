# Lovable Migration Guide for Attendance Enterprise System

이 문서는 현재 개발된 **근태관리 시스템(Attendance Enterprise System)**을 Lovable(Lovable.dev) 플랫폼으로 이관하기 위한 가이드입니다.
Lovable의 채팅창에 아래의 **Master Prompt**를 입력하면 현재 프로젝트의 구조와 핵심 기능을 빠르게 재구축할 수 있습니다.

---

## 1. Master Prompt (복사해서 Lovable에 붙여넣으세요)

```markdown
I want to build an **Enterprise HR & Attendance Management SaaS** with Multi-tenancy support.
The system should support three main user roles: **Employee**, **Admin**, and **Consultant (Partner)**.

### Tech Stack
- Framework: React + TypeScript + Vite
- UI Library: shadcn/ui + Tailwind CSS
- Icons: Lucide React
- State Management: React Context API + TanStack Query
- Database: Supabase (PostgreSQL)

### Core Features to Implement

1. **Multi-tenancy Architecture**
   - **Partner Center**: Consultants can manage multiple client companies.
   - **Client Onboarding**: Wizard for registering new companies (Info -> Plan -> Admin -> Review).
   - **Permission Matrix**: Granular control of permissions (View/Edit/Delete) for each module.

2. **Attendance Management**
   - **Dashboard**: Real-time clock-in/out with location verification.
   - **Flexible Work System**: Support for Staggered Commute & Selective Working Hours.
   - **Approval Workflow**: Request and approve Overtime, Leave, and Flexible Work applications.

3. **Payroll System (High Precision)**
   - **Reverse Calculation**: Calculate base salary from gross pay (inclusive wage system).
   - **Allowance Split**: Strictly separate Overtime, Night, and Holiday allowances.
   - **4 Major Insurances**: Auto-calculation based on 2026 rates (National Pension, Health, Employment, Workers' Comp).

4. **Electronic Labor Contract**
   - **Template Engine**: Dynamic contract generation with 2-page standard clauses.
   - **E-Signature**: Digital signature pad for employees.
   - **PDF Generation**: Export signed contracts to PDF.

### Key Data Models (Supabase Schema)

- **users**: id, email, role (employee/admin/consultant), company_id, department, position
- **companies**: id, name, business_number, plan_type (basic/standard/premium)
- **attendance_logs**: id, user_id, type (check_in/out), timestamp, location, verification_hash
- **flexible_work_policies**: id, company_id, type (staggered/selective), core_time_start, core_time_end
- **flexible_work_applications**: id, user_id, type, start_date, end_date, status (pending/approved/rejected)
- **payroll_records**: id, user_id, year, month, base_salary, overtime_pay, night_pay, holiday_pay, deductions

### UI/UX Requirements
- **Theme**: Clean, professional dashboard with Dark Mode support.
- **Navigation**: Role-based sidebar (Employees see "My Attendance", Admins see "Company Settings").
- **Interactivity**: Use toast notifications for actions, dialogs for forms, and tabs for organizing complex views.
```

---

## 2. Supabase Database Schema (SQL)

Lovable 프로젝트 생성 후 Supabase SQL Editor에서 실행하여 테이블을 생성하세요.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies Table
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  business_number text,
  plan_type text check (plan_type in ('basic', 'standard', 'premium')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('employee', 'admin', 'consultant', 'developer')),
  company_id uuid references public.companies(id),
  department text,
  position text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flexible Work Policies
create table public.flexible_work_policies (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) not null,
  policy_type text not null,
  policy_name text not null,
  core_time_start time,
  core_time_end time,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flexible Work Applications
create table public.flexible_work_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  policy_id uuid references public.flexible_work_policies(id),
  type text not null,
  start_date date not null,
  end_date date not null,
  reason text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 3. Manual Copy Required (핵심 로직 파일)

Lovable이 UI는 잘 생성하지만, 복잡한 비즈니스 로직은 기존 코드를 그대로 사용하는 것이 안전합니다.
아래 파일들은 Lovable 프로젝트의 `src/components` 또는 `src/lib` 폴더에 직접 복사해 넣으세요.

1.  **급여 계산 엔진 (Payroll Engine)**
    *   `client/src/components/consultant/ConsultantPayrollManager.tsx`
    *   `client/src/components/consultant/payroll/InsuranceRateManager.tsx`
    *   *이유: 4대보험 요율, 포괄임금제 역산 로직의 정밀도가 매우 중요함*

2.  **유연근무제 신청 위저드 (Flexible Work Wizard)**
    *   `client/src/components/flexible-work/FlexibleWorkApplicationWizard.tsx`
    *   *이유: 3단계 위저드 UI와 상태 관리 로직이 복잡하게 얽혀 있음*

3.  **권한 매트릭스 에디터 (Permission Matrix)**
    *   `client/src/components/partner/PermissionMatrixEditor.tsx`
    *   *이유: 체크박스 그리드 상호작용 로직 보존 필요*

4.  **타입 정의 (Type Definitions)**
    *   `client/src/types/flexible-work.ts`
    *   `client/src/types/saas.ts` (존재 시)
    *   *이유: 데이터 구조의 일관성 유지*

---

## 4. Migration Steps

1.  **Lovable 프로젝트 생성**: Lovable.dev에서 새 프로젝트를 시작합니다.
2.  **Master Prompt 입력**: 위 1번 항목의 프롬프트를 입력하여 기본 골격을 생성합니다.
3.  **Supabase 연동**: Lovable 설정에서 Supabase를 연결하고 2번 항목의 SQL을 실행합니다.
4.  **핵심 로직 이식**: 3번 항목의 파일들을 Lovable의 코드 에디터(또는 GitHub 연동 후 로컬)에서 붙여넣습니다.
5.  **UI 조정**: Lovable의 채팅 기능을 사용하여 "Apply the FlexibleWorkApplicationWizard component to the Employee Dashboard"와 같이 명령하여 컴포넌트를 연결합니다.
