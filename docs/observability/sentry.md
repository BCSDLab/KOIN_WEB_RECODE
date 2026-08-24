# KOIN Web Sentry 운영 Runbook

## 범위

- Sentry organization: `bcsd`
- production project/environment: `koin-prod` / `production`
- stage project/environment: `koin-stage` / `stage`
- Slack destination: `코인_오류_front_end`
- GitHub owner: `@BCSDLab/track_frontend`

Dashboard·alert·monitor의 실제 URL과 Sentry UI에서만 바꿀 수 있는 값은 적용 직후 아래 표에 기록한다.

| 종류 | 이름 | URL | 최종 설정 |
| --- | --- | --- | --- |
| Dashboard | KOIN Production Overview | 적용 후 기록 | 최근 14일, production |
| Issue Alert | prod-new-regression | 적용 후 기록 | first seen/regression, 30분 action interval |
| Issue Alert | prod-impact-spike | 적용 후 기록 | 5분 20건 또는 15분 10 users |
| Uptime | Production Next liveness | 적용 후 기록 | 1분, `/api/health`, P1 |
| Uptime | Stage Next liveness | 적용 후 기록 | 1분, `/api/health`, P2 |
| Uptime | Production end-to-end | 적용 후 기록 | 1분, `/`, P1 |
| Uptime | Stage end-to-end | 적용 후 기록 | 1분, `/`, P2 |
| Uptime | Production cafeteria journey | 적용 후 기록 | 5분, `/cafeteria`, P2 |
| Uptime | Production bus journey | 적용 후 기록 | 5분, `/bus/route`, P2 |

## 심각도와 초기 대응

| 등급 | 기준 | 알림 후 행동 |
| --- | --- | --- |
| P0 | production 전체 중단, 데이터 손상 또는 보안 사고 | 즉시 담당자 호출, 배포 중지/롤백 판단, incident 채널 개설 |
| P1 | production health 2회 연속 실패, 핵심 기능 지속 실패 | 즉시 확인, 10분 안에 원인 범위와 완화책 공유 |
| P2 | stage 중단, 일부 journey 실패, 성능 warning | 근무 시간 내 triage, 반복·확대 시 P1 승격 |

Uptime 502는 OOM을 뜻하지 않는다. 다음 순서로 원인을 확인한다.

1. Sentry Uptime에서 최초 실패 region, status, failure/recovery 시각을 확인한다.
2. `journalctl -u koin-production` 또는 `journalctl -u koin-stage`에서 프로세스 종료와 재시작을 확인한다.
3. nginx access/error log에서 502/504, rate limit, upstream 연결 실패를 확인한다.
4. 서버 메모리와 cgroup/V8 상한, systemd restart count를 확인한다.
5. 직전 Sentry Deploy와 release의 new/regressed issue를 확인한다.

## Health endpoint

- production: `https://koreatech.in/api/health`
- stage: `https://stage.koreatech.in/api/health`
- 성공: HTTP 200, `status=ok`, 기대한 `environment`, 현재 Git SHA인 `release`
- cache: `Cache-Control: no-store, no-cache, must-revalidate`; nginx `HIT`와 `Age`가 없어야 한다.
- 책임: Next.js 프로세스 liveness만 확인한다. KOIN API·DB의 readiness는 포함하지 않는다.

서버 반영 절차는 [배포 서버 README](../../scripts/deploy/server/README.md)를 따른다.

### Stage 장애 훈련

사전 공지한 점검 시간에만 시행한다. production에서는 고의 중단하지 않는다.

1. 외부/로컬 health가 모두 200인지 확인한다.
2. 대상이 `koin-stage.service`, 포트가 3000인지 재확인한다.
3. stage unit을 중단하고 외부 health가 502/timeout으로 바뀌는지 확인한다.
4. Sentry incident와 Slack이 목표 2분 안에 도착하는지 확인한다.
5. unit을 즉시 시작하고 health 200 및 Sentry recovery를 확인한다.
6. systemd/nginx/Sentry/Slack 시각을 KST로 기록한다.

## Issue triage

기본 확인 순서는 다음과 같다.

1. release/Deploy: 최근 배포 직후 시작·회귀했는가?
2. users/events: 영향 사용자와 발생률은 얼마인가?
3. Replay: 사용자가 어떤 행동을 했는가?
4. Trace: 실패 또는 지연된 구간은 어디인가?
5. suspect commit/CODEOWNERS: 어떤 변경과 담당 영역인가?

KoinError는 `koin.error_status`, `koin.error_code`, `koin.error_type` tag로 검색한다. ISR은
`isr.resource`, `retry.attempt`, `retry.result` attribute와 `koin.isr.fetch`,
`koin.isr.retry_wait` span으로 확인한다.

## Release·Deploy·source map 검증

1. GitHub Actions의 artifact bundle upload가 성공했는지 확인한다.
2. event, artifact, release, Deploy의 release 값이 모두 Git SHA인지 확인한다.
3. Deploy 시각이 원격 배포와 `/api/health` 성공 뒤인지 확인한다.
4. stage 진단 오류의 application frame이 원본 `.ts`/`.tsx` 파일과 line으로 복원되는지 확인한다.
5. release 화면에서 session과 crash-free sessions/users가 생성되는지 확인한다.

## 임계값 변경 원칙

- 새 규칙은 stage 또는 preview로 전달 경로를 먼저 검증한다.
- production 규칙은 적용 후 7일 동안 발생 수와 false positive를 기록한다.
- 임계값을 바꿀 때 변경 일시, 이전/새 값, 근거를 이 문서에 추가한다.
- 일시적 네트워크 실패 하나는 무시하되, 2026-08-04 stage 완전 중단 같은 지속 장애는 2분 안에 알려야 한다.

## 변경 이력

| 일자 | 변경 | 근거 |
| --- | --- | --- |
| 2026-08-24 | health/Uptime, Deploy, ownership, 진단 기준 초안 적용 | 2026-08-04 stage 장애의 인지 지연과 최근 14일 Sentry 조사 |
