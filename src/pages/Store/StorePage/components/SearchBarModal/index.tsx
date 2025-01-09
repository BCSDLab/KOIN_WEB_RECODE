import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelateSearch } from 'api/store';
import { RelatedSearchResponse } from 'api/store/entity';
import MobileSearchIcon from 'assets/svg/mobile-store-search-icon.svg';
import RelateSearchItem from 'pages/Store/StorePage/components/RelateSearchItem';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './SearchBarModal.module.scss';

interface SearchBarModalProps {
  onClose: () => void;
}
export default function SearchBarModal({ onClose }: SearchBarModalProps) {
  const storeRef = React.useRef<HTMLInputElement | null>(null);
  const { data: categories } = useStoreCategories();
  const [relateSearchItems, setRelateSearchItems] = useState<RelatedSearchResponse>();
  const { params, searchParams, setParams } = useParamsHandler();
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });
  useEffect(() => {
    storeRef.current?.focus();
  }, []);
  const debounceTimeout = useRef<null | NodeJS.Timeout>(null);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length === 0) setRelateSearchItems(undefined);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const data = await getRelateSearch(value);
      setRelateSearchItems(data);
    }, 200);
  }, []);
  return (
    <div className={styles['search-bar-modal__background']} ref={backgroundRef}>
      <div className={styles['search-bar-modal__container']}>
        <div className={styles['input-container']}>
          <input
            ref={storeRef}
            className={styles['search-bar-modal__input']}
            defaultValue={
              searchParams.get('storeName') === undefined
                ? ''
                : (searchParams.get('storeName') ?? '')
            }
            type="text"
            name="search"
            placeholder="검색어를 입력하세요"
            autoComplete="off"
            onChange={handleInputChange}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                const data = (await getRelateSearch(e.currentTarget.value)) || '';
                setRelateSearchItems(data);
                // setParams('storeName', e.currentTarget.value, {
                //   deleteBeforeParam: searchParams.get('storeName') === undefined,
                //   replacePage: true,
                // });
              }
            }}
            onFocus={() => {
              const currentCategoryId = Number(params.category) - 1; // 검색창에 포커스되면 로깅
              if (categories)
                logger.actionEventClick({
                  actionTitle: 'BUSINESS',
                  title: 'shop_categories_search',
                  value: `search in ${categories.shop_categories[currentCategoryId]?.name || '전체보기'}`,
                });
            }}
          />
          <button
            className={styles['search-bar-modal__icon']}
            type="button"
            onClick={async () => {
              const value = storeRef.current?.value ?? '';
              const data = await getRelateSearch(value);
              setRelateSearchItems(data);
              // setParams('storeName', storeRef.current?.value ?? '', {
              //   deleteBeforeParam: searchParams.get('storeName') === undefined,
              //   replacePage: true,
              // });
            }}
          >
            {isMobile ? (
              <div className={styles['search-icon']}>
                <MobileSearchIcon />
              </div>
            ) : (
              <img
                className={styles['search-icon']}
                src="https://static.koreatech.in/assets/img/search.png"
                alt="store_icon"
              />
            )}
          </button>
        </div>
        <div className={styles.result}>
          {relateSearchItems?.keywords?.map((item) => (
            <RelateSearchItem
              key={item.keyword}
              url={item.shop_id ? `/shop/${item.shop_id}` : null}
              content={item.keyword}
              onClick={() => {
                if (item.shop_id) {
                  navigate(`/store/${item.shop_id}`);
                } else {
                  setParams('shopIds', item.shop_ids.toString(), {
                    deleteBeforeParam: searchParams.get('shopIds') === undefined,
                    replacePage: true,
                  });
                  setParams('searchWord', item.keyword, {
                    deleteBeforeParam: searchParams.get('searchWord') === undefined,
                    replacePage: true,
                  });
                  setParams('category', '1', {
                    deleteBeforeParam: false,
                    replacePage: true,
                  });
                  if (!isMobile && storeRef.current) {
                    storeRef.current.value = '';
                    setRelateSearchItems(undefined);
                  }
                }
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
