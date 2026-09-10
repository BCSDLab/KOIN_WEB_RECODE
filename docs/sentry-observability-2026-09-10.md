# Sentry 전수조사 및 개선 작업 (2026-09-10)

koin-prod(조직 `bcsd`) Sentry 설정 전수조사에서 시작해, 실제 버그 수정과 SDK 업그레이드까지 이어진 작업 기록. Claude Code 세션 하나에서 진행됐고, 뒤로 갈수록 앞 단계의 판단을 실측 데이터로 뒤집거나 좁힌 경우가 많아 그 과정도 그대로 남긴다.

## 1. 출발점 — Sentry MCP로 전수조사

Sentry MCP 도구(`find_organizations`, `search_issues`, `search_events`×5개 데이터셋, `find_alert_rules`, `find_monitors`, `find_uptime_monitors`, `find_dsns`, `find_releases`, `analyze_issue_with_seer`, `get_issue_tag_values`)로 조사한 결과:

| 영역 | 상태 |
|---|---|
| 에러/로그/스팬/프로파일/리플레이 수집 | 정상 (5개 데이터셋 전부 최근 데이터 확인) |
| Slack 알림(이슈/메트릭) | 정상, 실제 발화 이력으로 확인 |
| 업타임 모니터 4개 | 전부 active/ok |
| 소스맵 | 부분적 — 아래 3절 참고 |
| **하이드레이션 diff 계측** | **버그 — 프로덕션에서 한 번도 작동한 적 없음** |

## 2. 핵심 발견 — 하이드레이션 diff 계측이 프로덕션에서 무력화돼 있었다

`src/instrumentation-client.ts`의 `reportHydrationDiff()`가 `console.error`를 후킹해 React 하이드레이션 에러를 잡도록 돼 있었는데, 정규식이 **개발 모드 풀텍스트**만 매치했다:

```ts
/Hydration failed|didn't match|Text content does not match|error while hydrating/i
```

프로덕션 React는 이 문구 대신 `Minified React error #418`처럼 코드 번호만 찍는다. Sentry Logs에서 실제로 이 패턴이 찍히는 걸 확인했고(`2026-09-10T04:34:47`), React 소스(`facebook/react` 에러 코드 테이블)로 418/419/421/422/423/425가 전부 하이드레이션 계열 에러임을 확인했다. 그 결과 90일간 `hydration-diff` fingerprint 이슈가 **0건** — 8/2에 "하이드레이션 원인 파악용"으로 추가한 계측이 프로덕션에서는 애초에 매치될 수 없는 조건이었다.

**수정**: `src/instrumentation-client.ts`
```ts
const HYDRATION_ERROR_PATTERN =
  /Hydration failed|didn't match|Text content does not match|error while hydrating|Minified React error #4(1[89]|2[1-3]|25)/i;
```

## 3. 소스맵 — 정정 히스토리

최초엔 "`/cafeteria` 번들 전체가 소스맵 미해석"이라고 결론 냈으나, 같은 페이지의 다른 이슈(KOIN-PROD-C, removeChild)를 추가로 대조하며 두 번 정정했다:

1. KOIN-PROD-C는 `_next/static/chunks/framework-*.js:1:113961` 형태의 정상 청크 경로를 가짐(React 내부 함수라 원래 미해석 대상). → "전체 번들 문제"는 아님.
2. KOIN-PROD-26(`RangeError: Maximum call stack size exceeded`)만 `app:///cafeteria:226` 같은 이례적 패턴. `get_issue_tag_values`로 전체 35건을 조회하니 browser.name/os.name **100%가 Chrome Mobile iOS/iOS**였다 — iOS는 모든 브라우저가 WebKit을 쓰므로, Sentry 업로드 문제가 아니라 **WebKit의 `Error.stack` 포맷이 V8과 달라 원본 URL을 온전히 못 줬을 가능성**이 유력하다(비교할 non-iOS 샘플이 없어 100% 확정은 아님).

결론: `next.config.mjs`의 `withSentryConfig` 소스맵 설정 자체는 정상(홈 페이지 이슈에서 `src/components/...`까지 완전히 해석된 걸 실측 확인). 이번 조사 대상 케이스는 소스맵보다 iOS 엔진 특성일 가능성이 더 크다.

## 4. `/cafeteria` RangeError(KOIN-PROD-26) — 조사만 하고 확정은 못함

- 서브에이전트로 replay/breadcrumb 전수 조사: 아이패드는 `MOBILE_QUERY = (max-width: 576px)` 컷오프상 **PC 분기**로 렌더된다. 크래시는 클릭이 아니라 매번 `/dinings`+`/coopshop/1` 응답 직후(유휴 1시간 49분 후에도) 발생.
- **가설 1(반증됨)**: `filterDinings`의 `PLACE_ORDER.indexOf`가 알 수 없는 `place` 값에 `-1`을 반환해 비교자가 깨진다 — 크래시 발생일(2026-09-03)과 오늘 날짜의 라이브 프로덕션 API(`api.koreatech.in/dinings`)를 직접 조회해 `PLACE_ORDER`와 정확히 일치함을 확인, **반증**.
- **가설 2(정황상 유력, 미확정)**: `PCDiningBlocks`의 masonry 레이아웃 effect가 `clientHeight` 읽기와 `style.transform` 쓰기를 매 반복 번갈아 해서 강제 동기 리플로우를 유발한다. 읽기/쓰기를 분리하는 리팩터를 적용했지만 **RangeError를 고친다는 확증은 없다** — 성능/정합성 개선으로 실었을 뿐, 근본 원인은 미확정 상태로 남는다. 스테이징 배포 후 KOIN-PROD-26 발생 빈도를 지켜보는 게 실질적인 검증이다.
- Seer(`analyze_issue_with_seer`) 분석은 "두 함수가 dining/coopshop 데이터 도착 후 무한 상호 재귀"라고 했지만, 소스맵이 안 풀려 정확한 컴포넌트는 특정하지 못했다.

## 5. `Sentry.metrics` — 도입 검토 후 보류

`Sentry.metrics.count/gauge/distribution`은 이 SDK 버전에서 **서버(Node) 런타임에만** 존재한다(클라이언트/엣지 빌드엔 없음 — 패키지 타입 선언으로 직접 확인). KOIN은 `src/pages/api/`에 `health.ts` 하나뿐이고 클라이언트 axios가 `api.koreatech.in`을 직접 호출하는 구조라, 서버 코드를 거치는 지점 자체가 없다. 자리를 억지로 만들지 않고 계획을 접었다.

(참고: SDK 10.74.0 기준 `@sentry/vercel-edge`도 `metrics`를 재수출하는 걸 확인했다 — 10.43.0 조사 시점과 달라진 부분. 단, 이 결론을 뒤집을 만큼 KOIN 아키텍처의 "서버 코드 경로 없음" 문제가 해소되는 건 아니다.)

## 6. `useCafeteriaParams`의 diningType/date — CLAUDE.md 규칙 10 위반 실사례

`src/components/cafeteria/hooks/useCafeteriaParams.ts`의 `diningType`/`date.current()` 기본값이 서버·클라이언트 양쪽에서 각자 `new Date()`를 계산하고 있었다. 정확히 CLAUDE.md 규칙 10("시각 파생 값은 서버가 확정해 props로 내리고 클라이언트에서 재계산하지 않는다")이 예시로 든 "식사 시간대" 버그 그 자체였다.

- `date.current()`는 `useDinings`의 **React Query 키**에 직접 들어간다. 서버가 UTC로 돈다면 KST 자정~오전 9시 사이 매번 서버·클라이언트가 다른 날짜 키를 써 캐시가 미스되고 `<Suspense>` 서브트리 전체가 재생성된다 — diningType보다 영향이 크다.
- `PCCafeteriaPage`의 `getWeekAgo()`, `WeeklyDatePicker`의 자체 `new Date()` 2곳도 같은 문제였다(처음엔 놓쳤다가 리팩터 과정에서 추가로 발견).

### 6-1. 1차 수정 — 서버 계산 → props로 주입 (prop-drilling)

`getServerSideProps`에서 `defaultDiningType`/`serverNowISO`를 계산해 `MobileCafeteriaPage`/`PCCafeteriaPage`까지 prop으로 내렸다. **문제**: 그 아래서 독립적으로 `useCafeteriaParams()`를 호출하는 `WeeklyDatePicker`/`DateNavigator`, 그리고 `getWeekAgo()`까지는 prop이 안 닿아서 여전히 버그가 남았다 — prop-drilling 방식 자체의 구조적 한계였다.

### 6-2. 2차 수정 — Context로 재구조화

이 코드베이스가 이미 쓰는 `useServerRequest()`(`src/utils/context/serverRequest.tsx`, `useMediaQuery`가 사용) 패턴을 그대로 따라 `src/components/cafeteria/context/CafeteriaServerContext.tsx`를 신설했다:

```ts
interface CafeteriaServerValue {
  serverNow?: Date;
}
const CafeteriaServerContext = createContext<CafeteriaServerValue>({});
export const CafeteriaServerProvider = CafeteriaServerContext.Provider;
export const useCafeteriaServerValue = () => useContext(CafeteriaServerContext);
```

`useCafeteriaParams()`가 내부에서 이 컨텍스트를 읽도록 바꾸면서, prop 없이 트리 어디서든 값을 받게 됐다 — `DateNavigator`는 코드 변경 없이 자동으로 고쳐졌다.

**Zustand로 하지 않은 이유**: 이 코드베이스의 기존 Zustand 스토어(`useHeaderButtonStore` 등)는 모듈 스코프 싱글턴이다. `serverNow`처럼 **요청마다 다른 값**을 싱글턴에 담으면, 같은 Node 프로세스가 동시에 처리하는 서로 다른 사용자의 요청 사이에 값이 섞일 수 있다(요청 A의 시각을 요청 B가 받는 식). 안전하게 하려면 결국 요청마다 스토어를 새로 만들어 Context로 감싸야 하므로, Zustand는 Context 위에 불필요한 추상화만 더하는 선택이었다. `serverRequest`/`CafeteriaServerContext`처럼 "서버가 주입한 읽기 전용 값"과 "클라이언트가 소유하는 가변 상태(Zustand 영역)"는 이미 이 코드베이스에서 구분되는 카테고리다.

### 6-3. 3차 수정 — 정적 스냅샷의 한계와 `useSyncExternalStore`

1·2차 수정은 "하이드레이션 시점에 서버·클라이언트가 같은 값을 본다"만 해결했다. **세션이 오래 열려 있으면**(breadcrumb에서 실측한 유휴 1시간 49분 세션 사례처럼) 날짜/식사시간대 경계를 넘어도 서버 스냅샷에 계속 머문다 — 단순 "오늘" 표시 문제가 아니라 **어제 메뉴가 계속 "오늘"로 보이는** 실질적 데이터 신선도 문제다.

React 공식 문서 기준으로 하이드레이션 불일치 대응은 세 갈래다:
1. `suppressHydrationWarning` — 단일 엘리먼트, 못 맞추는 값 전용(타임스탬프 텍스트 등). "고치지 않고 경고만 끔."
2. Two-pass render(`isClient` state를 `useEffect`에서 켜기) — React 문서도 "느려지고 사용자가 화면 전환을 체감할 수 있다"고 명시. CLAUDE.md 규칙 10의 `useMount()` 게이트 경고와 같은 근거.
3. **`useSyncExternalStore` + `getServerSnapshot`** — 하이드레이션 시점엔 서버 스냅샷, 그 이후엔 실제 값으로 구독·갱신. `useMediaQuery`가 이미 이 패턴.

`serverNow`는 "요청 시점엔 서버가 알지만, 마운트 후엔 계속 최신이어야" 하는 값이라 3번이 맞는 자리다. `src/components/cafeteria/hooks/useCafeteriaLiveNow.ts` 신설:

- `getServerSnapshot`: 서버가 준 `serverNow`
- `getSnapshot`: KST 날짜 + 식사시간대를 합친 "버킷" 문자열(예: `2026-09-11|LUNCH`)
- `subscribe`: 60초 폴링 + 탭이 다시 보일 때(`visibilitychange`) 즉시 재확인
- 리턴값: 버킷이 서버 스냅샷과 같으면 `serverNow` 그대로, 바뀌었으면(=경계를 실제로 넘었으면) 그 순간의 `new Date()`

버킷을 원시값(문자열)으로 비교하므로 60초마다 폴링해도 실제로 아무것도 안 바뀌면 리렌더가 안 일어난다. `useCafeteriaParams`, `WeeklyDatePicker`, `PCCafeteriaPage`의 `getWeekAgo()` 전부 이 훅으로 통일했고, 이 덕에 `defaultDiningType`을 서버에서 따로 계산해 내려보낼 필요가 없어져(이제 `new DiningTime(renderToday).getType()`으로 그 자리에서 유도) `CafeteriaServerContext`가 `{ serverNow }` 하나로 더 단순해졌다.

### 6-4. `DiningTime` 자체도 타임존 문제였다

`src/components/cafeteria/utils/time.ts`의 `DiningTime`이 `Date#setHours`/`getHours`(실행 환경 로컬 타임존 의존)로 식사 시간대 경계(9:00/13:30/18:30)를 계산하고 있었다. 서버가 UTC로 돌면 서버·클라이언트가 다른 시간대를 계산 — 고정 +9시간 오프셋으로 KST 달력일/시각을 직접 계산하도록 재작성했다(`kstTimeOn`, `kstHour`, `kstDateKey`). `isTodayDining`/`isTomorrowDining`도 같은 방식으로 맞췄다. `generateDiningDate`의 `setDate`/`getDate`는 여전히 로컬 타임존 의존인데, `convertDateToSimpleString`을 비롯한 cafeteria 날짜 처리 전체가 같은 전제라 이 함수 하나만 고치면 오히려 나머지와 더 어긋나서 의도적으로 남겨뒀다 — 주석으로 명시.

### 6-5. 코드 정리

최초 구현이 "이전 코드는 이랬는데 이렇게 바꿨다"는 서술형 주석과 `setPrev`/`setNext`/`setPrevWeek`/`setNextWeek`의 4줄 중복을 갖고 있었다. `shiftDate(days)` 하나로 합치고(89줄→65줄), 주석을 코드만 봐서 안 보이는 이유 1~2줄로 축약했다.

## 7. SDK 업그레이드

### `@sentry/nextjs` 10.43.0 → 10.74.0

31개 마이너 버전. Changelog에서 관련 있어 보이는 항목(10.64.0 immutable chunks 업로드 수정, 10.67.0 in_app 프레임 판정 수정)을 직접 확인했으나 **둘 다 KOIN의 `/cafeteria` 미해석 문제를 직접 고치지는 않는다**(전자는 Turbopack/Vercel 전용, 후자는 우리 `app:///cafeteria` 패턴과 매칭 안 됨). 순수 위생 업그레이드로 진행.

실제로 조치한 변경 2가지:
- **`withSentryConfig` import 경로 deprecated (10.73.0)**: `@sentry/nextjs` → `@sentry/nextjs/config`로 변경. `package.json`의 `exports` 맵에 실제로 있는 경로이고 `tsc`도 정상 해석하지만, `eslint-import-resolver-typescript@4.4.4`가 이 subpath exports를 못 읽어 `import/no-unresolved` 오탐 — 해당 줄만 `eslint-disable-next-line`으로 처리.
- **`sendDefaultPii` deprecated → `dataCollection` (10.57.0)**: 8/2 커밋에 "10.43.0엔 `dataCollection` 옵션이 없어 마이그레이션을 보류한다"고 팀이 직접 적어놓은 게 있었다 — 이번 업그레이드로 막혀있던 이유가 없어졌다. `@sentry/core`의 실제 번들 코드(`defaultPiiToCollectionOptions`)를 읽어 `sendDefaultPii: true`가 정확히 어떤 `dataCollection` 값으로 동작하는지 확인한 뒤, **동작 변화 없는 1:1 마이그레이션**으로 적용:
  ```ts
  dataCollection: { frameContextLines: 7 }
  ```
  (`dataCollection`을 명시하면 나머지 필드는 전부 `sendDefaultPii:true`와 동일한 DEFAULTS를 쓴다. 유일한 차이가 `frameContextLines` — DEFAULTS는 5, `sendDefaultPii:true` 브릿지는 7 — 라서 그 값만 명시했다.) `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/instrumentation-client.ts` 3곳 전부 동일 적용.

### `@sentry/cli` 2.58.5 → 3.7.0

`yarn up "@sentry/*"`가 처음에 이걸 실수로 3.x로 올렸길래 일단 2.x(`^2.58.6`)로 되돌렸다가, 사용자가 명시적으로 요청해서 다시 3.7.0으로 올렸다. CI(`.github/workflows/deploy.yml`)가 직접 실행하는 유일한 명령 `sentry-cli releases deploys "$SENTRY_RELEASE" new --env ... --name ... --url ...`을 v3 바이너리로 직접 실행해 `--env`/`--name`/`--url` 플래그가 전부 그대로 있음을 확인했다. v3.0.0의 breaking change 목록(`releases files`/`sourcemaps explain`/`send-metric` 제거, 레거시 API 키 인증 제거, JS wrapper default→named export)은 KOIN이 안 쓰는 것들이라 무관.

## 8. 검증하지 못한 것 — 솔직히 남겨둔다

CLAUDE.md 규칙 10은 명시한다: "검증: 콘솔 확인만으로는 부족하다. `scripts/hydration/dom-diff.mjs`로 DOM 파괴율을 잴 것. 로그인/비로그인 × 데스크톱/모바일 4조합을 볼 것." **이 스크립트가 저장소 어디에도(git 히스토리 포함) 존재하지 않는다.** 이번 세션에서 한 검증은 `yarn typecheck` + `yarn lint`뿐이다. 로직상 타당하다고 판단해 진행했지만, 실제 DOM 파괴율 실측은 하지 못했다 — 스크립트를 새로 만들거나 스테이징에서 수동으로 view-source(SSR HTML) vs 하이드레이션 후 DOM을 대조하기 전까지는 "고쳤다"를 확정으로 말할 수 없다.

## 9. 변경 파일 목록

| 파일 | 변경 내용 |
|---|---|
| `src/instrumentation-client.ts` | 하이드레이션 정규식 확장, `sendDefaultPii` → `dataCollection` |
| `sentry.server.config.ts` | `sendDefaultPii` → `dataCollection` |
| `sentry.edge.config.ts` | `sendDefaultPii` → `dataCollection` |
| `next.config.mjs` | `withSentryConfig` import 경로 `/config`로 |
| `src/components/cafeteria/utils/time.ts` | `DiningTime` KST 고정 오프셋 기반으로 재작성, `kstDateKey` 추가 |
| `src/components/cafeteria/context/CafeteriaServerContext.tsx` | 신규 — 서버 주입 값 Context |
| `src/components/cafeteria/hooks/useCafeteriaLiveNow.ts` | 신규 — `useSyncExternalStore` 기반 라이브 "오늘" |
| `src/components/cafeteria/hooks/useCafeteriaParams.ts` | Context/라이브 훅 사용, `shiftDate`로 중복 제거 |
| `src/pages/cafeteria/index.tsx` | `getServerSideProps`에서 `serverNowISO` 계산·주입 |
| `src/components/cafeteria/PCCafeteriaPage/index.tsx` | `useCafeteriaLiveNow` 사용, `getWeekAgo` 인자화 |
| `src/components/cafeteria/PCCafeteriaPage/components/PCDiningBlocks/index.tsx` | masonry effect 읽기/쓰기 분리(성능, RangeError 수정은 미확정) |
| `src/components/cafeteria/MobileCafeteriaPage/components/WeeklyDatePicker/index.tsx` | `useCafeteriaLiveNow` 사용 |
| `package.json`, `.pnp.cjs`, `.yarn/cache/**` | `@sentry/nextjs` 10.74.0, `@sentry/cli` 3.7.0 |

## 10. 남은 후속 작업

1. `scripts/hydration/dom-diff.mjs` 부재 — 만들거나, 최소한 스테이징에서 수동 검증.
2. KOIN-PROD-26(RangeError) 근본 원인 미확정 — 스테이징 배포 후 발생 빈도 관찰.
3. SDK 업그레이드 부작용: 10.67.0의 `in_app` 판정 수정으로 KOIN-PROD-C가 그룹 해시 변경 → "새 이슈"로 재등장 가능(`prod-new-regression` Slack 알림이 뜨어도 실제 회귀 아닐 수 있음, 확인 필요).
4. Uptime 모니터 범위: `/articles`, `/clubs`처럼 실제 에러가 몰린 영역에 모니터 추가 검토(1차 조사 항목, 이번 세션에서 미착수).
5. Session Replay 마스킹 정책(`maskAllText: false` 등) — 팀이 2026-08-02에 의도적으로 보류한 상태 그대로, 이번에도 미착수.
