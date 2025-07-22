import { type ChangeEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import { searchClub } from 'api/club';
import { ClubSearchResponse } from 'api/club/entity';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import RelateSearchItem from 'pages/Club/ClubListPage/components/RelateSearchItem/RelateSearchItem';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import SearchIcon from 'assets/svg/Club/search.svg';
import styles from './ClubSearchContainer.module.scss';

interface ClubSearchContainerProps {
  onClose?: () => void;
}

export default function ClubSearchContainer({ onClose }: ClubSearchContainerProps) {
  const navigate = useNavigate();

  const { searchParams, setParams } = useParamsHandler();
  const [searchValue, setSearchValue] = useState<string>(searchParams.get('clubName') ?? '');
  const [relateSearchItems, setRelateSearchItems] = useState<ClubSearchResponse | null>(null);

  const debouncedSearch = useDebounce(async (inputValue: string) => {
    if (inputValue.length === 0) {
      setRelateSearchItems(null);
      return;
    }
    const data = await searchClub(inputValue);
    setRelateSearchItems(data);
  }, 300);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    debouncedSearch(inputValue);
  }, [debouncedSearch]);

  const handleSearch = () => {
    const value = searchValue.trim();
    setParams('clubName', value, {
      deleteBeforeParam: !!searchParams.get('clubName'),
      replacePage: true,
    });
    if (onClose) onClose();
    setRelateSearchItems(null);
  };

  const handleDeleteButtonClick = () => {
    setSearchValue('');
    setParams('clubName', '', {
      deleteBeforeParam: true,
      replacePage: true,
    });
    setRelateSearchItems(null);
    if (onClose) onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles['search-bar-container']}>
        <div className={styles['search-bar__input-wrapper']}>
          <SearchIcon />
          <input
            className={styles['search-bar']}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleInputChange(e);
            }}
            type="text"
            name="search"
            placeholder="검색어를 입력해주세요"
            autoComplete="off"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
                setRelateSearchItems(null);
              }
            }}
          />
          <button
            className={styles['search-bar__delete-button']}
            type="button"
            aria-label="검색어 삭제"
            onClick={handleDeleteButtonClick}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className={styles.result}>
        {relateSearchItems?.keywords.map((item) => (
          <RelateSearchItem
            key={item.club_id}
            url={item.club_id ? `/club/${item.club_id}` : ''}
            content={item.club_name}
            onClick={() => {
              setParams('clubName', item.club_name, {
                deleteBeforeParam: !!searchParams.get('clubName'),
                replacePage: true,
              });
              navigate(ROUTES.ClubDetail({
                id: String(item.club_id),
                isLink: true,
              }));
            }}
          />
        ))}
      </div>
    </div>
  );
}
