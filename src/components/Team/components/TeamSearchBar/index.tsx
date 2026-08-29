import SearchIcon from 'assets/svg/Team/search.svg';
import styles from './TeamSearchBar.module.scss';

interface TeamSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function TeamSearchBar({ value, onChange, onSearch }: TeamSearchBarProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        aria-label="팀원 모집 검색"
        value={value}
        placeholder="검색어를 입력해주세요."
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.searchButton} type="button" aria-label="검색" onClick={onSearch}>
        <SearchIcon />
      </button>
    </div>
  );
}
