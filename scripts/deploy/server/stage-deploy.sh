#!/usr/bin/env bash
set -Eeuo pipefail
DEPLOY_DIR=/usr/local/koin/stage
TAR_FILE="${1:-/home/ubuntu/koin/web/dist.tar.gz}"
RELEASE_ID="${2:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
EXPECTED_RELEASE="${3:-}"
SERVICE=koin-stage.service
HEALTH_URL='http://127.0.0.1:3000/api/health?environment=stage'
KEEP_RELEASES=2
log() { echo "[deploy-stage $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

prune_releases() {
  local current release kept=0
  current="$(readlink -f "$DEPLOY_DIR/current")"
  while IFS= read -r release; do
    [ "$release" = "$current" ] && continue
    if [ "$kept" -lt $((KEEP_RELEASES - 1)) ]; then
      kept=$((kept + 1))
      continue
    fi
    log "오래된 릴리스 삭제: ${release##*/}"
    rm -rf -- "$release"
  done < <(find "$DEPLOY_DIR/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-)
}

# CI뿐 아니라 수동 배포도 직렬화한다. 잠금을 얻기 전에는 파일을 변경하지 않는다.
exec 9>"$DEPLOY_DIR/.deploy.lock"
flock -w 300 9
[[ "$RELEASE_ID" =~ ^[a-zA-Z0-9_-]+$ ]]
test -L "$DEPLOY_DIR/current" || {
  log 'ERROR: releases/current 구조와 systemd 실행 경로를 먼저 준비해야 합니다.'
  exit 1
}
if [ "$TAR_FILE" = --prune-only ]; then
  prune_releases
  exit 0
fi
test -f "$TAR_FILE"
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
  if [ "$(readlink -f "$DEPLOY_DIR/current")" != "$(readlink -f "$NEW_RELEASE")" ]; then
    rm -rf -- "$NEW_RELEASE"
  fi
  rm -f -- "$TAR_FILE"
  exit "$status"
}
trap 'rollback $?' ERR
trap 'rollback 129' HUP
trap 'rollback 130' INT
trap 'rollback 143' TERM

prune_releases
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
prune_releases || log 'WARN: 오래된 릴리스 정리에 실패했습니다. 다음 배포에서 다시 정리합니다.'
