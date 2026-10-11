import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { useDebounce } from 'utils/hooks/debounce/useDebounce';

import SearchBar from './components/SearchBar';
import SearchResultList from './components/SearchResultList';
import styles from './StoreSearchPage.module.scss';

const SEARCH_DEBOUNCE_MS = 200;

// KOIN_ORDER_WEBVIEW pages/Search 이전. 입력 후 200ms 뒤 키워드로 연관 검색어를 조회한다
export default function StoreSearchPage() {
  const [keyword, setKeyword] = useState('');
  const handleChange = useDebounce((event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }, SEARCH_DEBOUNCE_MS);

  return (
    <div className={styles.page}>
      <SearchBar onChange={handleChange} />
      {keyword && <SearchResultList keyword={keyword} />}
    </div>
  );
}
