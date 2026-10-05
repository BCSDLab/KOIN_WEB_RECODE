import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDebounce } from 'utils/hooks/debounce/useDebounce';

const SEARCH_DEBOUNCE_MS = 300;

const getKeyword = (value: string | string[] | undefined) => (typeof value === 'string' ? value : '');

// 검색어는 URL(`?keyword=`)이 단일 출처이고, 입력창 값만 따로 둔다
export default function useKeywordSearch() {
  const router = useRouter();
  const keyword = getKeyword(router.query.keyword);
  const [searchValue, setSearchValue] = useState(keyword);
  const [isSyncedWithUrl, setIsSyncedWithUrl] = useState(router.isReady);

  // 정적 페이지는 하이드레이션 때 쿼리 문자열이 비어 있어, 라우터가 준비되면 입력창을 URL 검색어로 한 번 맞춘다
  if (router.isReady && !isSyncedWithUrl) {
    setIsSyncedWithUrl(true);
    setSearchValue(keyword);
  }

  const replaceKeyword = useDebounce((value: string) => {
    const nextQuery = { ...router.query };
    if (value) {
      nextQuery.keyword = value;
    } else {
      delete nextQuery.keyword;
    }

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true, scroll: false });
  }, SEARCH_DEBOUNCE_MS);

  const changeSearchValue = (value: string) => {
    setSearchValue(value);
    replaceKeyword(value.trim());
  };

  return { searchValue, keyword, changeSearchValue };
}
