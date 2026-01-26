import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CloseIcon from 'assets/svg/Articles/close.svg';
import FilterIcon from 'assets/svg/Articles/filter.svg';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import PencilIcon from 'assets/svg/Articles/pencil.svg';
import LostItemFilterBottomSheet from 'components/Articles/components/LostItemFilterBottomSheet';
import { FilterState } from 'components/Articles/components/LostItemFilterContent';
import LostItemFilterModal from 'components/Articles/components/LostItemFilterModal';
import LostItemWriteBottomSheet from 'components/Articles/components/LostItemWriteBottomSheet';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { buildQueryFromFilter, LostItemParams, parseLostItemQuery } from 'components/Articles/utils/lostItemQuery';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  const { logItemWriteClick, logFindUserWriteClick, logLostItemWriteClick, logLoginRequire } = useArticlesLogger();
  const router = useRouter();

  const [isWriting, setIsWriting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const portalManager = useModalPortal();
  const { data: userInfo } = useUser();

  const isMobile = useMediaQuery();

  const { containerRef: writeContainerRef } = useOutsideClick<HTMLDivElement>({
    onOutsideClick: () => {
      setIsWriting(false);
    },
  });

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

  const handleApply = (filter: FilterState) => {
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
  };

  // 필터 버튼 렌더 --------------------------
  const renderFilter = () => {
    if (isMobile) {
      return (
        <LostItemFilterBottomSheet
          isOpen={isFilterOpen}
          initialFilter={initialFilter}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApply}
        />
      );
    }

    if (!isFilterOpen) return null;

    return (
      <div className={styles.filterPopover}>
        <LostItemFilterModal
          initialFilter={initialFilter}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApply}
        />
      </div>
    );
  };

  // 글쓰기 버튼 렌더 --------------------------
  const renderWriteMenu = () => {
    if (isMobile) {
      return (
        <LostItemWriteBottomSheet
          isOpen={isWriting}
          onClose={() => setIsWriting(false)}
          onFoundClick={logFindUserWriteClick}
          onLostClick={logLostItemWriteClick}
        />
      );
    }

    if (!isWriting) return null;

    return (
      <div ref={writeContainerRef} className={styles.writePopover} role="dialog" aria-label="글쓰기 메뉴">
        <div className={styles.writeHeader}>
          <div className={styles.writeTitle}>글쓰기</div>
          <button type="button" className={styles.writeClose} aria-label="닫기" onClick={() => setIsWriting(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.writeBody}>
          <Link
            className={styles.writeOptionButton}
            href={ROUTES.LostItemFound()}
            onClick={() => {
              logFindUserWriteClick();
              setIsWriting(false);
            }}
          >
            <FoundIcon />
            <span className={styles.writeOptionText}>주인을 찾아요</span>
          </Link>

          <Link
            className={styles.writeOptionButton}
            href={ROUTES.LostItemLost()}
            onClick={() => {
              logLostItemWriteClick();
              setIsWriting(false);
            }}
          >
            <LostIcon />
            <span className={styles.writeOptionText}>잃어버렸어요</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.links} ${isWriting ? styles['links--active'] : ''}`}>
      <button type="button" className={styles.links__filter} onClick={() => setIsFilterOpen((p) => !p)}>
        필터
        <FilterIcon />
      </button>

      {renderFilter()}

      <div className={styles.writeAnchor}>
        {!isWriting && (
          <button className={styles.links__write} type="button" onClick={handleWritingButtonClick}>
            <PencilIcon />
            글쓰기
          </button>
        )}

        {renderWriteMenu()}
      </div>
    </div>
  );
}
