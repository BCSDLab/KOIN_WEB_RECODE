# KOIN_WEB_RECODE GitHub Conventions

## Repository

- Repository: `BCSDLab/KOIN_WEB_RECODE`
- Default PR base: read with `gh repo view --json defaultBranchRef`; currently `develop`. Hotfix branches target `main` instead.
- Issue templates (legacy `.md` templates, not YAML forms — no automatic label from frontmatter):
  - `.github/ISSUE_TEMPLATE/NEW_FEATURE.md`
  - `.github/ISSUE_TEMPLATE/BUG_REPORT.md`
- PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- Automation:
  - `.github/workflows/PICK_REVIEWER.yml` — requests a reviewer on PR open (org-shared `BCSDLab/.github` workflow). Does not assign anyone, does not touch labels.
  - `.github/workflows/CHECK_PR_MERGED.yml` — deletes the head branch and posts a Slack notification when a PR merges. Never delete the branch manually.
  - `.github/workflows/LINT_CHECK.yml` — runs ESLint and `tsc --noEmit` on PRs targeting `main`/`develop` (develop push itself is gated by `deploy.yml`'s verify job instead).

There is no workflow that reads issue or PR body text to apply labels or assignees. Apply labels yourself with `gh issue create --label` / `gh pr create --label`, only from the set in **Labels** below, only when confident.

## Work Type Mapping

| Work type | Issue template | Commit type | Closest existing label |
| --- | --- | --- | --- |
| feature | `NEW_FEATURE.md` | `feat` | `✨ Feature` |
| fix | `BUG_REPORT.md` | `fix` | `🐞 BugFix` |
| refactor | `NEW_FEATURE.md` (repurposed) | `refactor` | `🔨 Refactor` |
| test | `NEW_FEATURE.md` (repurposed) | `test` | `✅ Test` |
| docs | `NEW_FEATURE.md` (repurposed) | `docs` | `📃 Docs` |
| deploy | — (no issue needed) | `chore` | `🌏 Deploy` |
| setting | `NEW_FEATURE.md` (repurposed) | `chore` | `⚙ Setting` |

Choose:

- `feature` for user-visible behavior, new pages, new UI, or new API integration.
- `fix` for broken or unexpected behavior — use the bug issue template.
- `refactor` when behavior stays the same and structure improves.
- `test` for test code or test infrastructure.
- `docs` for documentation-only changes.
- `deploy` for deployment workflow or release infrastructure changes made through this skill (still gets an issue and branch like any other change). The periodic `[배포] YYYY.MM.DD ... 배포` release-cut PRs (`develop` → `main`) seen in history are a separate manual release process, not something this skill creates.
- `setting` for dependencies, tooling, project configuration, or development environment changes.

For mixed work, pick one primary type for the commit prefixes and issue, but apply every label that clearly applies.

## Labels

Only apply labels that exist in this repository (`gh label list`). Work-type labels:

```text
✨ Feature   기능 개발
🐞 BugFix    버그 수정
🔨 Refactor  코드 리팩토링
✅ Test      Test 관련
📃 Docs      문서 작성 및 수정
🌏 Deploy    배포 관련 사항
⚙ Setting   개발 환경 세팅
```

Domain labels — apply only when the change clearly and entirely belongs to one domain, never as a guess:

```text
👤 User       유저, 시간표 도메인
💼 Business   주변상점, 복덕방 도메인
🎓 Campus     학교식단, 버스, 커뮤니티 도메인
📬 API        서버 API 통신
🖌 UI         UI 개발
❗QA issue    QA 이슈
📊DA          데이터 분석
🕸️ platform   플랫폼
```

## Domain Classification

Both the issue title and the PR title carry a domain bracket. There are exactly five values:

| Bracket | Scope |
| --- | --- |
| `[캠퍼스]` | 식단, 버스, 게시물(공지·분실물), 교내 시설물, 부서정보, 팀원 모집 등 — 대부분의 학교/캠퍼스 생활 기능 |
| `[비즈니스]` | 주변상점, 사장님(업주) 관련 기능 |
| `[유저]` | 회원가입, 로그인, 유저 프로필 등 인증/인가 관련 + 시간표 |
| `[공통]` | 위 세 도메인 어디에도 명확히 속하지 않는 작업 (전역 설정, 배포, 공용 유틸/컴포넌트, 여러 도메인에 걸친 변경 등) |
| `[hotfix]` | `main`을 베이스로 하는 hotfix 브랜치/PR. 도메인 대괄호 대신 이 값을 쓴다 |

Classification procedure:

1. If the branch targets `main` as a hotfix, use `[hotfix]` regardless of domain — skip the rest of this procedure.
2. Otherwise, check whether the change clearly and entirely matches `캠퍼스`, `비즈니스`, or `유저` per the table above.
3. If it clearly matches exactly one of those three, use that bracket.
4. If it clearly matches none of the three (e.g. pure `.claude/` skill config, CI/deploy config, a shared UI primitive with no domain owner), use `[공통]` — no need to ask.
5. If it is genuinely ambiguous between two domains, or you cannot tell whether it belongs to `캠퍼스`/`비즈니스`/`유저` at all, **ask the user** which bracket to use instead of guessing. Do not silently default to `[공통]` in this case.

This bracket is independent of the GitHub domain labels (`🎓 Campus` / `💼 Business` / `👤 User`) in **Labels** below — apply both when they agree; the label is optional and separate from the title text.

## Titles

Both issue and PR titles use the same shape:

```text
[도메인] 설명
```

e.g. `[캠퍼스] 팀원 모집 기본 구조 및 메인 UI 골격 구현`, `[유저] 로그인/회원가입 리디자인 적용`, `[비즈니스] 주변상점 리뷰 신고 기능 추가`, `[공통] Sentry 운영 모니터링 기반 추가`, `[hotfix] 배포 직후 stale buildId 오류 수정`.

Do not use a Conventional Commit prefix (`feat:`, `fix:`) as an issue or PR title — that style is reserved for commit messages only.

When a PR closes an issue, keep the same domain bracket as the issue; the description after the bracket may be phrased slightly differently to fit the PR's actual final scope, but the bracket itself must match.

## Branches

One pattern only:

```text
{type}/#{issue-number}/{english-kebab-case}
```

`{type}` is one of `feature`, `fix`, `refactor`, `test`, `docs`, `chore` (use `chore` for both `deploy` and `setting` work types). The description segment is in **English**, kebab-case, concise.

Examples:

```text
feature/#1328/team-recruitment-profile-entry
fix/#1324/graduation-calculator-entry-removal
chore/#1319/sentry-koin-error-dedup
```

This skill creates the issue first (see **Issue Creation** below) if one does not already exist, so an issue number is always available before branching. If the current branch already starts with `{type}/#{issue-number}/`, reuse that issue instead of creating another one.

## Issue Creation

Write feature issue bodies with the exact `NEW_FEATURE.md` structure:

```markdown
## Feature Name

팀원 모집 기본 화면 및 관련 기능을 구현합니다.

## Progress

- [ ] 팀원 모집 기본 화면 구현
- [ ] 알림 화면 구현

## Design Screenshot

## Precautions

- 현재 일부 화면의 디자인이 완료되지 않아, 확정된 디자인을 기준으로 우선 작업합니다.
```

Write bug issue bodies with the exact `BUG_REPORT.md` structure:

```markdown
## Describe the bug

로그인 실패 메시지가 표시되지 않습니다.

## To Reproduce

1. 잘못된 비밀번호로 로그인
2. 로그인 버튼 클릭

## Expected behavior

오류 메시지가 표시되어야 합니다.

## Screenshot

## Environment

**Desktop:**
- OS: macOS
- Browser: Chrome
- Version: 128

**Smartphone:**
- Device: iPhone 15
- OS: iOS 18
- Browser: Safari
- Version: 18.0
```

Include at least one Progress item for feature issues, and fill every required section for bug issues.

Create with:

```bash
gh issue create --title "[도메인] 설명" --body-file /tmp/issue-body.md --label "✨ Feature"
```

Do not pass `--assignee`; this repository does not auto-assign issue authors, and this skill does not either unless the user asks.

## Commits

- Use `type: 한국어 설명`.
- Split by logical behavior or independently reviewable concern.
- Keep generated files with the source change that requires them.
- Keep broad formatting or dependency churn separate when it is intentional.
- Do not make an empty cleanup commit solely to increase commit count.
- Never add a `Co-Authored-By` trailer or any AI-attribution line.

Examples:

```text
feat: 팀원 모집 프로필 진입점 페이지 구현
fix: 프로필 카드 아바타 아이콘 교체
chore: 팀원 모집 아이콘 자산 추가
```

## Validation

Always run:

```bash
yarn lint
yarn typecheck
```

Also run `yarn build` when changes affect:

- routing, layouts, `getServerSideProps`, or server/client boundaries
- dependencies or the Yarn PnP lockfile/cache (`.pnp.cjs`, `.yarn/cache`)
- Next.js, TypeScript, or build configuration

A `yarn build` failure caused by missing `NEXT_PUBLIC_API_PATH` (prerender hitting `localhost:80`) is an environment limitation, not a code defect — do not block on it, but do not silently check the checklist item either; note it in the report instead. If dependencies changed, commit the resulting `.pnp.cjs` and `.yarn/cache` changes (Zero-Install) alongside the change that needed them.

Never check a PR checklist item for a command that was not run successfully.

## PR Creation

Start from `.github/PULL_REQUEST_TEMPLATE.md` and write the completed body to a temporary Markdown file. Preserve this structure:

```markdown
- Close #1332

## What is this PR? 🔍

- 기능 : 팀원 모집 프로필 진입점 페이지
- issue : #1332

## Changes 📝

- `/team/profile` 페이지 및 `ProfileMenuCard` 컴포넌트 추가
- 프로필 있음/없음 두 상태에 대한 Figma 디자인 반영

## ScreenShot 📷

<!-- UI 변경이 있는 경우 Before / After 스크린샷을 첨부해주세요. -->

## Test CheckList ✅

- [ ] 프로필 없음 상태에서 빈 상태 카드가 노출되는지 확인
- [ ] 프로필 있음 상태에서 닉네임/학과/학번이 노출되는지 확인
- [ ] 모바일 뷰포트에서 레이아웃이 Figma와 일치하는지 확인

## Precaution

- 데스크탑 디자인은 아직 없어 모바일 전용으로 구현했습니다.

## ✔️ Please check if the PR fulfills these requirements

- [x] It's submitted to the correct branch, not the `develop` branch unconditionally?
- [ ] If on a hotfix branch, ensure it targets `main`?
- [x] There are no warning message when you run `yarn lint`
```

Drop the `- Close #ISSUE_NUMBER` line only when there genuinely is no linked issue. Only check the hotfix line when the branch actually targets `main`. Only check the `yarn lint` line when it was actually run and passed.

Use `[도메인] 설명` as the PR title per **Titles** above, keeping the same domain bracket as the linked issue. Open against the repository default branch (`develop`), or `main` for a hotfix.

## Verification

After PR creation:

1. Wait briefly for the `Pick Reviewer` workflow.
2. Inspect with `gh pr view --json reviewRequests,labels,url`.
3. If no reviewer was requested, inspect the recent `Pick Reviewer` Actions run before applying a manual fallback (`gh pr edit --add-reviewer <login>`).
4. Report whether automation or a manual fallback produced the final state.
