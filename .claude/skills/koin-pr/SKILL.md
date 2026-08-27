---
name: koin-pr
description: Create KOIN_WEB_RECODE GitHub issues, branches, Korean conventional commits, and pull requests from the current worktree. Use when the user asks to create an issue, organize or split commits, publish changes, open a PR, or verify the auto-picked reviewer and PR checklist using this repository's issue templates, PR template, and GitHub Actions workflows.
---

# KOIN PR Publish

Publish the current `BCSDLab/KOIN_WEB_RECODE` work through the repository's issue, commit, and PR workflow.

## Read First

Read these files completely before acting:

- `.github/ISSUE_TEMPLATE/NEW_FEATURE.md`
- `.github/ISSUE_TEMPLATE/BUG_REPORT.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/PICK_REVIEWER.yml`
- `.github/workflows/CHECK_PR_MERGED.yml`
- `.github/workflows/LINT_CHECK.yml`
- `references/conventions.md`

Follow the body structures in `references/conventions.md` exactly.

## Important difference from other repos' PR skills

This repository has **no body-parsing automation**. Labels are not derived from issue or PR text, and issues do not auto-assign the author. Only two things happen automatically:

- `PICK_REVIEWER.yml` requests a reviewer when a PR is opened (org-shared workflow, not an assignee).
- `CHECK_PR_MERGED.yml` deletes the head branch and pings Slack when a PR merges — never delete the branch yourself after merge.

Apply labels explicitly with `--label` from the existing label set in `references/conventions.md`. Never invent a label.

## Workflow

1. Confirm repository context with `git rev-parse --show-toplevel`, `git remote -v`, `git status --short --branch`, and `gh repo view --json nameWithOwner,defaultBranchRef`.
2. Inspect the full diff and separate intended work from unrelated user changes. Never stage unrelated files.
3. Resolve the work type from `references/conventions.md` (feature, fix, refactor, test, docs, deploy, setting). Support multiple PR checklist items when the diff genuinely spans multiple categories.
4. Determine the domain bracket (`[캠퍼스]` / `[비즈니스]` / `[유저]` / `[공통]` / `[hotfix]`) per **Domain Classification** in `references/conventions.md`. If the change is genuinely ambiguous between domains, or you cannot tell whether it fits `캠퍼스`/`비즈니스`/`유저` at all, ask the user before proceeding — do not guess.
5. Reuse an existing issue when the current branch begins with `{type}/#{issue-number}/`, an issue already describes this work, or the user names one. Search with `gh issue list` before creating a new one. Otherwise create the issue first, unless the user explicitly asked for PR-only work on top of an existing issue.
6. Write the issue body to a temporary Markdown file using the exact structure in `references/conventions.md` (`NEW_FEATURE.md` shape for features, `BUG_REPORT.md` shape for bugs). Title it `[도메인] 설명`.
7. Create the issue with `gh issue create --title "[도메인] 설명" --body-file ...`. Pass `--label` only for labels that already exist in the repo (`gh label list`) and clearly apply — do not guess a domain label you are not confident about.
8. Create or reuse a branch named `{type}/#{issue-number}/{english-kebab-case}` (`{type}` = `feature`/`fix`/`refactor`/`test`/`docs`/`chore`; description in English). Base new work on the GitHub default branch, currently `develop` — hotfix branches target `main` instead.
9. Split changes into logical commits. Use `type: 한국어 설명` (Conventional Commit type, Korean description). Do not add a `Co-Authored-By` trailer or an AI-attribution footer to any commit — this repository's owner has explicitly asked for commits without them.
10. Run the validation commands required by `references/conventions.md`. Do not check a PR checklist item unless that command actually passed.
11. Push the current branch with upstream tracking.
12. Write the PR body to a temporary Markdown file from `.github/PULL_REQUEST_TEMPLATE.md`. Keep the `- Close #ISSUE_NUMBER` line at the top when an issue is linked; drop it only when there genuinely is no issue.
13. Open a PR against the GitHub default branch (`develop`, or `main` for a hotfix) with `gh pr create`. Title it `[도메인] 설명`, keeping the same domain bracket as the linked issue. Apply labels explicitly, same rule as step 7.
14. Wait briefly, then check that a reviewer was requested (`gh pr view --json reviewRequests`). If not, inspect the `Pick Reviewer` workflow run before falling back to `gh pr edit --add-reviewer`.
15. Do not delete the branch after merge — `CHECK_PR_MERGED.yml` handles that automatically.

## Safety Rules

- Check `gh auth status` before GitHub writes.
- Do not create duplicate issues or PRs. Search by current branch, issue number, and title first.
- Do not use `git add -A` in a mixed worktree. Stage explicit paths.
- Do not rewrite published history unless the user explicitly requests it. If required, use `git push --force-with-lease`, never plain `--force`.
- Do not apply a label unless it already exists in `gh label list` and is a confident match.
- Do not guess the `[캠퍼스]`/`[비즈니스]`/`[유저]` title bracket when it is genuinely ambiguous — ask the user instead.
- Preserve user changes outside the publishing scope.
- Use temporary files for generated issue and PR bodies; do not add them to the repository.
- Never add `Co-Authored-By` or similar AI-attribution lines to commits or PR bodies.

## Tool Preference

- Use local `git` for branch, staging, commit, and push operations.
- Use `gh` for issue/PR creation, label application, reviewer checks, and Actions run inspection.
- When network access is blocked, request approval and continue rather than stopping at a plan.

## Final Report

Report:

- issue URL and selected work type (or "no issue" if intentionally skipped)
- branch name
- commit SHAs and messages
- validation commands and results
- PR URL and base branch
- labels applied
- requested reviewer (or automation failure/fallback used)
