import { useState } from 'react';

import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { reviewMutations } from 'api/review/mutations';
import { storeMobileQueries, storeMobileQueryKeys } from 'api/storeMobile/queries';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import ReviewExitModal from 'components/Store/mobile/ReviewFormPage/components/ReviewExitModal';
import ReviewForm from 'components/Store/mobile/ReviewFormPage/components/ReviewForm';
import useReviewFormBase from 'components/Store/mobile/ReviewFormPage/hooks/useReviewFormBase';
import useReviewImages from 'components/Store/mobile/ReviewFormPage/hooks/useReviewImages';
import ROUTES from 'static/routes';
import useGoBack from 'utils/hooks/routing/useGoBack';
import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Shop/shopReview/components/ReviewEditForm + hooks/useEditReviewForm 이전(모바일 리뷰 수정).
// 오라클 헤더는 /review/edit에서 뒤로가기를 누르면 나가기 확인 모달을 띄운다. 여기서는 헤더의 onBack으로 연다
interface ReviewEditPageProps {
  id: string;
  reviewId: string;
}

export default function ReviewEditPage({ id, reviewId }: ReviewEditPageProps) {
  const { data: shopDetail } = useSuspenseQuery(storeMobileQueries.detail(id));
  const { data: reviewDetail } = useSuspenseQuery(storeMobileQueries.reviewDetail(id, reviewId));

  const queryClient = useQueryClient();
  const goBack = useGoBack();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // 서버가 받은 기존 리뷰로 첫 렌더부터 채운다(오라클은 조회 후 effect로 채운다)
  const form = useReviewFormBase({
    rating: reviewDetail.rating,
    content: reviewDetail.content,
    menus: reviewDetail.menu_names ?? [],
    existingImageUrls: reviewDetail.image_urls ?? [],
  });
  const { imageUrls, imgRef, handleChangeImage, removeImage } = useReviewImages();
  const handleBack = () => goBack(ROUTES.StoreReviews({ id }));

  // 데스크톱 훅(useEditStoreReview)은 성공 시 자체 토스트를 띄워 오라클 토스트와 겹치므로 공용 mutation을 직접 쓴다
  const { mutate } = useMutation({
    ...reviewMutations.edit(queryClient, id, reviewId, {
      onSuccess: () => {
        // 모바일 리뷰 목록·내 리뷰는 같은 접두사(reviews) 아래에 있다. 다시 들어올 때를 위해 상세도 갱신한다
        queryClient.invalidateQueries({ queryKey: [...storeMobileQueryKeys.all, 'reviews'] });
        queryClient.invalidateQueries({ queryKey: storeMobileQueryKeys.reviewDetail(id, reviewId) });
        showToast('success', '리뷰가 수정되었어요');
        handleBack();
      },
    }),
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '리뷰 수정에 실패했어요');
      }
    },
  });

  const handleSubmit = () => {
    if (!form.isFormValid) return;
    // Enter 없이 남아 있는 메뉴명도 태그로 함께 보낸다
    const menuNames = form.commitMenuInput();

    mutate({
      rating: form.rating,
      content: form.content,
      image_urls: [...form.existingImageUrls, ...imageUrls],
      menu_names: menuNames,
    });
  };

  return (
    <>
      <MobilePageHeader title="리뷰 수정하기" onBack={() => setIsExitModalOpen(true)} />
      <ReviewForm
        shopName={shopDetail.name}
        form={form}
        imageUrls={imageUrls}
        imgRef={imgRef}
        onChangeImage={handleChangeImage}
        onRemoveImage={removeImage}
        submitLabel="수정하기"
        onSubmit={handleSubmit}
        variant="edit"
      />
      <ReviewExitModal
        isOpen={isExitModalOpen}
        message="리뷰 수정을 그만하시겠어요?"
        onClose={() => setIsExitModalOpen(false)}
        onExit={handleBack}
      />
    </>
  );
}
