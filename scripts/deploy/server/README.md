# 서버 배포 스크립트

이 디렉터리의 환경별 스크립트를 CI가 배포 아카이브와 함께 서버의
`/home/ubuntu/koin/web/deploy.sh`로 업로드한 뒤 실행한다. 따라서 저장소의 변경이 다음 배포부터
실제 배포 절차에 반영된다.

| 파일 | 선택 환경 | 서비스 | 포트 |
| --- | --- | --- | --- |
| `stage-deploy.sh` | stage | `koin-stage.service` | 3000 |
| `production-deploy.sh` | production | `koin-production.service` | 3001 |

서버의 기존 `/usr/local/koin/<environment>/deploy/deploy.sh`는 호환용 사본이며 CI 실행 경로가 아니다.

## 왜 사본을 두는가

이전까지 이 스크립트는 서버에만 있어서 누가 언제 무엇을 바꿨는지 추적할 수 없었다.
배포 동작을 바꿀 때 코드 리뷰와 실제 실행 내용이 일치하도록 저장소 파일을 CI가 직접 사용한다.

## 동작 요약

1. 아카이브 존재와 무결성 확인 (`tar -tzf`)
2. `$DEPLOY_DIR/.next` 삭제 — tar 추출은 덮어쓰기만 하므로 지우지 않으면 예전 빌드의
   청크와 manifest 가 무한히 누적된다
3. 아카이브 추출 (`yarn install` 은 하지 않는다. PnP 맵과 캐시가 아카이브에 들어 있다)
4. systemd 서비스 재시작
5. 최대 30초 `/api/health` health check, 실패 시 journal 출력과 함께 비정상 종료

배포 판정은 일반 페이지 `/`가 아니라 Next.js 프로세스가 직접 처리하는 `/api/health`를 사용한다.
일반 페이지는 nginx의 60초 캐시 때문에 upstream이 중단돼도 잠시 200을 반환할 수 있기 때문이다.

## 외부 health check

Sentry Uptime에서도 같은 endpoint를 사용한다.

| 환경 | URL | Next.js upstream | 참조 설정 |
| --- | --- | --- | --- |
| production | `https://koreatech.in/api/health` | `127.0.0.1:3001` | `production-nginx-health.conf` |
| stage | `https://stage.koreatech.in/api/health` | `127.0.0.1:3000` | `stage-nginx-health.conf` |

- 참조 설정의 exact-match `location = /api/health`를 각 도메인의 실제 `server` 블록에 반영한다.
- `proxy_cache off`, `proxy_no_cache 1`, `proxy_cache_bypass 1`을 유지한다.
- 적용 전 `sudo nginx -t`, 적용 후 `sudo systemctl reload nginx`를 실행한다.
- 반복 호출에서 cache `HIT`나 `Age`가 없어야 한다.
- upstream이 중단되면 nginx의 502/504를 그대로 반환해야 한다.
- 응답은 liveness만 나타낸다. API·DB 같은 외부 의존성의 정상 여부는 별도 monitor로 확인한다.

## nginx 캐시 레이어

서버 파일이라 저장소에 없지만, 앱 설정과 맞물리므로 구조를 남긴다.

| 경로               | 설정 파일                                    | 캐시 존         | 수명 | 캐시 키                                  |
| ------------------ | -------------------------------------------- | --------------- | ---- | ---------------------------------------- |
| `/_next/static/`   | `sites-enabled/*.conf`                       | 없음(브라우저)  | 1년  | `immutable`                              |
| `/_next/image`     | `sites-enabled/*.conf`                       | `koin_img_cache` | 30일 | `$scheme$proxy_host$request_uri`          |
| 그 외 (`/`)        | `sites-enabled/*.conf`                       | `koin_cache`    | 60초 | `...$request_uri$device_class`             |

- 존 정의는 `/etc/nginx/conf.d/proxy-cache.conf` 에 있다.
- `/_next/image` 는 **기기·로그인 상태와 무관**하므로 `location /` 의 `$device_class` 키 분리와
  `$skip_cache` 우회를 적용하지 않는다. 그대로 두면 이미지가 기기별로 쪼개지고 로그인 사용자는
  캐시를 통째로 우회한다.
- `location /` 의 `$device_class` 정규식은 `src/utils/hooks/useMediaQuery` 의 UA 판정과 반드시
  일치해야 한다. (CLAUDE.md 규칙 10)
- 브라우저로 내려가는 이미지 `Cache-Control` 은 nginx 가 아니라 **앱이 소유한다**
  (`next.config.mjs` 의 `images.minimumCacheTTL`). nginx 는 자기 엣지 캐시 수명만
  `proxy_ignore_headers Cache-Control` 로 독립시킨다.
- `include /etc/nginx/sites-enabled/*;` 는 확장자를 가리지 않는다. **백업 파일을 이 디렉터리에
  두면 설정으로 로드되어 server name 충돌이 난다.** 백업은 `/etc/nginx/backups/` 에 둔다.

## 주의

- 배포 스크립트는 서버에서 직접 수정하지 않고 이 디렉터리에서 변경한다.
- nginx 설정은 아직 자동 배포하지 않으므로 서버에서 수정했다면 참조 설정과 이 문서도 함께 갱신한다.
- `.next` 를 지우고 추출하므로 롤백은 이전 커밋 재배포로만 가능하다.
- 아카이브 구성은 `scripts/deploy/create-package.sh` 가 담당한다. 두 스크립트의 전제가
  맞아야 한다 (예: 서버는 `yarn start:serve` 로 기동하므로 `.yarn/releases` 가 필요하다).
