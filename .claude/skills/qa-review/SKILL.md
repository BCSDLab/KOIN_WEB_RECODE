---
name: qa-review
description: KOIN 프로젝트 코드 변경사항의 품질을 검증하는 스킬. TypeScript 타입 정합성, KOIN 컨벤션 준수, SSR 안전성, 에러 핸들링 패턴을 경계면 교차 비교로 검증한다. 코드 검증, QA, 품질 확인, 리뷰, 수정 검토를 요청할 때 반드시 이 스킬을 사용할 것. 초기 코드 작성에는 사용하지 않는다.
---

# QA Review Skill

## 검증 철학

단순히 파일이 존재하는지 확인하지 않는다. **경계면을 교차로 검증한다:**
- API entity.ts의 응답 타입 ↔ queries.ts에서 사용하는 타입 일치?
- 컴포넌트 props 타입 ↔ 페이지에서 전달하는 값 일치?
- getServerSideProps의 prefetch 쿼리 키 ↔ 컴포넌트의 useQuery 키 일치?

## 검증 실행 순서

### 1단계: lint 실행
```bash
yarn lint:eslint
yarn lint:stylelint  # SCSS 변경이 있을 때
```

### 2단계: 타입 체크
```bash
# KOIN 프로젝트는 tsc를 단독 script로 노출하지 않음
# package.json의 build 스크립트(tsc && next build)를 활용하거나
# node_modules 내 tsc를 직접 호출
yarn dlx tsc --noEmit 2>&1 | head -50
```

### 3단계: 코드 패턴 검증

변경된 파일을 읽고 다음을 확인한다:

**에러 핸들링 패턴 확인:**
```bash
# mutation onError에 isKoinError 패턴이 없는 파일 탐색
grep -n "onError" src/api/[domain]/mutations.ts
# isKoinError가 있는지 확인
grep -n "isKoinError" src/api/[domain]/mutations.ts
```

**console.log 확인:**
```bash
grep -rn "console\.log" src/[changed-path]
```

**하드코딩된 경로 확인:**
```bash
grep -n "router\.push('/[^']*')" src/[changed-path]
```

**절대 경로 임포트 확인:**
```bash
grep -n "from '\.\./" src/[changed-path]
```

**SSR 안전성 확인 (window 접근):**
```bash
grep -n "window\." src/[changed-path]
# typeof window !== 'undefined' 체크 없이 직접 접근하는지 확인
```

## 이슈 분류 기준

CLAUDE.md `## PR Review Rules` 섹션의 기준을 그대로 따른다.

| 등급 | 기준 | 조치 |
|------|------|------|
| `[P0]` | 런타임 에러 유발, SSR 크래시, 타입 불일치로 데이터 오염 | PR 차단 |
| `[P1]` | KOIN 컨벤션 위반 (isKoinError 누락, console.log 잔존, 하드코딩) | 수정 권고 |
| `[P2]` | 코드 개선 제안, 최적화 기회 | 선택적 수정 |

## 검증 보고서 작성

이슈가 없을 때:
```json
{
  "lint_passed": true,
  "issues": [],
  "approved": true,
  "summary": "모든 검증 통과. P0/P1 이슈 없음."
}
```

이슈 발견 시:
```json
{
  "lint_passed": true,
  "issues": [
    {
      "severity": "[P1]",
      "file": "src/api/feature/mutations.ts",
      "line": 15,
      "message": "onError에 isKoinError() 타입 가드 누락",
      "suggestion": "if (isKoinError(error)) 패턴 적용"
    }
  ],
  "approved": false,
  "summary": "[P1] 이슈 1건 발견. 수정 후 재검증 필요."
}
```

## P0 이슈 패턴 예시

```typescript
// P0: SSR 크래시 — window 직접 접근
const width = window.innerWidth; // ❌

// 수정
const width = typeof window !== 'undefined' ? window.innerWidth : 0; // ✅

// P0: 타입 불일치 — any 캐스팅
const item = data as any; // ❌

// P0: SSRLayout을 클라이언트 전용 페이지에 사용
// (Suspense 없이 useQuery를 쓰는 컴포넌트가 SSRLayout 아래 있는 경우)
```
