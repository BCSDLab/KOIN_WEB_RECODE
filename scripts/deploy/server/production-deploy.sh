#!/bin/bash
set -euo pipefail
PORT=3001
DEPLOY_DIR=/usr/local/koin/production
TAR_FILE=/home/ubuntu/koin/web/dist-production.tar.gz
SERVICE=koin-production.service
HEALTH_URL="http://localhost:${PORT}/api/health?environment=production"

log() { echo "[deploy-prod $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

log "extracting archive..."
test -f "$TAR_FILE" || { log "ERROR: $TAR_FILE not found"; exit 1; }
log "verifying archive..."
# .next 를 지우기 전에 검증한다. 손상된 아카이브면 서비스가 복구 불가로 내려간다.
tar -tzf "$TAR_FILE" > /dev/null

log "clearing previous build output..."
# tar 추출은 덮어쓰기만 해서, 지우지 않으면 예전 빌드의 청크가 무한히 누적된다.
rm -rf "$DEPLOY_DIR/.next"

tar -xzf "$TAR_FILE" -C "$DEPLOY_DIR"

log "restarting ${SERVICE}..."
sudo /usr/bin/systemctl restart "$SERVICE"

log "waiting for health check..."
for i in $(seq 1 30); do
  if curl -sf -o /dev/null "$HEALTH_URL"; then
    log "Production 배포 성공 (${i}s)"
    rm -f "$TAR_FILE"
    sudo /usr/bin/systemctl is-active "$SERVICE" || true
    exit 0
  fi
  sleep 1
done

log "Production 배포 실패: health check timeout"
sudo /usr/bin/journalctl -u "$SERVICE" -n 30 --no-pager || true
sudo /usr/bin/systemctl status "$SERVICE" --no-pager || true
rm -f "$TAR_FILE"
exit 1
