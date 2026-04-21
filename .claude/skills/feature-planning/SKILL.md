---
name: feature-planning
description: KOIN 프로젝트에 새 기능을 추가하기 위한 구현 계획을 수립하는 스킬. 기능 요구사항 분석, API 설계, 컴포넌트 구조 결정, 파일 목록 생성을 담당한다. 새 기능 구현 계획, 기능 설계, 구현 범위 파악을 요청할 때 반드시 이 스킬을 사용할 것. 이미 계획이 있는 구현 작업에는 사용하지 않는다.
---

# Feature Planning Skill

## 도메인 파악

새 기능이 어느 도메인에 속하는지 먼저 판단한다:

| 도메인 | 경로 | 특성 |
|--------|------|------|
| 시간표 | `src/api/timetable/`, `src/pages/timetable/` | 복잡한 상태 관리 (Zustand) |
| 버스 | `src/api/bus/`, `src/pages/bus/` | 실시간 데이터, SSE |
| 식당 | `src/api/dinings/`, `src/pages/cafeteria/` | 날짜 기반 필터링 |
| 커뮤니티 | `src/api/articles/`, `src/pages/articles/` | 인증 필요, 페이지네이션 |
| 가게 | `src/api/store/`, `src/pages/store/` | 검색/필터 |
| 클럽 | `src/api/club/`, `src/pages/clubs/` | 좋아요, 카테고리 |

## 유사 기능 탐색

계획 수립 전에 반드시 유사한 기능을 탐색한다:

```bash
# 유사 도메인의 파일 구조 확인
ls src/api/[similar-domain]/
ls src/components/[SimilarFeature]/

# 참조할 패턴 파악
cat src/api/[similar-domain]/APIDetail.ts
cat src/api/[similar-domain]/queries.ts
```

## API 설계 패턴

```typescript
// src/api/[domain]/APIDetail.ts
export class GetFeatureList implements APIRequest<FeatureListResponse> {
  path = '/feature';
  method = HTTP_METHOD.GET;
  params: { page: number; size: number };
  auth = false; // 인증 필요 시 true
}

export class PostFeature implements APIRequest<FeatureResponse> {
  path = '/feature';
  method = HTTP_METHOD.POST;
  data: CreateFeatureRequest;
  auth = true;
}
```

## 컴포넌트 구조 설계

```
src/components/[FeatureName]/
├── index.tsx                    # 메인 컴포넌트
├── [FeatureName].module.scss    # 스타일
├── hooks/
│   └── use[FeatureName].ts      # 데이터 페칭 훅
├── PCView/                      # PC 전용 뷰 (레이아웃이 크게 다를 때)
│   └── PCView.tsx
└── MobileView/                  # 모바일 전용 뷰
    └── MobileView.tsx
```

## 상태 관리 결정 기준

| 상황 | 선택 |
|------|------|
| 서버 데이터 조회/캐싱 | React Query (`useSuspenseQuery`) |
| 조건부 페칭, 백그라운드 갱신 | React Query (`useQuery`) |
| 전역 UI 상태 (모달, 사이드바) | Zustand |
| 복잡한 폼 | react-hook-form |
| 단순 컴포넌트 내부 상태 | useState |

## SSR 페이지 여부 결정

다음 조건 중 하나라도 해당하면 SSR:
- SEO가 필요한 공개 페이지
- 초기 로딩 시 서버 데이터가 필요한 경우
- 소셜 미디어 공유 지원 필요

SSR 페이지는:
- `getServerSideProps` 사용
- `SSRLayout` 사용
- `HydrationBoundary`로 React Query 상태 전달

## 계획 검증 체크리스트

- [ ] 유사 기능 참조 케이스 포함
- [ ] 모든 신규/수정 파일 명시
- [ ] API 클래스 설계 포함
- [ ] 인증 필요 여부 결정
- [ ] SSR/CSR 여부 결정
- [ ] 반응형 레이아웃 전략 결정
- [ ] 분석 로깅 포인트 명시
