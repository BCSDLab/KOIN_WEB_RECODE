import { cn } from '@bcsdlab/utils';
import SearchIcon from 'assets/svg/common/purple-search.svg';

import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  label: string;
  placeholder?: string;
  size?: 'small' | 'medium';
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  label,
  placeholder = '검색어를 입력해주세요.',
  size = 'medium',
}: SearchBarProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div
      className={cn({
        [styles['search-bar']]: true,
        [styles['search-bar--small']]: size === 'small',
      })}
    >
      <input
        className={styles['search-bar__input']}
        type="text"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      {onSearch ? (
        <button type="button" className={styles['search-bar__button']} aria-label="검색" onClick={onSearch}>
          <SearchIcon className={styles['search-bar__icon']} aria-hidden />
        </button>
      ) : (
        <SearchIcon className={styles['search-bar__icon']} aria-hidden />
      )}
    </div>
  );
}
