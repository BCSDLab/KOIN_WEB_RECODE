import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CloseIcon from 'assets/svg/Articles/close.svg';
import FilterIcon from 'assets/svg/Articles/filter.svg';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import PencilIcon from 'assets/svg/Articles/pencil.svg';
import LostItemFilterModal, { FilterState } from 'components/Articles/components/LostItemFilterModal';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { buildQueryFromFilter, LostItemParams, parseLostItemQuery } from 'components/Articles/utils/lostItemQuery';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  const { logItemWriteClick, logFindUserWriteClick, logLostItemWriteClick, logLoginRequire } = useArticlesLogger();
  const router = useRouter();

  const [isWriting, setIsWriting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const portalManager = useModalPortal();
  const { data: userInfo } = useUser();

  const handleWritingButtonClick = () => {
    if (userInfo) {
      setIsWriting((prev) => !prev);
      if (!isWriting) {
        logItemWriteClick();
      }
    } else {
      portalManager.open((portalOption) => (
        <LoginRequiredModal
          title="게시글을 작성하기"
          description="로그인 후 분실물 주인을 찾아주세요!"
          onClose={portalOption.close}
          onLoginClick={() => logLoginRequire('게시글 작성 팝업')}
        />
      ));
    }
  };

  const fallback: LostItemParams = {
    page: 1,
    type: null,
    category: [],
    foundStatus: 'ALL',
    sort: 'LATEST',
    author: 'ALL',
  };

  const params = parseLostItemQuery(router.query, fallback);

  const initialFilter: FilterState = {
    author: params.author,
    type: params.type ?? 'ALL',
    category: params.category,
    foundStatus: params.foundStatus,
  };

  return (
    <div className={`${styles.links} ${isWriting ? styles['links--active'] : ''}`}>
      <button type="button" className={styles.links__filter} onClick={() => setIsFilterOpen((p) => !p)}>
        필터
        <FilterIcon />
      </button>

      {isFilterOpen && (
        <div className={styles.filterPopover}>
          <LostItemFilterModal
            initialFilter={initialFilter}
            onClose={() => setIsFilterOpen(false)}
            onApply={(filter) => {
              if (filter.author === 'MY' && !userInfo) {
                portalManager.open((portalOption) => (
                  <LoginRequiredModal
                    title="내 게시물을 보기"
                    description="내가 작성한 게시물을 보려면 로그인이 필요해요."
                    onClose={portalOption.close}
                  />
                ));
                return;
              }

              const nextQuery = buildQueryFromFilter(filter, {
                page: 1,
                sort:
                  (Array.isArray(router.query.sort) ? router.query.sort[0] : router.query.sort) === 'OLDEST'
                    ? 'OLDEST'
                    : 'LATEST',
              });

              router.push({ pathname: router.pathname, query: nextQuery });
              setIsFilterOpen(false);
            }}
          />
        </div>
      )}

      {isWriting && (
        <div
          className={styles.overlay}
          role="button"
          tabIndex={0}
          aria-label="오버레이"
          onClick={() => setIsWriting(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsWriting(false);
            }
          }}
        />
      )}
      <div className={`${styles.links} ${isWriting ? styles['links--active'] : ''}`}>
        {isWriting && (
          <div className={styles['links__writing-options']}>
            <Link
              className={styles['links__option-button']}
              href={ROUTES.LostItemFound()}
              onClick={() => logFindUserWriteClick()}
            >
              <FoundIcon />
              <div className={styles['links__option-text']}>주인을 찾아요</div>
            </Link>

            <Link
              className={styles['links__option-button']}
              href={ROUTES.LostItemLost()}
              onClick={() => logLostItemWriteClick()}
            >
              <LostIcon />
              <div className={styles['links__option-text']}>잃어버렸어요</div>
            </Link>
          </div>
        )}

        <button className={styles.links__write} type="button" onClick={handleWritingButtonClick}>
          {isWriting ? <CloseIcon /> : <PencilIcon />}
          글쓰기
        </button>
      </div>
    </div>
  );
}
