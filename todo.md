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
- [x] 권한 세분화 (RBAC: admin, hr, finance, user)
- [x] 역할 기반 메뉴 표시/숨김

## 진행 중

- [ ] 실제 이메일 발송 연동 (SMTP/SendGrid)

## 예정된 기능

- [x] 직원 개별 등록/수정 폼 (EmployeeDetailForm)
- [ ] 급여 대장 엑셀 다운로드
- [ ] 실시간 알림 시스템
- [ ] 메신저 연동 (Slack/Teams)
- [ ] AI 이상 징후 탐지

## 버그 수정

- [x] 관리자 대시보드 오류 수정
- [x] 관리자 로그인 오류 수정 (useAuth import 경로 수정)


## 멀티테넌트 백엔드 통합 (Phase 1)

- [x] 고객사(clients) 테이블 스키마 추가
- [x] 자문 이력(consultations) 테이블 스키마 추가
- [ ] 직원 테이블에 client_id 외래키 추가
- [ ] 5단계 권한 체계 (super_admin, consultant, company_admin, company_hr, employee)
- [x] 고객사 CRUD API
- [x] 자문 이력 CRUD API
- [ ] 권한 검증 미들웨어

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
