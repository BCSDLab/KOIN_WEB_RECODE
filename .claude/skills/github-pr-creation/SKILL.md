---
name: github-pr-creation
description: KOIN 프로젝트의 코드 변경사항을 git 커밋하고 GitHub Pull Request를 생성하는 스킬. 브랜치 생성, 커밋, gh CLI를 통한 PR 작성을 담당한다. PR 생성, GitHub PR 작성, 브랜치 커밋, 풀 리퀘스트를 요청할 때 반드시 이 스킬을 사용할 것. 코드 작성이나 수정에는 사용하지 않는다.
---

# GitHub PR Creation Skill

## 사전 확인

```bash
# 현재 브랜치 확인
git branch --show-current

# git 상태 확인
git status

# gh CLI 인증 확인
gh auth status
```

## 브랜치 생성 및 전환

```bash
# develop에서 분기
git checkout develop
git pull origin develop

# 브랜치 생성
git checkout -b feature/[기능명-kebab-case]
# 또는
git checkout -b fix/sonarcloud-quality-$(date +%Y%m%d)
```

## 커밋 규칙

컨벤셔널 커밋 형식:
```
feat: [기능명] 추가
fix: [이슈] 수정
refactor: [대상] 리팩토링
style: 코드 스타일 수정 (SonarCloud 이슈 해결)
chore: 기타 변경사항
```

```bash
# 특정 파일만 스테이징 (git add -A 금지)
git add src/components/Feature/index.tsx
git add src/api/feature/

# 커밋
git commit -m "feat: 기능명 추가

- APIDetail.ts: GetFeatureList, PostFeature 클래스 추가
- queries.ts: useFeatureListQuery 훅 추가
- Feature/index.tsx: 목록 컴포넌트 구현"
```

## PR 생성 (gh CLI)

```bash
# PR 생성
gh pr create \
  --base develop \
  --title "[기능] 기능명 추가" \
  --body "$(cat <<'EOF'
## 개요
[기능 설명 1~2줄]

## 변경 사항
### 신규 파일
- `src/api/feature/APIDetail.ts` — API 클래스 정의
- `src/components/Feature/index.tsx` — 목록 컴포넌트

### 수정 파일
- `src/pages/feature/index.tsx` — 컴포넌트 연결

## 테스트 방법
1. `yarn start` 실행
2. `/feature` 페이지 접근
3. 목록 조회 확인

## 체크리스트
- [x] yarn lint 통과
- [x] SSR 안전성 확인
- [x] 에러 핸들링 패턴 적용 (isKoinError)
- [x] 분석 로깅 포함

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
EOF
)"
```

## PR 생성 후

```bash
# PR URL 확인
gh pr view --web

# PR 번호 확인
gh pr list --state open | head -5
```

## 주의사항

- `.env`, `.env.local`, 시크릿 파일 절대 커밋 금지
- `yarn.lock` 변경 없이 lock 파일만 건드리지 않음
- `src/generated/` 파일은 변경하지 않음 (자동 생성 파일)
- `_workspace/` 디렉토리는 PR에 포함하지 않음 (`.gitignore`에 추가)

## 브랜치 정리

PR 머지 후:
```bash
git checkout develop
git branch -d feature/[기능명]
```
