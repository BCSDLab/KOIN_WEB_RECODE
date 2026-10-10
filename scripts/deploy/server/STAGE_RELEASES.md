# Stage releases

`stage-deploy.sh <archive> <unique-release-id> <commit-sha>` prepares a complete
runtime in `/usr/local/koin/stage/releases/<id>`. It stops the single service,
atomically replaces `current`, starts the service and checks environment/release.
A failed activation restores the previous release and checks recovery. A failed
preparation leaves the running service untouched. This is not zero downtime.

Before the first deployment, copy the existing runtime (including `.env`, `.next`,
`public`, `.yarn`, PnP files and config) into an initial release without changing
its files. Create `current` pointing to it and add a systemd drop-in:

```ini
[Service]
WorkingDirectory=/usr/local/koin/stage/current
ExecStart=
ExecStart=/home/ubuntu/.nvm/versions/node/v24.14.1/bin/node /usr/local/koin/stage/current/.yarn/releases/yarn-4.17.0.cjs start:serve -p 3000
```

Reload systemd, restart stage and verify `/api/health?environment=stage`, including
the release SHA. Retain the previous service settings and runtime for rollback.
Coordinate this one-time migration with CI: old scripts still overwrite the root.
Do not run the old script after migration. Production settings are unchanged.

Deployments use `flock` and CI is not cancelled by a subsequent push. SIGTERM,
SIGHUP, SIGINT and command failures trigger rollback after stop is requested.
SIGKILL or host failure cannot be recovered by a shell trap; check `current` and
service state manually in those cases. Releases are retained for investigation;
monitor disk usage and remove obsolete releases only after confirming they are
neither current nor required for rollback. Preparation failures may leave a
partial release; use a new ID when retrying.

Validation (Python 3, bash, jq):

```sh
bash -n scripts/deploy/server/stage-deploy.sh
python3 scripts/deploy/tests/test_stage_deploy.py
```

Tests replace service control and HTTP calls; no real service is restarted.
