import {
  type ChangeEvent, useCallback, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import { searchClub } from 'api/club';
import { ClubSearchResponse } from 'api/club/entity';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import RelateSearchItem from 'pages/Club/ClubListPage/components/RelateSearchItem/RelateSearchItem';
import styles from './ClubSearchContainer.module.scss';

interface ClubSearchContainerProps {
  onClose?: () => void;
}

export default function ClubSearchContainer({ onClose }: ClubSearchContainerProps) {
  const navigate = useNavigate();
  const clubRef = useRef<HTMLInputElement | null>(null);

  const { searchParams, setParams } = useParamsHandler();
  const [relateSearchItems, setRelateSearchItems] = useState<ClubSearchResponse>();

  const debouncedSearch = useDebounce(async (inputValue: string) => {
    if (inputValue.length === 0) {
      setRelateSearchItems(undefined);
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
    const value = clubRef.current?.value ?? '';
    setParams('clubName', value, {
      deleteBeforeParam: searchParams.get('clubName') === undefined,
      replacePage: true,
    });
    if (onClose) onClose();
    setRelateSearchItems(undefined);
  };

  return (
    <div className={styles.container}>
      <input
        ref={clubRef}
        className={styles['search-bar']}
        defaultValue={
              searchParams.get('clubName') === undefined ? '' : searchParams.get('clubName') ?? ''
            }
        type="text"
        name="search"
        placeholder="검색어를 입력해주세요"
        autoComplete="off"
        onChange={handleInputChange}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
            setRelateSearchItems(undefined);
          }
        }}
      />
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
