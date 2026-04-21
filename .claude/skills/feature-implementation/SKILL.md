---
name: feature-implementation
description: KOIN 프로젝트의 기능 구현 계획을 실제 코드로 작성하는 스킬. TypeScript, React, SCSS, React Query, Zustand 패턴을 정확히 따르며 코드를 생성한다. 기능 구현, 코드 작성, API 연동, 컴포넌트 생성을 요청할 때 반드시 이 스킬을 사용할 것. 단순 버그 수정에는 사용하지 않는다.
---

# Feature Implementation Skill

## 구현 순서

의존성 방향에 따라 순서를 지킨다:
1. `entity.ts` — 타입 정의 (다른 파일이 의존)
2. `APIDetail.ts` — API 클래스
3. `index.ts` — export
4. `queries.ts` / `mutations.ts` — React Query 훅
5. `hooks/use[Feature].ts` — 비즈니스 로직 훅
6. `[Component].tsx` + `[Component].module.scss` — UI
7. `src/pages/...` — 페이지 연결

## 파일별 코드 패턴

### entity.ts
```typescript
export interface FeatureItem {
  id: number;
  name: string;
  createdAt: string;
}

export interface FeatureListResponse {
  items: FeatureItem[];
  totalCount: number;
}

export interface CreateFeatureRequest {
  name: string;
}
```

### APIDetail.ts
```typescript
import { APIRequest } from 'utils/ts/apiClient';
import { HTTP_METHOD } from 'static/httpMethod';
import { FeatureListResponse, CreateFeatureRequest, FeatureResponse } from './entity';

export class GetFeatureList implements APIRequest<FeatureListResponse> {
  path = '/feature';
  method = HTTP_METHOD.GET;
  params: { page?: number; size?: number };
  auth = false;
}

export class PostFeature implements APIRequest<FeatureResponse> {
  path = '/feature';
  method = HTTP_METHOD.POST;
  data: CreateFeatureRequest;
  auth = true;
}
```

### index.ts
```typescript
import { APIClient } from 'utils/ts/apiClient';
import { GetFeatureList, PostFeature } from './APIDetail';

export const getFeatureList = APIClient.of(GetFeatureList);
export const postFeature = APIClient.of(PostFeature);
```

### queries.ts (React Query)
```typescript
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { getFeatureList } from '.';

export const useFeatureListQuery = (params: { page?: number }) =>
  useSuspenseQuery({
    queryKey: ['feature', 'list', params],
    queryFn: () => getFeatureList({ params }),
  });
```

### mutations.ts
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import { showToast } from 'utils/ts/showToast';
import { postFeature } from '.';

export const useCreateFeatureMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature', 'list'] });
      showToast('success', '생성되었습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '오류가 발생했습니다.');
      } else {
        showToast('error', '오류가 발생했습니다.');
      }
    },
  });
};
```

### 컴포넌트 패턴
```tsx
import React from 'react';
import { useLogger } from 'utils/hooks/analytics/useLogger';
import { useFeatureListQuery } from 'api/feature/queries';
import styles from './Feature.module.scss';

const loggingTitle = {
  CLICK_ITEM: 'feature_item_click',
};

export default function Feature() {
  const { logEvent } = useLogger();
  const { data } = useFeatureListQuery({});

  const handleItemClick = (id: number) => {
    logEvent({ team: 'feature', event_label: loggingTitle.CLICK_ITEM, value: String(id) });
    // 클릭 로직
  };

  return (
    <div className={styles.container}>
      {data.items.map(item => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleItemClick(item.id)}
          className={styles.item}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

### SCSS 패턴
```scss
// Feature.module.scss
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include media.media-breakpoint(mobile) {
    gap: 8px;
  }
}

.item {
  // BEM: .item__title, .item--active
}
```

### 페이지 패턴
```tsx
// src/pages/feature/index.tsx
import type { NextPage } from 'next';
import { Suspense } from 'react';
import Feature from 'components/Feature';

const FeaturePage: NextPage = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Feature />
  </Suspense>
);

export default FeaturePage;
```

## 임포트 순서 (ESLint 규칙)
```typescript
// 1. React/Next
import React, { useState } from 'react';
import type { NextPage } from 'next';
// 2. 외부 패키지
import { useMutation } from '@tanstack/react-query';
// 3. 내부 패키지
import { isKoinError } from '@bcsdlab/koin';
// 4. 절대 경로 (부모/형제)
import { useFeatureListQuery } from 'api/feature/queries';
import styles from './Feature.module.scss';
```

## SSR 구현 패턴

SSR이 필요한 페이지의 경우:
```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getFeatureList } from 'api/feature';

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['feature', 'list', {}],
    queryFn: () => getFeatureList({}),
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
```

## 자주 쓰는 유틸리티

```typescript
import { cn } from '@bcsdlab/utils';           // className 병합
import { ROUTES } from 'static/routes';         // 라우트
import { showToast } from 'utils/ts/showToast'; // 토스트
import { isKoinError } from '@bcsdlab/koin';    // 에러 타입 가드
```
