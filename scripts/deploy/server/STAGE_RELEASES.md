# 스테이징 릴리스 배포

`stage-deploy.sh <아카이브 경로> <고유 릴리스 ID> <커밋 SHA>`로 배포합니다.
전체 실행 파일을 `/usr/local/koin/stage/releases/<ID>`에 준비한 뒤 서비스를
중지하고 `current` 링크를 교체합니다. 서비스를 시작한 후 환경과 커밋 SHA를
헬스 체크로 검증합니다. 무중단 배포는 아니며 재시작 중 짧은 공백이 남습니다.

준비 단계에서 실패하면 실행 중인 서비스는 변경하지 않습니다. 전환에 실패하면
이전 릴리스로 되돌리고 복구 여부를 확인합니다.

## 최초 서버 전환

기존 실행 파일을 초기 릴리스 폴더에 복사합니다. `.env`, `.next`, `public`,
`.yarn`, PnP 파일, 설정 파일을 함께 포함해야 합니다. 원본은 보존합니다.
초기 릴리스를 가리키는 `current` 링크를 만들고 systemd에 다음 드롭인을 추가합니다.

```ini
[Service]
WorkingDirectory=/usr/local/koin/stage/current
ExecStart=
ExecStart=/home/ubuntu/.nvm/versions/node/v24.14.1/bin/node /usr/local/koin/stage/current/.yarn/releases/yarn-4.17.0.cjs start:serve -p 3000
```

systemd 설정을 다시 읽고 스테이징을 재시작한 후
`/api/health?environment=stage`의 환경과 커밋 SHA를 검증합니다.
복구할 수 있도록 이전 서비스 설정과 실행 파일을 보관합니다.

최초 전환은 CI 변경 병합과 맞춰 진행해야 합니다. 기존 배포 스크립트는 여전히
루트 폴더를 덮어쓰므로, 서버 전환 후 실행하면 안 됩니다.
Production 서비스 설정과 배포 스크립트는 이번 변경에 포함하지 않습니다.

## 배포 직렬화와 복구 제한

서버에서는 `flock`으로 배포를 직렬화하고, CI는 새 push로 진행 중인 배포를
취소하지 않습니다. 아카이브 이름도 배포마다 구분합니다.

서비스 중지 요청 이후 명령 실패나 SIGTERM, SIGHUP, SIGINT를 받으면 이전
릴리스로 복구합니다. SIGKILL이나 서버 자체 장애는 셸에서 복구할 수 없으므로
`current` 링크와 서비스 상태를 수동으로 확인해야 합니다.

릴리스는 조사와 롤백을 위해 자동 삭제하지 않습니다. 디스크 사용량을 확인하고,
현재 사용 중이거나 복구에 필요한 릴리스가 아닌 경우에만 삭제합니다.
준비 실패로 일부 파일만 남을 수 있으므로 재시도에는 새 릴리스 ID를 사용합니다.

## 검증

Python 3, bash, jq가 필요합니다.

```sh
bash -n scripts/deploy/server/stage-deploy.sh
python3 scripts/deploy/tests/test_stage_deploy.py
```

테스트는 서비스 제어와 HTTP 요청을 모의 처리하며 실제 서비스를 재시작하지 않습니다.
정상 배포, 헬스 체크 실패, 서비스 시작 실패, 필수 파일 누락, 손상된 아카이브를 검증합니다.
