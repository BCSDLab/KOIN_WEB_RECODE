---
name: koin-pipeline
description: KOIN 프로젝트의 두 가지 AI 파이프라인을 조율하는 오케스트레이터 스킬. (1) SonarCloud 코드 품질 분석 → 이슈 수정 → PR 생성 파이프라인, (2) 기능 요구사항 분석 → 코드 구현 → 검증 → PR 생성 파이프라인을 자동으로 실행한다. "SonarCloud 분석해줘", "SonarCloud 이슈 수정해줘", "코드 품질 개선해줘", "기능 구현해줘", "새 기능 추가해줘", "PR 만들어줘", "파이프라인 실행", "다시 실행", "재실행", "이전 결과 개선", "업데이트" 등의 요청 시 반드시 이 스킬을 사용할 것.
---

# KOIN Pipeline Orchestrator

## Phase 0: 컨텍스트 확인

실행 시작 전 기존 작업 상태를 확인한다:

```bash
ls _workspace/ 2>/dev/null && echo "기존 작업 있음" || echo "신규 실행"
```

| 상태 | 액션 |
|------|------|
| `_workspace/` 없음 | 신규 실행 → Phase 1로 |
| `_workspace/` 있고 부분 수정 요청 | 부분 재실행 → 해당 Phase부터 |
| `_workspace/` 있고 새 입력 | `mv _workspace/ _workspace_prev/` 후 신규 실행 |

## 파이프라인 선택

사용자 요청을 분석하여 파이프라인을 선택한다:

| 요청 패턴 | 파이프라인 |
|-----------|-----------|
| "SonarCloud", "코드 품질", "정적 분석 이슈" | **파이프라인 A** (품질 개선) |
| "기능 구현", "새 기능", "[기능명] 만들어줘" | **파이프라인 B** (기능 구현) |

---

## 파이프라인 A: SonarCloud 코드 품질 개선

**실행 모드:** 서브 에이전트 (순차 파이프라인)

### A-1. SonarCloud Analyzer 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "sonarcloud-analyzer 에이전트 정의 파일(.claude/agents/sonarcloud-analyzer.md)을 읽고,
          sonarcloud-analysis 스킬(.claude/skills/sonarcloud-analysis/SKILL.md)을 사용하여
          SonarCloud 이슈를 조회하고 _workspace/01_analyzer_issues.json을 생성하라.
          [사용자 입력: {입력값}]"
)
```

A-1 완료 후 → A-2 실행

### A-2. Code Quality Fixer 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "code-quality-fixer 에이전트 정의 파일(.claude/agents/code-quality-fixer.md)을 읽고,
          code-quality-fix 스킬(.claude/skills/code-quality-fix/SKILL.md)을 사용하여
          _workspace/01_analyzer_issues.json의 이슈를 수정하라.
          수정 완료 후 _workspace/02_fixer_result.json을 생성하라."
)
```

A-2 완료 후 → A-3 실행

### A-3. QA Reviewer 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "qa-reviewer 에이전트 정의 파일(.claude/agents/qa-reviewer.md)을 읽고,
          qa-review 스킬(.claude/skills/qa-review/SKILL.md)을 사용하여
          _workspace/02_fixer_result.json의 changed_files를 검증하라.
          _workspace/03_qa_result.json을 생성하라."
)
```

QA 결과 확인:
- `approved: true` → A-4 실행
- `approved: false` (P0 이슈) → A-2로 재실행 요청

### A-4. PR Creator 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "pr-creator 에이전트 정의 파일(.claude/agents/pr-creator.md)을 읽고,
          github-pr-creation 스킬(.claude/skills/github-pr-creation/SKILL.md)을 사용하여
          _workspace/02_fixer_result.json과 _workspace/03_qa_result.json을 바탕으로
          PR 타입 'quality-fix'로 GitHub PR을 생성하라."
)
```

---

## 파이프라인 B: 기능 구현 자동화

**실행 모드:** 서브 에이전트 (순차 파이프라인)

### B-1. Feature Planner 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "feature-planner 에이전트 정의 파일(.claude/agents/feature-planner.md)을 읽고,
          feature-planning 스킬(.claude/skills/feature-planning/SKILL.md)을 사용하여
          다음 요구사항의 구현 계획을 수립하라:
          [요구사항: {입력값}]
          _workspace/01_planner_plan.md를 생성하라."
)
```

B-1 완료 후 → **계획 검토 요청** (사용자에게 계획 확인)

사용자 승인 후 → B-2 실행

### B-2. Feature Implementer 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "feature-implementer 에이전트 정의 파일(.claude/agents/feature-implementer.md)을 읽고,
          feature-implementation 스킬(.claude/skills/feature-implementation/SKILL.md)을 사용하여
          _workspace/01_planner_plan.md의 계획대로 코드를 구현하라.
          _workspace/02_implementer_result.json을 생성하라."
)
```

B-2 완료 후 → B-3 실행

### B-3. QA Reviewer 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "qa-reviewer 에이전트 정의 파일(.claude/agents/qa-reviewer.md)을 읽고,
          qa-review 스킬(.claude/skills/qa-review/SKILL.md)을 사용하여
          _workspace/02_implementer_result.json의 created_files와 modified_files를 검증하라.
          _workspace/03_qa_result.json을 생성하라."
)
```

QA 결과 확인:
- `approved: true` → B-4 실행
- `approved: false` (P0 이슈) → B-2로 재실행 (이슈 목록 전달)

### B-4. PR Creator 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "pr-creator 에이전트 정의 파일(.claude/agents/pr-creator.md)을 읽고,
          github-pr-creation 스킬(.claude/skills/github-pr-creation/SKILL.md)을 사용하여
          _workspace/02_implementer_result.json과 _workspace/03_qa_result.json을 바탕으로
          PR 타입 'feature'로 GitHub PR을 생성하라."
)
```

---

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| SonarCloud 연결 실패 | 환경변수 설정 안내 후 중단 |
| 이슈 수정 실패 | failed 목록 보고 후 성공 분만 PR |
| QA P0 이슈 (2회 이상 반복) | 중단하고 수동 수정 요청 |
| PR 생성 실패 | git 명령어와 gh CLI 명령어 수동 실행 안내 |

## 데이터 흐름

```
_workspace/
├── 01_analyzer_issues.json  (파이프라인 A) 또는
│   01_planner_plan.md       (파이프라인 B)
├── 02_fixer_result.json     (파이프라인 A) 또는
│   02_implementer_result.json (파이프라인 B)
└── 03_qa_result.json        (공통)
```

## 테스트 시나리오

### 정상 흐름 (파이프라인 A)
1. `SONAR_HOST_URL`, `SONAR_TOKEN` 환경변수 설정
2. "SonarCloud 분석해줘" 요청
3. → 이슈 조회 → 배치 생성 → 코드 수정 → QA → PR 생성

### 에러 흐름 (파이프라인 A)
1. `SONAR_TOKEN` 미설정
2. → Analyzer가 인증 실패 감지 → 설정 방법 안내 → 중단

### 정상 흐름 (파이프라인 B)
1. "기능 목록 페이지 만들어줘" 요청
2. → 계획 수립 → 사용자 승인 → 코드 구현 → QA → PR 생성
