import {
  type ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import { searchClub } from 'api/club';
import type { ClubSearchResponse } from 'api/club/entity';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import RelateSearchItem from 'pages/Club/ClubListPage/components/RelateSearchItem/RelateSearchItem';
import styles from './ClubSearchBarModal.module.scss';

interface ClubSearchBarModalProps {
  onClose: () => void;
}

export default function ClubSearchBarModal({ onClose }: ClubSearchBarModalProps) {
  const clubRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [relateSearchItems, setRelateSearchItems] = useState<ClubSearchResponse>();
  const { searchParams, setParams } = useParamsHandler();
  const navigate = useNavigate();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });
  useEffect(() => {
    clubRef.current?.focus();
  }, []);

  const debounceTimeout = useRef<null | NodeJS.Timeout>(null);
  const handleInputChange = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      if (inputValue.length === 0) {
        setRelateSearchItems(undefined);
        return;
      }
      const data = await searchClub(inputValue);
      setRelateSearchItems(data);
    }, 200);
  }, []);

  const handleSearch = () => {
    const value = clubRef.current?.value ?? '';
    setParams('clubName', value, {
      deleteBeforeParam: searchParams.get('clubName') === undefined,
      replacePage: true,
    });
    onClose();
    setRelateSearchItems(undefined);
  };

  return (
    <div className={styles['search-bar-modal__background']} ref={backgroundRef}>
      <div
        ref={containerRef}
        className={styles['search-bar-modal__container']}
      >
        <div className={styles['input-container']}>
          <input
            ref={clubRef}
            className={styles['search-bar-modal__input']}
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
              }
            }}
          />
        </div>
        <div className={styles.result}>
          {relateSearchItems?.keywords.map((item) => (
            <RelateSearchItem
              key={item.club_id}
              url={item.club_id ? `/club/${item.club_id}` : ''}
              content={item.club_name}
              onClick={() => {
                setParams('clubName', item.club_name, {
                  deleteBeforeParam: searchParams.get('clubName') === undefined,
                  replacePage: true,
                });
                onClose();
                navigate(ROUTES.ClubDetail({
                  id: String(item.club_id),
                  isLink: true,
                }));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
