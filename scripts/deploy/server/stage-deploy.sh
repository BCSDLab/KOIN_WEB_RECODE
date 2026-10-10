#!/usr/bin/env bash
set -Eeuo pipefail
DEPLOY_DIR=/usr/local/koin/stage
TAR_FILE="${1:-/home/ubuntu/koin/web/dist.tar.gz}"
RELEASE_ID="${2:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
EXPECTED_RELEASE="${3:-}"
SERVICE=koin-stage.service
HEALTH_URL='http://127.0.0.1:3000/api/health?environment=stage'
log() { echo "[deploy-stage $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

# CI뿐 아니라 수동 배포도 직렬화한다. 잠금을 얻기 전에는 파일을 변경하지 않는다.
exec 9>"$DEPLOY_DIR/.deploy.lock"
flock -w 300 9
[[ "$RELEASE_ID" =~ ^[a-zA-Z0-9_-]+$ ]]
test -f "$TAR_FILE"
test -L "$DEPLOY_DIR/current" || {
  log 'ERROR: releases/current 구조와 systemd 실행 경로를 먼저 준비해야 합니다.'
  exit 1
}
PREVIOUS_RELEASE="$(readlink -f "$DEPLOY_DIR/current")"
NEW_RELEASE="$DEPLOY_DIR/releases/$RELEASE_ID"
test -d "$PREVIOUS_RELEASE"
test ! -e "$NEW_RELEASE"

health() {
  local expected="$1" response
  for _ in $(seq 1 30); do
    if response="$(curl --fail --silent --show-error --connect-timeout 2 --max-time 3 "$HEALTH_URL")" &&
      jq -e --arg release "$expected" \
        '.status == "ok" and .environment == "stage" and ($release == "" or .release == $release)' \
        <<<"$response" >/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

activate() {
  ln -s "$1" "$DEPLOY_DIR/current.next"
  mv -Tf "$DEPLOY_DIR/current.next" "$DEPLOY_DIR/current"
}

STOP_REQUESTED=0
rollback() {
  local status="$1"
  trap - ERR HUP INT TERM
  set +e
  rm -f "$DEPLOY_DIR/current.next"
  if [ "$STOP_REQUESTED" -eq 1 ]; then
    log '배포 실패: 이전 릴리스로 복구합니다.'
    sudo /usr/bin/systemctl stop "$SERVICE"
    activate "$PREVIOUS_RELEASE"
    sudo /usr/bin/systemctl start "$SERVICE"
    if health ''; then
      log '이전 릴리스 복구 확인 완료'
    else
      log 'ERROR: 이전 릴리스 복구 확인 실패'
    fi
    sudo /usr/bin/journalctl -u "$SERVICE" -n 30 --no-pager
  fi
  exit "$status"
}
trap 'rollback $?' ERR
trap 'rollback 129' HUP
trap 'rollback 130' INT
trap 'rollback 143' TERM

log "신규 릴리스 준비: $RELEASE_ID"
tar -tzf "$TAR_FILE" >/dev/null
mkdir "$NEW_RELEASE"
tar -xzf "$TAR_FILE" -C "$NEW_RELEASE"
for file in .next/BUILD_ID package.json .pnp.cjs .pnp.loader.mjs .yarnrc.yml .env; do
  test -s "$NEW_RELEASE/$file"
done
YARN_BIN="$(sed -n 's/^yarnPath: *//p' "$NEW_RELEASE/.yarnrc.yml")"
[[ "$YARN_BIN" == .yarn/releases/* && "$YARN_BIN" != *..* ]]
test -f "$NEW_RELEASE/$YARN_BIN"
test -d "$NEW_RELEASE/public"
test -d "$NEW_RELEASE/.yarn/cache"

# 실행 중인 프로세스의 파일은 건드리지 않는다. 프로세스는 한 번에 하나만 실행한다.
STOP_REQUESTED=1
sudo /usr/bin/systemctl stop "$SERVICE"
activate "$NEW_RELEASE"
sudo /usr/bin/systemctl start "$SERVICE"
health "$EXPECTED_RELEASE"
STOP_REQUESTED=0
trap - ERR HUP INT TERM
log "Stage 배포 성공: $RELEASE_ID"
rm -f "$TAR_FILE"
# 자동 삭제하지 않는다. 이전 릴리스와 실패한 릴리스는 조사·롤백을 위해 보존한다.
