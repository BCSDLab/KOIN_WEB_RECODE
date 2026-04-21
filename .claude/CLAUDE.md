# CLAUDE.md

## 프로젝트 개요

KOIN은 한국기술교육대학교(KOREATECH) 재학생을 위한 캠퍼스 서비스 웹앱이다. 시간표, 버스, 식당, 가게, 커뮤니티, 동아리, 분실물, 졸업 계산기를 제공한다.

**기술 스택:** Next.js 15 (Pages Router) · React 19 · TypeScript strict · Yarn 4 (Berry) PnP · Node 20.11.1

## 주요 명령어

```bash
yarn start              # 개발 서버 (next dev)
yarn build              # 타입 체크(tsc) + 프로덕션 빌드
yarn lint               # ESLint + Stylelint
yarn lint:eslint        # ESLint (src/)
yarn lint:stylelint     # Stylelint (src/**/*.scss)
yarn log                # Notion 스펙에서 분석 로깅 훅 생성
```

**패키지 매니저:** Yarn 4만 사용. `npm install` 금지.

## 아키텍처 핵심 포인터

| 영역 | 패턴 요약 | 위치 |
|------|-----------|------|
| 라우팅 | Pages Router, `ROUTES` 헬퍼 사용 | `src/static/routes.ts` |
| API | `APIRequest<T>` 클래스 → `APIClient.of()` export | `src/api/[domain]/` |
| 서버 상태 | React Query (`staleTime: 60000, retry: false`) | `src/api/[domain]/queries.ts` |
| 클라이언트 상태 | Zustand (`State`/`Actions` 타입 분리) | `src/utils/zustand/` |
| 스타일 | SCSS Modules + BEM, 데스크톱 우선 | `[Component].module.scss` |
| 레이아웃 | SSR 페이지 → `SSRLayout`, 클라이언트 → `Layout` | `src/components/layout/` |
| 내부 패키지 | `@bcsdlab/koin` (isKoinError, sendClientError), `@bcsdlab/utils` (cn, sha256) | 교체 금지 |

## 필수 준수 규칙

1. **임포트:** 절대 경로 사용 (`import X from 'components/...'`). 상위 경로(`../`) ESLint 금지.
2. **에러 핸들링:** mutation `onError`에 반드시 `isKoinError()` 타입 가드 → `showToast()` 패턴 적용.
3. **쿠키:** `COOKIE_KEY` 상수 + `getCookieDomain()` 사용. 쿠키명/도메인 하드코딩 금지.
4. **SSR 안전성:** `window`/`document`/`localStorage` 접근 시 `typeof window !== 'undefined'` 체크 필수.
5. **라우팅:** `ROUTES` 헬퍼 사용. 경로 문자열 하드코딩 금지.
6. **로깅:** `console.log` 금지. `console.warn`/`console.error`만 허용.
7. **토스트:** `showToast(type, message)` 사용. `toast()` 직접 호출 금지.
8. **iOS 브릿지:** `window.webkit` optional chaining 유지 (`src/utils/ts/iosBridge.ts`).
9. **분석 로깅:** 주요 사용자 인터랙션마다 `useLogger()` 훅 포함.

## PR 리뷰 규칙 (claude-code-action용)

리뷰 댓글은 **한국어**로 작성. 정확성 > 회귀 위험 > 보안 > 성능 > 스타일 순으로 검토.

**출력 형식 (모든 발견에 적용):**
- 심각도: `[P0]` (머지 차단) · `[P1]` (수정 필요) · `[P2]` (제안)
- 위치: `file:line`
- 영향과 최소 수정안

**검토 제외:**
- lint/import-order 포매팅 노이즈
- 자동 생성 파일만 변경 (`src/generated/**`, `analytics.events.json`)
- `@bcsdlab/koin`, `@bcsdlab/utils` 교체 제안

## 유효성 검사 정책

- 기본: `yarn lint`
- `yarn build` 실패는 환경 제약(API 접근 불가 등)이 원인일 수 있으므로, 변경 코드가 직접 원인이 아니면 비차단 처리.

## 하네스: KOIN AI 파이프라인

**목표:** SonarCloud 코드 품질 분석 및 자동 수정, 기능 구현 자동화 PR 생성

**트리거:** "SonarCloud 분석", "SonarCloud 이슈 수정", "코드 품질 개선", "기능 구현해줘", "새 기능 추가해줘", "PR 만들어줘", "파이프라인 실행", "다시 실행", "재실행", "이전 결과 개선", "업데이트" 등의 요청 시 `koin-pipeline` 스킬을 사용하라.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-21 | 초기 구성 | 전체 | SonarCloud 품질 관리 + 기능 구현 자동화 파이프라인 |
| 2026-04-21 | 전체 재작성 | CLAUDE.md | 영어→한국어, 스킬 중복 제거, 분량 축소 (224줄→80줄) |
