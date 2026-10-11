import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteReview } from 'api/store';
import type { ReviewSorter } from 'api/storeMobile/entity';
import { storeMobileQueries, storeMobileQueryKeys } from 'api/storeMobile/queries';
import CheckboxFalseIcon from 'assets/svg/Store/checkbox-false.svg';
import CheckboxTrueIcon from 'assets/svg/Store/checkbox-true.svg';
import DownArrowIcon from 'assets/svg/Store/down-arrow-icon.svg';
import LoginRequiredModal from 'components/Store/mobile/common/LoginRequiredModal';
import { setStartLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import useScrollLogging from 'components/Store/mobile/StoreListPage/hooks/useScrollLogging';
import AverageRating from 'components/Store/mobile/StoreReviewsPage/components/AverageRating';
import DeleteReviewModal from 'components/Store/mobile/StoreReviewsPage/components/DeleteReviewModal';
import EmptyReview from 'components/Store/mobile/StoreReviewsPage/components/EmptyReview';
import ImagePreview from 'components/Store/mobile/StoreReviewsPage/components/ImagePreview';
import ReviewCard, { type ReviewCardItem } from 'components/Store/mobile/StoreReviewsPage/components/ReviewCard';
import SortModal from 'components/Store/mobile/StoreReviewsPage/components/SortModal';
import { storeReviewsQueries } from 'components/Store/mobile/StoreReviewsPage/queries';
import { getReviewSortLabel, parseReviewSort } from 'components/Store/mobile/StoreReviewsPage/utils/reviewSort';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { isomorphicSessionStorage } from 'utils/ts/env';
import { getViewerScope } from 'utils/ts/getViewerScope';
import showToast from 'utils/ts/showToast';

import styles from './StoreReviewsPage.module.scss';

interface StoreReviewsPageProps {
  id: string;
}

const LOGIN_MODAL_TITLE = '리뷰를 작성하기 위해\n로그인이 필요해요.';
const LOGIN_MODAL_SUBTITLE = '리뷰작성은 회원만 사용 가능합니다.';

// KOIN_ORDER_WEBVIEW pages/Shop/shopReview(ReviewList·ReviewCard 포함) 이전.
// 통계·상점명·목록은 서버가 프리페치해 본문까지 렌더하고, 정렬은 ?sort 쿼리를 얕은 replace로 바꾼다
export default function StoreReviewsPage({ id }: StoreReviewsPageProps) {
  const router = useRouter();
  const logger = useLogger();
  const queryClient = useQueryClient();
  const isLoggedIn = useIsLoggedIn();

  const selectedSort = parseReviewSort(router.query.sort);

  const { data: shopDetail } = useSuspenseQuery(storeMobileQueries.detail(id));
  const shopName = shopDetail.name;

  // 평균 별점은 order처럼 정렬과 무관하게 최신순 응답의 통계를 쓴다.
  // 서버가 비로그인으로 그린 뒤 마운트 후 로그인으로 확인되면 키(scope)가 바뀌므로, 서스펜드 대신 이전 데이터를 유지한다
  const { data: latestReviews } = useQuery({
    ...storeMobileQueries.reviewList(id, 'LATEST', isLoggedIn),
    placeholderData: keepPreviousData,
  });
  const { data: sortedReviews } = useQuery({
    ...storeMobileQueries.reviewList(id, selectedSort, isLoggedIn),
    placeholderData: keepPreviousData,
  });
  const { data: myReviews } = useQuery({
    ...storeReviewsQueries.myReviews(id, selectedSort, isLoggedIn),
    placeholderData: keepPreviousData,
  });

  const [showMineOnly, setShowMineOnly] = useState(false);
  const [isSortModalOpen, openSortModal, closeSortModal] = useBooleanState(false);
  const [isLoginModalOpen, openLoginModal, closeLoginModal] = useBooleanState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { mutate: removeReview, isPending: isDeletePending } = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeMobileQueryKeys.reviews(id, getViewerScope(isLoggedIn)) });
      showToast('success', '리뷰가 삭제되었어요');
      setDeleteTargetId(null);
    },
    onError: (error) => {
      if (!isKoinError(error)) sendClientError(error);
      showToast('error', '리뷰 삭제에 실패했어요');
    },
  });

  const handleChangeSort = (sort: ReviewSorter) => {
    const query = { ...router.query };
    if (sort === 'LATEST') delete query.sort;
    else query.sort = sort;

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  };

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      openLoginModal();

      return;
    }

    router.push(ROUTES.Review({ id }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      openLoginModal();

      return;
    }

    setShowMineOnly(e.target.checked);
  };

  const handleEdit = (reviewId: number) => {
    router.push(ROUTES.ReviewEdit({ id, reviewId: String(reviewId) }));
  };

  const handleReport = (reviewId: number) => {
    if (!isLoggedIn) {
      openLoginModal();

      return;
    }

    router.push(ROUTES.ReviewReport({ shopid: id, reviewid: String(reviewId) }));
  };

  const handleDeleteClick = (reviewId: number) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_delete',
      value: shopName,
    });

    setDeleteTargetId(reviewId);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === null) return;

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_delete_done',
      value: 'O',
    });

    removeReview(deleteTargetId);
  };

  const handleCancelDelete = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_delete_done',
      value: 'X',
    });

    setDeleteTargetId(null);
  };

  const shopScrollLogging = useCallback(() => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review',
      value: shopName,
      event_category: 'scroll',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- logger는 렌더마다 새 객체라 빼고 상점명이 바뀔 때만 다시 등록한다
  }, [shopName]);

  useScrollLogging(shopScrollLogging);

  useEffect(() => {
    if (!shopName) return;

    isomorphicSessionStorage.setItem('enteredShopName', shopName);
    setStartLoggingTime('enteredShopReview');
  }, [shopName]);

  const totalReviews: ReviewCardItem[] = (sortedReviews ?? latestReviews)?.reviews ?? [];
  const visibleReviews: ReviewCardItem[] = showMineOnly ? (myReviews?.reviews ?? []) : totalReviews;

  return (
    <div className={styles.page}>
      <button type="button" className={styles['write-button']} onClick={handleWriteClick}>
        리뷰 작성하기
      </button>
      <div className={styles.rating}>
        {latestReviews && <AverageRating data={latestReviews} />}
      </div>
      <div className={styles.toolbar}>
        <button type="button" onClick={openSortModal} className={styles.toolbar__sort}>
          <span>{getReviewSortLabel(selectedSort)}</span>
          <DownArrowIcon fill="#727272" className={styles['toolbar__sort-icon']} />
        </button>
        <label className={styles.toolbar__mine}>
          <input
            type="checkbox"
            className={styles['toolbar__mine-input']}
            checked={showMineOnly}
            onChange={handleCheckboxChange}
          />
          {showMineOnly ? (
            <CheckboxTrueIcon className={styles['toolbar__mine-icon']} />
          ) : (
            <CheckboxFalseIcon className={styles['toolbar__mine-icon']} />
          )}
          <span className={styles['toolbar__mine-text']}>내가 작성한 리뷰</span>
        </label>
      </div>
      <div className={styles.list}>
        {visibleReviews.length > 0 ? (
          visibleReviews.map((review) => (
            <ReviewCard
              key={review.review_id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onReport={handleReport}
              onImageClick={setPreviewImage}
            />
          ))
        ) : (
          <EmptyReview />
        )}
      </div>

      <SortModal
        isOpen={isSortModalOpen}
        onClose={closeSortModal}
        selectedSort={selectedSort}
        onApply={handleChangeSort}
      />

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title={LOGIN_MODAL_TITLE}
        subTitle={LOGIN_MODAL_SUBTITLE}
      />

      <DeleteReviewModal
        isOpen={deleteTargetId !== null}
        isPending={isDeletePending}
        onClose={() => setDeleteTargetId(null)}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <ImagePreview src={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}
