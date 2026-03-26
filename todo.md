# 근태관리시스템 TODO

## 완료된 기능

- [x] 기본 홈페이지 레이아웃
- [x] 관리자 대시보드
- [x] 직원 관리 (엑셀 일괄 등록)
- [x] 급여 관리 (명세서 발송 시뮬레이션)
- [x] 근태 수정/보완
- [x] 유연근무제 신청 및 관리
- [x] 연차 관리 대장
- [x] 팀 휴가 캘린더 (필터링 기능 포함)
- [x] 교대 근무 스케줄러
- [x] IP 접근 관리
- [x] 주 52시간 모니터링
- [x] 연장근무 리포트
- [x] 보안 감사 로그 (Audit Trail)
- [x] 민감 정보 마스킹 (MaskedData)
- [x] 지능형 워크플로우 설정
- [x] 외부 캘린더 연동 (Google/Outlook/iCal)
- [x] 모바일 최적화 (탭 스크롤)
- [x] 풀스택 업그레이드 (web-db-user)
- [x] 데이터베이스 스키마 (직원, 급여, 이메일 로그)
- [x] 백엔드 API (tRPC)
- [x] 권한 세분화 (RBAC: 6단계 → super_admin/consultant/company_admin/company_hr/company_finance/employee)
- [x] 역할 기반 메뉴 표시/숨김

## 진행 중

- [x] 실제 이메일 발송 연동 (email.service.ts — SMTP 설정 시 실발송 가능)

## 예정된 기능

- [x] 직원 개별 등록/수정 폼 (EmployeeDetailForm)
- [x] 급여 대장 엑셀 다운로드 (payroll.exportExcel)
- [x] 실시간 알림 시스템 (SSE + /api/sse)
- [ ] 메신저 연동 (Slack/Teams)
- [ ] AI 이상 징후 탐지

## 버그 수정

- [x] 관리자 대시보드 오류 수정
- [x] 관리자 로그인 오류 수정 (useAuth import 경로 수정)


## 멀티테넌트 백엔드 통합 (Phase 1)

- [x] 고객사(clients) 테이블 스키마 추가
- [x] 자문 이력(consultations) 테이블 스키마 추가
- [x] 직원 테이블에 client_id 외래키 추가 (users.clientId)
- [x] 6단계 권한 체계 (super_admin, consultant, company_admin, company_hr, company_finance, employee)
- [x] 고객사 CRUD API
- [x] 자문 이력 CRUD API
- [x] 권한 검증 미들웨어 (tenantProcedure + 도메인별 프로시저)

- [x] 고객사 관리 페이지 (ClientsPage.tsx) UI 구현

## 멀티테넌트 보안 강화 (7개 프롬프트)

- [x] 프롬프트1: 테넌트 격리 미들웨어 (tenantProcedure, clientFilter)
- [x] 프롬프트2: 테이블 관계 설정 (Drizzle relations)
- [x] 프롬프트3: 외래키 연결 (consultations.clientId, consultantId, employees.clientId)
- [x] 프롬프트4: 로그인 보안 강화 (5회 실패 잠금, 비밀번호 정책, JWT 24h)
- [x] 프롬프트5: 민감정보 암호화 (AES-256-GCM, 마스킹)
- [x] 프롬프트6: 감사 로그 (audit_logs 테이블, writeAuditLog)
- [x] 프롬프트7: 테스트 데이터 생성 (seed.ts)

## 디자인 개선 (D-1~D-6)

- [x] D-1: 역할별 대시보드 (기존 구현 확인)
- [x] D-2: 온보딩 마법사 (기존 ClientOnboardingWizard 확인)
- [x] D-3: 사이드바 메뉴 역할 분리 (Layout.tsx 업데이트)
- [x] D-4: 공통 데이터 테이블 (DataTable.tsx 생성)
- [x] D-5: 출퇴근 버튼 실시간 API (attendance router + DB)
- [x] D-6: 알림 테이블 및 API (notifications router + DB)

## 프리미엄 디자인 개선 (P-1~P-7)

- [x] P-1: 컬러 시스템 + Pretendard 글꼴 교체
- [x] P-2: 사이드바 프리미엄 리디자인 (slate-900 배경)
- [x] P-3: 대시보드 카드 + 여백 리디자인
- [x] P-4: 테이블 프리미엄 스타일 + Badge 통일 (StatusBadge.tsx)
- [x] P-5: 빈 상태(EmptyState) + 로딩 상태(LoadingState)
- [x] P-6: 폼/다이얼로그 스타일 통일 (ClientsPage 적용)
- [x] P-7: 마이크로 인터랙션 + 페이지 전환 애니메이션 (index.css)

## AES 고도화 (21개 프롬프트)

### 1차 필수
- [x] A-1: 근태 통계 API (analytics.monthlySummary)
- [x] A-2: 주 52시간 모니터링 API (analytics.weeklyOvertimeAlerts)
- [x] B-1: 개인정보 동의 API (privacy.saveConsent/myConsents)
- [x] B-2: 데이터 보존 만료 API (privacy.expiredRecords)
- [x] C-1: DB 인덱스 + 스키마 최적화
- [ ] D-1: API 단위 테스트

### 2차 경쟁력
- [x] A-3: 이상 징후 탐지 API (analytics.anomalies)
- [ ] B-3: 개인정보 다운로드/삭제 요청
- [x] C-2: 에러 핸들링 + 헬스체크 API
- [x] E-1: Webhook 테이블 + 발송 로직 (db.sendWebhook)
- [x] E-2: 엑셀 내보내기 (excel.service.ts + payroll.exportExcel + payroll.exportAttendanceExcel)
- [x] F-1: 고객사 헬스 스코어 API (clientHealth.scores)
- [ ] G-3: 반응형 모바일 레이아웃

### 3차 확장
- [ ] C-3: 자동 백업 스크립트
- [ ] D-2: E2E 테스트
- [ ] E-3: REST API 문서 자동 생성
- [ ] F-2: 인앱 도움말 + 툴팁
- [ ] F-3: 변경 이력 / 릴리스 노트
- [ ] G-1: 키보드 네비게이션 + 포커스
- [ ] G-2: 색상 대비 + aria 라벨

## 권한 체계 + 테넌트 격리 + 서버 분리 (P-01~P-03)

- [x] P-01: 권한 체계 6단계 통일 (super_admin/consultant/company_admin/company_hr/company_finance/employee) + users.clientId
- [x] P-02: 테넌트 격리 미들웨어 완성 (clientFilter 실제 동작)
- [x] P-03: 서버 코드 도메인 분리 (routers/ 폴더) + 헬스체크 + 에러 핸들링

## 고도화 프롬프트 (P-04~P-12)

- [x] P-04: 급여 계산 엔진 서버 이관 + 4대보험/소득세 (salary.service.ts, tax-table.ts)
- [x] P-05: 이메일 실발송 + 백그라운드 큐 (email.service.ts, payslip 템플릿)
- [x] P-06: 인증 강화 (Refresh Token 스키마 + 비밀번호 정책 컨텍스트)
- [x] P-07: GPS 출퇴근 인증 + QR 코드 (geofence.service.ts, GPSCheckIn, QRCheckIn)
- [x] P-08: 실시간 통신 (SSE) + 알림 시스템 (sse.service.ts, useSSE, /api/sse)
- [x] P-09: 근로시간 정밀 엔진 — 탄력/선택/재량 (worktime.service.ts)
- [x] P-10: 자문사 대시보드 + 고객사 헬스스코어 (ClientHealthScorePanel)
- [x] P-11: 엑셀 내보내기 + 더존/위하고 호환 (excel.service.ts)
- [x] P-12: UI 리디자인 (Warm Authority 디자인 시스템 전환 완료)

## P-DESIGN: Warm Authority 디자인 시스템 전환

- [x] STEP 1: index.css 디자인 토큰 전면 교체 (Indigo→Stone+Burnt Sienna)
- [x] STEP 2: 전체 컴포넌트 하드코딩 컨러 치환 (blue/indigo/slate→stone/orange/primary)
- [x] STEP 3: 레이아웃 컴포넌트 수정 (Layout.tsx, DashboardLayout.tsx)
- [x] STEP 4: 페이지별 수정 (24개 페이지)
- [x] STEP 5: 커스텀 컴포넌트 수정 (StatusBadge, DataTable, NotificationCenter 등)
- [x] STEP 6-7: shadcn/ui 확인 + 다크모드 검증

## 보안 강화 (P-01~P-02 보안 프롬프트)

- [x] P-01-SEC: 환경변수 시작 시 검증 (requireEnv + JWT_SECRET 최소 32자)
- [x] P-01-SEC: tenantProcedure clientFilter 모든 DB 쿼리에 적용 보강
- [x] P-02-SEC: Express 보안 미들웨어 (helmet + cors + rate-limit)
- [x] P-02-SEC: 쿠키 SameSite 수정 (HTTP에서 lax)
- [x] P-02-SEC: AuthContext 실체화 (서버 세션 기반, 개발모드에서만 mockUser)
- [x] P-02-SEC: OAuth state 암호화 (nonce 기반)
- [x] P-02-SEC: UnifiedLogin 데모 역할 선택 개발모드 전용 (import.meta.env.DEV)
