# KOIN Sentry 운영 고도화 계획

## Requirements Summary

- 대상: Sentry `bcsd/koin-prod`, production/stage KOIN Web 서버와 배포 파이프라인. 오류·성능 Dashboard는 production 중심으로 구성하고 Uptime은 두 환경을 모두 감시한다.
- 포함: Dashboard, Issue/Metric Alert, Uptime Monitor, Deploy/Release Health, Ownership, source map 검증, 오류 태그와 custom span, 운영 문서.
- 제외: trace/Replay 수집량 최적화, 개인정보 보호 설정 변경.
- 원칙: 먼저 현재 관측값을 보존한 채 운영 설정을 추가하고, staging에서 검증한 후 production에 적용한다.
- 현재 기준:
  - Issue Alert `prod-issue-alert` 1개, Metric Alert 0개, Uptime/Cron Monitor 0개.
  - Slack `코인_오류_front_end` 연동은 활성 상태.
  - Release와 Git commit은 연결되지만 Deploy와 Release Health 데이터는 없다.
  - SDK 초기화는 client/server/edge에 존재하며 release, tracing, Replay, Logs, profiling이 활성화되어 있다.

### 과거 장애에서 추가된 요구사항

2026-08-04 stage 장애를 Uptime 설계의 기준 incident로 사용한다.

| 항목 | 관측 내용 | 이번 계획에서 보완할 지점 |
| --- | --- | --- |
| 최초 크래시 | 20:27, V8 heap OOM | 1분 단위 외부 liveness 검사로 간헐 실패를 관찰한다. |
| 완전 중단 | 21:06, systemd 재시작 제한 도달 | non-cache health endpoint의 502/timeout을 2분 이내 알린다. |
| 복구 | 21:33 | recovery 알림으로 incident 종료 시점을 자동 기록한다. |
| 인지 지연 | 최초 크래시 후 약 50분 | stage도 production과 별도로 상시 감시한다. |
| 근본 원인 | V8 heap 160MB와 cgroup 380MB의 불일치 | Uptime은 원인이 아니라 중단을 감지한다. 메모리 상한 일치 여부는 별도 서버 운영 점검으로 유지한다. |
| 악화 요인 | 반복 크래시 후 systemd가 재시작 포기 | 짧은 간헐 실패와 지속 실패를 모두 보도록 1분 검사와 연속 실패 조건을 함께 사용한다. |

Uptime만으로 heap 사용량 증가, scanner IP, systemd restart count를 직접 설명할 수는 없다. 이번 범위의 목표는 “사용자가 502를 발견하기 전에 서버 중단을 탐지하고 알리는 것”이며, 원인 규명에는 journal/nginx 로그와 시스템 메트릭을 함께 사용한다.

### 범위 선택 근거

- SDK 자체 기능은 이미 폭넓게 활성화되어 있으므로, 기능을 더 켜는 것보다 수집된 데이터를 실제 대응으로 연결하는 운영 설정을 우선한다.
- Dashboard와 Alert를 먼저 두는 이유는 뒤에서 추가할 Deploy/custom span이 실제 판단 시간을 줄였는지 같은 화면과 같은 기준으로 비교하기 위해서다.
- staging 선검증은 잘못된 production 알림, 잘못 연결된 release, span cardinality 증가를 사용자 영향 없이 발견하기 위한 안전장치다.
- 수집량과 개인정보 설정은 사용자의 명시적 결정에 따라 이번 계획에서 제외한다.

## Phase 1. Dashboard와 알림 체계

### 1.1 Production overview dashboard 생성

Sentry UI에서 `KOIN Production Overview` dashboard를 만들고 다음 위젯을 배치한다.

1. `environment:production` error count와 unique users 시계열.
2. unresolved/new/regressed issue 상위 목록.
3. 전체 transaction `count()`, `p75(span.duration)`, `p95(span.duration)`.
4. `span.status:internal_error` count와 전체 transaction 대비 비율.
5. transaction별 p95 상위 목록.
6. `GET /articles/[id]`와 `GET /_next/image`의 throughput/p75/p95.
7. route별 p75 LCP, INP, CLS와 표본 수.
8. `hydration-diff` 이벤트 count와 route/browser/release 분포.

Dashboard 기본 범위는 `koin-prod`, `production`, 최근 14일로 설정한다.

#### 위젯과 기간 선택 근거

- error count만 보면 한 사용자의 반복 오류가 과대평가되므로 unique users를 함께 본다.
- unresolved/new/regressed를 분리하면 오래된 부채, 새 결함, 해결 후 재발을 서로 다른 대응 대상으로 볼 수 있다.
- 평균 대신 p75/p95를 쓰는 이유는 이번 조사에서 전체 p95가 후반 7일에 277.3ms에서 590.1ms로 112.8% 악화했지만 평균이나 중앙 구간만으로는 이 tail latency를 놓칠 수 있기 때문이다.
- `internal_error` 비율은 트래픽이 6.1% 감소한 동안 건수가 377건에서 453건으로 증가해, 단순 요청량보다 장애 신호로서 가치가 높았다.
- `GET /articles/[id]`는 p95가 159.4ms에서 691.0ms로 334% 악화했고 실제 500 오류도 동반했기 때문에 개별 위젯으로 승격한다.
- `GET /_next/image`는 대표 trace 4.577초 중 upstream fetch가 4.158초였으므로 외부 이미지 지연을 별도로 관찰할 필요가 있다.
- Web Vitals는 서버 transaction만으로 알 수 없는 실제 화면 체감을 보완한다. 표본 수를 함께 두어 저표본 route의 과잉 해석을 막는다.
- hydration은 14일 462건·251명으로 가장 영향이 큰 오류였으므로 route/browser/release 축을 고정 위젯으로 둔다.
- 최근 14일은 직전 조사 범위와 같아 변경 전후 비교가 가능하고, 평일·주말이 각각 두 번 포함되어 대학 서비스의 요일 효과를 완화한다.

### 1.2 기존 Issue Alert 분리

현재 `prod-issue-alert`는 유지하되 목적별로 분리한다.

- `prod-new-regression`:
  - 조건: `environment=production`, `level>=error`, first seen 또는 regression.
  - 목적: 새로운 결함과 재발을 빠르게 인지.
  - Slack: `코인_오류_front_end`.
  - action interval: 30분.
- `prod-impact-spike`:
  - 조건 A: 동일 issue가 5분에 20건 초과.
  - 조건 B: 동일 issue의 영향 사용자가 15분에 10명 초과.
  - 조건 C: 전주 같은 구간 대비 100% 이상 증가하며 최소 10건 이상.
  - Slack action에 issue URL, event count, users, release, environment 포함.

기존 720분 규칙은 새 규칙 검증 후 중복 알림이 없도록 비활성화하거나 digest 용도로 변경한다.

#### Alert 선택 근거

- 새 이슈/회귀와 기존 이슈의 급증을 분리한 이유는 Sentry의 first seen/regression 조건만으로는 이미 열린 hydration 같은 이슈의 재급증을 알릴 수 없기 때문이다.
- `level>=error`와 `environment=production`을 유지해 stage 실험과 warn 로그가 운영 채널을 오염시키지 않게 한다.
- 30분 action interval은 같은 배포에서 발생한 동일 이슈의 Slack 반복을 줄이면서 담당자가 근무 시간에 변화를 확인할 수 있는 타협값이다.
- 20건/5분은 `KOIN-PROD-2B`가 40초에 24건 발생했던 실제 burst를 포착하도록 선택했다. 한두 사용자의 일시적 재시도는 대부분 걸러진다.
- 10명/15분은 event 수가 낮아도 실제 사용자 범위가 넓은 오류를 잡기 위한 보완 조건이다.
- 전주 대비 100% 조건에는 최소 10건을 함께 둬서 1건에서 2건으로 늘어난 저빈도 노이즈가 알림을 만들지 않게 한다.
- 기존 720분 규칙을 바로 삭제하지 않는 이유는 새 규칙의 Slack 전달과 중복 여부가 검증되기 전 알림 공백이 생기는 것을 막기 위해서다.

### 1.3 Metric Monitor 생성

초기 임계값은 최근 14일 기준으로 설정하고 production 7일 관찰 후 한 번 조정한다.

| Monitor | Query/metric | Warning | Critical | 평가 창 |
|---|---|---:|---:|---:|
| Overall internal error rate | `span.status:internal_error / count(transaction)` | 1% | 2% | 10분 |
| Overall tail latency | `p95(span.duration)` | 750ms | 1,200ms | 15분 |
| Article detail latency | `transaction:"GET /articles/[id]"`, p95 | 800ms | 1,500ms | 10분 |
| Next image latency | `transaction:"GET /_next/image"`, p95 | 2,000ms | 3,000ms | 10분 |
| Cafeteria CLS | `/cafeteria`, p75 CLS | 0.1 | 0.25 | 30분 |
| Bus route INP | `/bus/route`, p75 INP | 200ms | 500ms | 30분 |

Web Vital 알림은 평가 창 내 표본 수가 100건 이상인 경우에만 운영 알림으로 승격한다. Sentry Monitor에서 표본 조건을 함께 표현할 수 없다면 dashboard 관찰용 query와 alert query를 분리한다.

#### Metric과 임계값 선택 근거

- internal error warning 1%는 최근 후반 기준 약 0.80%보다 25% 높은 값이라 정상 변동에는 반응하지 않으면서 추가 악화를 조기에 잡는다. 2%는 기준선의 약 2.5배라 즉시 대응할 critical로 둔다.
- 전체 p95 warning 750ms는 최근 590.1ms보다 약 27% 높은 값이다. 1.2초는 전체 서비스 tail latency가 기준선의 두 배를 넘는 상태라 critical로 본다.
- article p95 warning 800ms는 최근 691ms 바로 위에 두어 현재 회귀가 더 진행되는지를 감시한다. 1.5초는 사용자가 명확히 지연을 체감하고, 외부 호출 또는 retry 누적 가능성이 큰 구간이다.
- image warning은 최근 p95 1.826초보다 낮은 1.5초로 두면 즉시 상시 경보가 되므로 2초로 조정했다. 3초는 대표적인 느린 trace에 접근하는 심각 구간이다.
- CLS 0.1/0.25와 INP 200/500ms는 각각 사용자 경험의 양호/나쁨 경계로 해석하기 쉬운 값이다. 현재 `/cafeteria` CLS 0.154와 `/bus/route` INP 845ms가 이미 이를 넘기 때문에 개선이 끝날 때까지 알려야 할 실제 문제로 본다.
- latency는 트래픽이 충분해 10~15분 창을 사용하고, route별 Web Vital은 표본이 더 느리게 쌓여 30분 창을 사용한다.
- 표본 100건 조건은 `/policy`처럼 수치가 나빠도 16건뿐인 route보다 `/cafeteria`처럼 3,046건인 문제를 우선하기 위한 기준이다.
- 7일 후 조정은 평일과 주말을 한 번 모두 통과한 알림 빈도를 보고 false positive를 판단하기 위한 최소 관찰 기간이다.

### 1.4 Next.js liveness endpoint 구성

[src/pages/api/health.ts](../../src/pages/api/health.ts)를 추가해 Next.js 프로세스가 직접 응답하는 가벼운 endpoint를 만든다.

- method: `GET`만 허용.
- 성공 응답: HTTP 200과 `{ "status": "ok", "service": "koin-web", "environment": "production|stage", "release": "<git-sha>" }`.
- 응답 header: `Cache-Control: no-store, no-cache, must-revalidate`.
- 데이터베이스·KOIN API·static host 등 외부 의존성을 호출하지 않는다.
- 사용자 데이터나 서버 상세 메모리 수치를 응답하지 않는다.
- 동일 endpoint를 production과 stage에서 사용하되 environment/release 값으로 오배포를 식별한다.

nginx에서 `/api/health` exact-match location을 만들고 다음 조건을 적용한다.

- production은 `127.0.0.1:3001`, stage는 `127.0.0.1:3000`의 Next.js upstream으로 직접 proxy한다.
- `proxy_cache off`, `proxy_no_cache 1`, `proxy_cache_bypass 1`을 적용한다.
- upstream 연결 실패 시 nginx의 502/504를 그대로 반환한다.
- 일반 페이지의 `koin_cache` 60초 캐시와 `/_next/image` 30일 캐시를 절대 사용하지 않는다.
- 실제 서버 설정과 함께 리뷰할 수 있도록 reference nginx snippet을 `scripts/deploy/server/`에 보관하고 [scripts/deploy/server/README.md](../../scripts/deploy/server/README.md)를 갱신한다.

[scripts/deploy/server/production-deploy.sh](../../scripts/deploy/server/production-deploy.sh)와 [scripts/deploy/server/stage-deploy.sh](../../scripts/deploy/server/stage-deploy.sh)의 내부 `HEALTH_URL`도 `/` 대신 `http://localhost:<port>/api/health`로 변경한다.

#### Health endpoint 선택 근거

- 현재 nginx는 `/` 등 일반 페이지를 60초 캐시하므로 Next.js 프로세스가 죽어도 캐시가 남아 있는 동안 외부 `/` 검사가 200을 받을 수 있다.
- health endpoint를 Next.js API route로 두면 systemd 프로세스가 내려가거나 포트가 닫힐 때 nginx가 즉시 502/504를 반환해 2026-08-04의 완전 중단을 직접 감지할 수 있다.
- 외부 의존성을 호출하지 않는 shallow liveness로 만든 이유는 API 장애를 Next.js 프로세스 장애로 오분류하지 않기 위해서다. 사용자 관점 end-to-end 상태는 별도 `/` monitor가 맡는다.
- `environment`와 `release` assertion을 두면 stage가 production build를 잘못 실행하거나 이전 release가 살아 있는 배포 오류도 발견할 수 있다.
- 메모리 수치를 공개 endpoint에서 제외한 이유는 liveness의 책임을 단순하게 유지하고 내부 서버 정보를 외부에 노출하지 않기 위해서다. OOM 임박 탐지는 인프라 메트릭의 책임이다.
- 배포 스크립트도 같은 endpoint를 사용하면 배포 성공 판정과 외부 Uptime 판정이 서로 다른 페이지 동작에 의존하지 않는다.

### 1.5 Uptime Monitor 생성

| Monitor | URL | 간격 | 성공 assertion | 심각도/알림 |
| --- | --- | ---: | --- | --- |
| Production Next liveness | `https://koreatech.in/api/health` | 1분 | 200, JSON `status=ok`, `environment=production` | P1, Slack 즉시 |
| Stage Next liveness | `https://stage.koreatech.in/api/health` | 1분 | 200, JSON `status=ok`, `environment=stage` | P2, Slack 즉시 |
| Production end-to-end | `https://koreatech.in/` | 1분 | 2xx | P1, Slack 즉시 |
| Stage end-to-end | `https://stage.koreatech.in/` | 1분 | 2xx | P2, Slack 즉시 |
| Production cafeteria journey | `https://koreatech.in/cafeteria` | 5분 | 2xx | P2, Slack |
| Production bus journey | `https://koreatech.in/bus/route` | 5분 | 2xx | P2, Slack |

- liveness는 2회 연속 실패 시 incident를 열고, 성공으로 돌아오면 recovery 알림을 보낸다.
- Sentry 설정에서 연속 실패 횟수를 직접 지정할 수 없다면 지원되는 region/threshold 조건 중 약 2분 내 탐지하면서 단발 실패를 무시하는 가장 가까운 조건을 사용하고 runbook에 기록한다.
- 동적으로 삭제될 수 있는 article/lost-item ID는 사용하지 않는다.
- 백엔드에 공식 health endpoint가 있으면 KOIN API monitor를 별도로 추가하되 frontend incident와 다른 이름으로 라우팅한다.

#### Uptime 선택 근거

- production과 stage를 모두 감시하는 이유는 기준 incident가 stage에서 발생했고 실사용자 영향이 없다는 이유로 50분간 발견되지 않았기 때문이다.
- 1분 liveness는 20:27~21:06 반복 크래시 구간의 간헐 502를 포착할 가능성을 높이고, 21:06 이후 완전 중단은 약 2분 내 확정한다.
- liveness와 `/`를 분리하면 Next.js 프로세스 자체 중단과 DNS/nginx/SSR을 포함한 사용자 관점 장애를 구분할 수 있다.
- `/cafeteria`와 `/bus/route`는 사용량이 높고 Web Vital 이상도 관찰된 핵심 경로지만 서버 생존 판정용은 아니므로 5분 주기로 둔다.
- article/lost-item 상세 ID를 제외한 이유는 콘텐츠 삭제가 서비스 장애로 오인되는 false positive를 막기 위해서다.
- 2회 연속 실패는 일시적 네트워크 흔들림 한 번을 무시하면서도 2026-08-04의 27분 완전 중단보다 훨씬 짧은 시간 안에 알리기 위한 타협이다.
- recovery 알림은 복구 시각을 자동 기록해 당시처럼 수동으로 `200 OK`를 확인한 뒤 별도 공유해야 하는 절차를 줄인다.
- Cron Monitor는 현재 이 저장소에 정기 작업이 확인되지 않았으므로 만들지 않는다. 향후 scheduled job이 추가될 때 별도 도입한다.

#### 2026-08-04 장애에 대한 탐지 범위

| 장애 신호 | Sentry Uptime 감지 여부 | 설명 |
| --- | --- | --- |
| 20:27 이후 반복 OOM/재시작 | 부분 감지 | 1분 검사 시점과 크래시가 겹치면 502/timeout을 기록하지만 매번 포착된다고 보장할 수 없다. |
| 21:06 이후 포트 3000 완전 중단 | 감지 | stage liveness가 nginx 502를 받아 약 2분 내 incident를 생성한다. |
| 21:33 복구 | 감지 | health 200 복귀로 recovery 알림을 생성한다. |
| V8 heap 160MB 상한 접근 | 감지 불가 | 외부 HTTP Uptime이 아니라 process/system 메트릭이 필요하다. |
| systemd restart count와 StartLimit 도달 | 원인 식별 불가 | Uptime은 결과인 502를 알리고, 원인은 `journalctl`로 확인한다. |
| scanner IP와 순차 요청 | 감지 불가 | nginx access/error log, rate limit 또는 WAF 영역이다. |

## Phase 2. Deploy와 Release Health

### 2.1 Sentry Deploy 등록

배포 성공 이후에만 Deploy가 생성되도록 [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)의 SSH Deploy step 뒤에 별도 step을 추가한다.

- `Set deploy config`에서 `SENTRY_ENVIRONMENT=production|stage`를 함께 설정한다.
- 등록 명령은 저장소에 설치된 `@sentry/cli`를 사용한다.
- 필요한 환경 변수: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG=bcsd`, `SENTRY_PROJECT`, `SENTRY_RELEASE=${{ github.sha }}`.
- deploy name에는 GitHub run ID/attempt를 포함하고, workflow URL을 deploy URL로 기록한다.
- SSH 배포 실패 시 이 step은 실행되지 않아야 한다.

예상 명령 형태:

```bash
yarn sentry-cli releases deploys "$SENTRY_RELEASE" new \
  --env "$SENTRY_ENVIRONMENT" \
  --name "github-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
```

#### Deploy 등록 방식 선택 근거

- release 생성만으로는 코드가 빌드된 시점만 알 수 있고 실제 서버 반영 시점을 알 수 없다. Deploy marker를 추가해야 오류와 성능 변화가 실제 배포 직후인지 판단할 수 있다.
- SSH step 뒤에 두는 이유는 업로드나 원격 배포가 실패했는데도 Sentry가 배포 완료로 기록하는 것을 방지하기 위해서다.
- 저장소의 `@sentry/cli`를 사용하면 별도 전역 CLI 버전에 의존하지 않고 lockfile과 같은 버전으로 재현할 수 있다.
- release 식별자를 기존과 동일한 Git SHA 하나로 통일하면 SDK event, source map artifact, commit, Deploy가 서로 다른 release로 갈라지는 문제를 막는다.
- run ID/attempt는 같은 commit을 재배포한 경우도 서로 구분하기 위해 deploy name에 넣는다.
- production과 stage를 같은 workflow에서 처리하므로 environment를 명시해 stage Deploy가 production release 분석에 섞이지 않게 한다.

### 2.2 Release Health 진단 및 활성화

1. staging 브라우저에서 Sentry envelope에 session item이 전송되는지 확인한다.
2. event의 `release`가 Git SHA, `environment`가 `stage`인지 확인한다.
3. 최신 release 화면에서 session count와 crash-free sessions/users가 생성되는지 확인한다.
4. 자동 session tracking이 실제로 비활성인 경우에만 [src/instrumentation-client.ts](../../src/instrumentation-client.ts)에 명시적 SDK 옵션을 추가한다.
5. production 배포 후 동일 검증을 반복한다.

#### Release Health 선택 근거

- 최근 release에는 event와 commit이 연결됐지만 session/crash-free 데이터가 없었다. 코드부터 변경하기보다 실제 envelope를 먼저 확인해 SDK 문제, 환경 변수 문제, Sentry 표시 문제를 구분한다.
- staging에서 먼저 보는 이유는 session tracking을 검증하기 위해 production 사용자 이벤트를 기다릴 필요가 없고 설정 오류를 안전하게 반복할 수 있기 때문이다.
- session count와 crash-free users를 모두 확인하면 반복 방문이 많은 일부 사용자 때문에 session 지표만 왜곡되는 것을 보완할 수 있다.
- SDK가 기본 자동 추적을 제공할 수 있으므로 명시 옵션은 실제 비활성이 확인될 때만 추가한다. 불필요한 중복 초기화나 설정 복잡도를 피하기 위한 선택이다.

### 2.3 Source map 배포 검증

[next.config.mjs](../../next.config.mjs)의 `withSentryConfig`, release name, commit 연결, artifact upload 설정은 유지한다.

- CI 로그에서 artifact bundle 업로드 성공과 release 값이 Git SHA와 동일한지 검사한다.
- staging에서 의도적으로 발생시키는 비공개 진단 오류 또는 기존 staging 오류 하나를 사용해 stack frame이 원본 TypeScript 파일/라인으로 복원되는지 확인한다.
- 검증 event의 release와 uploaded artifact release가 일치해야 한다.
- production의 `KOIN-PROD-26`처럼 minified frame만 보이는 경우 해당 release의 artifact 누락 여부를 확인한다.
- 검증 절차와 실패 시 점검 항목을 운영 문서에 기록한다.

#### Source map 검증 방식 선택 근거

- 설정 파일에는 upload 구성이 있지만 `KOIN-PROD-26`에서 `Fk↔Hk` 같은 minified frame만 확인됐다. 설정 존재와 실제 artifact 적용은 별도로 검증해야 한다.
- CI upload 로그는 artifact 전송 여부를, 실제 staging stack frame은 release/debug ID 매칭 여부를 검증하므로 둘 다 필요하다.
- production에서 의도적 오류를 만들지 않고 staging 진단 오류를 사용하는 이유는 실제 사용자에게 영향을 주지 않으면서 전체 수집 경로를 검증하기 위해서다.
- TypeScript 파일과 line까지 복원되는 것을 성공 조건으로 둔 이유는 함수명만 복원된 상태로는 실제 수정 위치를 충분히 좁힐 수 없기 때문이다.
- 절차를 runbook에 남기면 이후 SDK/Next.js 업그레이드나 CI 변경 때 동일 검사를 반복할 수 있다.

## Phase 3. Ownership과 운영 흐름

### 3.1 GitHub 연동과 CODEOWNERS

- Sentry의 GitHub integration에서 이 저장소를 연결한다.
- 정확한 GitHub team slug를 확인한 후 `.github/CODEOWNERS`를 추가한다.
- 최소 소유 영역:
  - `src/pages/articles/`, `src/components/Articles/`, `src/api/articles/`
  - `src/pages/lost-item/`
  - `src/pages/bus/`, `src/components/Bus/`
  - `src/pages/cafeteria/`와 관련 components/API
  - `src/instrumentation*`, `sentry.*.config.ts`, `next.config.mjs`, deploy workflow
- Sentry에서 CODEOWNERS auto-sync와 suspect commit 기반 auto-assignment를 활성화한다.

정확한 GitHub team slug가 결정되기 전에는 임의 이름으로 CODEOWNERS를 커밋하지 않는다.

#### CODEOWNERS 선택 근거

- 현재 Sentry owner가 조직의 단일 `bcsd` 팀에만 연결되어 있어 알림을 받아도 실제 담당자를 다시 찾아야 한다. 자동 할당으로 초기 triage 시간을 줄이는 것이 목적이다.
- 코드 경로 기준 소유권은 release commit과 stack frame에 직접 연결되므로 URL 규칙보다 정확한 경우가 많다.
- articles/lost-item/bus/cafeteria를 우선한 이유는 최근 오류 또는 성능 이상이 실제로 관찰된 도메인이기 때문이다.
- instrumentation/config/deploy workflow를 별도 platform 영역으로 둬서 제품 기능 오류와 관측 인프라 오류의 담당자를 구분한다.
- 임의 team slug를 넣지 않는 이유는 존재하지 않는 owner가 설정되면 review 요청과 Sentry auto-assignment가 조용히 실패할 수 있기 때문이다.

### 3.2 Sentry Issue Owner 규칙

CODEOWNERS로 잡히지 않는 runtime issue를 위해 다음 rule을 추가한다.

- `url:*/articles/*` → 게시판 owner.
- `url:*/lost-item/*` → 분실물 owner.
- `url:*/bus/*` → 버스 owner.
- `url:*/cafeteria*` → 식단 owner.
- `path:src/instrumentation*`와 `path:sentry.*.config.ts` → frontend platform owner.
- 미매칭 issue는 frontend 기본 팀으로 fall through.

#### Issue Owner 규칙 선택 근거

- CODEOWNERS는 stack frame이나 suspect commit이 없는 hydration, URL 오류, 외부 서비스 오류를 담당자에게 연결하지 못할 수 있어 runtime URL 규칙이 필요하다.
- URL과 path 규칙을 함께 사용하면 client route 오류와 server/build 오류를 각각 소유 영역에 연결할 수 있다.
- fallthrough를 두는 이유는 새 기능 경로가 추가됐을 때 owner가 완전히 비어 알림이 방치되는 것을 막기 위해서다.

### 3.3 Runbook 문서화

`docs/observability/sentry.md`를 만들고 다음을 기록한다.

- dashboard와 alert URL 및 각 임계값의 의미.
- P0/P1/P2 분류와 Slack 알림 대응 절차.
- issue 확인 순서: release → users → replay → trace → suspect commit.
- deploy/source map/release health 검증 방법.
- false positive 조정 방법과 변경 이력.
- ownership 담당 영역.

#### Runbook 선택 근거

- Sentry UI 설정은 Git diff에 남지 않으므로 규칙의 목적, URL, 임계값 변경 이력을 저장소에 남겨야 재현과 리뷰가 가능하다.
- `release → users → replay → trace → suspect commit` 순서는 배포 연관성, 영향 범위, 재현 행동, 병목, 변경 코드를 넓은 범위에서 좁은 범위로 탐색하도록 정한 기본 triage 흐름이다.
- P0/P1/P2 기준을 문서화하면 같은 수치에도 담당자마다 다른 긴급도를 부여하는 문제를 줄일 수 있다.

## Phase 4. 데이터 품질과 Custom Instrumentation

### 4.1 KoinError 검색용 태그 추가

현재 client/server `beforeSend`는 fingerprint만 설정한다. 다음 low-cardinality tag를 함께 추가한다.

- `koin.error_code`
- `koin.error_status`
- `koin.error_type`
- route/domain은 정규화된 값만 사용한다.

대상:

- [src/instrumentation-client.ts](../../src/instrumentation-client.ts)
- [sentry.server.config.ts](../../sentry.server.config.ts)
- 필요 시 [sentry.edge.config.ts](../../sentry.edge.config.ts)

Hydration diagnostic에는 기존 pathname fingerprint를 유지하면서 `hydration.route`, `release`, browser 분류가 dashboard에서 바로 조회되는지 확인한다.

#### Tag 선택 근거

- 현재 fingerprint는 grouping에는 유용하지만 Discover/Alert에서 status와 code별 필터·집계를 하기 어렵다. tag는 grouping을 바꾸지 않고 검색 축을 추가한다.
- `error_code`, `status`, `type`은 값의 종류가 제한적이라 cardinality가 안정적이고 API 오류 분류에 직접 쓰인다.
- route/domain을 정규화하는 이유는 실제 ID나 query가 tag 값마다 새 그룹을 만들어 검색 비용과 노이즈를 키우는 것을 막기 위해서다.
- hydration은 pathname별 fingerprint가 이미 원인 컴포넌트 범위를 좁히는 데 유용하므로 유지하고, browser/release 분포만 보강한다.

### 4.2 ISR retry 계측

[src/utils/ts/isr.ts](../../src/utils/ts/isr.ts)의 `withStaticFetchRetry`가 task name과 정규화된 attributes를 받을 수 있도록 확장한다.

- span op: `koin.isr.fetch`.
- attributes: `isr.resource`, `retry.attempt`, `retry.max_attempts`, `retry.result`, 정규화된 HTTP status.
- article ID 같은 고카디널리티 값은 tag/transaction name에 넣지 않는다.
- retry delay와 실제 fetch 시간을 분리해 확인할 수 있어야 한다.

우선 적용 위치:

- [src/pages/articles/[id]/index.tsx](../../src/pages/articles/[id]/index.tsx): article detail, hot articles.
- 이후 room/store/bus ISR 호출부는 동일 helper로 확장한다.

#### ISR 계측 선택 근거

- article detail p95가 334% 악화했지만 기존 trace에서는 외부 HTTP span 외 남은 시간이 retry 대기인지 변환인지 구분되지 않았다.
- 공통 `withStaticFetchRetry`에서 attempt와 wait를 계측하면 각 페이지에 중복 코드를 넣지 않고 retry 비용을 일관되게 비교할 수 있다.
- article detail과 hot articles를 분리하는 이유는 필수 데이터와 실패해도 빈 배열로 대체되는 부가 데이터의 지연 영향을 구분하기 위해서다.
- article을 먼저 적용하는 이유는 실제 500 burst와 가장 큰 p95 회귀가 동시에 확인된 경로이기 때문이다. helper 안정성을 확인한 뒤 room/store/bus로 넓힌다.
- 실제 article ID를 제외하고 resource enum을 쓰면 개별 사건의 상세성보다 서비스 구간별 집계 가능성을 보존할 수 있다.

### 4.3 중앙 API client의 업무 구간 계측

[src/utils/ts/apiClient.ts](../../src/utils/ts/apiClient.ts)의 자동 HTTP span과 중복되지 않도록 먼저 staging trace를 확인한다. 자동 span으로 보이지 않는 아래 구간만 custom span 또는 span event로 추가한다.

- response parse/validation.
- 401 refresh 대기와 retry.
- 403 user type 재검증과 retry.
- KoinError 변환.

endpoint 이름은 `/v2/articles/:id`처럼 정규화하고 실제 token, article ID, query 전문은 attribute에 넣지 않는다.

#### API client 계측 선택 근거

- Sentry/Next/Axios가 이미 HTTP 요청 span을 자동 생성할 수 있으므로 수동으로 같은 네트워크 span을 만들면 waterfall과 집계가 중복된다. staging trace로 누락 구간을 먼저 확인한다.
- 401 refresh, 403 user type 재검증, retry는 단일 HTTP span 밖에서 여러 요청과 대기를 만들 수 있어 사용자 체감 지연의 원인을 설명하는 업무 구간이다.
- parse/validation과 KoinError 변환을 구분하면 `200 + null`처럼 HTTP 성공이 애플리케이션 실패로 바뀌는 사례를 검색할 수 있다.
- 중앙 client에서 계측하면 모든 API에 동일 규칙이 적용되고 개별 hook마다 다른 span 이름을 만드는 문제를 줄인다.

### 4.4 Article/Next Image 진단 보강

- `GET /articles/[id]` trace에서 article fetch, hot article fetch, transform 시간을 각각 구분한다.
- upstream이 `200`과 `null`을 반환할 때 span status와 `koin.response_shape=null`을 기록한다.
- `GET /_next/image`는 Next 내부 upstream span이 이미 보이므로 중복 span을 추가하지 않는다. 대신 host, status, duration별 dashboard와 Metric Monitor를 사용한다.

#### Article/Image 접근 차이의 근거

- article은 애플리케이션 코드에서 fetch, retry, fallback, transform을 제어하므로 custom span으로 원인 구간을 더 세분화할 수 있다.
- `200 + null`은 status만 보면 성공이므로 response shape attribute가 있어야 동일 유형의 실패를 별도로 탐지할 수 있다.
- `/_next/image`는 대표 trace에서 upstream fetch 4.158초가 이미 식별됐다. 같은 구간을 다시 감싸는 것보다 host/status/duration 집계와 경보가 더 적은 복잡도로 같은 목적을 달성한다.

## Acceptance Criteria

1. `KOIN Production Overview`에서 오류, users, 전체/route별 p95, internal error rate, Web Vitals, hydration 추세를 최근 14일 기준으로 한 화면에서 볼 수 있다.
2. staging synthetic error가 `prod-new-regression`에 영향을 주지 않고, production 필터가 적용된 규칙만 production Slack으로 전달된다.
3. 테스트용 staging alert 또는 preview 규칙으로 spike 조건과 recovery 알림을 검증한 기록이 남는다.
4. production과 stage의 `/api/health`가 정상 시 HTTP 200, 올바른 `environment`/`release`, `Cache-Control: no-store`를 반환하고 nginx cache의 `HIT` 또는 `Age`가 나타나지 않는다.
5. production/stage 배포 스크립트가 `/`가 아닌 각 로컬 `/api/health` 응답으로 배포 성공을 판정한다.
6. Metric Monitor 4개 이상과 표에 정의한 Uptime Monitor 6개가 활성화되고 owner/Slack destination이 지정된다.
7. 사전 공지한 stage 점검 시간에 Next.js upstream을 통제 중단했을 때 외부 `/api/health`가 502/timeout이 되고, Sentry가 목표 2분 안에 incident를 열며 재기동 후 recovery 알림을 보낸다.
8. stage 장애 훈련의 중단·탐지·알림·복구 시각을 systemd/nginx 로그와 Sentry incident에서 대조한 기록이 runbook에 남는다.
9. 다음 성공 배포의 release에 Git commit과 Deploy 1건이 함께 표시되며 environment가 정확하다.
10. 다음 production release에서 Release Health session count 또는 crash-free 지표가 표시된다. 표시되지 않으면 원인과 확인한 envelope 결과가 runbook에 기록된다.
11. staging 오류의 최소 한 개 application frame이 원본 `.ts`/`.tsx` 파일과 정확한 line으로 symbolicate된다.
12. Sentry issue가 URL/path 또는 CODEOWNERS 규칙에 따라 담당 팀/사용자에게 자동 할당된다.
13. KoinError event가 status/code 기준으로 검색 가능하며 기존 fingerprint grouping은 유지된다.
14. article detail trace에서 article fetch, retry wait, hot article fetch를 독립 span으로 구분할 수 있다.
15. `yarn typecheck`, `yarn lint`, `yarn build`가 통과한다.
16. `docs/observability/sentry.md`에 실제 dashboard/alert/monitor URL, health endpoint 운영법, 최종 임계값이 기록된다.

## Verification Steps

1. 로컬: `/api/health`의 GET 200/JSON/header와 GET 이외 method 거부를 확인한 뒤 `yarn typecheck`, `yarn lint`, production 환경 변수 없이 `yarn build`가 기존 동작을 유지하는지 확인한다.
2. Stage nginx: 외부 `https://stage.koreatech.in/api/health`를 반복 호출해 올바른 stage/release가 반환되고 cache `HIT`/`Age`가 없으며, 로컬 `http://localhost:3000/api/health`와 결과가 일치하는지 확인한다.
3. Stage 장애 훈련: 사전 공지한 점검 시간에 `koin-stage`를 중단하거나 upstream 연결을 통제 차단하고 외부 health의 502/timeout, Sentry incident 생성, Slack 도착을 확인한 뒤 즉시 재기동해 200 복귀와 recovery 알림을 확인한다.
4. 장애 기록 대조: systemd journal의 중단·재기동 시각, nginx 502 시각, Sentry 최초 실패·incident·recovery 시각을 KST로 정리하고 실제 탐지 시간이 2분 목표를 만족하는지 기록한다.
5. CI: stage build에서 release 생성, commit 연결, artifact upload 로그를 확인한다.
6. Stage deploy: `/api/health` 기반 배포 판정, deploy marker, Release Health, source map, custom span, alert 환경 격리를 확인한다.
7. Production deploy: `/api/health`가 cache 없이 production 환경과 새 release를 반환하고, release/deploy 시각이 실제 SSH 배포 완료 뒤에 기록되는지 확인한다. production에서 고의 중단 훈련은 하지 않는다.
8. Sentry Discover/Trace: `GET /articles/[id]`에서 새 span과 attribute가 조회되는지 확인한다.
9. 7일 관찰 후 alert 발생 수와 false-positive 비율을 검토해 임계값을 한 차례 조정한다.

### 검증 전략 선택 근거

- typecheck/lint/build는 관측 코드가 애플리케이션의 정적 안정성과 production bundle 생성을 깨지 않았는지 확인하는 최소 회귀 검사다.
- 정상 응답만 확인하면 nginx cache 때문에 프로세스가 죽은 경우를 놓칠 수 있으므로, header 확인과 실제 stage upstream 중단을 모두 성공 조건으로 둔다.
- 장애 훈련의 systemd/nginx/Sentry 시각을 대조하면 “monitor가 존재한다”가 아니라 장애 시작부터 Slack 도착과 recovery까지의 실제 탐지 시간을 검증할 수 있다.
- 고의 중단은 stage에서만 짧게 수행한다. 기준 incident가 stage였고 production 사용자에게 검증 트래픽 이상의 영향을 줄 이유가 없기 때문이다.
- CI, stage deploy, production deploy를 분리하면 build-time artifact 문제, runtime 수집 문제, 실제 운영 환경 변수 문제를 단계별로 격리할 수 있다.
- Sentry UI에 데이터가 보이는 것까지 완료 조건에 포함한 이유는 코드가 컴파일돼도 잘못된 release/environment 또는 sampling context 때문에 관측 데이터가 연결되지 않을 수 있기 때문이다.
- 7일 후 false-positive 리뷰는 초기 임계값을 영구 규칙으로 간주하지 않고 실제 트래픽 패턴으로 보정하기 위한 운영 단계다.

## Risks and Mitigations

- 알림 폭주: 새 규칙을 stage에서 검증하고 warning/critical 및 action interval을 분리한다.
- Uptime false positive: 삭제 가능한 동적 URL을 피하고 2회 연속 실패 조건을 사용한다.
- nginx cache로 인한 false green: `/api/health`를 exact-match location으로 분리하고 cache off/no-cache/bypass를 모두 명시하며 응답 header와 stage 중단 훈련으로 검증한다.
- health endpoint 정보 노출·오용: GET만 허용하고 status/environment/release 외 내부 메모리·호스트·의존성 정보를 반환하지 않는다. 비정상 호출이 관찰되면 health 전용 rate limit을 추가하되 Sentry probe를 막지 않는다.
- stage 장애 훈련 영향: 사전 공지한 짧은 점검 시간에만 수행하고, 대상 unit과 포트를 명시적으로 재확인하며 재기동 명령과 담당자를 준비한다. production에서는 고의 중단하지 않는다.
- Uptime 원인 오판: 502 탐지를 OOM 확정으로 간주하지 않고 runbook에서 systemd journal, nginx 로그, 서버 메트릭 순으로 원인을 확인한다.
- Deploy 오기록: SSH Deploy step 성공 뒤에만 Sentry deploy step을 실행한다.
- Source map/release 불일치: Git SHA 한 값을 SDK, plugin, CLI deploy에서 공통으로 사용한다.
- custom span 중복: 자동 Axios/Next span을 staging에서 먼저 확인하고 누락된 업무 구간만 추가한다.
- cardinality 증가: transaction/tag에는 정규화된 route와 제한된 enum만 사용한다.
- CODEOWNERS 오할당: 실제 GitHub team slug와 담당 영역을 확인한 후 활성화한다.

## Recommended Execution Order

1. Next.js `/api/health` + nginx cache bypass + production/stage 배포 스크립트 변경.
2. Stage 장애 훈련 + production/stage Uptime Monitor + Slack/recovery 검증.
3. Dashboard + Issue/Metric Alert.
4. Deploy marker + Release Health/source map 검증.
5. CODEOWNERS + Sentry ownership + runbook.
6. KoinError tags + ISR/API custom instrumentation.
7. 나머지 stage 검증 → production 반영 → 7일 후 임계값 조정.

### 실행 순서 선택 근거

1. health endpoint와 cache bypass가 먼저 있어야 Uptime이 Next.js 생존 여부를 신뢰성 있게 검사할 수 있다. 배포 스크립트도 같은 기준으로 맞춰 판정 차이를 없앤다.
2. 2026-08-04 장애에서 가장 큰 공백은 원인 분석보다 중단 인지였으므로, stage 장애 훈련과 Uptime 전달 경로를 가장 먼저 닫는다.
3. Dashboard와 Issue/Metric Alert는 Uptime이 설명하지 못하는 오류 추세, tail latency, 사용자 영향과 OOM 전후의 애플리케이션 징후를 보완한다.
4. Deploy/Release/source map은 코드 변경과 장애 발생 사이를 연결하는 기반 정보이므로 세부 span보다 먼저 완성한다.
5. Ownership과 runbook은 알림이 늘어난 뒤 담당자가 불명확해지는 운영 병목을 제거한다.
6. custom instrumentation은 코드 변경과 데이터 증가를 동반하므로, 기존 자동 계측과 source map이 정상임을 확인한 뒤 필요한 구간에만 넣는다.
7. stage에서 전체 흐름을 검증한 뒤 production에 적용하고, 한 주의 실제 알림 데이터를 이용해 임계값을 보정한다.
