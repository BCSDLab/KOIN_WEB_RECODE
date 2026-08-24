#!/usr/bin/env bash
#
# 배포 아카이브 생성.
#
# 서버의 deploy.sh 는 이 아카이브를 배포 디렉터리에 풀고 systemd 서비스를 재시작할 뿐이다.
# yarn install 을 하지 않으므로 PnP 맵과 의존성 아카이브가 여기 들어 있어야 한다.
#
# 사용법: scripts/deploy/create-package.sh <아카이브 파일명>
set -euo pipefail

ARCHIVE_NAME="${1:?사용법: create-package.sh <아카이브 파일명>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

SMOKE_PORT="${SMOKE_PORT:-3999}"
YARN_BIN="$(sed -n 's/^yarnPath: *//p' .yarnrc.yml)"

log() { echo "==> $*"; }

test -f .env || {
  echo "ERROR: .env 가 없다. 빌드 전에 생성돼 있어야 한다." >&2
  exit 1
}

log "프로덕션 전용 PnP 맵 재구성"
yarn workspaces focus --production

STAGE="$(mktemp -d)"
SERVER_PID=''
cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true
  rm -rf "$STAGE"
}
trap cleanup EXIT

log "런타임에 필요한 파일만 스테이징"
# .next/cache 는 빌드 캐시라 next start 에 필요 없다(빌드 1회당 700MB 규모).
# .yarn/sdks 는 에디터용 SDK 다.
# .yarn/cache 는 통째로 넣지 않고 아래에서 참조되는 zip 만 골라 넣는다.
tar -cf - \
  --exclude='.next/cache' \
  --exclude='.next/trace' \
  --exclude='.yarn/sdks' \
  --exclude='.yarn/cache' \
  .next \
  public \
  yarn.lock \
  .env \
  next.config.mjs \
  .yarn \
  .pnp.cjs \
  .pnp.loader.mjs \
  .yarnrc.yml |
  tar -xf - -C "$STAGE"

log "package.json 에서 devDependencies 제거"
# 서버는 `yarn start:serve` 로 기동한다. yarn CLI 는 package.json 의 의존성을 전부 해석하므로
# devDependencies 가 남아 있으면 아래에서 제외한 zip 을 찾다가 기동에 실패한다.
jq 'del(.devDependencies)' package.json >"$STAGE/package.json"

log ".pnp.cjs 가 참조하는 캐시 zip 만 복사"
mkdir -p "$STAGE/.yarn/cache"
zip_count=0
while IFS= read -r zip; do
  if [ ! -f "$zip" ]; then
    echo "ERROR: .pnp.cjs 가 참조하는 $zip 이 없다." >&2
    exit 1
  fi
  cp "$zip" "$STAGE/.yarn/cache/"
  zip_count=$((zip_count + 1))
done < <(grep -oE '\.yarn/cache/[^"]+\.zip' .pnp.cjs | sort -u)

if [ "$zip_count" -eq 0 ]; then
  echo "ERROR: .pnp.cjs 에서 캐시 zip 참조를 찾지 못했다. PnP 파일 형식을 확인할 것." >&2
  exit 1
fi
log "zip ${zip_count}개 복사"

log "스모크 테스트"
# 잡으려는 실패는 'PnP 맵이 깨져 프로세스가 즉시 죽는 것' 이다.
# API 도달 여부는 관심사가 아니므로 상태 코드는 보지 않는다.
(
  cd "$STAGE"
  NODE_ENV=production node "$YARN_BIN" start:serve -p "$SMOKE_PORT" >"$STAGE/smoke.log" 2>&1
) &
SERVER_PID=$!

booted=0
for _ in $(seq 1 30); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    break
  fi
  if curl -fsS -o /dev/null "http://127.0.0.1:${SMOKE_PORT}/api/health"; then
    booted=1
    break
  fi
  sleep 1
done

kill "$SERVER_PID" 2>/dev/null || true
wait "$SERVER_PID" 2>/dev/null || true
SERVER_PID=''

if [ "$booted" -ne 1 ]; then
  echo "ERROR: 배포 패키지가 기동하지 못했다. 아카이브를 만들지 않는다." >&2
  cat "$STAGE/smoke.log" >&2
  exit 1
fi
log "스모크 테스트 통과"

log "아카이브 생성"
tar -czf "$ROOT/$ARCHIVE_NAME" -C "$STAGE" .
ls -lh "$ROOT/$ARCHIVE_NAME"
