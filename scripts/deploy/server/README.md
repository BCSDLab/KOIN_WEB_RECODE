# 서버 배포 스크립트 (참조 사본)

이 디렉터리의 파일은 **배포 서버에서 실제로 실행되는 스크립트의 사본**이다.
CI 가 이 파일을 사용하지는 않는다. 서버의 원본 경로는 다음과 같다.

| 파일                    | 서버 경로                                      | 서비스                    | 포트 |
| ----------------------- | ---------------------------------------------- | ------------------------- | ---- |
| `stage-deploy.sh`       | `/usr/local/koin/stage/deploy/deploy.sh`       | `koin-stage.service`      | 3000 |
| `production-deploy.sh`  | `/usr/local/koin/production/deploy/deploy.sh`  | `koin-production.service` | 3001 |

`deploy.yml` 의 마지막 단계가 SSH 로 이 스크립트를 실행한다.

## 왜 사본을 두는가

이전까지 이 스크립트는 서버에만 있어서 누가 언제 무엇을 바꿨는지 추적할 수 없었다.
배포 동작을 바꿀 때 리뷰 대상이 되도록 사본을 커밋한다.

## 동작 요약

1. 아카이브 존재와 무결성 확인 (`tar -tzf`)
2. `$DEPLOY_DIR/.next` 삭제 — tar 추출은 덮어쓰기만 하므로 지우지 않으면 예전 빌드의
   청크와 manifest 가 무한히 누적된다
3. 아카이브 추출 (`yarn install` 은 하지 않는다. PnP 맵과 캐시가 아카이브에 들어 있다)
4. systemd 서비스 재시작
5. 최대 30초 health check, 실패 시 journal 출력과 함께 비정상 종료

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

- **서버에서 스크립트나 nginx 설정을 수정했다면 이 문서도 함께 갱신할 것.** 자동 동기화는 없다.
- `.next` 를 지우고 추출하므로 롤백은 이전 커밋 재배포로만 가능하다.
- 아카이브 구성은 `scripts/deploy/create-package.sh` 가 담당한다. 두 스크립트의 전제가
  맞아야 한다 (예: 서버는 `yarn start:serve` 로 기동하므로 `.yarn/releases` 가 필요하다).
