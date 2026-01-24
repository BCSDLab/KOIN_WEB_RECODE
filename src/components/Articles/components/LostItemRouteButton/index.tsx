import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CloseIcon from 'assets/svg/Articles/close.svg';
import FilterIcon from 'assets/svg/Articles/filter.svg';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import PencilIcon from 'assets/svg/Articles/pencil.svg';
import LostItemFilterModal from 'components/Articles/components/LostItemFilterModal';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';
import type { FilterState } from 'components/Articles/components/LostItemFilterModal';
import styles from './LostItemRouteButton.module.scss';

// 단수 전용 =========================================================
function pickSingleOrAll<T extends string>(arr: T[], fallbackAll: string) {
  return arr.length === 0 ? fallbackAll : arr[0];
}

function buildLostItemQueryForSingleAPI(filter: FilterState) {
  return {
    author: pickSingleOrAll(filter.author, 'ALL'),
    type: pickSingleOrAll(filter.type, 'LOST'), // 페이지 기본 LOST 유지
    category: pickSingleOrAll(filter.category, 'ALL'),
    foundStatus: pickSingleOrAll(filter.foundStatus, 'ALL'),
  };
}
// 복수 전용 =========================================================
// function buildLostItemQueryForMultiAPI(filter: FilterState) {
//   const norm = <T extends string>(arr: T[]) => normalizeAll(arr);

//   return {
//     author: norm(filter.author),
//     type: norm(filter.type),
//     category: norm(filter.category),
//     foundStatus: norm(filter.foundStatus),
//     sort: filter.sort,
//     title: filter.title,
//   };
// }

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

  return (
    <div className={`${styles.links} ${isWriting ? styles['links--active'] : ''}`}>
      <button type="button" className={styles.links__filter} onClick={() => setIsFilterOpen((p) => !p)}>
        필터
        <FilterIcon />
      </button>

      {isFilterOpen && (
        <div className={styles.filterPopover}>
          <LostItemFilterModal
            onClose={() => setIsFilterOpen(false)}
            onApply={(filter) => {
              const next = buildLostItemQueryForSingleAPI(filter);

              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  page: 1,
                  type: next.type,
                  category: next.category,
                  foundStatus: next.foundStatus,
                  author: next.author,
                },
              });

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
