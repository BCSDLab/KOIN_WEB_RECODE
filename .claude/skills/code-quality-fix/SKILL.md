---
name: code-quality-fix
description: SonarCloud 이슈를 KOIN 프로젝트 컨벤션에 맞게 수정하는 스킬. TypeScript 타입 오류, React 패턴 개선, 보안 이슈 수정 방법을 제공한다. SonarCloud 이슈 수정, 코드 품질 개선, 정적 분석 이슈 해결을 요청할 때 반드시 이 스킬을 사용할 것. 새 기능 구현에는 사용하지 않는다.
---

# Code Quality Fix Skill

## KOIN 프로젝트 수정 원칙

수정은 항상 최소 범위로 한다 — 이슈를 해결하는 데 필요한 변경만, 그 이상은 하지 않는다.

## 자주 발생하는 SonarCloud 이슈 수정 패턴

### TypeScript 관련

**미사용 변수/임포트 제거**
```typescript
// 이전 (typescript:S1128)
import { useState, useEffect } from 'react'; // useEffect 미사용

// 수정
import { useState } from 'react';
```

**타입 단언 대신 타입 가드 사용**
```typescript
// 이전 (typescript:S4325)
const value = someValue as string;

// 수정
if (typeof someValue === 'string') {
  const value = someValue;
}
```

**null 체크 누락**
```typescript
// 이전
const name = user.profile.name;

// 수정
const name = user.profile?.name ?? '';
```

### React 관련

**useEffect 의존성 배열 누락**
```typescript
// 이전
useEffect(() => {
  fetchData(id);
}, []); // id 누락

// 수정
useEffect(() => {
  fetchData(id);
}, [id]);
```

**Key prop 누락**
```tsx
// 이전
{items.map(item => <Item data={item} />)}

// 수정
{items.map(item => <Item key={item.id} data={item} />)}
```

### KOIN 특수 패턴 적용

**에러 핸들링 패턴**
```typescript
// 이전 (패턴 불일치)
onError: (error: unknown) => {
  showToast('error', (error as any).message);
}

// 수정
onError: (error) => {
  if (isKoinError(error)) {
    showToast('error', error.message || '오류가 발생했습니다.');
  } else {
    showToast('error', '오류가 발생했습니다.');
  }
}
```

**console.log 제거**
```typescript
// 이전
console.log('data:', data);

// 수정: 제거 (디버깅용 로그는 완전 삭제)
// 에러 추적이 필요하면: console.error('...') 또는 Sentry 사용
```

**하드코딩된 경로 → ROUTES 사용**
```typescript
// 이전
router.push('/store/123');

// 수정
router.push(ROUTES.StoreDetail({ id: '123' }));
```

## lint 실행 방법

```bash
# 전체 lint
yarn lint

# ESLint만
yarn lint:eslint

# 특정 파일만
yarn lint:eslint src/components/Store/StoreDetail.tsx
```

## 수정 완료 확인 체크리스트

- [ ] `yarn lint:eslint` 통과
- [ ] TypeScript 타입 오류 없음 (`tsc --noEmit`)
- [ ] 기능 변경 없음 (수정 전후 동작 동일)
- [ ] KOIN 특수 패턴 준수 (isKoinError, ROUTES, COOKIE_KEY)

## 수정 불가 판단 기준

다음 경우 수정을 포기하고 failed 목록에 추가한다:
- 수정이 비즈니스 로직 변경을 요구할 때
- 타입 구조를 근본적으로 바꿔야 할 때
- 다른 파일에 연쇄적인 영향이 클 때
