# 사장님 고민 상담소 (정적 사이트)

`index.html` 1개 + `data/cards.json`. 빌드·프레임워크·로그인·DB·쿠키·추적 스크립트 없음.

## 흐름
상황 10개 → 고민 최대 3개 + "제 상황은 달라요" → 답 카드. 뒤로 가기 1번이면 처음 화면.

## 카드 공개 규칙
- `status`가 `"live"`인 카드만 보입니다.
- `legalRefs`가 있는데 `verifiedAt`이 비어 있으면 live여도 숨기고 콘솔에 경고를 남깁니다.
- 법령 근거를 검수한 뒤 `verifiedAt`에 `"YYYY-MM-DD"`를 넣으면 공개됩니다.
- 내부 확인용: 주소 끝에 `?draft=1`을 붙이면 검수 전 카드도 "검수 전 초안" 표시와 함께 보입니다.

## 채워야 할 값
- `defaultCta.href`, `other.cta.href`: 상담 연결 주소(현재 `#상담연결-준비중`)
- 각 카드 `media.video`, `media.onePager`: 비어 있으면 해당 블록을 숨깁니다.

## 금지
실명·고객사명·사건 내용은 어떤 파일에도 넣지 않습니다.

## 로컬 미리보기
```
cd boss-counsel && python3 -m http.server 8000
```

## 배포
Vercel 프로젝트의 Root Directory를 `boss-counsel`로, Framework Preset은 Other(빌드 명령 없음)로 둡니다.
작업 브랜치의 미리보기 배포를 대표님이 확인한 뒤 main에 반영합니다.
