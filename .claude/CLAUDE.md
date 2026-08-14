# CLAUDE.md

## 프로젝트 개요

KOIN은 한국기술교육대학교(KOREATECH) 재학생을 위한 캠퍼스 서비스 웹앱이다. 시간표, 버스, 식당, 가게, 커뮤니티, 동아리, 분실물, 졸업 계산기를 제공한다.

**기술 스택:** Next.js 15 (Pages Router) · React 19 · TypeScript strict · Yarn 4 (Berry) PnP · Node 24.14.1

## 주요 명령어

```bash
yarn start              # 개발 서버 (next dev)
yarn start:serve        # 프로덕션 서버 (next start)
yarn build              # 프로덕션 빌드 + sitemap 생성
yarn typecheck          # tsc --noEmit
yarn lint               # ESLint + Stylelint
yarn lint:eslint        # ESLint (src/)
yarn lint:stylelint     # Stylelint (src/**/*.scss)
yarn log                # Notion 스펙에서 분석 로깅 훅 생성
```

테스트 스크립트와 Jest 스택은 없다. 테스트를 도입한다면 `next/jest` 로 새로 세팅할 것.

**패키지 매니저:** Yarn 4만 사용. `npm install` 금지.

## 아키텍처 핵심 포인터

| 영역            | 패턴 요약                                                                     | 위치                          |
| --------------- | ----------------------------------------------------------------------------- | ----------------------------- |
| 라우팅          | Pages Router, `ROUTES` 헬퍼 사용                                              | `src/static/routes.ts`        |
| API             | `APIRequest<T>` 클래스 → `APIClient.of()` export                              | `src/api/[domain]/`           |
| 서버 상태       | React Query (`staleTime: 60000, retry: false`)                                | `src/api/[domain]/queries.ts` |
| 클라이언트 상태 | Zustand (`State`/`Actions` 타입 분리)                                         | `src/utils/zustand/`          |
| 스타일          | SCSS Modules + BEM, 데스크톱 우선                                             | `[Component].module.scss`     |
| 레이아웃        | SSR 페이지 → `SSRLayout`, 클라이언트 → `Layout`                               | `src/components/layout/`      |
| 내부 패키지     | `@bcsdlab/koin` (isKoinError, sendClientError), `@bcsdlab/utils` (cn, sha256) | 교체 금지                     |

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
10. **SSR 렌더 결정성:** 서버 렌더와 하이드레이션 렌더가 갈리면 서버가 그린 DOM이 통째로 버려진다. **React는 이 경우 대부분 경고하지 않는다** — `key` 변경과 `useSyncExternalStore` 스냅샷 전환은 React 입장에선 정상 동작이다. 콘솔이 조용하다고 안전한 게 아니다.
    - **원칙: 서버가 아는 것은 서버에서 렌더한다.** 요청에서 알 수 있는 값(기기·로그인 여부·토큰)은 `withCacheControl`이 `serverRequest`로 주입한다. `useServerRequest()`로 읽는다.
    - **`useMount()` 게이트는 최후 수단이다.** React 경고는 없애지만 서버가 그린 DOM이 매 로드 교체되는 것은 그대로다. 서버가 값을 알 수 있으면 게이트가 아니라 주입으로 해결할 것
    - 시각 파생 값(식사 시간대, "N일 전" 뱃지 등)은 **서버가 확정해 props로 내리고 클라이언트에서 재계산하지 않는다**. 클라이언트는 사용자 기기 시계·타임존을 쓰므로 KST 밖 사용자는 자정과 무관하게 상시 어긋난다. 공유 캐시로 최대 60초 낡을 수 있으나 경계 구간이 짧아 교체가 매번 일어나는 쪽보다 낫다
    - 인증 상태는 SSR에 반영해도 안전하다. nginx가 인증 쿠키가 있으면 `proxy_cache_bypass`/`proxy_no_cache`로 캐시를 우회한다
    - `useTokenState()`는 SSR에서 스토어가 `''`을 반환하므로 `serverRequest`로 폴백한다. `??`가 아니라 `||`를 쓸 것. **토큰만 넘기면 안 된다** — `userType`이 요청 엔드포인트를 결정하므로 빠뜨리면 403이 난다
    - 쿼리 키에 토큰이 들어가면 SSR과 클라이언트가 다른 캐시를 본다
    - `getServerSideProps`가 없는 페이지는 서버가 요청을 모른다. `serverRequest`가 `null`이므로 훅들이 기본값으로 동작한다
    - 기기 분기는 `useMediaQuery`가 UA 판정값을 서버 스냅샷으로 쓴다. **UA 정규식이 nginx `$device_class`(`/etc/nginx/conf.d/proxy-cache.conf`)와 같아야 한다** — 한쪽만 바꾸면 캐시가 잘못 갈려 다른 기기용 HTML이 서빙된다
    - 검증: 콘솔 확인만으로는 부족하다. `scripts/hydration/dom-diff.mjs`로 **DOM 파괴율**을 잴 것. 로그인/비로그인 × 데스크톱/모바일 4조합을 볼 것

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

- 기본: `yarn lint` + `yarn typecheck`
- `yarn build` 실패는 환경 제약(API 접근 불가 등)이 원인일 수 있으므로, 변경 코드가 직접 원인이 아니면 비차단 처리.
  - `.env`/`.env.local` 에 `NEXT_PUBLIC_API_PATH` 가 없으면 프리렌더가 `localhost:80` 으로 붙어 실패한다. 컴파일 통과 여부와 구분할 것.
- 의존성을 건드렸다면 `yarn install` 후 `.pnp.cjs`, `.yarn/cache` 변경까지 커밋에 포함할 것 (Zero-Install).

## 하네스: KOIN AI 파이프라인

**목표:** SonarCloud 코드 품질 분석 및 자동 수정, 기능 구현 자동화 PR 생성

**트리거:** "SonarCloud 분석", "SonarCloud 이슈 수정", "코드 품질 개선", "기능 구현해줘", "새 기능 추가해줘", "PR 만들어줘", "파이프라인 실행", "다시 실행", "재실행", "이전 결과 개선", "업데이트" 등의 요청 시 `koin-pipeline` 스킬을 사용하라.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-21 | 초기 구성 | 전체 | SonarCloud 품질 관리 + 기능 구현 자동화 파이프라인 |
| 2026-04-21 | 전체 재작성 | CLAUDE.md | 영어→한국어, 스킬 중복 제거, 분량 축소 (224줄→80줄) |
| 2026-08-08 | 규칙 10 재작성 | CLAUDE.md | useMount 게이트 권장 → 서버 주입 원칙으로 전환. 게이트가 하이드레이션 DOM 교체의 원인이었음 |
| 2026-08-13 | 명령어·검증 정책 갱신 | CLAUDE.md | 무효 test 스크립트/Jest 스택 제거, typecheck 분리(빌드에서 tsc 이중 실행 제거), CI 정합성 정비 |
