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
- [ ] 고객사 CRUD API
- [ ] 자문 이력 CRUD API
- [ ] 권한 검증 미들웨어
