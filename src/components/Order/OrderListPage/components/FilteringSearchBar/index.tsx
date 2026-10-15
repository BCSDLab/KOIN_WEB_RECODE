import { useState, type KeyboardEvent } from 'react';

import { cn } from '@bcsdlab/utils';
import ArrowDownIcon from 'assets/svg/Order/List/arrow-down-icon.svg';
import RefreshIcon from 'assets/svg/Order/List/refresh-icon.svg';
import SearchIconGray from 'assets/svg/Order/List/search-icon-gray.svg';
import useLockBodyScroll from 'components/Order/OrderListPage/hooks/useLockBodyScroll';
import Button from 'components/ui/Button';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import styles from './FilteringSearchBar.module.scss';

interface FilteringSearchBarProps {
  isScrolled: boolean;
  openFilter: () => void;
  isFiltered: boolean;
  onReset: () => void;
  onSearchConfirm: (keyword: string) => void;
  periodLabel: string;
  orderLabel: string;
  isPeriod: boolean;
  isOrder: boolean;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/FilteringSearchBar 이전. 탭 아래에 고정된 검색창·필터 칩.
// 검색어는 Enter로 확정하고, 검색창에 포커스가 있는 동안 아래 목록을 어둡게 가리고 스크롤을 막는다
export default function FilteringSearchBar({
  isScrolled,
  openFilter,
  isFiltered,
  onReset,
  onSearchConfirm,
  periodLabel,
  orderLabel,
  isPeriod,
  isOrder,
}: FilteringSearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [isSearchActive, activateSearch, deactivateSearch] = useBooleanState(false);

  useLockBodyScroll(isSearchActive);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchConfirm(keyword.trim());
      deactivateSearch();
    }
  };

  const handleCancel = () => {
    setKeyword('');
    onSearchConfirm('');
    deactivateSearch();
  };

  return (
    <div className={cn({ [styles.bar]: true, [styles['bar--scrolled']]: isScrolled })}>
      <div className={styles.search}>
        <div className={styles.search__box}>
          <SearchIconGray />
          <input
            type="text"
            placeholder="주문한 메뉴/매장을 찾아보세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={activateSearch}
            className={styles.search__input}
          />
        </div>
        {keyword && (
          <button type="button" onClick={handleCancel} className={styles.search__cancel}>
            취소
          </button>
        )}
      </div>

      {isSearchActive && (
        <button type="button" aria-label="검색 닫기" className={styles.dimmed} onClick={deactivateSearch} />
      )}

      <div className={styles.chips}>
        {isFiltered && (
          <Button size="sm" color="white" onClick={onReset} endIcon={<RefreshIcon />} className={styles.chips__chip}>
            초기화
          </Button>
        )}
        <Button
          size="sm"
          color={isFiltered && isPeriod ? 'primary' : 'white'}
          onClick={openFilter}
          endIcon={isFiltered && isPeriod ? <ArrowDownIcon fill="white" /> : <ArrowDownIcon />}
          className={styles.chips__chip}
        >
          {periodLabel}
        </Button>
        <Button
          size="sm"
          color={isFiltered && isOrder ? 'primary' : 'white'}
          onClick={openFilter}
          endIcon={isFiltered && isOrder ? <ArrowDownIcon fill="white" /> : <ArrowDownIcon />}
          className={styles.chips__chip}
        >
          {orderLabel}
        </Button>
      </div>
    </div>
  );
}
