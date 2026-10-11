import type { ChangeEventHandler } from 'react';

import SearchIconGray from 'assets/svg/store/search-icon-gray.svg';

import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

// KOIN_ORDER_WEBVIEW pages/Search/components/SearchBar 이전
export default function SearchBar({ onChange }: SearchBarProps) {
  return (
    <div className={styles['search-bar']}>
      <SearchIconGray className={styles['search-bar__icon']} />
      <input
        type="text"
        placeholder="검색어를 입력해주세요."
        autoComplete="off"
        // eslint-disable-next-line jsx-a11y/no-autofocus -- 검색 화면 진입 즉시 입력하도록 오라클과 같이 포커스한다
        autoFocus
        className={styles['search-bar__input']}
        onChange={onChange}
      />
    </div>
  );
}
