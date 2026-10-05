import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import ArticlesSearchEmptyState from 'components/Articles/components/ArticlesSearchEmptyState';
import ArticlesSearchResultList from 'components/Articles/components/ArticlesSearchResultList';
import HotSearchKeywords from 'components/Articles/components/HotSearchKeywords';
import RecentSearchKeywords from 'components/Articles/components/RecentSearchKeywords';
import { useRecentSearchKeywords } from 'components/Articles/hooks/useRecentSearchKeywords';
import styles from './ArticlesSearchPage.module.scss';

const HOT_KEYWORD_COUNT = 5;
const SEARCH_RESULT_LIMIT = 5;

export default function ArticlesSearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialQuery = typeof router.query.query === 'string' ? router.query.query : '';

  const [inputValue, setInputValue] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const { keywords: recentKeywords, addKeyword, removeKeyword, clearKeywords } = useRecentSearchKeywords();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: hotKeywordData } = useQuery(articleQueries.hotKeyword(HOT_KEYWORD_COUNT));

  const {
    data: searchData,
    hasNextPage,
    isFetchingNextPage,
    isPending: isSearchPending,
    fetchNextPage,
  } = useInfiniteQuery({
    ...articleQueries.search({ query: submittedQuery, limit: SEARCH_RESULT_LIMIT }),
    enabled: submittedQuery.length > 0,
  });

  const searchResultArticles = searchData?.pages.flatMap((page) => page.articles) ?? [];
  const hasSearched = submittedQuery.length > 0;
  const isSearchLoading = hasSearched && isSearchPending;
  const hasResults = searchResultArticles.length > 0;

  const submitSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    addKeyword(trimmed);
    setSubmittedQuery(trimmed);
    router.replace(
      { pathname: router.pathname, query: { query: trimmed } },
      undefined,
      { shallow: true },
    );
  };

  const handleKeywordSelect = (keyword: string) => {
    setInputValue(keyword);
    submitSearch(keyword);
  };

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <button
          type="button"
          className={styles['page__back-button']}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles.page__title}>공지글 검색</h1>
        <div className={styles['page__spacer']} />
      </div>

      <div className={styles.page__searchbar}>
        <div className={styles['page__search-pill']}>
          <input
            ref={inputRef}
            className={styles['page__search-input']}
            type="text"
            value={inputValue}
            placeholder="검색어를 입력해주세요."
            autoComplete="off"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitSearch(inputValue);
            }}
          />
          <button
            type="button"
            className={styles['page__search-button']}
            onClick={() => submitSearch(inputValue)}
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      <div className={styles.page__content}>
        {hasSearched ? (
          isSearchLoading ? null : hasResults ? (
            <ArticlesSearchResultList
              articles={searchResultArticles}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          ) : (
            <ArticlesSearchEmptyState />
          )
        ) : (
          <>
            <HotSearchKeywords keywords={hotKeywordData?.keywords ?? []} onKeywordClick={handleKeywordSelect} />
            <RecentSearchKeywords
              keywords={recentKeywords}
              onKeywordClick={handleKeywordSelect}
              onKeywordRemove={removeKeyword}
              onClearAll={clearKeywords}
            />
          </>
        )}
      </div>
    </div>
  );
}
